const { getInitialMatches, getNextCounter } = require("./seedMatches");
const { getInitialSportMatches, saveSportMatches } = require("./matchStore");

let chessMatches = getInitialSportMatches("chess", getInitialMatches("chess"));
let matchIdCounter = getNextCounter(chessMatches);

const getChessMatches = () => chessMatches;

const getChessMatchById = (id) => {
  return chessMatches.find((match) => match.id === parseInt(id));
};

const createChessMatch = (data) => {
  const newMatch = {
    id: matchIdCounter++,
    player1: data.player1 || "",
    player2: data.player2 || "",
    timePlayer1: data.timePlayer1 || "10:00",
    timePlayer2: data.timePlayer2 || "10:00",
    movesPlayer1: data.movesPlayer1 || 0,
    movesPlayer2: data.movesPlayer2 || 0,
    currentTurn: data.currentTurn || 1,
    timeControl: data.timeControl || "10+0",
    result: data.result || "",
    status: data.status || "",
  };
  chessMatches.push(newMatch);
  saveSportMatches("chess", chessMatches);
  return newMatch;
};

const updateChessMatch = (id, data) => {
  const index = chessMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    chessMatches[index] = { ...chessMatches[index], ...data };
    saveSportMatches("chess", chessMatches);
    return chessMatches[index];
  }
  return null;
};

const deleteChessMatch = (id) => {
  const index = chessMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    const removedMatch = chessMatches.splice(index, 1)[0];
    saveSportMatches("chess", chessMatches);
    return removedMatch;
  }
  return null;
};

module.exports = {
  getChessMatches,
  getChessMatchById,
  createChessMatch,
  updateChessMatch,
  deleteChessMatch,
};
