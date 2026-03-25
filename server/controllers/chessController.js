const {
  getChessMatches,
  getChessMatchById,
  createChessMatch,
  updateChessMatch,
  deleteChessMatch,
} = require("../models/chessModel");
const { emitChessUpdate } = require("../socket/socketHandler");

const getAllMatches = (req, res) => {
  const matches = getChessMatches();
  res.json(matches);
};

const getMatch = (req, res) => {
  const match = getChessMatchById(req.params.id);
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

  const match = createChessMatch(data);
  emitChessUpdate(getChessMatches());
  res.status(201).json(match);
};

const updateMatch = (req, res) => {
  const data = req.body;

  const match = updateChessMatch(req.params.id, data);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitChessUpdate(getChessMatches());
  res.json(match);
};

const deleteMatch = (req, res) => {
  const match = deleteChessMatch(req.params.id);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitChessUpdate(getChessMatches());
  res.json({ message: "Match deleted", match });
};

module.exports = {
  getAllMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
};
