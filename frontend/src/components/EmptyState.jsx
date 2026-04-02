import { Link } from "react-router-dom";

function EmptyState() {
  return (
    <section className="card empty-state">
      <h2>No analysis yet</h2>
      <p>Run a sentiment analysis from the home page to see results here.</p>
      <Link to="/">Go to analyzer</Link>
    </section>
  );
}

export default EmptyState;
