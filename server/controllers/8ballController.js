const {
  getEightBallMatches,
  getEightBallMatchById,
  createEightBallMatch,
  updateEightBallMatch,
  deleteEightBallMatch,
} = require("../models/8ballModel");
const { emitEightBallUpdate } = require("../socket/socketHandler");

const getAllMatches = (req, res) => {
  const matches = getEightBallMatches();
  res.json(matches);
};

const getMatch = (req, res) => {
  const match = getEightBallMatchById(req.params.id);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }
  res.json(match);
};

const createMatch = (req, res) => {
  const data = req.body;

  if (!data.player1 || !data.player2) {
    return res.status(400).json({ error: "Player names are required" });
  }

  const match = createEightBallMatch(data);
  emitEightBallUpdate(getEightBallMatches());
  res.status(201).json(match);
};

const updateMatch = (req, res) => {
  const data = req.body;

  const match = updateEightBallMatch(req.params.id, data);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitEightBallUpdate(getEightBallMatches());
  res.json(match);
};

const deleteMatch = (req, res) => {
  const match = deleteEightBallMatch(req.params.id);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitEightBallUpdate(getEightBallMatches());
  res.json({ message: "Match deleted", match });
};

module.exports = {
  getAllMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
};
