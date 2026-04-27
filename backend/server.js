const express = require("express");
const cors = require("cors");

const { analyzeText } = require("./helpers/analyzeText");
const { buildAnalytics } = require("./services/analyticsService");
const {
  runAdvancedAnalysis,
  runStrictFormatAnalysis,
} = require("./services/nlpService");
const { appendHistory, readHistory } = require("./services/storageService");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.text({ type: ["text/csv", "text/plain"], limit: "2mb" }));

app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Authentication Middleware
function requireAuth(req, res, next) {
  const userIdHeader = req.headers["x-user-id"];
  const userIdBody = req.body && req.body.userId;
  const userIdQuery = req.query.userId;

  // Try to get user ID from headers, body, or query params
  const userId = userIdHeader || userIdBody || userIdQuery;

  if (!userId) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Missing user identification." });
  }

  req.userId = String(userId);
  next();
}

function validateTextInput(text) {
  return typeof text === "string" && text.trim();
}

function parseCsvContent(csvContent) {
  const rows = String(csvContent || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!rows.length) {
    return [];
  }

  const [header, ...rest] = rows;
  const headerColumns = header
    .split(",")
    .map((column) => column.trim().toLowerCase());
  const textIndex = headerColumns.findIndex((column) =>
    ["text", "review", "content", "feedback"].includes(column),
  );
  const dataRows = textIndex >= 0 ? rest : rows;

  return dataRows
    .map((row) => {
      const columns = row
        .split(",")
        .map((column) => column.trim().replace(/^"|"$/g, ""));
      return textIndex >= 0 ? columns[textIndex] : columns[0];
    })
    .filter((value) => typeof value === "string" && value.trim());
}

async function handleAnalyze(req, res) {
  const { text } = req.body || {};

  if (!validateTextInput(text)) {
    return res
      .status(400)
      .json({ error: "A non-empty 'text' field is required." });
  }

  try {
    const result = await analyzeText(text);
    return res.json(result);
  } catch {
    return res.status(500).json({ error: "Analysis failed." });
  }
}

app.post("/analyze", handleAnalyze);
app.post("/api/analyze", handleAnalyze);

app.post("/analyze-advanced", requireAuth, async (req, res) => {
  const { text } = req.body || {};

  if (!validateTextInput(text)) {
    return res
      .status(400)
      .json({ error: "A non-empty 'text' field is required." });
  }

  try {
    const analysis = await runAdvancedAnalysis(text);
    appendHistory(analysis, req.userId);
    return res.json(analysis);
  } catch {
    return res.status(500).json({ error: "Advanced analysis failed." });
  }
});

app.post("/analyze-strict", async (req, res) => {
  const { text } = req.body || {};

  if (!validateTextInput(text)) {
    return res
      .status(400)
      .json({ error: "A non-empty 'text' field is required." });
  }

  try {
    const analysis = await runStrictFormatAnalysis(text);
    return res.json(analysis);
  } catch {
    return res.status(500).json({ error: "Strict format analysis failed." });
  }
});

app.post("/batch-analyze", requireAuth, async (req, res) => {
  const { csvContent } =
    typeof req.body === "string" ? { csvContent: req.body } : req.body || {};
  const rows = parseCsvContent(csvContent);

  if (!rows.length) {
    return res
      .status(400)
      .json({ error: "CSV content is required with at least one text row." });
  }

  try {
    const results = [];

    for (const text of rows) {
      const analysis = await runAdvancedAnalysis(text);
      appendHistory(analysis, req.userId);
      results.push(analysis);
    }

    return res.json({
      processed: results.length,
      results,
      summary: buildAnalytics(results),
    });
  } catch {
    return res.status(500).json({ error: "Batch analysis failed." });
  }
});

app.get("/analytics", requireAuth, (req, res) => {
  const history = readHistory(req.userId);
  return res.json(buildAnalytics(history));
});

app.get("/history", requireAuth, (req, res) => {
  return res.json(readHistory(req.userId));
});

// User Isolation Endpoints
app.post("/save", requireAuth, (req, res) => {
  const { data } = req.body || {};

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Invalid data." });
  }

  // Ensure record is saved with strict userId
  const record = { ...data, userId: req.userId };
  appendHistory(record, req.userId);

  return res.json({
    status: "saved",
    userId: req.userId,
    record: record,
  });
});

app.post("/get_dashboard", requireAuth, (req, res) => {
  // Fetch only records for this specific user
  const records = readHistory(req.userId);

  return res.json({
    userId: req.userId,
    records: records,
  });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
