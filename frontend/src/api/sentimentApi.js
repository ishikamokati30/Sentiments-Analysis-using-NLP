import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:4000",
});

export async function analyzeText(text) {
  const { data } = await api.post("/analyze", { text });
  return data;
}

export async function analyzeTextAdvanced(text) {
  const { data } = await api.post("/analyze-advanced", { text });
  return data;
}

export async function fetchAnalytics() {
  const { data } = await api.get("/analytics");
  return data;
}

export async function fetchHistory() {
  const { data } = await api.get("/history");
  return Array.isArray(data) ? data : [];
}

export async function batchAnalyzeCsv(csvContent) {
  const { data } = await api.post("/batch-analyze", { csvContent });
  return data;
}
