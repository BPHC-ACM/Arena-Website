const { getNextCounter } = require("./modelUtils");
const { getInitialSportMatches, saveSportMatches } = require("./matchStore");

let frisbeeMatches = getInitialSportMatches("frisbee");
let matchIdCounter = getNextCounter(frisbeeMatches);

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
  saveSportMatches("frisbee", frisbeeMatches);
  return newMatch;
};

const updateFrisbeeMatch = (id, data) => {
  const index = frisbeeMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    frisbeeMatches[index] = { ...frisbeeMatches[index], ...data };
    saveSportMatches("frisbee", frisbeeMatches);
    return frisbeeMatches[index];
  }
  return null;
};

const deleteFrisbeeMatch = (id) => {
  const index = frisbeeMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    const removedMatch = frisbeeMatches.splice(index, 1)[0];
    saveSportMatches("frisbee", frisbeeMatches);
    return removedMatch;
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
