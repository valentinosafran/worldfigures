import { fetchPersonData } from "../lib/api-client";
import { calculateLabel } from "../lib/label-calculator";

export async function ProfilePreview() {
  // Fetch live data for Emmanuel Macron
  const apiData = await fetchPersonData("emmanuel-macron");
  
  // Use API scores if available, fallback to defaults
  const scores = apiData ? {
    approval: apiData.breakdown.approval.score,
    trust: apiData.breakdown.trust.score,
    impact: apiData.breakdown.impact.score,
    controversy: apiData.breakdown.controversy.score,
  } : {
    approval: 61,
    trust: 54,
    impact: 83,
    controversy: 58,
  };

  const perceptionLabel = calculateLabel(scores);

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
                <p>President of France · Overall perception: {perceptionLabel}</p>
              </div>
            </div>
            <span className="panelUpdate previewLiveBadge">
              <span className="panelUpdateDot" aria-hidden="true" />
              Live data
            </span>
          </div>

          <div className="scoreList">
            <div>
              <label className="scoreLabelRow"><span>Approval</span><strong>{scores.approval}%</strong></label>
              <progress max="100" value={scores.approval} />
            </div>
            <div>
              <label className="scoreLabelRow"><span>Trust</span><strong>{scores.trust}%</strong></label>
              <progress max="100" value={scores.trust} />
            </div>
            <div>
              <label className="scoreLabelRow"><span>Impact</span><strong>{scores.impact}%</strong></label>
              <progress max="100" value={scores.impact} />
            </div>
            <div>
              <label className="scoreLabelRow"><span>Controversy</span><strong>{scores.controversy}%</strong></label>
              <progress max="100" value={scores.controversy} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}