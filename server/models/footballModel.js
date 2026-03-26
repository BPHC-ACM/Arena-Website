const { getNextCounter } = require("./modelUtils");
const { getInitialSportMatches, saveSportMatches } = require("./matchStore");

let footballMatches = getInitialSportMatches("football");
let matchIdCounter = getNextCounter(footballMatches);

const getFootballMatches = () => footballMatches;

const getFootballMatchById = (id) => {
  return footballMatches.find((match) => match.id === parseInt(id));
};

const createFootballMatch = (data) => {
  const newMatch = {
    id: matchIdCounter++,
    teamA: data.teamA || "",
    teamB: data.teamB || "",
    scoreA: data.scoreA || 0,
    scoreB: data.scoreB || 0,
    matchTime: data.matchTime || 0,
    half: data.half || 1,
    status: data.status || "",
  };
  footballMatches.push(newMatch);
  saveSportMatches("football", footballMatches);
  return newMatch;
};

const updateFootballMatch = (id, data) => {
  const index = footballMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    footballMatches[index] = { ...footballMatches[index], ...data };
    saveSportMatches("football", footballMatches);
    return footballMatches[index];
  }
  return null;
};

const deleteFootballMatch = (id) => {
  const index = footballMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    const removedMatch = footballMatches.splice(index, 1)[0];
    saveSportMatches("football", footballMatches);
    return removedMatch;
  }
  return null;
};

module.exports = {
  getFootballMatches,
  getFootballMatchById,
  createFootballMatch,
  updateFootballMatch,
  deleteFootballMatch,
};
