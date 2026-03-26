const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Only init client if valid URL
const hasValidConfig =
  typeof supabaseUrl === "string" &&
  supabaseUrl.includes("supabase.co") &&
  typeof supabaseKey === "string" &&
  supabaseKey.length > 0 &&
  supabaseKey !== "placeholder-key";
const supabase = hasValidConfig ? createClient(supabaseUrl, supabaseKey) : null;

let inMemoryStore = {};
let dbEnabled = !!supabase;

const initializeStore = async () => {
  if (!dbEnabled) {
    console.warn("⚠️ Supabase credentials not found in .env, running purely in memory.");
    return;
  }

  try {
    const { data, error } = await supabase.from('sport_states').select('*');
    if (error) throw error;
    
    if (data && data.length > 0) {
      data.forEach(row => {
        inMemoryStore[row.sport] = Array.isArray(row.data) ? row.data : [];
      });
      console.log("✅ Supabase DB Connected. Synced sports:", Object.keys(inMemoryStore));
    } else {
      console.log("✅ Supabase DB Connected. (Empty/Wiped DB - Starting fresh)");
    }
  } catch (err) {
    console.error("❌ Supabase initialization failed, falling back to memory layer:", err.message);
    dbEnabled = false;
  }
};

const getInitialSportMatches = (sport) => {
  // If the DB already had records, return a deep copy to prevent mutation bugs
  if (Array.isArray(inMemoryStore[sport]) && inMemoryStore[sport].length > 0) {
    return JSON.parse(JSON.stringify(inMemoryStore[sport]));
  }
  
  // The user requested a completely fresh wipe, ignoring seed files!
  inMemoryStore[sport] = [];
  return [];
};

const saveSportMatches = (sport, matches) => {
  inMemoryStore[sport] = matches;
  if (!dbEnabled) return;
  
  // Asynchronously flush the state to Supabase JSONB col
  supabase
    .from('sport_states')
    .upsert({ sport, data: matches, updated_at: new Date() })
    .then(({ error }) => {
      if (error) console.error(`Failed to save ${sport} to Supabase:`, error);
    });
};

module.exports = {
  initializeStore,
  getInitialSportMatches,
  saveSportMatches,
};
