const {
  getFrisbeeMatches,
  getFrisbeeMatchById,
  createFrisbeeMatch,
  updateFrisbeeMatch,
  deleteFrisbeeMatch,
} = require("../models/frisbeeModel");
const { emitFrisbeeUpdate } = require("../socket/socketHandler");

const getAllMatches = (req, res) => {
  const matches = getFrisbeeMatches();
  res.json(matches);
};

const getMatch = (req, res) => {
  const match = getFrisbeeMatchById(req.params.id);
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

  const match = createFrisbeeMatch(data);
  emitFrisbeeUpdate(getFrisbeeMatches());
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

  if (data.pointCap !== undefined && data.pointCap < 1) {
    return res.status(400).json({ error: "Invalid point cap" });
  }

  const match = updateFrisbeeMatch(req.params.id, data);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitFrisbeeUpdate(getFrisbeeMatches());
  res.json(match);
};

const deleteMatch = (req, res) => {
  const match = deleteFrisbeeMatch(req.params.id);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitFrisbeeUpdate(getFrisbeeMatches());
  res.json({ message: "Match deleted", match });
};

module.exports = {
  getAllMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
};
