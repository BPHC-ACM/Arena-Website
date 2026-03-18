const {
  getFootballMatches,
  getFootballMatchById,
  createFootballMatch,
  updateFootballMatch,
  deleteFootballMatch,
} = require("../models/footballModel");
const { emitFootballUpdate } = require("../socket/socketHandler");

const getAllMatches = (req, res) => {
  const matches = getFootballMatches();
  res.json(matches);
};

const getMatch = (req, res) => {
  const match = getFootballMatchById(req.params.id);
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

  const match = createFootballMatch(data);
  emitFootballUpdate(getFootballMatches());
  res.status(201).json(match);
};

const updateMatch = (req, res) => {
  const data = req.body;

  if (data.scoreA !== undefined && data.scoreA < 0) {
    return res.status(400).json({ error: "Invalid score" });
  }

  if (data.scoreB !== undefined && data.scoreB < 0) {
    return res.status(400).json({ error: "Invalid score" });
  }

  if (data.matchTime !== undefined && data.matchTime < 0) {
    return res.status(400).json({ error: "Invalid match time" });
  }

  if (data.half && (data.half < 1 || data.half > 2)) {
    return res.status(400).json({ error: "Invalid half" });
  }

  const match = updateFootballMatch(req.params.id, data);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitFootballUpdate(getFootballMatches());
  res.json(match);
};

const deleteMatch = (req, res) => {
  const match = deleteFootballMatch(req.params.id);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitFootballUpdate(getFootballMatches());
  res.json({ message: "Match deleted", match });
};

module.exports = {
  getAllMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
};
