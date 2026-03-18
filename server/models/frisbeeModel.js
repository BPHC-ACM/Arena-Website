let frisbeeMatches = [];
let matchIdCounter = 1;

const getFrisbeeMatches = () => frisbeeMatches;

const getFrisbeeMatchById = (id) => {
  return frisbeeMatches.find((match) => match.id === parseInt(id));
};

const createFrisbeeMatch = (data) => {
  const newMatch = {
    id: matchIdCounter++,
    teamA: data.teamA || "",
    teamB: data.teamB || "",
    scoreA: data.scoreA || 0,
    scoreB: data.scoreB || 0,
    possession: data.possession || "",
    timeRemaining: data.timeRemaining || "48:00",
    pointCap: data.pointCap || 21,
    status: data.status || "",
  };
  frisbeeMatches.push(newMatch);
  return newMatch;
};

const updateFrisbeeMatch = (id, data) => {
  const index = frisbeeMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    frisbeeMatches[index] = { ...frisbeeMatches[index], ...data };
    return frisbeeMatches[index];
  }
  return null;
};

const deleteFrisbeeMatch = (id) => {
  const index = frisbeeMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    return frisbeeMatches.splice(index, 1)[0];
  }
  return null;
};

module.exports = {
  getFrisbeeMatches,
  getFrisbeeMatchById,
  createFrisbeeMatch,
  updateFrisbeeMatch,
  deleteFrisbeeMatch,
};
