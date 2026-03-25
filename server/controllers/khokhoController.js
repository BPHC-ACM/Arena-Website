const {
  getKhoKhoMatches,
  getKhoKhoMatchById,
  createKhoKhoMatch,
  updateKhoKhoMatch,
  deleteKhoKhoMatch,
} = require("../models/khokhoModel");
const { emitKhoKhoUpdate } = require("../socket/socketHandler");

const getAllMatches = (req, res) => {
  const matches = getKhoKhoMatches();
  res.json(matches);
};

const getMatch = (req, res) => {
  const match = getKhoKhoMatchById(req.params.id);
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

  const match = createKhoKhoMatch(data);
  emitKhoKhoUpdate(getKhoKhoMatches());
  res.status(201).json(match);
};

const updateMatch = (req, res) => {
  const data = req.body;

  const match = updateKhoKhoMatch(req.params.id, data);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitKhoKhoUpdate(getKhoKhoMatches());
  res.json(match);
};

const deleteMatch = (req, res) => {
  const match = deleteKhoKhoMatch(req.params.id);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitKhoKhoUpdate(getKhoKhoMatches());
  res.json({ message: "Match deleted", match });
};

module.exports = {
  getAllMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
};
