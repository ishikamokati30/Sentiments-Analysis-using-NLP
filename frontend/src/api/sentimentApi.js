import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const api = axios.create();

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
  const { data } = await api.post(`${API}/analyze`, { text });
  return data;
}

export async function analyzeTextAdvanced(text) {
  const { data } = await api.post(`${API}/analyze-advanced`, { text });
  return data;
}

export async function fetchAnalytics() {
  const { data } = await api.get(`${API}/analytics`);
  return data;
}

export async function fetchHistory() {
  const { data } = await api.get(`${API}/history`);
  return Array.isArray(data) ? data : [];
}

export async function batchAnalyzeCsv(csvContent) {
  const { data } = await api.post(`${API}/batch-analyze`, { csvContent });
  return data;
}
