const { getInitialMatches, getNextCounter } = require("./seedMatches");
const { getInitialSportMatches, saveSportMatches } = require("./matchStore");

let powerliftingMatches = getInitialSportMatches("powerlifting", getInitialMatches("powerlifting"));
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
    squatAttempt1Athlete1: data.squatAttempt1Athlete1 || 0,
    squatAttempt2Athlete1: data.squatAttempt2Athlete1 || 0,
    squatAttempt3Athlete1: data.squatAttempt3Athlete1 || 0,
    benchAttempt1Athlete1: data.benchAttempt1Athlete1 || 0,
    benchAttempt2Athlete1: data.benchAttempt2Athlete1 || 0,
    benchAttempt3Athlete1: data.benchAttempt3Athlete1 || 0,
    deadliftAttempt1Athlete1: data.deadliftAttempt1Athlete1 || 0,
    deadliftAttempt2Athlete1: data.deadliftAttempt2Athlete1 || 0,
    deadliftAttempt3Athlete1: data.deadliftAttempt3Athlete1 || 0,
    squatAttempt1Athlete2: data.squatAttempt1Athlete2 || 0,
    squatAttempt2Athlete2: data.squatAttempt2Athlete2 || 0,
    squatAttempt3Athlete2: data.squatAttempt3Athlete2 || 0,
    benchAttempt1Athlete2: data.benchAttempt1Athlete2 || 0,
    benchAttempt2Athlete2: data.benchAttempt2Athlete2 || 0,
    benchAttempt3Athlete2: data.benchAttempt3Athlete2 || 0,
    deadliftAttempt1Athlete2: data.deadliftAttempt1Athlete2 || 0,
    deadliftAttempt2Athlete2: data.deadliftAttempt2Athlete2 || 0,
    deadliftAttempt3Athlete2: data.deadliftAttempt3Athlete2 || 0,
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
