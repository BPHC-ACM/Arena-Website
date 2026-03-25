const { getInitialMatches, getNextCounter } = require("./seedMatches");
const { getInitialSportMatches, saveSportMatches } = require("./matchStore");

let tabletennisMatches = getInitialSportMatches("tabletennis", getInitialMatches("tabletennis"));
let matchIdCounter = getNextCounter(tabletennisMatches);

const getTableTennisMatches = () => tabletennisMatches;

const getTableTennisMatchById = (id) => {
  return tabletennisMatches.find((match) => match.id === parseInt(id));
};

const createTableTennisMatch = (data) => {
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
  tabletennisMatches.push(newMatch);
  saveSportMatches("tabletennis", tabletennisMatches);
  return newMatch;
};

const updateTableTennisMatch = (id, data) => {
  const index = tabletennisMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    tabletennisMatches[index] = { ...tabletennisMatches[index], ...data };
    saveSportMatches("tabletennis", tabletennisMatches);
    return tabletennisMatches[index];
  }
  return null;
};

const deleteTableTennisMatch = (id) => {
  const index = tabletennisMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    const removedMatch = tabletennisMatches.splice(index, 1)[0];
    saveSportMatches("tabletennis", tabletennisMatches);
    return removedMatch;
  }
  return null;
};

module.exports = {
  getTableTennisMatches,
  getTableTennisMatchById,
  createTableTennisMatch,
  updateTableTennisMatch,
  deleteTableTennisMatch,
};
