import { Footer } from "../../../components/footer";
import { Navbar } from "../../../components/navbar";
import {
  getOpinionClass,
  getPersonBySlug,
  people,
} from "../../../data/people";

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

export function generateStaticParams() {
  return people.map((person) => ({ slug: person.slug }));
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
                <span className={`pill opinionTag ${getOpinionClass(person.label)}`}>
                  {person.label}
                </span>
              </div>
            </div>

            <p className="profileSummary">{person.summary}</p>

            <div className="profileMetaRow">
              <div className="miniMetricCard">
                <span>Source confidence</span>
                <strong>{person.sourceConfidence}%</strong>
              </div>
              <div className="miniMetricCard">
                <span>7-day movement</span>
                <strong className={person.trend7d >= 0 ? "trend-up" : "trend-down"}>
                  {person.trend7d >= 0 ? `+${person.trend7d}` : person.trend7d}
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
                <strong>{person.lastUpdated}</strong>
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
                  <strong className={`scoreValue ${getValueTone("approval", person.scores.approval)}`}>
                    {person.scores.approval}
                  </strong>
                </div>
                <div className="scaleTrack">
                  <div
                    className={`scaleFill fill-${getValueTone("approval", person.scores.approval)}`}
                    style={{ width: `${person.scores.approval}%` }}
                  />
                </div>
                <p className="bandLabel">{getBandLabel("approval", person.scores.approval)}</p>
              </div>
              <div className="profileScoreCard">
                <div className="profileScoreHeader">
                  <span>Trust</span>
                  <strong className={`scoreValue ${getValueTone("trust", person.scores.trust)}`}>
                    {person.scores.trust}
                  </strong>
                </div>
                <div className="scaleTrack">
                  <div
                    className={`scaleFill fill-${getValueTone("trust", person.scores.trust)}`}
                    style={{ width: `${person.scores.trust}%` }}
                  />
                </div>
                <p className="bandLabel">{getBandLabel("trust", person.scores.trust)}</p>
              </div>
              <div className="profileScoreCard">
                <div className="profileScoreHeader">
                  <span>Impact</span>
                  <strong className={`scoreValue ${getValueTone("impact", person.scores.impact)}`}>
                    {person.scores.impact}
                  </strong>
                </div>
                <div className="scaleTrack">
                  <div
                    className={`scaleFill fill-${getValueTone("impact", person.scores.impact)}`}
                    style={{ width: `${person.scores.impact}%` }}
                  />
                </div>
                <p className="bandLabel">{getBandLabel("impact", person.scores.impact)}</p>
              </div>
              <div className="profileScoreCard">
                <div className="profileScoreHeader">
                  <span>Controversy</span>
                  <strong className={`scoreValue ${getValueTone("controversy", person.scores.controversy)}`}>
                    {person.scores.controversy}
                  </strong>
                </div>
                <div className="scaleTrack">
                  <div
                    className={`scaleFill fill-${getValueTone("controversy", person.scores.controversy)}`}
                    style={{ width: `${person.scores.controversy}%` }}
                  />
                </div>
                <p className="bandLabel">{getBandLabel("controversy", person.scores.controversy)}</p>
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
