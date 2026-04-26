import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:4000",
});

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("sentiment-token");
  const userRaw = window.localStorage.getItem("sentiment-user");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (userRaw) {
    try {
      const user = JSON.parse(userRaw);
      if (user?.email) {
        config.headers["x-user-id"] = user.email;
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
  }
  
  return config;
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
