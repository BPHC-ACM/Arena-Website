const { getNextCounter } = require("./modelUtils");
const { getInitialSportMatches, saveSportMatches } = require("./matchStore");

let snookerMatches = getInitialSportMatches("snooker");
let matchIdCounter = getNextCounter(snookerMatches);

const getSnookerMatches = () => snookerMatches;

const getSnookerMatchById = (id) => {
  return snookerMatches.find((match) => match.id === parseInt(id));
};

const createSnookerMatch = (data) => {
  const newMatch = {
    id: matchIdCounter++,
    player1: data.player1 || "",
    player2: data.player2 || "",
    framesPlayer1: data.framesPlayer1 || 0,
    framesPlayer2: data.framesPlayer2 || 0,
    currentFrame: data.currentFrame || 1,
    currentScorePlayer1: data.currentScorePlayer1 || 0,
    currentScorePlayer2: data.currentScorePlayer2 || 0,
    bestOf: data.bestOf || 7,
    onTable: data.onTable || 1,
    remainingPoints: data.remainingPoints || 147,
    status: data.status || "",
  };
  snookerMatches.push(newMatch);
  saveSportMatches("snooker", snookerMatches);
  return newMatch;
};

const updateSnookerMatch = (id, data) => {
  const index = snookerMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    snookerMatches[index] = { ...snookerMatches[index], ...data };
    saveSportMatches("snooker", snookerMatches);
    return snookerMatches[index];
  }
  return null;
};

const deleteSnookerMatch = (id) => {
  const index = snookerMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    const removedMatch = snookerMatches.splice(index, 1)[0];
    saveSportMatches("snooker", snookerMatches);
    return removedMatch;
  }
  return null;
};

module.exports = {
  getSnookerMatches,
  getSnookerMatchById,
  createSnookerMatch,
  updateSnookerMatch,
  deleteSnookerMatch,
};
