const { getInitialMatches, getNextCounter } = require("./seedMatches");
const { getInitialSportMatches, saveSportMatches } = require("./matchStore");

let tennisMatches = getInitialSportMatches("tennis", getInitialMatches("tennis"));
let matchIdCounter = getNextCounter(tennisMatches);

const getTennisMatches = () => tennisMatches;

const getTennisMatchById = (id) => {
  return tennisMatches.find((match) => match.id === parseInt(id));
};

const createTennisMatch = (data) => {
  const newMatch = {
    id: matchIdCounter++,
    player1: data.player1 || "",
    player2: data.player2 || "",
    setsPlayer1: data.setsPlayer1 || [],
    setsPlayer2: data.setsPlayer2 || [],
    currentSet: data.currentSet || 1,
    currentGameScorePlayer1: data.currentGameScorePlayer1 || 0,
    currentGameScorePlayer2: data.currentGameScorePlayer2 || 0,
    server: data.server || 1,
    status: data.status || "",
  };
  tennisMatches.push(newMatch);
  saveSportMatches("tennis", tennisMatches);
  return newMatch;
};

const updateTennisMatch = (id, data) => {
  const index = tennisMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    tennisMatches[index] = { ...tennisMatches[index], ...data };
    saveSportMatches("tennis", tennisMatches);
    return tennisMatches[index];
  }
  return null;
};

const deleteTennisMatch = (id) => {
  const index = tennisMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    const removedMatch = tennisMatches.splice(index, 1)[0];
    saveSportMatches("tennis", tennisMatches);
    return removedMatch;
  }
  return null;
};

module.exports = {
  getTennisMatches,
  getTennisMatchById,
  createTennisMatch,
  updateTennisMatch,
  deleteTennisMatch,
};
