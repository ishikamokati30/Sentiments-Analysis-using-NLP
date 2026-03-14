const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 4000;
const FLASK_API_URL = process.env.FLASK_API_URL || "http://127.0.0.1:5000";

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", upstream: FLASK_API_URL });
});

app.post("/analyze", async (req, res) => {
  const { text } = req.body || {};

  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "A non-empty 'text' field is required." });
  }

  try {
    const response = await axios.post(`${FLASK_API_URL}/predict`, { text });
    return res.json({
      ...response.data,
      analyzedAt: new Date().toISOString(),
      source: "flask-ml-service",
    });
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    return res.status(502).json({
      error: "Unable to reach the Flask sentiment service.",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
