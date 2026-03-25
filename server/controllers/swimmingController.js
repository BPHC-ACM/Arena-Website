const {
  getSwimmingMatches,
  getSwimmingMatchById,
  createSwimmingMatch,
  updateSwimmingMatch,
  deleteSwimmingMatch,
} = require("../models/swimmingModel");
const { emitSwimmingUpdate } = require("../socket/socketHandler");

const getAllMatches = (req, res) => {
  const matches = getSwimmingMatches();
  res.json(matches);
};

const getMatch = (req, res) => {
  const match = getSwimmingMatchById(req.params.id);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }
  res.json(match);
};

const createMatch = (req, res) => {
  const data = req.body;

  if (!data.swimmer1 || !data.swimmer2) {
    return res.status(400).json({ error: "Swimmer names are required" });
  }

  const match = createSwimmingMatch(data);
  emitSwimmingUpdate(getSwimmingMatches());
  res.status(201).json(match);
};

const updateMatch = (req, res) => {
  const data = req.body;

  const match = updateSwimmingMatch(req.params.id, data);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitSwimmingUpdate(getSwimmingMatches());
  res.json(match);
};

const deleteMatch = (req, res) => {
  const match = deleteSwimmingMatch(req.params.id);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitSwimmingUpdate(getSwimmingMatches());
  res.json({ message: "Match deleted", match });
};

module.exports = {
  getAllMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
};
