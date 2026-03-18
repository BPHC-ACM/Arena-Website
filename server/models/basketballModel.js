let basketballMatches = [];
let matchIdCounter = 1;

const getBasketballMatches = () => basketballMatches;

const getBasketballMatchById = (id) => {
  return basketballMatches.find((match) => match.id === parseInt(id));
};

const createBasketballMatch = (data) => {
  const newMatch = {
    id: matchIdCounter++,
    teamA: data.teamA || "",
    teamB: data.teamB || "",
    scoreA: data.scoreA || 0,
    scoreB: data.scoreB || 0,
    quarterScoresA: data.quarterScoresA || [0, 0, 0, 0],
    quarterScoresB: data.quarterScoresB || [0, 0, 0, 0],
    currentQuarter: data.currentQuarter || 1,
    gameClock: data.gameClock || "12:00",
    shotClock: data.shotClock || 24,
    status: data.status || "",
  };
  basketballMatches.push(newMatch);
  return newMatch;
};

const updateBasketballMatch = (id, data) => {
  const index = basketballMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    basketballMatches[index] = { ...basketballMatches[index], ...data };
    return basketballMatches[index];
  }
  return null;
};

const deleteBasketballMatch = (id) => {
  const index = basketballMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    return basketballMatches.splice(index, 1)[0];
  }
  return null;
};

module.exports = {
  getBasketballMatches,
  getBasketballMatchById,
  createBasketballMatch,
  updateBasketballMatch,
  deleteBasketballMatch,
};
