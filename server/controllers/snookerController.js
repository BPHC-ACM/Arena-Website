const {
  getSnookerMatches,
  getSnookerMatchById,
  createSnookerMatch,
  updateSnookerMatch,
  deleteSnookerMatch,
} = require("../models/snookerModel");
const { emitSnookerUpdate } = require("../socket/socketHandler");

const getAllMatches = (req, res) => {
  const matches = getSnookerMatches();
  res.json(matches);
};

const getMatch = (req, res) => {
  const match = getSnookerMatchById(req.params.id);
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

  const match = createSnookerMatch(data);
  emitSnookerUpdate(getSnookerMatches());
  res.status(201).json(match);
};

const updateMatch = (req, res) => {
  const data = req.body;

  const match = updateSnookerMatch(req.params.id, data);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitSnookerUpdate(getSnookerMatches());
  res.json(match);
};

const deleteMatch = (req, res) => {
  const match = deleteSnookerMatch(req.params.id);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitSnookerUpdate(getSnookerMatches());
  res.json({ message: "Match deleted", match });
};

module.exports = {
  getAllMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
};
