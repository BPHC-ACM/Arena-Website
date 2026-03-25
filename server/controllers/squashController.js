const {
  getSquashMatches,
  getSquashMatchById,
  createSquashMatch,
  updateSquashMatch,
  deleteSquashMatch,
} = require("../models/squashModel");
const { emitSquashUpdate } = require("../socket/socketHandler");

const getAllMatches = (req, res) => {
  const matches = getSquashMatches();
  res.json(matches);
};

const getMatch = (req, res) => {
  const match = getSquashMatchById(req.params.id);
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

  const match = createSquashMatch(data);
  emitSquashUpdate(getSquashMatches());
  res.status(201).json(match);
};

const updateMatch = (req, res) => {
  const data = req.body;

  const match = updateSquashMatch(req.params.id, data);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitSquashUpdate(getSquashMatches());
  res.json(match);
};

const deleteMatch = (req, res) => {
  const match = deleteSquashMatch(req.params.id);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitSquashUpdate(getSquashMatches());
  res.json({ message: "Match deleted", match });
};

module.exports = {
  getAllMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
};
