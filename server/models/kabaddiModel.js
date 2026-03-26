const { getNextCounter } = require("./modelUtils");
const { getInitialSportMatches, saveSportMatches } = require("./matchStore");

let kabaddiMatches = getInitialSportMatches("kabaddi");
let matchIdCounter = getNextCounter(kabaddiMatches);

const getKabaddiMatches = () => kabaddiMatches;

const getKabaddiMatchById = (id) => {
  return kabaddiMatches.find((match) => match.id === parseInt(id));
};

const createKabaddiMatch = (data) => {
  const newMatch = {
    id: matchIdCounter++,
    teamA: data.teamA || "",
    teamB: data.teamB || "",
    scoreA: data.scoreA || 0,
    scoreB: data.scoreB || 0,
    playersOnMatA: data.playersOnMatA || 7,
    playersOnMatB: data.playersOnMatB || 7,
    raidTimer: data.raidTimer || 30,
    raidingTeam: data.raidingTeam || "",
    bonusActive: data.bonusActive || false,
    superRaidActive: data.superRaidActive || false,
    half: data.half || 1,
    timeRemaining: data.timeRemaining || "20:00",
    status: data.status || "",
  };
  kabaddiMatches.push(newMatch);
  saveSportMatches("kabaddi", kabaddiMatches);
  return newMatch;
};

const updateKabaddiMatch = (id, data) => {
  const index = kabaddiMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    kabaddiMatches[index] = { ...kabaddiMatches[index], ...data };
    saveSportMatches("kabaddi", kabaddiMatches);
    return kabaddiMatches[index];
  }
  return null;
};

const deleteKabaddiMatch = (id) => {
  const index = kabaddiMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    const removedMatch = kabaddiMatches.splice(index, 1)[0];
    saveSportMatches("kabaddi", kabaddiMatches);
    return removedMatch;
  }
  return null;
};

module.exports = {
  getKabaddiMatches,
  getKabaddiMatchById,
  createKabaddiMatch,
  updateKabaddiMatch,
  deleteKabaddiMatch,
};
