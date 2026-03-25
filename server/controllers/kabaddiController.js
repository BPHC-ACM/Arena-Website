const {
  getKabaddiMatches,
  getKabaddiMatchById,
  createKabaddiMatch,
  updateKabaddiMatch,
  deleteKabaddiMatch,
} = require("../models/kabaddiModel");
const { emitKabaddiUpdate } = require("../socket/socketHandler");

const getAllMatches = (req, res) => {
  const matches = getKabaddiMatches();
  res.json(matches);
};

const getMatch = (req, res) => {
  const match = getKabaddiMatchById(req.params.id);
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

  const match = createKabaddiMatch(data);
  emitKabaddiUpdate(getKabaddiMatches());
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

  if (
    data.playersOnMatA !== undefined &&
    (data.playersOnMatA < 0 || data.playersOnMatA > 7)
  ) {
    return res.status(400).json({ error: "Invalid players on mat" });
  }

  if (
    data.playersOnMatB !== undefined &&
    (data.playersOnMatB < 0 || data.playersOnMatB > 7)
  ) {
    return res.status(400).json({ error: "Invalid players on mat" });
  }

  if (data.raidTimer !== undefined && data.raidTimer < 0) {
    return res.status(400).json({ error: "Invalid raid timer" });
  }

  const match = updateKabaddiMatch(req.params.id, data);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitKabaddiUpdate(getKabaddiMatches());
  res.json(match);
};

const deleteMatch = (req, res) => {
  const match = deleteKabaddiMatch(req.params.id);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitKabaddiUpdate(getKabaddiMatches());
  res.json({ message: "Match deleted", match });
};

module.exports = {
  getAllMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
};
