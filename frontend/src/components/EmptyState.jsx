import { Link } from "react-router-dom";

function EmptyState() {
  return (
    <section className="card empty-state">
      <h2>No analytics yet</h2>
      <p>Run at least one sentiment analysis from the home page to populate the charts.</p>
      <Link to="/">Go to analyzer</Link>
    </section>
  );
}

export default EmptyState;
