const express = require("express");
const cors = require("cors");
const { analyzeText } = require("./helpers/analyzeText");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

function handleAnalyze(req, res) {
  const { text } = req.body || {};

  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "A non-empty 'text' field is required." });
  }

  return res.json(analyzeText(text));
}

app.post("/analyze", handleAnalyze);
app.post("/api/analyze", handleAnalyze);

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
