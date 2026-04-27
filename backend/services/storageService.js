const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const HISTORY_FILE = path.join(DATA_DIR, "analysis-history.json");

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(HISTORY_FILE)) {
    fs.writeFileSync(HISTORY_FILE, "[]", "utf8");
  }
}

function readHistory(userId = null) {
  ensureStorage();

  try {
    const raw = fs.readFileSync(HISTORY_FILE, "utf8");
    const parsed = JSON.parse(raw);
    const allRecords = Array.isArray(parsed) ? parsed : [];

    // Strict User Isolation
    if (userId) {
      return allRecords.filter((record) => record.userId === String(userId));
    }

    // Do not return all records if no user is specified
    return [];
  } catch {
    return [];
  }
}

function writeHistory(entries) {
  ensureStorage();
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(entries, null, 2), "utf8");
}

function appendHistory(entry, userId = null) {
  // We read ALL history so we can append to the global file
  ensureStorage();
  let history = [];
  try {
    const raw = fs.readFileSync(HISTORY_FILE, "utf8");
    const parsed = JSON.parse(raw);
    history = Array.isArray(parsed) ? parsed : [];
  } catch {
    history = [];
  }

  if (userId) {
    entry.userId = String(userId);
  }

  history.unshift(entry);
  writeHistory(history.slice(0, 500));
  return entry;
}

module.exports = {
  appendHistory,
  readHistory,
};
