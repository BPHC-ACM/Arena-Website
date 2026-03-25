const { getInitialMatches, getNextCounter } = require("./seedMatches");
const { getInitialSportMatches, saveSportMatches } = require("./matchStore");

let throwballMatches = getInitialSportMatches("throwball", getInitialMatches("throwball"));
let matchIdCounter = getNextCounter(throwballMatches);

const getThrowballMatches = () => throwballMatches;

const getThrowballMatchById = (id) => {
  return throwballMatches.find((match) => match.id === parseInt(id));
};

const createThrowballMatch = (data) => {
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
    bestOf: data.bestOf || 3,
    servingTeam: data.servingTeam || "A",
    status: data.status || "",
  };
  throwballMatches.push(newMatch);
  saveSportMatches("throwball", throwballMatches);
  return newMatch;
};

const updateThrowballMatch = (id, data) => {
  const index = throwballMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    throwballMatches[index] = { ...throwballMatches[index], ...data };
    saveSportMatches("throwball", throwballMatches);
    return throwballMatches[index];
  }
  return null;
};

const deleteThrowballMatch = (id) => {
  const index = throwballMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    const removedMatch = throwballMatches.splice(index, 1)[0];
    saveSportMatches("throwball", throwballMatches);
    return removedMatch;
  }
  return null;
};

module.exports = {
  getThrowballMatches,
  getThrowballMatchById,
  createThrowballMatch,
  updateThrowballMatch,
  deleteThrowballMatch,
};
