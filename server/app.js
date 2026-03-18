const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const socketHandler = require("./socket/socketHandler");

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

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

socketHandler.initialize(wss);

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

const startLiveTimers = () => {
  setInterval(() => {
    let basketballChanged = false;
    const basketballMatches = getBasketballMatches();
    basketballMatches.forEach((match) => {
      const clockInSeconds = parseClockToSeconds(match.gameClock);
      if (clockInSeconds !== null && clockInSeconds > 0) {
        match.gameClock = formatSecondsToClock(clockInSeconds - 1);
        basketballChanged = true;
      }
    });
    if (basketballChanged) {
      socketHandler.emitBasketballUpdate(basketballMatches);
    }

    let kabaddiChanged = false;
    const kabaddiMatches = getKabaddiMatches();
    kabaddiMatches.forEach((match) => {
      if (typeof match.raidTimer === "number" && match.raidTimer >= 0) {
        match.raidTimer = match.raidTimer > 0 ? match.raidTimer - 1 : 30;
        kabaddiChanged = true;
      }
    });
    if (kabaddiChanged) {
      socketHandler.emitKabaddiUpdate(kabaddiMatches);
    }

    let frisbeeChanged = false;
    const frisbeeMatches = getFrisbeeMatches();
    frisbeeMatches.forEach((match) => {
      const clockInSeconds = parseClockToSeconds(match.timeRemaining);
      if (clockInSeconds !== null && clockInSeconds > 0) {
        match.timeRemaining = formatSecondsToClock(clockInSeconds - 1);
        frisbeeChanged = true;
      }
    });
    if (frisbeeChanged) {
      socketHandler.emitFrisbeeUpdate(frisbeeMatches);
    }
  }, 1000);

  setInterval(() => {
    let footballChanged = false;
    const footballMatches = getFootballMatches();
    footballMatches.forEach((match) => {
      if (typeof match.matchTime === "number" && match.matchTime >= 0 && match.matchTime < 90) {
        match.matchTime += 1;
        footballChanged = true;
      }
    });
    if (footballChanged) {
      socketHandler.emitFootballUpdate(footballMatches);
    }
  }, 60000);
};

wss.on("connection", (ws) => {
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
