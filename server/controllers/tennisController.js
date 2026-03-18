const {
  getTennisMatches,
  getTennisMatchById,
  createTennisMatch,
  updateTennisMatch,
  deleteTennisMatch,
} = require("../models/tennisModel");
const { emitTennisUpdate } = require("../socket/socketHandler");

const getAllMatches = (req, res) => {
  const matches = getTennisMatches();
  res.json(matches);
};

const getMatch = (req, res) => {
  const match = getTennisMatchById(req.params.id);
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

  const match = createTennisMatch(data);
  emitTennisUpdate(getTennisMatches());
  res.status(201).json(match);
};

const updateMatch = (req, res) => {
  const data = req.body;

  if (
    data.currentGameScorePlayer1 !== undefined &&
    data.currentGameScorePlayer1 < 0
  ) {
    return res.status(400).json({ error: "Invalid game score" });
  }

  if (
    data.currentGameScorePlayer2 !== undefined &&
    data.currentGameScorePlayer2 < 0
  ) {
    return res.status(400).json({ error: "Invalid game score" });
  }

  if (data.server && (data.server < 1 || data.server > 2)) {
    return res.status(400).json({ error: "Invalid server" });
  }

  const match = updateTennisMatch(req.params.id, data);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitTennisUpdate(getTennisMatches());
  res.json(match);
};

const deleteMatch = (req, res) => {
  const match = deleteTennisMatch(req.params.id);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitTennisUpdate(getTennisMatches());
  res.json({ message: "Match deleted", match });
};

module.exports = {
  getAllMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
};
