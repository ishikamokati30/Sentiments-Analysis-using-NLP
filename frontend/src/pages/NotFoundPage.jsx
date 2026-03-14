import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="card empty-state">
      <h2>Page not found</h2>
      <p>The requested route does not exist in this workspace.</p>
      <Link to="/">Return home</Link>
    </section>
  );
}

export default NotFoundPage;
