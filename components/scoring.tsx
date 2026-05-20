const scores = [
  {
    title: "Approval",
    text: "Polling, favorability, and public support indicators.",
  },
  {
    title: "Trust",
    text: "Institutional confidence, credibility signals, and consistent expert evaluations.",
  },
  {
    title: "Impact",
    text: "Measured public influence, policy relevance, and reach.",
  },
  {
    title: "Controversy",
    text: "Frequency and intensity of criticism, disputes, and sharply divided opinion.",
  },
];

export function Scoring() {
  return (
    <section className="section" id="methodology">
      <div className="container">
        <div className="sectionHeading">
          <span>How the score works</span>
          <h2>Transparent by design</h2>
          <p>
            WorldFigures combines multiple public signals into a profile view.
            Instead of claiming absolute truth, it shows measurable perception
            patterns with clear sourcing.
          </p>
        </div>

        <div className="cardGrid four">
          {scores.map((score) => (
            <article className="infoCard" key={score.title}>
              <h3>{score.title}</h3>
              <p>{score.text}</p>
            </article>
          ))}
        </div>
        
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <a href="/how-it-works" className="button buttonPrimary">
            Learn more about scoring
          </a>
        </div>
      </div>
    </section>
  );
}