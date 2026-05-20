'use client';

import { useState } from 'react';
import { Navbar } from '../../components/navbar';
import { Footer } from '../../components/footer';

export default function APITestPage() {
  const [slug, setSlug] = useState('donald-trump');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`/api/data/person/${slug}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
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
            This will fetch real data from NewsAPI, Reddit, Google Trends, and Wikipedia
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
              </div>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '1.2rem' }}>Approval</strong>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#60a5fa' }}>
                      {data.breakdown.approval.score}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <div>Favorability: <strong>{data.breakdown.approval.components.favorability}</strong> (40%)</div>
                    <div>News Sentiment: <strong>{data.breakdown.approval.components.newsSentiment}</strong> (30%)</div>
                    <div>Polling Trends: <strong>{data.breakdown.approval.components.pollingTrends}</strong> (20%)</div>
                    <div>Social Sentiment: <strong>{data.breakdown.approval.components.socialSentiment}</strong> (10%)</div>
                  </div>
                  <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'var(--panel-2)', borderRadius: '4px', fontSize: '0.85rem' }}>
                    <strong>Calculation:</strong> {data.breakdown.approval.components.favorability} × 0.40 + {data.breakdown.approval.components.newsSentiment} × 0.30 + {data.breakdown.approval.components.pollingTrends} × 0.20 + {data.breakdown.approval.components.socialSentiment} × 0.10 = <strong>{data.breakdown.approval.score}</strong>
                  </div>
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
                    <div>Institutional: <strong>{data.breakdown.trust.components.institutional}</strong> (35%)</div>
                    <div>Fact Check: <strong>{data.breakdown.trust.components.factCheck}</strong> (25%)</div>
                    <div>Expert Eval: <strong>{data.breakdown.trust.components.expertEval}</strong> (25%)</div>
                    <div>Consistency: <strong>{data.breakdown.trust.components.consistency}</strong> (15%)</div>
                  </div>
                  <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'var(--panel-2)', borderRadius: '4px', fontSize: '0.85rem' }}>
                    <strong>Calculation:</strong> {data.breakdown.trust.components.institutional} × 0.35 + {data.breakdown.trust.components.factCheck} × 0.25 + {data.breakdown.trust.components.expertEval} × 0.25 + {data.breakdown.trust.components.consistency} × 0.15 = <strong>{data.breakdown.trust.score}</strong>
                  </div>
                </div>

                {/* Impact */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong style={{ fontSize: '1.2rem' }}>Impact</strong>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fbbf24' }}>
                      {data.breakdown.impact.score}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <div>Media Coverage: <strong>{data.breakdown.impact.components.mediaCoverage}</strong> (35%)</div>
                    <div>Policy Influence: <strong>{data.breakdown.impact.components.policyInfluence}</strong> (25%)</div>
                    <div>Social Reach: <strong>{data.breakdown.impact.components.socialReach}</strong> (20%)</div>
                    <div>Search Volume: <strong>{data.breakdown.impact.components.searchVolume}</strong> (15%)</div>
                    <div>Event Impact: <strong>{data.breakdown.impact.components.eventImpact}</strong> (5%)</div>
                  </div>
                  <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'var(--panel-2)', borderRadius: '4px', fontSize: '0.85rem' }}>
                    <strong>Calculation:</strong> {data.breakdown.impact.components.mediaCoverage} × 0.35 + {data.breakdown.impact.components.policyInfluence} × 0.25 + {data.breakdown.impact.components.socialReach} × 0.20 + {data.breakdown.impact.components.searchVolume} × 0.15 + {data.breakdown.impact.components.eventImpact} × 0.05 = <strong>{data.breakdown.impact.score}</strong>
                  </div>
                </div>

                {/* Controversy */}
                <div>
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
                    <strong>Calculation:</strong> {data.breakdown.controversy.components.negativeCoverage} × 0.30 + {data.breakdown.controversy.components.scandalFrequency} × 0.25 + {data.breakdown.controversy.components.polarization} × 0.25 + {data.breakdown.controversy.components.criticismIntensity} × 0.15 + {data.breakdown.controversy.components.disputeVolume} × 0.05 = <strong>{data.breakdown.controversy.score}</strong>
                  </div>
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
                      {JSON.stringify(source.data)}
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
                {JSON.stringify(data, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  );
}
