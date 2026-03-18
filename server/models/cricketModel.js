let cricketMatches = [];
let matchIdCounter = 1;

const getCricketMatches = () => cricketMatches;

const getCricketMatchById = (id) => {
  return cricketMatches.find((match) => match.id === parseInt(id));
};

const createCricketMatch = (data) => {
  const newMatch = {
    id: matchIdCounter++,
    teamA: data.teamA || "",
    teamB: data.teamB || "",
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
  return newMatch;
};

const updateCricketMatch = (id, data) => {
  const index = cricketMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    cricketMatches[index] = { ...cricketMatches[index], ...data };
    return cricketMatches[index];
  }
  return null;
};

const deleteCricketMatch = (id) => {
  const index = cricketMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    return cricketMatches.splice(index, 1)[0];
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
