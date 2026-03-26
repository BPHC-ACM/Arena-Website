const { getNextCounter } = require("./modelUtils");
const { getInitialSportMatches, saveSportMatches } = require("./matchStore");

let cricketMatches = getInitialSportMatches("cricket");
let matchIdCounter = getNextCounter(cricketMatches);

const getCricketMatches = () => cricketMatches;

const getCricketMatchById = (id) => {
  return cricketMatches.find((match) => match.id === parseInt(id));
};

const createCricketMatch = (data) => {
  const parsedTotalOvers = Number(data.totalOvers);
  const newMatch = {
    id: matchIdCounter++,
    teamA: data.teamA || "",
    teamB: data.teamB || "",
    totalOvers:
      Number.isFinite(parsedTotalOvers) && parsedTotalOvers > 0
        ? parsedTotalOvers
        : 20,
    scoreA: data.scoreA || {
      runs: 0,
      wickets: 0,
      overs: 0,
    },
    scoreB: data.scoreB || {
      runs: 0,
      wickets: 0,
      overs: 0,
    },
    runRateA: data.runRateA || 0,
    runRateB: data.runRateB || 0,
    target: data.target || 0,
    required: data.required || 0,
    requiredRate: data.requiredRate || 0,
    currentBatsmen: data.currentBatsmen || [],
    currentBowler: data.currentBowler || {
      name: "",
      overs: 0,
      runs: 0,
      wickets: 0,
    },
    innings: data.innings || 1,
    status: data.status || "",
  };
  cricketMatches.push(newMatch);
  saveSportMatches("cricket", cricketMatches);
  return newMatch;
};

const updateCricketMatch = (id, data) => {
  const index = cricketMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    const parsedTotalOvers = Number(data.totalOvers);
    const normalizedData =
      data.totalOvers === undefined
        ? data
        : {
            ...data,
            totalOvers:
              Number.isFinite(parsedTotalOvers) && parsedTotalOvers > 0
                ? parsedTotalOvers
                : cricketMatches[index].totalOvers || 20,
          };

    cricketMatches[index] = { ...cricketMatches[index], ...normalizedData };
    saveSportMatches("cricket", cricketMatches);
    return cricketMatches[index];
  }
  return null;
};

const deleteCricketMatch = (id) => {
  const index = cricketMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    const removedMatch = cricketMatches.splice(index, 1)[0];
    saveSportMatches("cricket", cricketMatches);
    return removedMatch;
  }
  return null;
};

module.exports = {
  getCricketMatches,
  getCricketMatchById,
  createCricketMatch,
  updateCricketMatch,
  deleteCricketMatch,
};
