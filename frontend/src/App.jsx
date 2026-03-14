import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const [history, setHistory] = useState(() => {
    const saved = window.localStorage.getItem("sentiment-history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    window.localStorage.setItem("sentiment-history", JSON.stringify(history));
  }, [history]);

  const appendHistory = (entry) => {
    setHistory((current) => [entry, ...current].slice(0, 12));
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
