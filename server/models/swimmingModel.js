const { getNextCounter } = require("./modelUtils");
const { getInitialSportMatches, saveSportMatches } = require("./matchStore");

let swimmingMatches = getInitialSportMatches("swimming");
let matchIdCounter = getNextCounter(swimmingMatches);

const getSwimmingMatches = () => swimmingMatches;

const getSwimmingMatchById = (id) => {
  return swimmingMatches.find((match) => match.id === parseInt(id));
};

const createSwimmingMatch = (data) => {
  const newMatch = {
    id: matchIdCounter++,
    swimmer1: data.swimmer1 || "",
    swimmer2: data.swimmer2 || "",
    time1: data.time1 || "",
    time2: data.time2 || "",
    distance: data.distance || "",
    stroke: data.stroke || "",
    lane1: data.lane1 || 0,
    lane2: data.lane2 || 0,
    status: data.status || "",
  };
  swimmingMatches.push(newMatch);
  saveSportMatches("swimming", swimmingMatches);
  return newMatch;
};

const updateSwimmingMatch = (id, data) => {
  const index = swimmingMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    swimmingMatches[index] = { ...swimmingMatches[index], ...data };
    saveSportMatches("swimming", swimmingMatches);
    return swimmingMatches[index];
  }
  return null;
};

const deleteSwimmingMatch = (id) => {
  const index = swimmingMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    const removedMatch = swimmingMatches.splice(index, 1)[0];
    saveSportMatches("swimming", swimmingMatches);
    return removedMatch;
  }
  return null;
};

module.exports = {
  getSwimmingMatches,
  getSwimmingMatchById,
  createSwimmingMatch,
  updateSwimmingMatch,
  deleteSwimmingMatch,
};
