const {
  getThrowballMatches,
  getThrowballMatchById,
  createThrowballMatch,
  updateThrowballMatch,
  deleteThrowballMatch,
} = require("../models/throwballModel");
const { emitThrowballUpdate } = require("../socket/socketHandler");

const getAllMatches = (req, res) => {
  const matches = getThrowballMatches();
  res.json(matches);
};

const getMatch = (req, res) => {
  const match = getThrowballMatchById(req.params.id);
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

  const match = createThrowballMatch(data);
  emitThrowballUpdate(getThrowballMatches());
  res.status(201).json(match);
};

const updateMatch = (req, res) => {
  const data = req.body;

  const match = updateThrowballMatch(req.params.id, data);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitThrowballUpdate(getThrowballMatches());
  res.json(match);
};

const deleteMatch = (req, res) => {
  const match = deleteThrowballMatch(req.params.id);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitThrowballUpdate(getThrowballMatches());
  res.json({ message: "Match deleted", match });
};

module.exports = {
  getAllMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
};
