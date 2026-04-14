import { NavLink } from "react-router-dom";

function MainLayout({ children }) {
  return (
    <div className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">AI Sentiment Intelligence</p>
          <h1>Sentiment Analytics Platform</h1>
        </div>
        <nav className="navlinks">
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            Analyzer
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
            Dashboard
          </NavLink>
          <NavLink to="/upload" className={({ isActive }) => (isActive ? "active" : "")}>
            CSV Upload
          </NavLink>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}

export default MainLayout;
