const { getInitialMatches, getNextCounter } = require("./seedMatches");
const { getInitialSportMatches, saveSportMatches } = require("./matchStore");

let carromMatches = getInitialSportMatches("carrom", getInitialMatches("carrom"));
let matchIdCounter = getNextCounter(carromMatches);

const getCarromMatches = () => carromMatches;

const getCarromMatchById = (id) => {
  return carromMatches.find((match) => match.id === parseInt(id));
};

const createCarromMatch = (data) => {
  const newMatch = {
    id: matchIdCounter++,
    player1: data.player1 || "",
    player2: data.player2 || "",
    scorePlayer1: data.scorePlayer1 || 0,
    scorePlayer2: data.scorePlayer2 || 0,
    currentBoard: data.currentBoard || 1,
    bestOf: data.bestOf || 3,
    boardsPlayer1: data.boardsPlayer1 || [],
    boardsPlayer2: data.boardsPlayer2 || [],
    striker: data.striker || 1,
    status: data.status || "",
  };
  carromMatches.push(newMatch);
  saveSportMatches("carrom", carromMatches);
  return newMatch;
};

const updateCarromMatch = (id, data) => {
  const index = carromMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    carromMatches[index] = { ...carromMatches[index], ...data };
    saveSportMatches("carrom", carromMatches);
    return carromMatches[index];
  }
  return null;
};

const deleteCarromMatch = (id) => {
  const index = carromMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    const removedMatch = carromMatches.splice(index, 1)[0];
    saveSportMatches("carrom", carromMatches);
    return removedMatch;
  }
  return null;
};

module.exports = {
  getCarromMatches,
  getCarromMatchById,
  createCarromMatch,
  updateCarromMatch,
  deleteCarromMatch,
};
