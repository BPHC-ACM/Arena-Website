const { getNextCounter } = require("./modelUtils");
const { getInitialSportMatches, saveSportMatches } = require("./matchStore");

let hockeyMatches = getInitialSportMatches("hockey");
let matchIdCounter = getNextCounter(hockeyMatches);

const getHockeyMatches = () => hockeyMatches;

const getHockeyMatchById = (id) => {
  return hockeyMatches.find((match) => match.id === parseInt(id));
};

const createHockeyMatch = (data) => {
  const newMatch = {
    id: matchIdCounter++,
    teamA: data.teamA || "",
    teamB: data.teamB || "",
    scoreA: data.scoreA || 0,
    scoreB: data.scoreB || 0,
    currentPeriod: data.currentPeriod || 1,
    matchTime: data.matchTime || "0:00",
    periodScoresA: data.periodScoresA || [0, 0, 0],
    periodScoresB: data.periodScoresB || [0, 0, 0],
    penaltiesA: data.penaltiesA || 0,
    penaltiesB: data.penaltiesB || 0,
    status: data.status || "",
  };
  hockeyMatches.push(newMatch);
  saveSportMatches("hockey", hockeyMatches);
  return newMatch;
};

const updateHockeyMatch = (id, data) => {
  const index = hockeyMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    hockeyMatches[index] = { ...hockeyMatches[index], ...data };
    saveSportMatches("hockey", hockeyMatches);
    return hockeyMatches[index];
  }
  return null;
};

const deleteHockeyMatch = (id) => {
  const index = hockeyMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    const removedMatch = hockeyMatches.splice(index, 1)[0];
    saveSportMatches("hockey", hockeyMatches);
    return removedMatch;
  }
  return null;
};

module.exports = {
  getHockeyMatches,
  getHockeyMatchById,
  createHockeyMatch,
  updateHockeyMatch,
  deleteHockeyMatch,
};
