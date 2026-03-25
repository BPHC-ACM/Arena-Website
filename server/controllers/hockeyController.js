const {
  getHockeyMatches,
  getHockeyMatchById,
  createHockeyMatch,
  updateHockeyMatch,
  deleteHockeyMatch,
} = require("../models/hockeyModel");
const { emitHockeyUpdate } = require("../socket/socketHandler");

const getAllMatches = (req, res) => {
  const matches = getHockeyMatches();
  res.json(matches);
};

const getMatch = (req, res) => {
  const match = getHockeyMatchById(req.params.id);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }
  res.json(match);
};

const createMatch = (req, res) => {
  const data = req.body;

  if (!data.teamA || !data.teamB) {
    return res.status(400).json({ error: "Team names are required" });
  }

  const match = createHockeyMatch(data);
  emitHockeyUpdate(getHockeyMatches());
  res.status(201).json(match);
};

const updateMatch = (req, res) => {
  const data = req.body;

  const match = updateHockeyMatch(req.params.id, data);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitHockeyUpdate(getHockeyMatches());
  res.json(match);
};

const deleteMatch = (req, res) => {
  const match = deleteHockeyMatch(req.params.id);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitHockeyUpdate(getHockeyMatches());
  res.json({ message: "Match deleted", match });
};

module.exports = {
  getAllMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
};
