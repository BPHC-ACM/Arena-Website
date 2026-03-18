const {
  getBadmintonMatches,
  getBadmintonMatchById,
  createBadmintonMatch,
  updateBadmintonMatch,
  deleteBadmintonMatch,
} = require("../models/badmintonModel");
const { emitBadmintonUpdate } = require("../socket/socketHandler");

const getAllMatches = (req, res) => {
  const matches = getBadmintonMatches();
  res.json(matches);
};

const getMatch = (req, res) => {
  const match = getBadmintonMatchById(req.params.id);
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

  const match = createBadmintonMatch(data);
  emitBadmintonUpdate(getBadmintonMatches());
  res.status(201).json(match);
};

const updateMatch = (req, res) => {
  const data = req.body;

  if (
    data.currentPointsPlayer1 !== undefined &&
    data.currentPointsPlayer1 < 0
  ) {
    return res.status(400).json({ error: "Invalid points" });
  }

  if (
    data.currentPointsPlayer2 !== undefined &&
    data.currentPointsPlayer2 < 0
  ) {
    return res.status(400).json({ error: "Invalid points" });
  }

  if (data.server && (data.server < 1 || data.server > 2)) {
    return res.status(400).json({ error: "Invalid server" });
  }

  const match = updateBadmintonMatch(req.params.id, data);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitBadmintonUpdate(getBadmintonMatches());
  res.json(match);
};

const deleteMatch = (req, res) => {
  const match = deleteBadmintonMatch(req.params.id);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitBadmintonUpdate(getBadmintonMatches());
  res.json({ message: "Match deleted", match });
};

module.exports = {
  getAllMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
};
