function Spinner({ className = "h-4 w-4" }) {
  return <span className={`inline-block animate-spin rounded-full border-2 border-white/30 border-t-white ${className}`} />;
}

export default Spinner;
