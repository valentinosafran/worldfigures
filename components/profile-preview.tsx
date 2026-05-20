import { fetchPersonData } from "../lib/api-client";

export async function ProfilePreview() {
  // Fetch live data for Emmanuel Macron
  const apiData = await fetchPersonData("emmanuel-macron");
  
  // Use API scores if available, fallback to defaults
  const scores = apiData?.data ? {
    approval: apiData.data.breakdown.approval.score,
    trust: apiData.data.breakdown.trust.score,
    impact: apiData.data.breakdown.impact.score,
    controversy: apiData.data.breakdown.controversy.score,
  } : {
    approval: 61,
    trust: 54,
    impact: 83,
    controversy: 58,
  };

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
            <span className="pill">🔴 Live data</span>
          </div>

          <div className="scoreList">
            <div>
              <label>Approval</label>
              <progress max="100" value={scores.approval} />
            </div>
            <div>
              <label>Trust</label>
              <progress max="100" value={scores.trust} />
            </div>
            <div>
              <label>Impact</label>
              <progress max="100" value={scores.impact} />
            </div>
            <div>
              <label>Controversy</label>
              <progress max="100" value={scores.controversy} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}