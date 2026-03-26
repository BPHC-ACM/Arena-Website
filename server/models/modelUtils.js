const getNextCounter = (matches) => {
  if (!Array.isArray(matches) || matches.length === 0) {
    return 1;
  }

  const maxId = matches.reduce((max, match) => {
    const id = Number(match?.id) || 0;
    return id > max ? id : max;
  }, 0);

  return maxId + 1;
};

module.exports = {
  getNextCounter,
};
