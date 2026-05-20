import { Footer } from "../../../components/footer";
import { Navbar } from "../../../components/navbar";
import {
  getPersonBySlug,
  people,
} from "../../../data/people";
import { fetchPersonData, formatLastUpdated } from "../../../lib/api-client";
import { calculateLabel, getOpinionClass } from "../../../lib/label-calculator";

// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getValueTone(metric: "approval" | "trust" | "impact" | "controversy", value: number) {
  if (metric === "controversy") {
    if (value >= 80) return "tone-risk-high";
    if (value >= 60) return "tone-risk-medium";
    return "tone-risk-low";
  }

  if (value >= 80) return "tone-good-high";
  if (value >= 60) return "tone-good-medium";
  if (value >= 40) return "tone-good-mixed";
  return "tone-good-low";
}

function getBandLabel(metric: "approval" | "trust" | "impact" | "controversy", value: number) {
  if (metric === "controversy") {
    if (value >= 80) return "Very disputed";
    if (value >= 60) return "High dispute";
    if (value >= 40) return "Moderate dispute";
    return "Low dispute";
  }

  if (value >= 80) return "Very strong";
  if (value >= 60) return "Strong";
  if (value >= 40) return "Mixed";
  return "Weak";
}

export default async function PersonProfilePage({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const resolvedParams = await Promise.resolve(params);
  const person = getPersonBySlug(resolvedParams?.slug);

  if (!person) {
    return (
      <main>
        <Navbar />
        <section className="section">
          <div className="container profilePageWrap">
            <a href="/#rankings" className="textLink backLink">
              ← Back to rankings
            </a>
            <article className="previewCard profileHeroCard card-visible">
              <h1 className="profileHeroTitle">Profile not found</h1>
              <p className="profileSummary">
                We could not find this person profile.
              </p>
            </article>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  // Fetch real-time data from API
  const apiData = await fetchPersonData(resolvedParams.slug);

  // Use API scores if available, otherwise fall back to static data
  const scores = apiData ? {
    approval: apiData.breakdown.approval.score,
    trust: apiData.breakdown.trust.score,
    impact: apiData.breakdown.impact.score,
    controversy: apiData.breakdown.controversy.score,
  } : person.scores;

  const confidence = apiData ? apiData.confidence : person.sourceConfidence;
  const lastUpdated = apiData ? formatLastUpdated(apiData.lastUpdated) : person.lastUpdated;
  const isLiveData = !!apiData;
  
  // Calculate dynamic label based on live scores
  const label = calculateLabel(scores);

  return (
    <main>
      <Navbar />
      <section className="section">
        <div className="container profilePageWrap">
          <a href="/#rankings" className="textLink backLink">
            ← Back to rankings
          </a>

          <article className="previewCard profileHeroCard card-visible">
            <div className="profileHeroTop">
              <img className="profileHeroAvatar" src={person.image} alt={person.name} />
              <div>
                <h1 className="profileHeroTitle">{person.name}</h1>
                <p className="profileHeroMeta">
                  {person.role} · {person.region}
                </p>
                <span className={`pill opinionTag ${getOpinionClass(label)}`}>
                  {label}
                </span>
              </div>
            </div>

            <p className="profileSummary">{person.summary}</p>

            <div className="profileMetaRow">
              <div className="miniMetricCard">
                <span>Source confidence</span>
                <strong>{Math.round(confidence)}%</strong>
              </div>
              <div className="miniMetricCard">
                <span>Data status</span>
                <strong className={isLiveData ? "trend-up" : "trend-flat"}>
                  {isLiveData ? "🔴 Live" : "📊 Static"}
                </strong>
              </div>
              <div className="miniMetricCard">
                <span>30-day movement</span>
                <strong className={person.trend30d >= 0 ? "trend-up" : "trend-down"}>
                  {person.trend30d >= 0 ? `+${person.trend30d}` : person.trend30d}
                </strong>
              </div>
              <div className="miniMetricCard">
                <span>Updated</span>
                <strong>{lastUpdated}</strong>
              </div>
            </div>

            <p className="scoreLegend">
              Score interval is 0-100: 0-39 weak/low, 40-59 mixed, 60-79 strong, 80-100 very strong.
              For controversy, higher means more public dispute.
            </p>

            <div className="profileScoreGrid">
              <div className="profileScoreCard">
                <div className="profileScoreHeader">
                  <span>Approval</span>
                  <strong className={`scoreValue ${getValueTone("approval", scores.approval)}`}>
                    {scores.approval}
                  </strong>
                </div>
                <div className="scaleTrack">
                  <div
                    className={`scaleFill fill-${getValueTone("approval", scores.approval)}`}
                    style={{ width: `${scores.approval}%` }}
                  />
                </div>
                <p className="bandLabel">{getBandLabel("approval", scores.approval)}</p>
              </div>
              <div className="profileScoreCard">
                <div className="profileScoreHeader">
                  <span>Trust</span>
                  <strong className={`scoreValue ${getValueTone("trust", scores.trust)}`}>
                    {scores.trust}
                  </strong>
                </div>
                <div className="scaleTrack">
                  <div
                    className={`scaleFill fill-${getValueTone("trust", scores.trust)}`}
                    style={{ width: `${scores.trust}%` }}
                  />
                </div>
                <p className="bandLabel">{getBandLabel("trust", scores.trust)}</p>
              </div>
              <div className="profileScoreCard">
                <div className="profileScoreHeader">
                  <span>Impact</span>
                  <strong className={`scoreValue ${getValueTone("impact", scores.impact)}`}>
                    {scores.impact}
                  </strong>
                </div>
                <div className="scaleTrack">
                  <div
                    className={`scaleFill fill-${getValueTone("impact", scores.impact)}`}
                    style={{ width: `${scores.impact}%` }}
                  />
                </div>
                <p className="bandLabel">{getBandLabel("impact", scores.impact)}</p>
              </div>
              <div className="profileScoreCard">
                <div className="profileScoreHeader">
                  <span>Controversy</span>
                  <strong className={`scoreValue ${getValueTone("controversy", scores.controversy)}`}>
                    {scores.controversy}
                  </strong>
                </div>
                <div className="scaleTrack">
                  <div
                    className={`scaleFill fill-${getValueTone("controversy", scores.controversy)}`}
                    style={{ width: `${scores.controversy}%` }}
                  />
                </div>
                <p className="bandLabel">{getBandLabel("controversy", scores.controversy)}</p>
              </div>
            </div>

            <div className="profileDetailGrid">
              <article className="infoCard card-visible">
                <h3>Key topics</h3>
                <ul className="profileList">
                  {person.keyTopics.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
              </article>

              <article className="infoCard card-visible">
                <h3>Recent movement notes</h3>
                <ul className="profileList">
                  {person.trendNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </article>

              <article className="infoCard card-visible">
                <h3>Strength signals</h3>
                <ul className="profileList">
                  {person.strengths.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="infoCard card-visible">
                <h3>Risk signals</h3>
                <ul className="profileList">
                  {person.risks.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          </article>
        </div>
      </section>
      <Footer />
    </main>
  );
}
