"use client";

import { useEffect, useState } from "react";
import { people } from "../data/people";
import { fetchMultiplePeopleData } from "../lib/api-client";
import { calculateLabel, getOpinionClass } from "../lib/label-calculator";
import { InlineVoteDisplay } from "./inline-vote-display";
import { getDisplayRole } from "../lib/profile-taxonomy";

type TrendingPerson = {
  name: string;
  slug: string;
  image: string;
  role: string;
  opinion: string;
  delta: number;
  hasMovementData: boolean;
  signalScore: number;
};

function getStaticSignalScore(scores: {
  approval: number;
  trust: number;
  impact: number;
  controversy: number;
}, trend7d: number) {
  const movementBonus = Math.min(Math.abs(trend7d) * 1.2, 12);
  const base = (scores.impact * 0.65) + (scores.controversy * 0.3) + (((scores.approval + scores.trust) / 2) * 0.05);
  return Math.round(base + movementBonus);
}

function getStaticTrendingPeople(): TrendingPerson[] {
  return [...people]
    .map((person) => {
      const scores = person.scores;
      return {
        name: person.name,
        slug: person.slug,
        image: person.image,
        role: getDisplayRole(person),
        opinion: calculateLabel(scores),
        delta: person.trend7d,
        hasMovementData: true,
        signalScore: getStaticSignalScore(scores, person.trend7d),
      };
    })
    .sort((a, b) => b.signalScore - a.signalScore)
    .slice(0, 8);
}

export function TrendingHome() {
  const [trendingPeople, setTrendingPeople] = useState<TrendingPerson[]>(getStaticTrendingPeople());
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function hydrateLiveData() {
      try {
        const apiDataMap = await fetchMultiplePeopleData(people.map((p) => p.slug));

        const enrichedPeople = people.map((person) => {
          const apiData = apiDataMap.get(person.slug);
          const scores = apiData
            ? {
                approval: apiData.breakdown.approval.score,
                trust: apiData.breakdown.trust.score,
                impact: apiData.breakdown.impact.score,
                controversy: apiData.breakdown.controversy.score,
              }
            : person.scores;

          const signalScore = apiData?.signalScore ?? getStaticSignalScore(scores, person.trend7d);
          const movement7d = apiData?.movement7d;
          let delta = person.trend7d;

          if (movement7d) {
            delta = Math.round(
              movement7d.impact * 0.65 +
              movement7d.controversy * 0.3 +
              (movement7d.approval + movement7d.trust) * 0.025
            );
          }

          return {
            name: person.name,
            slug: person.slug,
            image: person.image,
            role: getDisplayRole(person),
            opinion: calculateLabel(scores),
            delta,
            hasMovementData: !!movement7d,
            signalScore,
          };
        });

        const topBySignal = enrichedPeople
          .sort((a, b) => b.signalScore - a.signalScore)
          .slice(0, 8);

        if (!cancelled) {
          setTrendingPeople(topBySignal);
        }
      } catch {
        // Keep the static first paint if live hydration fails.
      } finally {
        if (!cancelled) {
          setIsHydrating(false);
        }
      }
    }

    hydrateLiveData();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="section" id="rankings">
      <div className="container">
        <div className="sectionHeading">
          <span>Trending public figures</span>
          <h2>Explore the Top 100</h2>
          <p>
            Start with the current standout profiles, then open the full Top 100 dashboard
            for deeper rankings, momentum, and narrative signals.
          </p>
        </div>

        <div className="panelUpdate" style={{ marginBottom: "18px" }}>
          <span className="panelUpdateDot" aria-hidden="true" />
          {isHydrating ? "Showing fast snapshot, updating live signals..." : "Live signal ranking updated"}
        </div>

        <div className="cardGrid four profileCards">
          {trendingPeople.map((person) => (
            <article className="profileCard" key={person.name}>
              <img className="avatar" src={person.image} alt={person.name} />
              <h3>{person.name}</h3>
              <p className="muted">{person.role}</p>
              <div className={`pill opinionTag ${getOpinionClass(person.opinion)}`}>
                {person.opinion}
                <InlineVoteDisplay slug={person.slug} />
              </div>
              <a className="textLink" href={`/profile/${person.slug}`}>
                View profile &rarr;
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
