const { getNextCounter } = require("./modelUtils");
const { getInitialSportMatches, saveSportMatches } = require("./matchStore");

let powerliftingMatches = getInitialSportMatches("powerlifting");
let matchIdCounter = getNextCounter(powerliftingMatches);

const getPowerliftingMatches = () => powerliftingMatches;

const getPowerliftingMatchById = (id) => {
  return powerliftingMatches.find((match) => match.id === parseInt(id));
};

const createPowerliftingMatch = (data) => {
  const newMatch = {
    id: matchIdCounter++,
    athlete1: data.athlete1 || "",
    athlete2: data.athlete2 || "",
    squatAthlete1: data.squatAthlete1 || 0,
    benchAthlete1: data.benchAthlete1 || 0,
    deadliftAthlete1: data.deadliftAthlete1 || 0,
    squatAthlete2: data.squatAthlete2 || 0,
    benchAthlete2: data.benchAthlete2 || 0,
    deadliftAthlete2: data.deadliftAthlete2 || 0,
    totalAthlete1: data.totalAthlete1 || 0,
    totalAthlete2: data.totalAthlete2 || 0,
    currentLift: data.currentLift || "squat",
    weightClass: data.weightClass || "",
    status: data.status || "",
  };
  powerliftingMatches.push(newMatch);
  saveSportMatches("powerlifting", powerliftingMatches);
  return newMatch;
};

const updatePowerliftingMatch = (id, data) => {
  const index = powerliftingMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    powerliftingMatches[index] = { ...powerliftingMatches[index], ...data };
    saveSportMatches("powerlifting", powerliftingMatches);
    return powerliftingMatches[index];
  }
  return null;
};

const deletePowerliftingMatch = (id) => {
  const index = powerliftingMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    const removedMatch = powerliftingMatches.splice(index, 1)[0];
    saveSportMatches("powerlifting", powerliftingMatches);
    return removedMatch;
  }
  return null;
};

module.exports = {
  getPowerliftingMatches,
  getPowerliftingMatchById,
  createPowerliftingMatch,
  updatePowerliftingMatch,
  deletePowerliftingMatch,
};
