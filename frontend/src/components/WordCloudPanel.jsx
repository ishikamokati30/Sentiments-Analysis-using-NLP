import { TagCloud } from "react-tagcloud";

function WordCloudPanel({ history }) {
  const frequencies = history.reduce((accumulator, entry) => {
    entry.text
      .toLowerCase()
      .replace(/[^a-z\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 3)
      .forEach((word) => {
        accumulator[word] = (accumulator[word] || 0) + 1;
      });

    return accumulator;
  }, {});

  const tags = Object.entries(frequencies)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 30)
    .map(([value, count]) => ({ value, count }));

  return (
    <section className="card">
      <div className="section-heading">
        <p className="eyebrow">Vocabulary</p>
        <h2>Word cloud</h2>
      </div>
      <div className="word-cloud-wrap">
        <TagCloud
          minSize={18}
          maxSize={48}
          tags={tags}
          className="word-cloud"
          colorOptions={{ luminosity: "dark", hue: "orange" }}
        />
      </div>
    </section>
  );
}

export default WordCloudPanel;
