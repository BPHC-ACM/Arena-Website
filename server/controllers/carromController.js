const {
  getCarromMatches,
  getCarromMatchById,
  createCarromMatch,
  updateCarromMatch,
  deleteCarromMatch,
} = require("../models/carromModel");
const { emitCarromUpdate } = require("../socket/socketHandler");

const getAllMatches = (req, res) => {
  const matches = getCarromMatches();
  res.json(matches);
};

const getMatch = (req, res) => {
  const match = getCarromMatchById(req.params.id);
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

  const match = createCarromMatch(data);
  emitCarromUpdate(getCarromMatches());
  res.status(201).json(match);
};

const updateMatch = (req, res) => {
  const data = req.body;

  const match = updateCarromMatch(req.params.id, data);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitCarromUpdate(getCarromMatches());
  res.json(match);
};

const deleteMatch = (req, res) => {
  const match = deleteCarromMatch(req.params.id);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitCarromUpdate(getCarromMatches());
  res.json({ message: "Match deleted", match });
};

module.exports = {
  getAllMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
};
