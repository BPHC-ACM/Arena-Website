const fs = require("fs");
const path = require("path");

const DATA_DIR = path.resolve(__dirname, "../data");
const STORE_FILE = path.join(DATA_DIR, "matches.json");

const ensureStoreFile = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(STORE_FILE)) {
    fs.writeFileSync(STORE_FILE, JSON.stringify({}, null, 2));
  }
};

const safeParse = (content) => {
  try {
    const parsed = JSON.parse(content);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const readStore = () => {
  ensureStoreFile();
  const raw = fs.readFileSync(STORE_FILE, "utf-8");
  return safeParse(raw);
};

const writeStore = (store) => {
  ensureStoreFile();
  fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2));
};

const getInitialSportMatches = (sport, seedData) => {
  const store = readStore();

  if (Array.isArray(store[sport])) {
    return JSON.parse(JSON.stringify(store[sport]));
  }

  store[sport] = Array.isArray(seedData) ? JSON.parse(JSON.stringify(seedData)) : [];
  writeStore(store);
  return store[sport];
};

const saveSportMatches = (sport, matches) => {
  const store = readStore();
  store[sport] = Array.isArray(matches) ? matches : [];
  writeStore(store);
};

module.exports = {
  getInitialSportMatches,
  saveSportMatches,
};
