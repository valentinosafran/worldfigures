export function TrustSection() {
  return (
    <section className="section" id="sources">
      <div className="container">
        <div className="sectionHeading">
          <span>Why people use it</span>
          <h2>No black-box reputation scores</h2>
          <p>
            WorldFigures is a public-perception platform, not a moral authority.
            Scores reflect measurable signals from selected public sources and
            may change as new data arrives.
          </p>
        </div>

        <div className="cardGrid two">
          <article className="infoCard">
            <h3>Compare figures quickly</h3>
            <p>See how perception differs across people, regions, and time.</p>
          </article>
          <article className="infoCard">
            <h3>Inspect the evidence</h3>
            <p>Every profile is designed to be explainable, not mysterious.</p>
          </article>
          <article className="infoCard">
            <h3>Track changes over time</h3>
            <p>Spot who is gaining trust, losing approval, or becoming more polarizing.</p>
          </article>
          <article className="infoCard">
            <h3>Avoid simplistic labels</h3>
            <p>WorldFigures shows nuance instead of reducing people to a single verdict.</p>
          </article>
        </div>
      </div>
    </section>
  );
}