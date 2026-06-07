"use client";

import { useEffect, useState } from "react";
import { getPersonBySlug } from "../data/people";
import { fetchPersonData } from "../lib/api-client";
import { calculateLabel } from "../lib/label-calculator";
import { getDisplayRole } from "../lib/profile-taxonomy";

export function ProfilePreviewHome() {
  const person = getPersonBySlug("emmanuel-macron");
  const defaultScores = person?.scores ?? {
    approval: 61,
    trust: 54,
    impact: 83,
    controversy: 58,
  };

  const [scores, setScores] = useState(defaultScores);
  const [perceptionLabel, setPerceptionLabel] = useState(calculateLabel(defaultScores));
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const apiData = await fetchPersonData("emmanuel-macron");
        if (!apiData?.breakdown || cancelled) return;

        const liveScores = {
          approval: apiData.breakdown.approval.score,
          trust: apiData.breakdown.trust.score,
          impact: apiData.breakdown.impact.score,
          controversy: apiData.breakdown.controversy.score,
        };

        setScores(liveScores);
        setPerceptionLabel(calculateLabel(liveScores));
        setIsLive(true);
      } catch {
        // keep static snapshot
      }
    }

    hydrate();

    return () => {
      cancelled = true;
    };
  }, []);

  const displayRole = person ? getDisplayRole(person) : "President of France";

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
                <p>{displayRole} · Overall perception: {perceptionLabel}</p>
              </div>
            </div>
            <span className="panelUpdate previewLiveBadge">
              <span className="panelUpdateDot" aria-hidden="true" />
              {isLive ? "Live data" : "Loading live data"}
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
