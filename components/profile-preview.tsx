export function ProfilePreview() {
  return (
    <section className="section">
      <div className="container previewPanel">
        <div>
          <span className="sectionKicker">Profile preview</span>
          <h2>What a person profile looks like</h2>
          <p>
            Each profile shows a perception snapshot, source-backed score
            dimensions, trend direction, and recent movement explanations.
          </p>
        </div>

        <div className="previewCard">
          <div className="previewHeader">
            <div className="profileIdentity">
              <img
                className="previewAvatar"
                src="/images/people/emmanuel-macron.jpg"
                alt="Emmanuel Macron"
              />
              <div>
                <h3>Emmanuel Macron</h3>
                <p>President of France · Overall perception: Mixed</p>
              </div>
            </div>
            <span className="pill">Updated today</span>
          </div>

          <div className="scoreList">
            <div>
              <label>Approval</label>
              <progress max="100" value="61" />
            </div>
            <div>
              <label>Trust</label>
              <progress max="100" value="54" />
            </div>
            <div>
              <label>Impact</label>
              <progress max="100" value="83" />
            </div>
            <div>
              <label>Controversy</label>
              <progress max="100" value="58" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}