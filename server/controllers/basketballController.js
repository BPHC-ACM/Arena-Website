const {
  getBasketballMatches,
  getBasketballMatchById,
  createBasketballMatch,
  updateBasketballMatch,
  deleteBasketballMatch,
} = require("../models/basketballModel");
const { emitBasketballUpdate } = require("../socket/socketHandler");

const getAllMatches = (req, res) => {
  const matches = getBasketballMatches();
  res.json(matches);
};

const getMatch = (req, res) => {
  const match = getBasketballMatchById(req.params.id);
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

  const match = createBasketballMatch(data);
  emitBasketballUpdate(getBasketballMatches());
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

  if (data.currentQuarter && (data.currentQuarter < 1 || data.currentQuarter > 4)) {
    return res.status(400).json({ error: "Invalid quarter" });
  }

  if (data.shotClock !== undefined && data.shotClock < 0) {
    return res.status(400).json({ error: "Invalid shot clock" });
  }

  const match = updateBasketballMatch(req.params.id, data);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitBasketballUpdate(getBasketballMatches());
  res.json(match);
};

const deleteMatch = (req, res) => {
  const match = deleteBasketballMatch(req.params.id);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitBasketballUpdate(getBasketballMatches());
  res.json({ message: "Match deleted", match });
};

module.exports = {
  getAllMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
};
