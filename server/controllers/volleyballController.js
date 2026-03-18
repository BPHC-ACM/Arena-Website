const {
  getVolleyballMatches,
  getVolleyballMatchById,
  createVolleyballMatch,
  updateVolleyballMatch,
  deleteVolleyballMatch,
} = require("../models/volleyballModel");
const { emitVolleyballUpdate } = require("../socket/socketHandler");

const getAllMatches = (req, res) => {
  const matches = getVolleyballMatches();
  res.json(matches);
};

const getMatch = (req, res) => {
  const match = getVolleyballMatchById(req.params.id);
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

  const match = createVolleyballMatch(data);
  emitVolleyballUpdate(getVolleyballMatches());
  res.status(201).json(match);
};

const updateMatch = (req, res) => {
  const data = req.body;

  if (
    data.currentPointsTeamA !== undefined &&
    data.currentPointsTeamA < 0
  ) {
    return res.status(400).json({ error: "Invalid points" });
  }

  if (
    data.currentPointsTeamB !== undefined &&
    data.currentPointsTeamB < 0
  ) {
    return res.status(400).json({ error: "Invalid points" });
  }

  if (data.setWinsA !== undefined && data.setWinsA < 0) {
    return res.status(400).json({ error: "Invalid set wins" });
  }

  if (data.setWinsB !== undefined && data.setWinsB < 0) {
    return res.status(400).json({ error: "Invalid set wins" });
  }

  const match = updateVolleyballMatch(req.params.id, data);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitVolleyballUpdate(getVolleyballMatches());
  res.json(match);
};

const deleteMatch = (req, res) => {
  const match = deleteVolleyballMatch(req.params.id);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitVolleyballUpdate(getVolleyballMatches());
  res.json({ message: "Match deleted", match });
};

module.exports = {
  getAllMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
};
