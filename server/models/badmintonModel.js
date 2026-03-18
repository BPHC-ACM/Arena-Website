let badmintonMatches = [];
let matchIdCounter = 1;

const getBadmintonMatches = () => badmintonMatches;

const getBadmintonMatchById = (id) => {
  return badmintonMatches.find((match) => match.id === parseInt(id));
};

const createBadmintonMatch = (data) => {
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
    bestOf: data.bestOf || 3,
    status: data.status || "",
  };
  badmintonMatches.push(newMatch);
  return newMatch;
};

const updateBadmintonMatch = (id, data) => {
  const index = badmintonMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    badmintonMatches[index] = { ...badmintonMatches[index], ...data };
    return badmintonMatches[index];
  }
  return null;
};

const deleteBadmintonMatch = (id) => {
  const index = badmintonMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    return badmintonMatches.splice(index, 1)[0];
  }
  return null;
};

module.exports = {
  getBadmintonMatches,
  getBadmintonMatchById,
  createBadmintonMatch,
  updateBadmintonMatch,
  deleteBadmintonMatch,
};
