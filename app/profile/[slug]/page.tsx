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
  const signalScore = apiData?.signalScore || 0;
  const movement7d = apiData?.movement7d || null;
  
  // Use dynamic insights from API or fallback to static data
  const keyTopics = apiData?.keyTopics || person.keyTopics;
  const movementNotes = apiData?.movementNotes || person.trendNotes;
  const strengthSignals = apiData?.strengthSignals || person.strengths;
  const riskSignals = apiData?.riskSignals || person.risks;
  const articles = apiData?.articles || [];
  
  // Calculate dynamic label based on live scores
  const label = calculateLabel(scores);

  // Format 7-day movement for display
  const formatMovement = (value: number | undefined | null) => {
    if (value === null || value === undefined) return '-';
    if (value > 0) return `+${value}`;
    if (value < 0) return `${value}`;
    return '0';
  };

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
                <span>Signal score</span>
                <strong className="trend-up">{signalScore}</strong>
              </div>
              <div className="miniMetricCard">
                <span>Updated</span>
                <strong>{lastUpdated}</strong>
              </div>
            </div>

            {movement7d && (
              <div className="profileMetaRow" style={{ marginTop: '16px' }}>
                <div className="miniMetricCard">
                  <span>7d Approval</span>
                  <strong className={movement7d.approval >= 0 ? "trend-up" : "trend-down"}>
                    {formatMovement(movement7d.approval)}
                  </strong>
                </div>
                <div className="miniMetricCard">
                  <span>7d Trust</span>
                  <strong className={movement7d.trust >= 0 ? "trend-up" : "trend-down"}>
                    {formatMovement(movement7d.trust)}
                  </strong>
                </div>
                <div className="miniMetricCard">
                  <span>7d Impact</span>
                  <strong className={movement7d.impact >= 0 ? "trend-up" : "trend-down"}>
                    {formatMovement(movement7d.impact)}
                  </strong>
                </div>
                <div className="miniMetricCard">
                  <span>7d Controversy</span>
                  <strong className={movement7d.controversy >= 0 ? "trend-up" : "trend-down"}>
                    {formatMovement(movement7d.controversy)}
                  </strong>
                </div>
              </div>
            )}

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
                  {keyTopics.map((topic, idx) => (
                    <li key={`${topic}-${idx}`}>{topic}</li>
                  ))}
                </ul>
              </article>

              <article className="infoCard card-visible">
                <h3>Recent movement notes</h3>
                <ul className="profileList">
                  {movementNotes.map((note, idx) => (
                    <li key={`${note}-${idx}`}>{note}</li>
                  ))}
                </ul>
              </article>

              <article className="infoCard card-visible">
                <h3>Strength signals</h3>
                <ul className="profileList">
                  {strengthSignals.map((item, idx) => (
                    <li key={`${item}-${idx}`}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="infoCard card-visible">
                <h3>Risk signals</h3>
                <ul className="profileList">
                  {riskSignals.map((item, idx) => (
                    <li key={`${item}-${idx}`}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>

            {articles.length > 0 && (
              <article className="infoCard card-visible" style={{ marginTop: '24px' }}>
                <h3>Latest News Coverage</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px' }}>
                  Recent articles from NewsAPI · Updated {lastUpdated}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {articles.map((article, idx) => (
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      key={`${article.url}-${idx}`}
                      className="articleCard"
                      style={{
                        display: 'block',
                        padding: '16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                        <h4 style={{ 
                          fontSize: '16px', 
                          fontWeight: '600', 
                          color: '#e2e8f0',
                          margin: 0,
                          flex: 1,
                          lineHeight: '1.5'
                        }}>
                          {article.title}
                        </h4>
                        {article.sentiment && (
                          <span style={{
                            fontSize: '12px',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            marginLeft: '12px',
                            backgroundColor: article.sentiment > 0.1 
                              ? 'rgba(34, 197, 94, 0.2)'
                              : article.sentiment < -0.1
                              ? 'rgba(239, 68, 68, 0.2)'
                              : 'rgba(100, 116, 139, 0.2)',
                            color: article.sentiment > 0.1
                              ? '#86efac'
                              : article.sentiment < -0.1
                              ? '#fca5a5'
                              : '#94a3b8',
                          }}>
                            {article.sentiment > 0.1 ? '↗' : article.sentiment < -0.1 ? '↘' : '→'}
                          </span>
                        )}
                      </div>
                      {article.description && (
                        <p style={{ 
                          fontSize: '14px', 
                          color: '#94a3b8',
                          margin: '8px 0',
                          lineHeight: '1.6'
                        }}>
                          {article.description}
                        </p>
                      )}
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        fontSize: '12px',
                        color: '#64748b',
                        marginTop: '8px'
                      }}>
                        <span>{article.source}</span>
                        <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </article>
            )}
          </article>
        </div>
      </section>
      <Footer />
    </main>
  );
}
