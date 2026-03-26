const { getNextCounter } = require("./modelUtils");
const { getInitialSportMatches, saveSportMatches } = require("./matchStore");

let skatingMatches = getInitialSportMatches("skating");
let matchIdCounter = getNextCounter(skatingMatches);

const getSkatingMatches = () => skatingMatches;

const getSkatingMatchById = (id) => {
  return skatingMatches.find((match) => match.id === parseInt(id));
};

const createSkatingMatch = (data) => {
  const newMatch = {
    id: matchIdCounter++,
    athlete1: data.athlete1 || "",
    athlete2: data.athlete2 || "",
    time1: data.time1 || "",
    time2: data.time2 || "",
    distance: data.distance || "",
    eventType: data.eventType || "speed",
    scoreAthlete1: data.scoreAthlete1 || 0,
    scoreAthlete2: data.scoreAthlete2 || 0,
    status: data.status || "",
  };
  skatingMatches.push(newMatch);
  saveSportMatches("skating", skatingMatches);
  return newMatch;
};

const updateSkatingMatch = (id, data) => {
  const index = skatingMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    skatingMatches[index] = { ...skatingMatches[index], ...data };
    saveSportMatches("skating", skatingMatches);
    return skatingMatches[index];
  }
  return null;
};

const deleteSkatingMatch = (id) => {
  const index = skatingMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    const removedMatch = skatingMatches.splice(index, 1)[0];
    saveSportMatches("skating", skatingMatches);
    return removedMatch;
  }
  return null;
};

module.exports = {
  getSkatingMatches,
  getSkatingMatchById,
  createSkatingMatch,
  updateSkatingMatch,
  deleteSkatingMatch,
};
