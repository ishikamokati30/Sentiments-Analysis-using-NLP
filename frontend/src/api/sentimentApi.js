import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:4000",
});

export async function analyzeText(text) {
  const { data } = await api.post("/analyze", { text });
  return data;
}
