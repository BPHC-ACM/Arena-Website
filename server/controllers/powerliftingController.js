const {
  getPowerliftingMatches,
  getPowerliftingMatchById,
  createPowerliftingMatch,
  updatePowerliftingMatch,
  deletePowerliftingMatch,
} = require("../models/powerliftingModel");
const { emitPowerliftingUpdate } = require("../socket/socketHandler");

const getAllMatches = (req, res) => {
  const matches = getPowerliftingMatches();
  res.json(matches);
};

const getMatch = (req, res) => {
  const match = getPowerliftingMatchById(req.params.id);
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

  const match = createPowerliftingMatch(data);
  emitPowerliftingUpdate(getPowerliftingMatches());
  res.status(201).json(match);
};

const updateMatch = (req, res) => {
  const data = req.body;

  const match = updatePowerliftingMatch(req.params.id, data);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitPowerliftingUpdate(getPowerliftingMatches());
  res.json(match);
};

const deleteMatch = (req, res) => {
  const match = deletePowerliftingMatch(req.params.id);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitPowerliftingUpdate(getPowerliftingMatches());
  res.json({ message: "Match deleted", match });
};

module.exports = {
  getAllMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
};
