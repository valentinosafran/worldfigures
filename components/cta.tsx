export function CTA() {
  return (
    <section className="section">
      <div className="container">
        <div className="ctaBox">
          <h2>Start exploring the Top 100</h2>
          <p>
            Browse the world’s most watched public figures through a transparent,
            source-based lens.
          </p>
          <div className="heroActions" style={{ justifyContent: "center" }}>
            <a className="button buttonPrimary" href="/top-100">
              Open rankings
            </a>
            <a className="button buttonSecondary" href="/categories">
              Browse by category
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}