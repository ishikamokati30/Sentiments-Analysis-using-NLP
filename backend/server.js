const express = require("express");
const cors = require("cors");

const { analyzeText } = require("./helpers/analyzeText");
const { buildAnalytics } = require("./services/analyticsService");
const { runAdvancedAnalysis } = require("./services/nlpService");
const { appendHistory, readHistory } = require("./services/storageService");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.text({ type: ["text/csv", "text/plain"], limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

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
  const headerColumns = header.split(",").map((column) => column.trim().toLowerCase());
  const textIndex = headerColumns.findIndex((column) => ["text", "review", "content", "feedback"].includes(column));
  const dataRows = textIndex >= 0 ? rest : rows;

  return dataRows
    .map((row) => {
      const columns = row.split(",").map((column) => column.trim().replace(/^"|"$/g, ""));
      return textIndex >= 0 ? columns[textIndex] : columns[0];
    })
    .filter((value) => typeof value === "string" && value.trim());
}

async function handleAnalyze(req, res) {
  const { text } = req.body || {};

  if (!validateTextInput(text)) {
    return res.status(400).json({ error: "A non-empty 'text' field is required." });
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

app.post("/analyze-advanced", async (req, res) => {
  const { text } = req.body || {};

  if (!validateTextInput(text)) {
    return res.status(400).json({ error: "A non-empty 'text' field is required." });
  }

  try {
    const analysis = await runAdvancedAnalysis(text);
    appendHistory(analysis);
    return res.json(analysis);
  } catch {
    return res.status(500).json({ error: "Advanced analysis failed." });
  }
});

app.post("/batch-analyze", async (req, res) => {
  const csvContent = typeof req.body === "string" ? req.body : req.body?.csvContent;
  const rows = parseCsvContent(csvContent);

  if (!rows.length) {
    return res.status(400).json({ error: "CSV content is required with at least one text row." });
  }

  try {
    const results = [];

    for (const text of rows) {
      const analysis = await runAdvancedAnalysis(text);
      appendHistory(analysis);
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

app.get("/analytics", (_req, res) => {
  const history = readHistory();
  return res.json(buildAnalytics(history));
});

app.get("/history", (_req, res) => {
  return res.json(readHistory());
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
