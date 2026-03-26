const { getNextCounter } = require("./modelUtils");
const { getInitialSportMatches, saveSportMatches } = require("./matchStore");

let eightballMatches = getInitialSportMatches("8ball");
let matchIdCounter = getNextCounter(eightballMatches);

const getEightBallMatches = () => eightballMatches;

const getEightBallMatchById = (id) => {
  return eightballMatches.find((match) => match.id === parseInt(id));
};

const createEightBallMatch = (data) => {
  const newMatch = {
    id: matchIdCounter++,
    player1: data.player1 || "",
    player2: data.player2 || "",
    framesPlayer1: data.framesPlayer1 || 0,
    framesPlayer2: data.framesPlayer2 || 0,
    currentFrame: data.currentFrame || 1,
    bestOf: data.bestOf || 5,
    ballsRemainingPlayer1: data.ballsRemainingPlayer1 || 7,
    ballsRemainingPlayer2: data.ballsRemainingPlayer2 || 7,
    onBreak: data.onBreak || 1,
    status: data.status || "",
  };
  eightballMatches.push(newMatch);
  saveSportMatches("8ball", eightballMatches);
  return newMatch;
};

const updateEightBallMatch = (id, data) => {
  const index = eightballMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    eightballMatches[index] = { ...eightballMatches[index], ...data };
    saveSportMatches("8ball", eightballMatches);
    return eightballMatches[index];
  }
  return null;
};

const deleteEightBallMatch = (id) => {
  const index = eightballMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    const removedMatch = eightballMatches.splice(index, 1)[0];
    saveSportMatches("8ball", eightballMatches);
    return removedMatch;
  }
  return null;
};

module.exports = {
  getEightBallMatches,
  getEightBallMatchById,
  createEightBallMatch,
  updateEightBallMatch,
  deleteEightBallMatch,
};
