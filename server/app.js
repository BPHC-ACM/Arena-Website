const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const socketHandler = require("./socket/socketHandler");

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

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

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
});
