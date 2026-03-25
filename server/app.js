const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const dotenv = require("dotenv");
const socketHandler = require("./socket/socketHandler");

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const { initializeStore, saveSportMatches } = require("./models/matchStore");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-User-Role");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

socketHandler.initialize(wss);

const parseClockToSeconds = (clock) => {
  if (typeof clock !== "string" || !clock.includes(":")) {
    return null;
  }
  const [minutes, seconds] = clock.split(":").map((value) => Number.parseInt(value, 10));
  if (Number.isNaN(minutes) || Number.isNaN(seconds) || minutes < 0 || seconds < 0) {
    return null;
  }
  return minutes * 60 + seconds;
};

const formatSecondsToClock = (totalSeconds) => {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

// Bootstrap Backend after DB Load
initializeStore().then(() => {
  const { getCricketMatches } = require("./models/cricketModel");
  const { getBasketballMatches } = require("./models/basketballModel");
  const { getFootballMatches } = require("./models/footballModel");
  const { getTennisMatches } = require("./models/tennisModel");
  const { getBadmintonMatches } = require("./models/badmintonModel");
  const { getVolleyballMatches } = require("./models/volleyballModel");
  const { getKabaddiMatches } = require("./models/kabaddiModel");
  const { getFrisbeeMatches } = require("./models/frisbeeModel");

  const cricketRoutes = require("./routes/cricket");
  const basketballRoutes = require("./routes/basketball");
  const footballRoutes = require("./routes/football");
  const tennisRoutes = require("./routes/tennis");
  const badmintonRoutes = require("./routes/badminton");
  const volleyballRoutes = require("./routes/volleyball");
  const kabaddiRoutes = require("./routes/kabaddi");
  const frisbeeRoutes = require("./routes/frisbee");

  const emitAllSnapshots = () => {
    socketHandler.emitCricketUpdate(getCricketMatches());
    socketHandler.emitBasketballUpdate(getBasketballMatches());
    socketHandler.emitFootballUpdate(getFootballMatches());
    socketHandler.emitTennisUpdate(getTennisMatches());
    socketHandler.emitBadmintonUpdate(getBadmintonMatches());
    socketHandler.emitVolleyballUpdate(getVolleyballMatches());
    socketHandler.emitKabaddiUpdate(getKabaddiMatches());
    socketHandler.emitFrisbeeUpdate(getFrisbeeMatches());
  };

  const startLiveTimers = () => {
    setInterval(() => {
      let basketballChanged = false;
      const basketballMatches = getBasketballMatches();
      basketballMatches.forEach((match) => {
        if (match.clockRunning) {
          const clockInSeconds = parseClockToSeconds(match.gameClock);
          if (clockInSeconds !== null && clockInSeconds > 0) {
            match.gameClock = formatSecondsToClock(clockInSeconds - 1);
            basketballChanged = true;
          }
        }
      });
      if (basketballChanged) {
        saveSportMatches("basketball", basketballMatches);
        socketHandler.emitBasketballUpdate(basketballMatches);
      }

      let kabaddiChanged = false;
      const kabaddiMatches = getKabaddiMatches();
      kabaddiMatches.forEach((match) => {
        if (match.clockRunning) {
          if (typeof match.raidTimer === "number" && match.raidTimer >= 0) {
            match.raidTimer = match.raidTimer > 0 ? match.raidTimer - 1 : 30;
            kabaddiChanged = true;
          }
          const clockInSeconds = parseClockToSeconds(match.timeRemaining);
          if (clockInSeconds !== null && clockInSeconds > 0) {
            match.timeRemaining = formatSecondsToClock(clockInSeconds - 1);
            kabaddiChanged = true;
          }
        }
      });
      if (kabaddiChanged) {
        saveSportMatches("kabaddi", kabaddiMatches);
        socketHandler.emitKabaddiUpdate(kabaddiMatches);
      }

      let frisbeeChanged = false;
      const frisbeeMatches = getFrisbeeMatches();
      frisbeeMatches.forEach((match) => {
        if (match.clockRunning) {
          const clockInSeconds = parseClockToSeconds(match.timeRemaining);
          if (clockInSeconds !== null && clockInSeconds > 0) {
            match.timeRemaining = formatSecondsToClock(clockInSeconds - 1);
            frisbeeChanged = true;
          }
        }
      });
      if (frisbeeChanged) {
        saveSportMatches("frisbee", frisbeeMatches);
        socketHandler.emitFrisbeeUpdate(frisbeeMatches);
      }
    }, 1000);

    setInterval(() => {
      let footballChanged = false;
      const footballMatches = getFootballMatches();
      footballMatches.forEach((match) => {
        if (match.clockRunning) {
          if (typeof match.matchTime === "number" && match.matchTime >= 0 && match.matchTime < 90) {
            match.matchTime += 1;
            footballChanged = true;
          }
        }
      });
      if (footballChanged) {
        saveSportMatches("football", footballMatches);
        socketHandler.emitFootballUpdate(footballMatches);
      }
    }, 60000);
  };

  wss.on("connection", (ws, req) => {
    console.log("WebSocket client connected");
    emitAllSnapshots();
    ws.on("message", (message) => {
      console.log("Received:", message.toString());
    });
    ws.on("close", () => {
      console.log("WebSocket client disconnected");
    });
  });

  app.use("/api/cricket", cricketRoutes);
  app.use("/api/basketball", basketballRoutes);
  app.use("/api/football", footballRoutes);
  app.use("/api/tennis", tennisRoutes);
  app.use("/api/badminton", badmintonRoutes);
  app.use("/api/volleyball", volleyballRoutes);
  app.use("/api/kabaddi", kabaddiRoutes);
  app.use("/api/frisbee", frisbeeRoutes);

  app.get("/", (req, res) => {
    res.json({
      message: "Multi-Sport Scoreboard API",
      sports: [
        "cricket",
        "basketball",
        "football",
        "tennis",
        "badminton",
        "volleyball",
        "kabaddi",
        "frisbee",
      ],
      endpoints: {
        GET: "/api/{sport}",
        POST: "/api/{sport}",
        PUT: "/api/{sport}/update",
        DELETE: "/api/{sport}",
      },
    });
  });

  const PORT = process.env.PORT || 3001;

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`WebSocket server running on ws://localhost:${PORT}`);
    startLiveTimers();
  });
});
