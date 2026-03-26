const { getNextCounter } = require("./modelUtils");
const { getInitialSportMatches, saveSportMatches } = require("./matchStore");

let khokhoMatches = getInitialSportMatches("khokho");
let matchIdCounter = getNextCounter(khokhoMatches);

const getKhoKhoMatches = () => khokhoMatches;

const getKhoKhoMatchById = (id) => {
  return khokhoMatches.find((match) => match.id === parseInt(id));
};

const createKhoKhoMatch = (data) => {
  const newMatch = {
    id: matchIdCounter++,
    teamA: data.teamA || "",
    teamB: data.teamB || "",
    scoreA: data.scoreA || 0,
    scoreB: data.scoreB || 0,
    currentInning: data.currentInning || 1,
    chasingTeam: data.chasingTeam || "A",
    defendersRemaining: data.defendersRemaining || 7,
    timeRemaining: data.timeRemaining || "7:00",
    inning1ScoreA: data.inning1ScoreA || 0,
    inning2ScoreA: data.inning2ScoreA || 0,
    inning1ScoreB: data.inning1ScoreB || 0,
    inning2ScoreB: data.inning2ScoreB || 0,
    status: data.status || "",
  };
  khokhoMatches.push(newMatch);
  saveSportMatches("khokho", khokhoMatches);
  return newMatch;
};

const updateKhoKhoMatch = (id, data) => {
  const index = khokhoMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    khokhoMatches[index] = { ...khokhoMatches[index], ...data };
    saveSportMatches("khokho", khokhoMatches);
    return khokhoMatches[index];
  }
  return null;
};

const deleteKhoKhoMatch = (id) => {
  const index = khokhoMatches.findIndex((match) => match.id === parseInt(id));
  if (index !== -1) {
    const removedMatch = khokhoMatches.splice(index, 1)[0];
    saveSportMatches("khokho", khokhoMatches);
    return removedMatch;
  }
  return null;
};

module.exports = {
  getKhoKhoMatches,
  getKhoKhoMatchById,
  createKhoKhoMatch,
  updateKhoKhoMatch,
  deleteKhoKhoMatch,
};
