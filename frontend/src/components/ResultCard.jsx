import AspectBreakdown from "./AspectBreakdown";
import ConfidenceMeter from "./ConfidenceMeter";
import HighlightedText from "./HighlightedText";

const EMOTION_ICONS = {
  happy: "😊",
  sad: "😢",
  angry: "😡",
  neutral: "😐",
  fear: "😟",
  surprise: "😲",
};

function ResultCard({ result }) {
  if (!result) {
    return (
      <article className="result-card neutral">
        <h3>Advanced Result</h3>
        <p>No analysis yet</p>
      </article>
    );
  }

  const toneClass =
    result.sentiment === "positive"
      ? "positive"
      : result.sentiment === "negative"
        ? "negative"
        : "neutral";

  const emotions = Object.entries(result.emotions?.distribution || {});

  return (
    <article className={`result-card ${toneClass}`}>
      <div className="section-heading">
        <p className="eyebrow">Advanced Analysis</p>
        <h2>Sentiment result</h2>
      </div>

      <p className="result-meta">
        Sentiment: <span className={`sentiment-badge tone-${result.sentiment}`}>{result.sentiment}</span>
      </p>
      <p className="result-meta">
        Mood: <span className="sentiment-badge">{result.mood}</span>
      </p>
      <p className="result-meta">
        Language: <span className="sentiment-badge">{result.language}</span>
      </p>

      <ConfidenceMeter score={result.sentimentScore} />

      <div className="pill-row">
        <span className={`pill ${result.sarcasm?.isSarcastic ? "warning" : "safe"}`}>
          Sarcasm: {result.sarcasm?.isSarcastic ? "Likely" : "Low"}
        </span>
        <span className={`pill ${result.spam?.isSpam ? "danger" : "safe"}`}>
          Spam/Fake: {result.spam?.isSpam ? "Flagged" : "Clean"}
        </span>
      </div>

      <div className="emotion-grid">
        {emotions.map(([emotion, value]) => (
          <div key={emotion} className="emotion-chip">
            <span>{EMOTION_ICONS[emotion] || "•"} {emotion}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <div className="subsection">
        <h3>Explainable keywords</h3>
        <HighlightedText items={result.explainability?.influentialWords} />
      </div>

      <div className="subsection">
        <h3>Aspect breakdown</h3>
        <AspectBreakdown aspects={result.aspects} />
      </div>

      <div className="subsection">
        <h3>Model outputs</h3>
        <div className="comparison-grid">
          {Object.entries(result.models || {}).map(([key, model]) => (
            <article key={key} className="comparison-card">
              <h3>{key}</h3>
              <p>Label: <strong>{model.label}</strong></p>
              <p>Score: {Number(model.score).toFixed(2)}</p>
              <p>Confidence: {Number(model.confidence).toFixed(2)}</p>
            </article>
          ))}
        </div>
      </div>
    </article>
  );
}

export default ResultCard;
