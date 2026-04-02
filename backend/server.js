const express = require("express");
const cors = require("cors");
const Sentiment = require("sentiment");

const app = express();
const PORT = process.env.PORT || 4000;
const sentiment = new Sentiment();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/analyze", (req, res) => {
  const { text } = req.body || {};

  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "A non-empty 'text' field is required." });
  }

  const { score } = sentiment.analyze(text.trim());
  const sentimentLabel = score > 0 ? "positive" : "negative";

  return res.json({ sentiment: sentimentLabel });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
