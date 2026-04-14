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

function readHistory() {
  ensureStorage();

  try {
    const raw = fs.readFileSync(HISTORY_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeHistory(entries) {
  ensureStorage();
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(entries, null, 2), "utf8");
}

function appendHistory(entry) {
  const history = readHistory();
  history.unshift(entry);
  writeHistory(history.slice(0, 500));
  return entry;
}

module.exports = {
  appendHistory,
  readHistory,
};
