const {
  getTableTennisMatches,
  getTableTennisMatchById,
  createTableTennisMatch,
  updateTableTennisMatch,
  deleteTableTennisMatch,
} = require("../models/tabletennisModel");
const { emitTableTennisUpdate } = require("../socket/socketHandler");

const getAllMatches = (req, res) => {
  const matches = getTableTennisMatches();
  res.json(matches);
};

const getMatch = (req, res) => {
  const match = getTableTennisMatchById(req.params.id);
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

  const match = createTableTennisMatch(data);
  emitTableTennisUpdate(getTableTennisMatches());
  res.status(201).json(match);
};

const updateMatch = (req, res) => {
  const data = req.body;

  const match = updateTableTennisMatch(req.params.id, data);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitTableTennisUpdate(getTableTennisMatches());
  res.json(match);
};

const deleteMatch = (req, res) => {
  const match = deleteTableTennisMatch(req.params.id);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitTableTennisUpdate(getTableTennisMatches());
  res.json({ message: "Match deleted", match });
};

module.exports = {
  getAllMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
};
