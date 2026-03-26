const { getNextCounter } = require("./modelUtils");
const { getInitialSportMatches, saveSportMatches } = require("./matchStore");

let squashMatches = getInitialSportMatches("squash");
let matchIdCounter = getNextCounter(squashMatches);

const getSquashMatches = () => squashMatches;

const getSquashMatchById = (id) => {
  return squashMatches.find((match) => match.id === parseInt(id));
};

const createSquashMatch = (data) => {
  const newMatch = {
    id: matchIdCounter++,
    player1: data.player1 || "",
    player2: data.player2 || "",
    gamesPlayer1: data.gamesPlayer1 || [],
    gamesPlayer2: data.gamesPlayer2 || [],
    currentGame: data.currentGame || 1,
    currentPointsPlayer1: data.currentPointsPlayer1 || 0,
    currentPointsPlayer2: data.currentPointsPlayer2 || 0,
    server: data.server || 1,
    bestOf: data.bestOf || 5,
    status: data.status || "",
  };
  squashMatches.push(newMatch);
  saveSportMatches("squash", squashMatches);
  return newMatch;
};

const updateSquashMatch = (id, data) => {
  const index = squashMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    squashMatches[index] = { ...squashMatches[index], ...data };
    saveSportMatches("squash", squashMatches);
    return squashMatches[index];
  }
  return null;
};

const deleteSquashMatch = (id) => {
  const index = squashMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    const removedMatch = squashMatches.splice(index, 1)[0];
    saveSportMatches("squash", squashMatches);
    return removedMatch;
  }
  return null;
};

module.exports = {
  getSquashMatches,
  getSquashMatchById,
  createSquashMatch,
  updateSquashMatch,
  deleteSquashMatch,
};
