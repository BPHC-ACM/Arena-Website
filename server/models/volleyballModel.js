let volleyballMatches = [];
let matchIdCounter = 1;

const getVolleyballMatches = () => volleyballMatches;

const getVolleyballMatchById = (id) => {
  return volleyballMatches.find((match) => match.id === parseInt(id));
};

const createVolleyballMatch = (data) => {
  const newMatch = {
    id: matchIdCounter++,
    teamA: data.teamA || "",
    teamB: data.teamB || "",
    setsTeamA: data.setsTeamA || [],
    setsTeamB: data.setsTeamB || [],
    currentSet: data.currentSet || 1,
    currentPointsTeamA: data.currentPointsTeamA || 0,
    currentPointsTeamB: data.currentPointsTeamB || 0,
    setWinsA: data.setWinsA || 0,
    setWinsB: data.setWinsB || 0,
    bestOf: data.bestOf || 5,
    status: data.status || "",
  };
  volleyballMatches.push(newMatch);
  return newMatch;
};

const updateVolleyballMatch = (id, data) => {
  const index = volleyballMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    volleyballMatches[index] = { ...volleyballMatches[index], ...data };
    return volleyballMatches[index];
  }
  return null;
};

const deleteVolleyballMatch = (id) => {
  const index = volleyballMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    return volleyballMatches.splice(index, 1)[0];
  }
  return null;
};

module.exports = {
  getVolleyballMatches,
  getVolleyballMatchById,
  createVolleyballMatch,
  updateVolleyballMatch,
  deleteVolleyballMatch,
};
