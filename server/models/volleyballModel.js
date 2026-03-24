const { getInitialMatches, getNextCounter } = require("./seedMatches");
const { getInitialSportMatches, saveSportMatches } = require("./matchStore");

let volleyballMatches = getInitialSportMatches("volleyball", getInitialMatches("volleyball"));
let matchIdCounter = getNextCounter(volleyballMatches);

const getVolleyballMatches = () => volleyballMatches;

const getVolleyballMatchById = (id) => {
  return volleyballMatches.find((match) => match.id === parseInt(id));
};

const createVolleyballMatch = (data) => {
  const newMatch = {
    id: matchIdCounter++,
    teamA: data.teamA || "",
    teamB: data.teamB || "",
    setsTeamA: data.setsTeamA || [],
    setsTeamB: data.setsTeamB || [],
    currentSet: data.currentSet || 1,
    currentPointsTeamA: data.currentPointsTeamA || 0,
    currentPointsTeamB: data.currentPointsTeamB || 0,
    setWinsA: data.setWinsA || 0,
    setWinsB: data.setWinsB || 0,
    bestOf: data.bestOf || 5,
    status: data.status || "",
  };
  volleyballMatches.push(newMatch);
  saveSportMatches("volleyball", volleyballMatches);
  return newMatch;
};

const updateVolleyballMatch = (id, data) => {
  const index = volleyballMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    volleyballMatches[index] = { ...volleyballMatches[index], ...data };
    saveSportMatches("volleyball", volleyballMatches);
    return volleyballMatches[index];
  }
  return null;
};

const deleteVolleyballMatch = (id) => {
  const index = volleyballMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    const removedMatch = volleyballMatches.splice(index, 1)[0];
    saveSportMatches("volleyball", volleyballMatches);
    return removedMatch;
  }
  return null;
};

module.exports = {
  getVolleyballMatches,
  getVolleyballMatchById,
  createVolleyballMatch,
  updateVolleyballMatch,
  deleteVolleyballMatch,
};
