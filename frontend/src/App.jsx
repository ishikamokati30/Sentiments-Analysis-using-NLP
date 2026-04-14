import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import { fetchAnalytics, fetchHistory } from "./api/sentimentApi";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import FileUploadPage from "./pages/FileUploadPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

function normalizeEntry(entry) {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const sentiment = typeof entry.sentiment === "string" ? entry.sentiment.trim().toLowerCase() : "";

  if (!sentiment) {
    return null;
  }

  return {
    text: typeof entry.text === "string" ? entry.text : "",
    sentiment,
    sentimentScore: Number(entry.sentimentScore ?? 0),
    mood: typeof entry.mood === "string" ? entry.mood.trim() : "Neutral 😐",
    language: typeof entry.language === "string" ? entry.language : "english",
    emotions: entry.emotions || { primary: "neutral", distribution: {} },
    aspects: Array.isArray(entry.aspects) ? entry.aspects : [],
    sarcasm: entry.sarcasm || { isSarcastic: false, confidence: 0, reasons: [] },
    spam: entry.spam || { isSpam: false, confidence: 0, reasons: [] },
    explainability: entry.explainability || { influentialWords: [], highlightedText: [] },
    wordCloud: Array.isArray(entry.wordCloud) ? entry.wordCloud : [],
    models: entry.models || {},
    timestamp: typeof entry.timestamp === "string" ? entry.timestamp : new Date().toISOString(),
  };
}

function App() {
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      try {
        const [historyPayload, analyticsPayload] = await Promise.all([fetchHistory(), fetchAnalytics()]);

        if (!active) {
          return;
        }

        setHistory(historyPayload.map(normalizeEntry).filter(Boolean));
        setAnalytics(analyticsPayload);
      } catch {
        if (!active) {
          return;
        }

        try {
          const localHistory = window.localStorage.getItem("sentiment-history");
          const parsedHistory = localHistory ? JSON.parse(localHistory) : [];
          setHistory(Array.isArray(parsedHistory) ? parsedHistory.map(normalizeEntry).filter(Boolean) : []);
        } catch {
          setHistory([]);
        }
      } finally {
        if (active) {
          setBootstrapping(false);
        }
      }
    }

    loadInitialData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem("sentiment-history", JSON.stringify(history));
  }, [history]);

  const appendHistory = (entry) => {
    const normalized = normalizeEntry(entry);

    if (!normalized) {
      return;
    }

    setHistory((current) => [normalized, ...current].slice(0, 100));
  };

  return (
    <MainLayout>
      <Routes>
        <Route
          path="/"
          element={<HomePage history={history} onAnalyze={appendHistory} onAnalyticsRefresh={setAnalytics} />}
        />
        <Route
          path="/dashboard"
          element={<DashboardPage history={history} analytics={analytics} bootstrapping={bootstrapping} />}
        />
        <Route
          path="/upload"
          element={
            <FileUploadPage
              onBatchAppend={(updater) => {
                setHistory((current) => {
                  const nextHistory = typeof updater === "function" ? updater(current) : updater;
                  return (Array.isArray(nextHistory) ? nextHistory : current)
                    .map(normalizeEntry)
                    .filter(Boolean)
                    .slice(0, 100);
                });
              }}
              onAnalyticsRefresh={setAnalytics}
            />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
