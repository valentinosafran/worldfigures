import { people, type PersonProfile } from "../data/people";
import { fetchMultiplePeopleData } from "../lib/api-client";
import { calculateLabel, getOpinionClass } from "../lib/label-calculator";

function formatDelta(value: number) {
  if (value > 0) return `+${value}`;
  if (value < 0) return `${value}`;
  return "0";
}

function getDeltaClass(value: number) {
  if (value > 0) return "change-up";
  if (value < 0) return "change-down";
  return "change-flat";
}

type EnrichedPerson = PersonProfile & {
  signalScore: number;
  pressureScore: number;
  hasLiveData: boolean;
  trend7d: number;
};

function getPressureScore(scores: { approval: number; trust: number; impact: number; controversy: number }, trend7d: number) {
  return Math.round(
    scores.controversy * 0.5 +
      Math.max(trend7d * -12, 0) +
      Math.max(55 - scores.trust, 0)
  );
}

function calculate7dMovement(movement7d?: { approval: number; trust: number; impact: number; controversy: number } | null): number {
  if (!movement7d) return 0;
  // Average the 4 score changes to get overall movement
  return Number(
    ((movement7d.approval + movement7d.trust + movement7d.impact + movement7d.controversy) / 4).toFixed(1)
  );
}

export async function Top100Dashboard() {
  // Fetch real-time data for all people
  const apiDataMap = await fetchMultiplePeopleData(people.map(p => p.slug));

  // Merge static profiles with API data and calculate derived scores
  const enrichedPeople: EnrichedPerson[] = people.map(person => {
    const apiData = apiDataMap.get(person.slug);
    const scores = apiData ? {
      approval: apiData.breakdown.approval.score,
      trust: apiData.breakdown.trust.score,
      impact: apiData.breakdown.impact.score,
      controversy: apiData.breakdown.controversy.score,
    } : person.scores;
    
    const sourceConfidence = apiData ? apiData.confidence : person.sourceConfidence;
    const label = calculateLabel(scores);
    
    // Use real signalScore from API, fallback to 0 if not available
    const signalScore = apiData?.signalScore ?? 0;
    
    // Calculate 7-day movement from API movement7d data
    const trend7d = apiData ? calculate7dMovement(apiData.movement7d) : person.trend7d;
    
    return {
      ...person,
      scores,
      label,
      sourceConfidence,
      signalScore,
      trend7d,
      pressureScore: getPressureScore(scores, trend7d),
      hasLiveData: !!apiData,
    };
  });

  const rankedPeople = [...enrichedPeople].sort((a, b) => b.signalScore - a.signalScore);

  const positiveCount = enrichedPeople.filter((person) =>
    person.label.toLowerCase().includes("positive")
  ).length;
  const polarizingCount = enrichedPeople.filter((person) =>
    person.label.toLowerCase().includes("polarizing")
  ).length;
  const averageApproval = Math.round(
    enrichedPeople.reduce((sum, person) => sum + person.scores.approval, 0) / enrichedPeople.length
  );
  const averageTrust = Math.round(
    enrichedPeople.reduce((sum, person) => sum + person.scores.trust, 0) / enrichedPeople.length
  );
  const averageTrend7d = Number(
    (
      enrichedPeople.reduce((sum, person) => sum + person.trend7d, 0) / enrichedPeople.length
    ).toFixed(1)
  );

  const mostWatched = rankedPeople[0];
  const biggestRiser = [...rankedPeople].sort((a, b) => {
    if (b.trend7d !== a.trend7d) return b.trend7d - a.trend7d;
    return b.trend30d - a.trend30d;
  })[0];
  const trustLeader = [...rankedPeople].sort(
    (a, b) => b.scores.trust - a.scores.trust
  )[0];
  const pressurePoint = [...rankedPeople].sort(
    (a, b) => b.pressureScore - a.pressureScore
  )[0];

  const topNarratives = Object.entries(
    enrichedPeople.reduce<Record<string, number>>((acc, person) => {
      person.keyTopics.forEach((topic) => {
        acc[topic] = (acc[topic] ?? 0) + 1;
      });

      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <section className="section">
      <div className="container">
        <div className="sectionHeading">
          <span>WorldFigures list view</span>
          <h2>Top 100 dashboard</h2>
          <p>
            This dashboard surfaces who matters right now, who is moving fastest,
            and which narratives are driving public attention across tracked figures.
            The main board is sorted by live attention, because users usually want
            to see what is both important and moving, not only who is most liked.
          </p>
        </div>

        <div className="dashboardStats">
          <article className="dashboardStatCard infoCard">
            <span className="dashboardStatLabel">Avg approval</span>
            <strong>{averageApproval}</strong>
            <p>Platform-wide approval benchmark across tracked figures.</p>
          </article>
          <article className="dashboardStatCard infoCard">
            <span className="dashboardStatLabel">Avg trust</span>
            <strong>{averageTrust}</strong>
            <p>Trust stays below approval, which signals caution in public sentiment.</p>
          </article>
          <article className="dashboardStatCard infoCard">
            <span className="dashboardStatLabel">Positive leaning</span>
            <strong>{positiveCount}</strong>
            <p>Figures currently sitting in a clearly favorable perception band.</p>
          </article>
          <article className="dashboardStatCard infoCard">
            <span className="dashboardStatLabel">7d direction</span>
            <strong className={getDeltaClass(averageTrend7d)}>{formatDelta(averageTrend7d)}</strong>
            <p>{polarizingCount} figures are in polarizing or highly polarizing territory.</p>
          </article>
        </div>

        <div className="dashboardHighlights">
          <a className="dashboardHighlightCard" href={`/profile/${mostWatched.slug}`}>
            <div className="dashboardHighlightTop">
              <span className="pill">Most watched</span>
              <span className={`changeTag ${getDeltaClass(mostWatched.trend7d)}`}>
                {formatDelta(mostWatched.trend7d)} 7d
              </span>
            </div>
            <div className="dashboardPerson">
              <img className="dashboardAvatar" src={mostWatched.image} alt={mostWatched.name} />
              <div>
                <h3>{mostWatched.name}</h3>
                <p>{mostWatched.role} · {mostWatched.region}</p>
              </div>
            </div>
            <p className="dashboardHighlightText">
              Highest live attention score at <strong>{mostWatched.signalScore}</strong>, driven by impact and active movement.
            </p>
          </a>

          <a className="dashboardHighlightCard" href={`/profile/${biggestRiser.slug}`}>
            <div className="dashboardHighlightTop">
              <span className="pill">Biggest riser</span>
              <span className={`changeTag ${getDeltaClass(biggestRiser.trend7d)}`}>
                {formatDelta(biggestRiser.trend7d)} 7d
              </span>
            </div>
            <div className="dashboardPerson">
              <img className="dashboardAvatar" src={biggestRiser.image} alt={biggestRiser.name} />
              <div>
                <h3>{biggestRiser.name}</h3>
                <p>{biggestRiser.keyTopics[0]} is the main narrative driver.</p>
              </div>
            </div>
            <p className="dashboardHighlightText">{biggestRiser.trendNotes[0]}</p>
          </a>

          <a className="dashboardHighlightCard" href={`/profile/${trustLeader.slug}`}>
            <div className="dashboardHighlightTop">
              <span className="pill">Trust leader</span>
              <span className="dashboardMetric">Trust {trustLeader.scores.trust}</span>
            </div>
            <div className="dashboardPerson">
              <img className="dashboardAvatar" src={trustLeader.image} alt={trustLeader.name} />
              <div>
                <h3>{trustLeader.name}</h3>
                <p>{trustLeader.label}</p>
              </div>
            </div>
            <p className="dashboardHighlightText">{trustLeader.strengths[0]}</p>
          </a>

          <a className="dashboardHighlightCard" href={`/profile/${pressurePoint.slug}`}>
            <div className="dashboardHighlightTop">
              <span className="pill">Pressure point</span>
              <span className="dashboardMetric">Risk {pressurePoint.pressureScore}</span>
            </div>
            <div className="dashboardPerson">
              <img className="dashboardAvatar" src={pressurePoint.image} alt={pressurePoint.name} />
              <div>
                <h3>{pressurePoint.name}</h3>
                <p>{pressurePoint.role} · {pressurePoint.region}</p>
              </div>
            </div>
            <p className="dashboardHighlightText">{pressurePoint.risks[0]}</p>
          </a>
        </div>

        <div className="dashboardNarratives infoCard">
          <div className="panelHeader">
            <span>Key narratives now</span>
            <span>Shared discussion themes</span>
          </div>
          <div className="dashboardNarrativeList">
            {topNarratives.map(([topic, count]) => (
              <div className="dashboardNarrativeItem" key={topic}>
                <strong>{topic}</strong>
                <span>{count} tracked figures</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboardBoard profileCard">
          <div className="dashboardBoardHeader">
            <div>
              <span className="sectionKicker">Live attention ranking</span>
              <h3>World figures board</h3>
            </div>
            <p>
              Attention score combines impact, controversy, source confidence,
              and short-term movement so users can spot both high-profile and fast-moving figures.
            </p>
          </div>

          <div className="dashboardTable">
            <div className="dashboardRow dashboardRowHead">
              <span>#</span>
              <span>Figure</span>
              <span>Region</span>
              <span>Signal</span>
              <span>7d</span>
              <span>Approval</span>
              <span>Trust</span>
              <span>Impact</span>
              <span>Controversy</span>
            </div>

            {rankedPeople.map((person, index) => (
              <a className="dashboardRow dashboardRowLink" href={`/profile/${person.slug}`} key={person.slug}>
                <span data-label="#" className="dashboardNumericCell dashboardRankCell">{index + 1}</span>
                <span data-label="Figure" className="dashboardNameCell">
                  <img className="dashboardTableAvatar" src={person.image} alt={person.name} />
                  <span className="dashboardFigureText">
                    <strong>{person.name}</strong>
                    <small>{person.role}</small>
                    <span className={`dashboardInlineStatus ${getOpinionClass(person.label)}`}>
                      {person.label}
                    </span>
                  </span>
                </span>
                <span data-label="Region" className="dashboardRegionCell">{person.region}</span>
                <span data-label="Signal" className="dashboardNumericCell">{person.signalScore}</span>
                <span data-label="7d" className={`dashboardNumericCell dashboardDeltaCell ${getDeltaClass(person.trend7d)}`}>
                  {formatDelta(person.trend7d)}
                </span>
                <span data-label="Approval" className="dashboardNumericCell">{person.scores.approval}</span>
                <span data-label="Trust" className="dashboardNumericCell">{person.scores.trust}</span>
                <span data-label="Impact" className="dashboardNumericCell">{person.scores.impact}</span>
                <span data-label="Controversy" className="dashboardNumericCell">{person.scores.controversy}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}