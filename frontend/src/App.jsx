import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

function normalizeHistoryEntry(entry) {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const sentiment =
    typeof entry.sentiment === "string" ? entry.sentiment.trim().toLowerCase() : "";

  if (!sentiment) {
    return null;
  }

  return {
    sentiment,
    text: typeof entry.text === "string" ? entry.text : "",
    timestamp: typeof entry.timestamp === "string" ? entry.timestamp : new Date().toISOString(),
  };
}

function App() {
  const [history, setHistory] = useState(() => {
    const saved = window.localStorage.getItem("sentiment-history");

    if (!saved) {
      return [];
    }

    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.map(normalizeHistoryEntry).filter(Boolean) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem("sentiment-history", JSON.stringify(history));
  }, [history]);

  const appendHistory = (entry) => {
    const normalizedEntry = normalizeHistoryEntry(entry);

    if (!normalizedEntry) {
      return;
    }

    setHistory((current) => [normalizedEntry, ...current].slice(0, 12));
  };

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage history={history} onAnalyze={appendHistory} />} />
        <Route path="/dashboard" element={<DashboardPage history={history} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
