'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { people, type PersonProfile } from '../data/people';
import { fetchMultiplePeopleData } from '../lib/api-client';
import { calculateLabel, getOpinionClass } from '../lib/label-calculator';
import { InlineVoteDisplay } from './inline-vote-display';
import { CATEGORY_DEFINITIONS, CategoryKey, getCategoryKey, getCategoryName, getDisplayRole } from '../lib/profile-taxonomy';

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
  displayRole: string;
  categoryKey: CategoryKey;
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
  return Number(
    ((movement7d.approval + movement7d.trust + movement7d.impact + movement7d.controversy) / 4).toFixed(1)
  );
}

// Loading skeleton component
function TableRowSkeleton() {
  return (
    <div className="dashboardRow dashboardRowSkeleton" style={{ opacity: 0.5, pointerEvents: 'none' }}>
      <span className="dashboardNumericCell dashboardRankCell">
        <div style={{ width: '30px', height: '16px', background: 'var(--border)', borderRadius: '4px' }}></div>
      </span>
      <span className="dashboardNameCell">
        <div style={{ width: '40px', height: '40px', background: 'var(--border)', borderRadius: '50%' }}></div>
        <span className="dashboardFigureText">
          <div style={{ width: '120px', height: '16px', background: 'var(--border)', borderRadius: '4px', marginBottom: '4px' }}></div>
          <div style={{ width: '80px', height: '12px', background: 'var(--border)', borderRadius: '4px' }}></div>
        </span>
      </span>
      <span className="dashboardRegionCell">
        <div style={{ width: '60px', height: '16px', background: 'var(--border)', borderRadius: '4px' }}></div>
      </span>
      <span className="dashboardNumericCell">
        <div style={{ width: '40px', height: '16px', background: 'var(--border)', borderRadius: '4px' }}></div>
      </span>
      <span className="dashboardNumericCell">
        <div style={{ width: '35px', height: '16px', background: 'var(--border)', borderRadius: '4px' }}></div>
      </span>
      <span className="dashboardNumericCell">
        <div style={{ width: '35px', height: '16px', background: 'var(--border)', borderRadius: '4px' }}></div>
      </span>
      <span className="dashboardNumericCell">
        <div style={{ width: '35px', height: '16px', background: 'var(--border)', borderRadius: '4px' }}></div>
      </span>
      <span className="dashboardNumericCell">
        <div style={{ width: '35px', height: '16px', background: 'var(--border)', borderRadius: '4px' }}></div>
      </span>
      <span className="dashboardNumericCell">
        <div style={{ width: '35px', height: '16px', background: 'var(--border)', borderRadius: '4px' }}></div>
      </span>
    </div>
  );
}

const BATCH_SIZE = 12; // Load 12 profiles at a time
const INITIAL_BATCH_SIZE = 15; // Load 15 initially for above-the-fold

type SortKey = 'signal' | 'approval' | 'trust' | 'impact' | 'controversy' | 'name';

type Top100DashboardClientProps = {
  initialCategory?: string;
  initialCountry?: string;
};

export function Top100DashboardClient({ initialCategory = 'all', initialCountry = 'all' }: Top100DashboardClientProps) {
  const [enrichedPeople, setEnrichedPeople] = useState<EnrichedPerson[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
  const [countryFilter, setCountryFilter] = useState<string>(initialCountry);
  const [sortBy, setSortBy] = useState<SortKey>('signal');
  const [displayedCount, setDisplayedCount] = useState(INITIAL_BATCH_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Initial data load
  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      try {
        // Fetch all data in one batch call (already optimized on backend)
        const apiDataMap = await fetchMultiplePeopleData(people.map(p => p.slug));

        // Process all people
        const processed: EnrichedPerson[] = people.map(person => {
          const apiData = apiDataMap.get(person.slug);
          const scores = apiData ? {
            approval: apiData.breakdown.approval.score,
            trust: apiData.breakdown.trust.score,
            impact: apiData.breakdown.impact.score,
            controversy: apiData.breakdown.controversy.score,
          } : person.scores;
          
          const sourceConfidence = apiData ? apiData.confidence : person.sourceConfidence;
          const label = calculateLabel(scores);
          const signalScore = apiData?.signalScore ?? 0;
          const trend7d = apiData ? calculate7dMovement(apiData.movement7d) : person.trend7d;
          
          return {
            ...person,
            role: getDisplayRole(person),
            displayRole: getDisplayRole(person),
            categoryKey: getCategoryKey(person),
            scores,
            label,
            sourceConfidence,
            signalScore,
            trend7d,
            pressureScore: getPressureScore(scores, trend7d),
            hasLiveData: !!apiData,
          };
        });

        // Sort by signal score
        const ranked = processed.sort((a, b) => b.signalScore - a.signalScore);
        setEnrichedPeople(ranked);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Fallback to static data
        const fallback: EnrichedPerson[] = people.map(person => ({
          ...person,
          role: getDisplayRole(person),
          displayRole: getDisplayRole(person),
          categoryKey: getCategoryKey(person),
          signalScore: 0,
          pressureScore: getPressureScore(person.scores, person.trend7d),
          hasLiveData: false,
        }));
        setEnrichedPeople(fallback);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  const countries = useMemo(() => {
    return Array.from(new Set(enrichedPeople.map((person) => person.region))).sort((a, b) => a.localeCompare(b));
  }, [enrichedPeople]);

  const filteredAndSortedPeople = useMemo(() => {
    let next = [...enrichedPeople];

    if (categoryFilter !== 'all') {
      next = next.filter((person) => person.categoryKey === categoryFilter);
    }

    if (countryFilter !== 'all') {
      next = next.filter((person) => person.region === countryFilter);
    }

    switch (sortBy) {
      case 'approval':
        next.sort((a, b) => b.scores.approval - a.scores.approval);
        break;
      case 'trust':
        next.sort((a, b) => b.scores.trust - a.scores.trust);
        break;
      case 'impact':
        next.sort((a, b) => b.scores.impact - a.scores.impact);
        break;
      case 'controversy':
        next.sort((a, b) => b.scores.controversy - a.scores.controversy);
        break;
      case 'name':
        next.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'signal':
      default:
        next.sort((a, b) => b.signalScore - a.signalScore);
        break;
    }

    return next;
  }, [enrichedPeople, categoryFilter, countryFilter, sortBy]);

  useEffect(() => {
    setDisplayedCount(INITIAL_BATCH_SIZE);
  }, [categoryFilter, countryFilter, sortBy]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && displayedCount < filteredAndSortedPeople.length) {
          setIsLoadingMore(true);
          // Simulate a small delay for smooth UX
          setTimeout(() => {
            setDisplayedCount(prev => Math.min(prev + BATCH_SIZE, filteredAndSortedPeople.length));
            setIsLoadingMore(false);
          }, 300);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [displayedCount, filteredAndSortedPeople.length, isLoadingMore]);

  // Calculate stats
  const positiveCount = filteredAndSortedPeople.filter((person) =>
    person.label.toLowerCase().includes("positive")
  ).length;
  const polarizingCount = filteredAndSortedPeople.filter((person) =>
    person.label.toLowerCase().includes("polarizing")
  ).length;
  const averageApproval = filteredAndSortedPeople.length > 0 ? Math.round(
    filteredAndSortedPeople.reduce((sum, person) => sum + person.scores.approval, 0) / filteredAndSortedPeople.length
  ) : 0;
  const averageTrust = filteredAndSortedPeople.length > 0 ? Math.round(
    filteredAndSortedPeople.reduce((sum, person) => sum + person.scores.trust, 0) / filteredAndSortedPeople.length
  ) : 0;
  const averageTrend7d = filteredAndSortedPeople.length > 0 ? Number(
    (filteredAndSortedPeople.reduce((sum, person) => sum + person.trend7d, 0) / filteredAndSortedPeople.length).toFixed(1)
  ) : 0;

  const mostWatched = filteredAndSortedPeople[0];
  const biggestRiser = [...filteredAndSortedPeople].sort((a, b) => {
    if (b.trend7d !== a.trend7d) return b.trend7d - a.trend7d;
    return b.trend30d - a.trend30d;
  })[0];
  const trustLeader = [...filteredAndSortedPeople].sort(
    (a, b) => b.scores.trust - a.scores.trust
  )[0];
  const pressurePoint = [...filteredAndSortedPeople].sort(
    (a, b) => b.pressureScore - a.pressureScore
  )[0];

  const topNarratives = filteredAndSortedPeople.length > 0 ? Object.entries(
    filteredAndSortedPeople.reduce<Record<string, number>>((acc, person) => {
      person.keyTopics.forEach((topic) => {
        acc[topic] = (acc[topic] ?? 0) + 1;
      });
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6) : [];

  const displayedPeople = filteredAndSortedPeople.slice(0, displayedCount);

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
            <strong>{isLoading ? '...' : averageApproval}</strong>
            <p>Platform-wide approval benchmark across tracked figures.</p>
          </article>
          <article className="dashboardStatCard infoCard">
            <span className="dashboardStatLabel">Avg trust</span>
            <strong>{isLoading ? '...' : averageTrust}</strong>
            <p>Trust stays below approval, which signals caution in public sentiment.</p>
          </article>
          <article className="dashboardStatCard infoCard">
            <span className="dashboardStatLabel">Positive leaning</span>
            <strong>{isLoading ? '...' : positiveCount}</strong>
            <p>Figures currently sitting in a clearly favorable perception band.</p>
          </article>
          <article className="dashboardStatCard infoCard">
            <span className="dashboardStatLabel">7d direction</span>
            <strong className={isLoading ? '' : getDeltaClass(averageTrend7d)}>
              {isLoading ? '...' : formatDelta(averageTrend7d)}
            </strong>
            <p>{isLoading ? 'Loading...' : `${polarizingCount} figures are in polarizing or highly polarizing territory.`}</p>
          </article>
        </div>

        {!isLoading && mostWatched && biggestRiser && trustLeader && pressurePoint && (
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
        )}

        {!isLoading && topNarratives.length > 0 && (
          <div className="dashboardNarratives infoCard card-visible">
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
        )}

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

          {!isLoading && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <label style={{ display: 'grid', gap: '6px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Category</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--panel-2)', color: 'var(--text)' }}
                >
                  <option value="all">All categories</option>
                  {CATEGORY_DEFINITIONS.map((category) => (
                    <option key={category.key} value={category.key}>{category.name}</option>
                  ))}
                </select>
              </label>

              <label style={{ display: 'grid', gap: '6px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Country / Region</span>
                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--panel-2)', color: 'var(--text)' }}
                >
                  <option value="all">All countries/regions</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </label>

              <label style={{ display: 'grid', gap: '6px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Sort</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--panel-2)', color: 'var(--text)' }}
                >
                  <option value="signal">Signal (desc)</option>
                  <option value="approval">Approval (desc)</option>
                  <option value="trust">Trust (desc)</option>
                  <option value="impact">Impact (desc)</option>
                  <option value="controversy">Controversy (desc)</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </label>
            </div>
          )}

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

            {isLoading ? (
              // Show skeletons while initial load
              <>
                {Array.from({ length: 8 }).map((_, i) => (
                  <TableRowSkeleton key={`skeleton-${i}`} />
                ))}
              </>
            ) : (
              <>
                {displayedPeople.map((person, index) => (
                  <a className="dashboardRow dashboardRowLink" href={`/profile/${person.slug}`} key={person.slug}>
                    <span data-label="#" className="dashboardNumericCell dashboardRankCell">{index + 1}</span>
                    <span data-label="Figure" className="dashboardNameCell">
                      <img className="dashboardTableAvatar" src={person.image} alt={person.name} />
                      <span className="dashboardFigureText">
                        <strong>{person.name}</strong>
                        <small>{person.displayRole}</small>
                        <span className={`dashboardInlineStatus ${getOpinionClass(person.label)}`}>
                          {person.label}
                          <InlineVoteDisplay slug={person.slug} />
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

                {/* Loading indicator for infinite scroll */}
                {isLoadingMore && (
                  <>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <TableRowSkeleton key={`loading-${i}`} />
                    ))}
                  </>
                )}

                {/* Intersection observer target */}
                {displayedCount < filteredAndSortedPeople.length && (
                  <div ref={observerTarget} style={{ height: '20px', width: '100%' }} />
                )}

                {/* Show completion message */}
                {displayedCount >= filteredAndSortedPeople.length && filteredAndSortedPeople.length > 0 && (
                  <div style={{ 
                    padding: '24px', 
                    textAlign: 'center', 
                    color: 'var(--muted)',
                    fontSize: '0.9rem'
                  }}>
                    ✓ Showing {filteredAndSortedPeople.length} profiles
                    {categoryFilter !== 'all' ? ` in ${getCategoryName(categoryFilter as CategoryKey)}` : ''}
                    {countryFilter !== 'all' ? ` for ${countryFilter}` : ''}
                  </div>
                )}

                {!isLoading && filteredAndSortedPeople.length === 0 && (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)' }}>
                    No profiles match the selected filters.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
