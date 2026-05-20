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
                    <div>Favorability: {data.breakdown.approval.components.favorability}</div>
                    <div>News Sentiment: {data.breakdown.approval.components.newsSentiment}</div>
                    <div>Polling Trends: {data.breakdown.approval.components.pollingTrends}</div>
                    <div>Social Sentiment: {data.breakdown.approval.components.socialSentiment}</div>
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
                    <div>Institutional: {data.breakdown.trust.components.institutional}</div>
                    <div>Fact Check: {data.breakdown.trust.components.factCheck}</div>
                    <div>Expert Eval: {data.breakdown.trust.components.expertEval}</div>
                    <div>Consistency: {data.breakdown.trust.components.consistency}</div>
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
                    <div>Media Coverage: {data.breakdown.impact.components.mediaCoverage}</div>
                    <div>Policy Influence: {data.breakdown.impact.components.policyInfluence}</div>
                    <div>Social Reach: {data.breakdown.impact.components.socialReach}</div>
                    <div>Search Volume: {data.breakdown.impact.components.searchVolume}</div>
                    <div>Event Impact: {data.breakdown.impact.components.eventImpact}</div>
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
                    <div>Negative Coverage: {data.breakdown.controversy.components.negativeCoverage}</div>
                    <div>Scandal Frequency: {data.breakdown.controversy.components.scandalFrequency}</div>
                    <div>Polarization: {data.breakdown.controversy.components.polarization}</div>
                    <div>Criticism: {data.breakdown.controversy.components.criticismIntensity}</div>
                    <div>Disputes: {data.breakdown.controversy.components.disputeVolume}</div>
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
