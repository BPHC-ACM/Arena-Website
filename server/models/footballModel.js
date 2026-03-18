let footballMatches = [];
let matchIdCounter = 1;

const getFootballMatches = () => footballMatches;

const getFootballMatchById = (id) => {
  return footballMatches.find((match) => match.id === parseInt(id));
};

const createFootballMatch = (data) => {
  const newMatch = {
    id: matchIdCounter++,
    teamA: data.teamA || "",
    teamB: data.teamB || "",
    scoreA: data.scoreA || 0,
    scoreB: data.scoreB || 0,
    matchTime: data.matchTime || 0,
    half: data.half || 1,
    status: data.status || "",
  };
  footballMatches.push(newMatch);
  return newMatch;
};

const updateFootballMatch = (id, data) => {
  const index = footballMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    footballMatches[index] = { ...footballMatches[index], ...data };
    return footballMatches[index];
  }
  return null;
};

const deleteFootballMatch = (id) => {
  const index = footballMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    return footballMatches.splice(index, 1)[0];
  }
  return null;
};

module.exports = {
  getFootballMatches,
  getFootballMatchById,
  createFootballMatch,
  updateFootballMatch,
  deleteFootballMatch,
};
