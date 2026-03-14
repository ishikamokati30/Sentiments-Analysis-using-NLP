import { NavLink } from "react-router-dom";

function MainLayout({ children }) {
  return (
    <div className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">AI Sentiment Intelligence</p>
          <h1>Sentiment Analysis Platform</h1>
        </div>
        <nav className="navlinks">
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
            Dashboard
          </NavLink>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}

export default MainLayout;
