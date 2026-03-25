const {
  getSkatingMatches,
  getSkatingMatchById,
  createSkatingMatch,
  updateSkatingMatch,
  deleteSkatingMatch,
} = require("../models/skatingModel");
const { emitSkatingUpdate } = require("../socket/socketHandler");

const getAllMatches = (req, res) => {
  const matches = getSkatingMatches();
  res.json(matches);
};

const getMatch = (req, res) => {
  const match = getSkatingMatchById(req.params.id);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }
  res.json(match);
};

const createMatch = (req, res) => {
  const data = req.body;

  if (!data.athlete1 || !data.athlete2) {
    return res.status(400).json({ error: "Athlete names are required" });
  }

  const match = createSkatingMatch(data);
  emitSkatingUpdate(getSkatingMatches());
  res.status(201).json(match);
};

const updateMatch = (req, res) => {
  const data = req.body;

  const match = updateSkatingMatch(req.params.id, data);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitSkatingUpdate(getSkatingMatches());
  res.json(match);
};

const deleteMatch = (req, res) => {
  const match = deleteSkatingMatch(req.params.id);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitSkatingUpdate(getSkatingMatches());
  res.json({ message: "Match deleted", match });
};

module.exports = {
  getAllMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
};
