let tennisMatches = [];
let matchIdCounter = 1;

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
  return newMatch;
};

const updateTennisMatch = (id, data) => {
  const index = tennisMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    tennisMatches[index] = { ...tennisMatches[index], ...data };
    return tennisMatches[index];
  }
  return null;
};

const deleteTennisMatch = (id) => {
  const index = tennisMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    return tennisMatches.splice(index, 1)[0];
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
