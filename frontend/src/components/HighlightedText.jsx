function HighlightedText({ items }) {
  if (!items?.length) {
    return <p className="muted-text">No standout keywords detected yet.</p>;
  }

  return (
    <div className="highlighted-text">
      {items.map((item, index) => (
        <span key={`${item.token || item.word}-${index}`} className={`token-chip ${item.label}`}>
          {item.token || item.word}
        </span>
      ))}
    </div>
  );
}

export default HighlightedText;
