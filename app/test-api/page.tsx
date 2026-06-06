'use client';

import { useState } from 'react';
import { Navbar } from '../../components/navbar';
import { Footer } from '../../components/footer';

type Source = {
  type: string;
  name: string;
  data: Record<string, any>;
  timestamp: string;
  confidence: number;
};

type PersonData = {
  personSlug: string;
  personName: string;
  confidence: number;
  lastUpdated: string;
  sources: Source[];
  breakdown: {
    approval: { score: number; components: Record<string, number> };
    trust: { score: number; components: Record<string, number> };
    impact: { score: number; components: Record<string, number> };
    controversy: { score: number; components: Record<string, number> };
  };
  crawlDiagnostics?: {
    newsTelemetry: {
      articleCount: number;
      byCategory: Record<string, number>;
      byCredibility: { high: number; medium: number; low: number; average: number };
      topDomains: Array<{ domain: string; count: number }>;
    };
    sourceReputation: {
      domainsEvaluated: number;
      domainsWithHistory: number;
      averageHistoricalReputation: number;
      domainsUpdated: number;
    };
  };
  articles: Array<{
    title: string;
    description: string;
    url: string;
    source: string;
    sourceDomain?: string;
    sourceCategory?: string;
    publishedAt: string;
    sentiment?: number;
    credibility?: number;
  }>;
};

export default function APITestPage() {
  const [slug, setSlug] = useState('donald-trump');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PersonData | null>(null);
  const [meta, setMeta] = useState<{ cached?: boolean; stale?: boolean; crawlDiagnostics?: any } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getSource = (sources: Source[], type: string) => {
    return sources.find((source) => source.type === type);
  };

  const getApprovalWeights = (approval: { components: Record<string, number> }) => {
    const socialSentiment = approval.components.socialSentiment || 0;
    if (socialSentiment === 0) {
      return { favorability: 0.44, newsSentiment: 0.36, pollingTrends: 0.2, socialSentiment: 0 };
    }

    return { favorability: 0.4, newsSentiment: 0.3, pollingTrends: 0.2, socialSentiment: 0.1 };
  };

  const getImpactWeights = (
    impact: { components: Record<string, number> },
    sources: Source[]
  ) => {
    const hasSocial = (impact.components.socialReach || 0) > 0;
    const trendsSource = getSource(sources, 'trends');
    const hasTrends = !!trendsSource && trendsSource.confidence > 0;

    const weights = {
      mediaCoverage: 0.35,
      policyInfluence: 0.25,
      socialReach: 0.2,
      searchVolume: 0.15,
      eventImpact: 0.05,
    };

    if (!hasSocial) {
      weights.mediaCoverage += 0.12;
      weights.policyInfluence += 0.08;
      weights.socialReach = 0;
    }

    if (!hasTrends) {
      weights.mediaCoverage += 0.09;
      weights.policyInfluence += 0.06;
      weights.searchVolume = 0;
    }

    return weights;
  };

  const calculateScore = (components: Record<string, number>, weights: Record<string, number>) => {
    const keys = Object.keys(weights);
    const total = keys.reduce((sum, key) => sum + ((components[key] || 0) * (weights[key] || 0)), 0);
    return Math.round(total);
  };

  const getControversyCalculation = (controversy: { components: Record<string, number> }) => {
    const w = {
      negativeCoverage: 0.3,
      scandalFrequency: 0.25,
      polarization: 0.25,
      criticismIntensity: 0.15,
      disputeVolume: 0.05,
    };

    const base = calculateScore(controversy.components, w);
    const amplified = Math.min(
      100,
      Math.round(
        (base * 1.2) +
        ((controversy.components.negativeCoverage || 0) * 0.08) +
        ((controversy.components.polarization || 0) * 0.05)
      )
    );

    return { w, base, amplified };
  };

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    setMeta(null);

    try {
      const response = await fetch(`/api/data/person/${slug}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
        setMeta({
          cached: result.cached,
          stale: result.stale,
          crawlDiagnostics: result.crawlDiagnostics || result.data?.crawlDiagnostics,
        });
      } else {
        setError(result.error || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Navbar />
      
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
          🧪 API Test Dashboard
        </h1>
        
        <div style={{ 
          background: 'var(--panel)', 
          padding: '2rem', 
          borderRadius: '12px',
          marginBottom: '2rem',
          border: '1px solid var(--border)'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>Test Person Data API</h2>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <select
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'var(--panel-2)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text)',
                fontSize: '1rem'
              }}
            >
              <option value="donald-trump">Donald Trump</option>
              <option value="volodymyr-zelenskyy">Volodymyr Zelenskyy</option>
              <option value="ursula-von-der-leyen">Ursula von der Leyen</option>
              <option value="narendra-modi">Narendra Modi</option>
              <option value="jacinda-ardern">Jacinda Ardern</option>
              <option value="xi-jinping">Xi Jinping</option>
              <option value="emmanuel-macron">Emmanuel Macron</option>
              <option value="elon-musk">Elon Musk</option>
            </select>
            
            <button
              onClick={testAPI}
              disabled={loading}
              style={{
                padding: '0.75rem 2rem',
                background: loading ? 'var(--muted)' : 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
            >
              {loading ? 'Fetching...' : 'Fetch Real Data'}
            </button>
          </div>
          
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
            This now fetches crawler-first news (RSS + domain filtering + reputation weighting), then recalculates all scores with dynamic weights.
          </p>
        </div>

        {error && (
          <div style={{
            background: '#ff000020',
            border: '1px solid #ff0000',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            color: '#ff6b6b'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {data && (
          <div style={{ display: 'grid', gap: '2rem' }}>
            <div style={{
              background: 'var(--panel)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid var(--border)'
            }}>
              <h2 style={{ marginBottom: '0.75rem' }}>✅ What Changed</h2>
              <div style={{ display: 'grid', gap: '0.35rem', fontSize: '0.92rem', color: 'var(--text)' }}>
                <div>• News is now crawler-first, with NewsAPI fallback only when crawl results are empty.</div>
                <div>• Domains are filtered by optional allow/block lists and checked against robots policy.</div>
                <div>• Every article gets credibility + category metadata (polling, fact-check, major/regional media).</div>
                <div>• Historical domain reputation from Redis is blended into credibility before score computation.</div>
                <div>• Approval and impact weights auto-adjust when data sources are missing.</div>
              </div>
            </div>

            {/* Overview */}
            <div style={{
              background: 'var(--panel)',
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid var(--border)'
            }}>
              <h2 style={{ marginBottom: '1rem' }}>📊 {data.personName}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Overall Confidence</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                    {data.confidence}%
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Data Sources</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {data.sources.length}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Last Updated</div>
                  <div style={{ fontSize: '1rem' }}>
                    {new Date(data.lastUpdated).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Cache Status</div>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', color: meta?.stale ? '#f59e0b' : '#34d399' }}>
                    {meta?.cached ? (meta?.stale ? 'Cached Fallback (Stale)' : 'Cached Fresh') : 'Freshly Calculated'}
                  </div>
                </div>
              </div>
            </div>

            {/* Crawl Diagnostics */}
            <div style={{
              background: 'var(--panel)',
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid var(--border)'
            }}>
              <h2 style={{ marginBottom: '1rem' }}>🕷️ Crawl Diagnostics</h2>
              {meta?.crawlDiagnostics?.newsTelemetry ? (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                    <div style={{ background: 'var(--panel-2)', padding: '0.8rem', borderRadius: '8px' }}>
                      <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Articles Ingested</div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.35rem' }}>{meta.crawlDiagnostics.newsTelemetry.articleCount}</div>
                    </div>
                    <div style={{ background: 'var(--panel-2)', padding: '0.8rem', borderRadius: '8px' }}>
                      <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Avg Credibility</div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.35rem' }}>{meta.crawlDiagnostics.newsTelemetry.byCredibility.average}</div>
                    </div>
                    <div style={{ background: 'var(--panel-2)', padding: '0.8rem', borderRadius: '8px' }}>
                      <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Domains Evaluated</div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.35rem' }}>{meta.crawlDiagnostics.sourceReputation?.domainsEvaluated || 0}</div>
                    </div>
                    <div style={{ background: 'var(--panel-2)', padding: '0.8rem', borderRadius: '8px' }}>
                      <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Historical Reputation Avg</div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.35rem' }}>{meta.crawlDiagnostics.sourceReputation?.averageHistoricalReputation || 0}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                    <div style={{ background: 'var(--panel-2)', padding: '0.9rem', borderRadius: '8px' }}>
                      <div style={{ marginBottom: '0.4rem', fontWeight: 'bold' }}>By Category</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                        {Object.entries(meta.crawlDiagnostics.newsTelemetry.byCategory).map(([key, value]) => (
                          <div key={key}>{key}: <strong style={{ color: 'var(--text)' }}>{String(value)}</strong></div>
                        ))}
                      </div>
                    </div>

                    <div style={{ background: 'var(--panel-2)', padding: '0.9rem', borderRadius: '8px' }}>
                      <div style={{ marginBottom: '0.4rem', fontWeight: 'bold' }}>Top Domains</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                        {(meta.crawlDiagnostics.newsTelemetry.topDomains || []).length > 0 ? (
                          meta.crawlDiagnostics.newsTelemetry.topDomains.map((entry: any) => (
                            <div key={entry.domain}>{entry.domain}: <strong style={{ color: 'var(--text)' }}>{entry.count}</strong></div>
                          ))
                        ) : (
                          <div>No domains collected yet.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--muted)' }}>
                  Crawl diagnostics not available for this response.
                </div>
              )}
            </div>

            {/* Scores */}
            <div style={{
              background: 'var(--panel)',
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid var(--border)'
            }}>
              <h2 style={{ marginBottom: '1.5rem' }}>🎯 Score Breakdown</h2>
              
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {/* Approval */}
                <div>
                  {(() => {
                    const w = getApprovalWeights(data.breakdown.approval);
                    const recomputed = calculateScore(data.breakdown.approval.components, w);
                    return (
                      <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '1.2rem' }}>Approval</strong>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#60a5fa' }}>
                      {data.breakdown.approval.score}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <div>Favorability: <strong>{data.breakdown.approval.components.favorability}</strong> ({Math.round(w.favorability * 100)}%)</div>
                    <div>News Sentiment: <strong>{data.breakdown.approval.components.newsSentiment}</strong> ({Math.round(w.newsSentiment * 100)}%)</div>
                    <div>Polling Trends: <strong>{data.breakdown.approval.components.pollingTrends}</strong> ({Math.round(w.pollingTrends * 100)}%)</div>
                    <div>Social Sentiment: <strong>{data.breakdown.approval.components.socialSentiment}</strong> ({Math.round(w.socialSentiment * 100)}%)</div>
                  </div>
                  <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'var(--panel-2)', borderRadius: '4px', fontSize: '0.85rem' }}>
                    <strong>Effective Calculation:</strong> {data.breakdown.approval.components.favorability} × {w.favorability.toFixed(2)} + {data.breakdown.approval.components.newsSentiment} × {w.newsSentiment.toFixed(2)} + {data.breakdown.approval.components.pollingTrends} × {w.pollingTrends.toFixed(2)} + {data.breakdown.approval.components.socialSentiment} × {w.socialSentiment.toFixed(2)} = <strong>{recomputed}</strong>
                  </div>
                      </>
                    );
                  })()}
                </div>

                {/* Trust */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '1.2rem' }}>Trust</strong>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#34d399' }}>
                      {data.breakdown.trust.score}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <div>Institutional: <strong>{data.breakdown.trust.components.institutional}</strong> (45%)</div>
                    <div>Fact Check: <strong>{data.breakdown.trust.components.factCheck}</strong> (30%)</div>
                    <div>Expert Eval: <strong>{data.breakdown.trust.components.expertEval}</strong> (15%)</div>
                    <div>Consistency: <strong>{data.breakdown.trust.components.consistency}</strong> (10%)</div>
                  </div>
                  <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'var(--panel-2)', borderRadius: '4px', fontSize: '0.85rem' }}>
                    <strong>Calculation:</strong> {data.breakdown.trust.components.institutional} × 0.45 + {data.breakdown.trust.components.factCheck} × 0.30 + {data.breakdown.trust.components.expertEval} × 0.15 + {data.breakdown.trust.components.consistency} × 0.10 = <strong>{data.breakdown.trust.score}</strong>
                  </div>
                </div>

                {/* Impact */}
                <div>
                  {(() => {
                    const w = getImpactWeights(data.breakdown.impact, data.sources);
                    const recomputed = calculateScore(data.breakdown.impact.components, w);
                    return (
                      <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '1.2rem' }}>Impact</strong>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fbbf24' }}>
                      {data.breakdown.impact.score}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <div>Media Coverage: <strong>{data.breakdown.impact.components.mediaCoverage}</strong> ({Math.round(w.mediaCoverage * 100)}%)</div>
                    <div>Policy Influence: <strong>{data.breakdown.impact.components.policyInfluence}</strong> ({Math.round(w.policyInfluence * 100)}%)</div>
                    <div>Social Reach: <strong>{data.breakdown.impact.components.socialReach}</strong> ({Math.round(w.socialReach * 100)}%)</div>
                    <div>Search Volume: <strong>{data.breakdown.impact.components.searchVolume}</strong> ({Math.round(w.searchVolume * 100)}%)</div>
                    <div>Event Impact: <strong>{data.breakdown.impact.components.eventImpact}</strong> ({Math.round(w.eventImpact * 100)}%)</div>
                  </div>
                  <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'var(--panel-2)', borderRadius: '4px', fontSize: '0.85rem' }}>
                    <strong>Effective Calculation:</strong> {data.breakdown.impact.components.mediaCoverage} × {w.mediaCoverage.toFixed(2)} + {data.breakdown.impact.components.policyInfluence} × {w.policyInfluence.toFixed(2)} + {data.breakdown.impact.components.socialReach} × {w.socialReach.toFixed(2)} + {data.breakdown.impact.components.searchVolume} × {w.searchVolume.toFixed(2)} + {data.breakdown.impact.components.eventImpact} × {w.eventImpact.toFixed(2)} = <strong>{recomputed}</strong>
                  </div>
                      </>
                    );
                  })()}
                </div>

                {/* Controversy */}
                <div>
                  {(() => {
                    const c = getControversyCalculation(data.breakdown.controversy);
                    return (
                      <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '1.2rem' }}>Controversy</strong>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f87171' }}>
                      {data.breakdown.controversy.score}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <div>Negative Coverage: <strong>{data.breakdown.controversy.components.negativeCoverage}</strong> (30%)</div>
                    <div>Scandal Frequency: <strong>{data.breakdown.controversy.components.scandalFrequency}</strong> (25%)</div>
                    <div>Polarization: <strong>{data.breakdown.controversy.components.polarization}</strong> (25%)</div>
                    <div>Criticism: <strong>{data.breakdown.controversy.components.criticismIntensity}</strong> (15%)</div>
                    <div>Disputes: <strong>{data.breakdown.controversy.components.disputeVolume}</strong> (5%)</div>
                  </div>
                  <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'var(--panel-2)', borderRadius: '4px', fontSize: '0.85rem' }}>
                    <strong>Base Weighted:</strong> {data.breakdown.controversy.components.negativeCoverage} × 0.30 + {data.breakdown.controversy.components.scandalFrequency} × 0.25 + {data.breakdown.controversy.components.polarization} × 0.25 + {data.breakdown.controversy.components.criticismIntensity} × 0.15 + {data.breakdown.controversy.components.disputeVolume} × 0.05 = <strong>{c.base}</strong>
                    <br />
                    <strong>Amplified Final:</strong> ({c.base} × 1.20) + ({data.breakdown.controversy.components.negativeCoverage} × 0.08) + ({data.breakdown.controversy.components.polarization} × 0.05) = <strong>{c.amplified}</strong>
                  </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Data Sources */}
            <div style={{
              background: 'var(--panel)',
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid var(--border)'
            }}>
              <h2 style={{ marginBottom: '1rem' }}>📡 Data Sources</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {data.sources.map((source: any, idx: number) => (
                  <div key={idx} style={{
                    padding: '1rem',
                    background: 'var(--panel-2)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{source.name}</strong>
                        <span style={{ marginLeft: '1rem', color: 'var(--muted)' }}>
                          ({source.type})
                        </span>
                      </div>
                      <div style={{
                        color: source.confidence >= 70 ? '#34d399' : source.confidence >= 50 ? '#fbbf24' : '#f87171',
                        fontWeight: 'bold'
                      }}>
                        Confidence: {source.confidence}%
                      </div>
                    </div>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(source.data, null, 2)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Article Quality Sample */}
            <div style={{
              background: 'var(--panel)',
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid var(--border)'
            }}>
              <h2 style={{ marginBottom: '1rem' }}>📰 Article Quality Sample (Top 8)</h2>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {(data.articles || []).slice(0, 8).map((article, idx) => (
                  <div key={`${article.url}-${idx}`} style={{
                    padding: '0.8rem',
                    background: 'var(--panel-2)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)'
                  }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{article.title}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                      {article.sourceDomain || article.source} | category: {article.sourceCategory || 'unknown'} | credibility: {article.credibility ?? 'n/a'} | sentiment: {article.sentiment ?? 'n/a'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Raw JSON */}
            <details style={{
              background: 'var(--panel-2)',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid var(--border)'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '1rem' }}>
                🔍 View Raw JSON Response
              </summary>
              <pre style={{
                background: '#000',
                padding: '1rem',
                borderRadius: '8px',
                overflow: 'auto',
                fontSize: '0.85rem'
              }}>
                {JSON.stringify({ data, meta }, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  );
}
