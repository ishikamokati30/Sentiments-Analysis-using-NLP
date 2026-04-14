import { TagCloud } from "react-tagcloud";

function WordCloudPanel({ words }) {
  if (!words?.length) {
    return null;
  }

  return (
    <section className="card word-cloud-wrap">
      <div className="section-heading">
        <p className="eyebrow">Keyword Map</p>
        <h2>Word cloud</h2>
      </div>
      <div className="word-cloud">
        <TagCloud
          minSize={14}
          maxSize={36}
          tags={words.map((item) => ({ value: item.value, count: item.count }))}
        />
      </div>
    </section>
  );
}

export default WordCloudPanel;
