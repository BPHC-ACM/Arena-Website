const {
  getCricketMatches,
  getCricketMatchById,
  createCricketMatch,
  updateCricketMatch,
  deleteCricketMatch,
} = require("../models/cricketModel");
const { emitCricketUpdate } = require("../socket/socketHandler");

const getAllMatches = (req, res) => {
  const matches = getCricketMatches();
  res.json(matches);
};

const getMatch = (req, res) => {
  const match = getCricketMatchById(req.params.id);
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

  const match = createCricketMatch(data);
  emitCricketUpdate(getCricketMatches());
  res.status(201).json(match);
};

const updateMatch = (req, res) => {
  const data = req.body;

  if (data.scoreA) {
    if (
      data.scoreA.runs < 0 ||
      data.scoreA.wickets < 0 ||
      data.scoreA.wickets > 10
    ) {
      return res.status(400).json({ error: "Invalid cricket score" });
    }
  }

  if (data.scoreB) {
    if (
      data.scoreB.runs < 0 ||
      data.scoreB.wickets < 0 ||
      data.scoreB.wickets > 10
    ) {
      return res.status(400).json({ error: "Invalid cricket score" });
    }
  }

  const match = updateCricketMatch(req.params.id, data);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitCricketUpdate(getCricketMatches());
  res.json(match);
};

const deleteMatch = (req, res) => {
  const match = deleteCricketMatch(req.params.id);
  if (!match) {
    return res.status(404).json({ error: "Match not found" });
  }

  emitCricketUpdate(getCricketMatches());
  res.json({ message: "Match deleted", match });
};

module.exports = {
  getAllMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch,
};
