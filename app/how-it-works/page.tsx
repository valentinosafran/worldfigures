import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";

export default function HowItWorksPage() {
  return (
    <main>
      <Navbar />
      
      {/* Hero Section */}
      <section className="section" style={{ paddingTop: "100px" }}>
        <div className="container">
          <div className="sectionHeading" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <span style={{ color: "var(--accent)" }}>Methodology</span>
            <h1 style={{ fontSize: "clamp(2rem, 8vw, 3rem)", margin: "16px 0" }}>How Scoring Works</h1>
            <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.1rem)", color: "var(--muted)", lineHeight: "1.7" }}>
              WorldFigures combines multiple public signals into a transparent, data-driven scoring system. 
              We don't claim absolute truth—we measure and present public perception patterns with clear sourcing.
            </p>
          </div>
        </div>
      </section>

      {/* The Four Signals */}
      <section className="section">
        <div className="container">
          <div className="sectionHeading">
            <h2>The Four Core Signals</h2>
            <p>Each profile is evaluated across four distinct dimensions that together provide a comprehensive view of public perception.</p>
          </div>

          <div style={{ display: "grid", gap: "clamp(20px, 4vw, 32px)", marginTop: "clamp(28px, 6vw, 48px)" }}>
            {/* Approval */}
            <div className="scoreDetailCard">
              <div className="scoreDetailHeader">
                <div className="scoreDetailIcon approval">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                  </svg>
                </div>
                <div>
                  <h3>Approval</h3>
                  <p className="scoreDetailSubtitle">Public Support Indicators</p>
                </div>
              </div>
              <div className="scoreDetailContent">
                <p>
                  Measures overall public support through polling data, favorability ratings, and sentiment analysis 
                  from news coverage and social media. This signal captures how positively or negatively the public 
                  views the individual.
                </p>
                <div className="sourceList">
                  <strong>Data Sources:</strong>
                  <ul>
                    <li>Gallup, Pew Research, YouGov polling data</li>
                    <li>Regional and national survey aggregators</li>
                    <li>Sentiment analysis from major news outlets (Reuters, AP, BBC, etc.)</li>
                    <li>Social media sentiment tracking (Twitter/X, Reddit public discussions)</li>
                  </ul>
                </div>
                <div className="methodologyBox">
                  <strong>Calculation Method:</strong>
                  <p>Weighted average of net favorability (+40%), news sentiment (+30%), polling trends (+20%), and social sentiment (+10%)</p>
                </div>
              </div>
            </div>

            {/* Trust */}
            <div className="scoreDetailCard">
              <div className="scoreDetailHeader">
                <div className="scoreDetailIcon trust">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div>
                  <h3>Trust</h3>
                  <p className="scoreDetailSubtitle">Credibility & Institutional Confidence</p>
                </div>
              </div>
              <div className="scoreDetailContent">
                <p>
                  Evaluates credibility through institutional endorsements, expert assessments, fact-checking records, 
                  and consistency in public messaging. This measures how reliable and trustworthy the figure is perceived to be.
                </p>
                <div className="sourceList">
                  <strong>Data Sources:</strong>
                  <ul>
                    <li>Institutional trust surveys (Edelman Trust Barometer, etc.)</li>
                    <li>Fact-checking records (PolitiFact, FactCheck.org)</li>
                    <li>Expert opinion surveys (academic institutions, think tanks)</li>
                    <li>Media credibility assessments</li>
                    <li>Track record of statement consistency</li>
                  </ul>
                </div>
                <div className="methodologyBox">
                  <strong>Calculation Method:</strong>
                  <p>Composite of institutional ratings (+35%), fact-check scores (+25%), expert evaluations (+25%), and messaging consistency (+15%)</p>
                </div>
              </div>
            </div>

            {/* Impact */}
            <div className="scoreDetailCard">
              <div className="scoreDetailHeader">
                <div className="scoreDetailIcon impact">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="6"/>
                    <circle cx="12" cy="12" r="2"/>
                  </svg>
                </div>
                <div>
                  <h3>Impact</h3>
                  <p className="scoreDetailSubtitle">Influence & Reach</p>
                </div>
              </div>
              <div className="scoreDetailContent">
                <p>
                  Quantifies real-world influence through media coverage volume, policy impact, global reach, 
                  and ability to shape public discourse. This signal measures how much the individual affects 
                  conversations, decisions, and outcomes.
                </p>
                <div className="sourceList">
                  <strong>Data Sources:</strong>
                  <ul>
                    <li>Media mention frequency (GDELT, MediaCloud)</li>
                    <li>Policy influence metrics (legislation, international agreements)</li>
                    <li>Social media reach and engagement metrics</li>
                    <li>Search interest trends (Google Trends)</li>
                    <li>Speaking engagement and audience size</li>
                  </ul>
                </div>
                <div className="methodologyBox">
                  <strong>Calculation Method:</strong>
                  <p>Weighted sum of media coverage (+35%), policy influence (+25%), social reach (+20%), search volume (+15%), and event impact (+5%)</p>
                </div>
              </div>
            </div>

            {/* Controversy */}
            <div className="scoreDetailCard">
              <div className="scoreDetailHeader">
                <div className="scoreDetailIcon controversy">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <div>
                  <h3>Controversy</h3>
                  <p className="scoreDetailSubtitle">Criticism & Polarization</p>
                </div>
              </div>
              <div className="scoreDetailContent">
                <p>
                  Tracks the frequency and intensity of criticism, scandals, disputes, and polarized opinions. 
                  Higher controversy indicates more divided public opinion and frequent critical coverage.
                </p>
                <div className="sourceList">
                  <strong>Data Sources:</strong>
                  <ul>
                    <li>Negative news coverage frequency and intensity</li>
                    <li>Scandal and investigation tracking</li>
                    <li>Opinion polarization metrics (partisan divide in polling)</li>
                    <li>Critical commentary volume</li>
                    <li>Legal/ethical dispute tracking</li>
                  </ul>
                </div>
                <div className="methodologyBox">
                  <strong>Calculation Method:</strong>
                  <p>Aggregate of negative coverage (+30%), scandal frequency (+25%), opinion polarization (+25%), criticism intensity (+15%), and dispute volume (+5%)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Flow Visualization */}
      <section className="section" style={{ background: "var(--panel)" }}>
        <div className="container">
          <div className="sectionHeading">
            <h2>From Data to Scores: The Process</h2>
            <p>Our transparent methodology transforms raw data into actionable insights</p>
          </div>

          <div className="dataFlowDiagram">
            <div className="flowStep">
              <div className="flowNumber">1</div>
              <h4>Data Collection</h4>
              <p>Automated aggregation from 50+ verified sources including polling firms, news APIs, academic databases, and fact-checkers</p>
            </div>
            <div className="flowArrow">→</div>
            <div className="flowStep">
              <div className="flowNumber">2</div>
              <h4>Quality Filtering</h4>
              <p>Source reliability scoring, duplicate removal, bias adjustment, and temporal weighting (recent data weighted higher)</p>
            </div>
            <div className="flowArrow">→</div>
            <div className="flowStep">
              <div className="flowNumber">3</div>
              <h4>Signal Processing</h4>
              <p>Separate calculation of the four core signals using weighted algorithms tailored to each dimension</p>
            </div>
            <div className="flowArrow">→</div>
            <div className="flowStep">
              <div className="flowNumber">4</div>
              <h4>Profile Generation</h4>
              <p>Final scores (0-100 scale), trend indicators, confidence levels, and human-readable insights</p>
            </div>
          </div>
        </div>
      </section>

      {/* Source Transparency */}
      <section className="section">
        <div className="container">
          <div className="sectionHeading">
            <h2>Source Transparency</h2>
            <p>We believe in complete transparency about where our data comes from</p>
          </div>

          <div className="cardGrid three" style={{ marginTop: "clamp(28px, 6vw, 48px)" }}>
            <div className="transparencyCard">
              <h3>📊 Polling Organizations</h3>
              <ul className="sourceListCompact">
                <li>Gallup</li>
                <li>Pew Research Center</li>
                <li>YouGov</li>
                <li>Ipsos</li>
                <li>Morning Consult</li>
                <li>Regional polling firms</li>
              </ul>
            </div>

            <div className="transparencyCard">
              <h3>📰 News & Media</h3>
              <ul className="sourceListCompact">
                <li>Reuters</li>
                <li>Associated Press</li>
                <li>BBC</li>
                <li>GDELT Project</li>
                <li>MediaCloud</li>
                <li>Major regional outlets</li>
              </ul>
            </div>

            <div className="transparencyCard">
              <h3>✓ Fact-Checkers</h3>
              <ul className="sourceListCompact">
                <li>PolitiFact</li>
                <li>FactCheck.org</li>
                <li>Snopes</li>
                <li>Full Fact</li>
                <li>International Fact-Checking Network members</li>
              </ul>
            </div>

            <div className="transparencyCard">
              <h3>🎓 Academic & Research</h3>
              <ul className="sourceListCompact">
                <li>University research databases</li>
                <li>Think tank publications</li>
                <li>Policy analysis institutes</li>
                <li>Expert opinion surveys</li>
              </ul>
            </div>

            <div className="transparencyCard">
              <h3>📈 Analytics Platforms</h3>
              <ul className="sourceListCompact">
                <li>Google Trends</li>
                <li>Social media APIs (Twitter/X, Reddit)</li>
                <li>News aggregators</li>
                <li>Public sentiment trackers</li>
              </ul>
            </div>

            <div className="transparencyCard">
              <h3>🏛️ Institutional Data</h3>
              <ul className="sourceListCompact">
                <li>Government records</li>
                <li>NGO reports</li>
                <li>International organizations</li>
                <li>Electoral databases</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Score Confidence */}
      <section className="section" style={{ background: "var(--panel)" }}>
        <div className="container">
          <div className="sectionHeading">
            <h2>Score Confidence & Limitations</h2>
            <p>We're transparent about what our scores can and cannot tell you</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(20px, 4vw, 32px)", marginTop: "clamp(28px, 6vw, 48px)" }}>
            <div className="limitationCard">
              <h3 style={{ color: "#86efac" }}>✓ What Our Scores Represent</h3>
              <ul>
                <li>Measurable public perception patterns</li>
                <li>Aggregated sentiment from diverse sources</li>
                <li>Trends over time (7-day, 30-day)</li>
                <li>Relative comparison between figures</li>
                <li>Data-backed insights with source citations</li>
              </ul>
            </div>

            <div className="limitationCard">
              <h3 style={{ color: "#fca5a5" }}>⚠ What Our Scores Don't Represent</h3>
              <ul>
                <li>Absolute truth or moral judgment</li>
                <li>Personal opinions of WorldFigures</li>
                <li>Predictions of future performance</li>
                <li>Complete global consensus (data availability varies)</li>
                <li>Replacement for critical thinking</li>
              </ul>
            </div>
          </div>

          <div className="confidenceExplainer">
            <h3>Source Confidence Score</h3>
            <p>
              Each profile includes a "Source Confidence" percentage (0-100%) that indicates how much reliable data 
              is available. Higher confidence means more diverse, recent, and verified sources contribute to the score.
            </p>
            <div style={{ display: "flex", gap: "16px", marginTop: "24px", flexWrap: "wrap" }}>
              <div className="confidenceBadge high">90-100%: Excellent data coverage</div>
              <div className="confidenceBadge good">70-89%: Good data coverage</div>
              <div className="confidenceBadge medium">50-69%: Moderate data coverage</div>
              <div className="confidenceBadge low">Below 50%: Limited data coverage</div>
            </div>
          </div>
        </div>
      </section>

      {/* Example Breakdown */}
      <section className="section">
        <div className="container">
          <div className="sectionHeading">
            <h2>Example: Score Breakdown</h2>
            <p>See how a profile's scores are calculated in practice</p>
          </div>

          <div className="exampleBreakdown">
            <div className="exampleProfile">
              <h3>Sample Public Figure</h3>
              <p className="exampleNote">Hypothetical example for illustration purposes</p>
            </div>

            <div className="scoreBreakdownGrid">
              <div className="breakdownCard">
                <div className="breakdownHeader">
                  <span className="breakdownLabel">Approval</span>
                  <span className="breakdownScore">67</span>
                </div>
                <div className="breakdownBar">
                  <div className="breakdownBarFill approval" style={{ width: "67%" }}></div>
                </div>
                <div className="breakdownDetail">
                  <small>Net favorability: 59% • News sentiment: 72% • Polling: 68% • Social: 71%</small>
                </div>
              </div>

              <div className="breakdownCard">
                <div className="breakdownHeader">
                  <span className="breakdownLabel">Trust</span>
                  <span className="breakdownScore">54</span>
                </div>
                <div className="breakdownBar">
                  <div className="breakdownBarFill trust" style={{ width: "54%" }}></div>
                </div>
                <div className="breakdownDetail">
                  <small>Institutional: 51% • Fact-check: 62% • Experts: 48% • Consistency: 55%</small>
                </div>
              </div>

              <div className="breakdownCard">
                <div className="breakdownHeader">
                  <span className="breakdownLabel">Impact</span>
                  <span className="breakdownScore">88</span>
                </div>
                <div className="breakdownBar">
                  <div className="breakdownBarFill impact" style={{ width: "88%" }}></div>
                </div>
                <div className="breakdownDetail">
                  <small>Media: 91% • Policy: 82% • Social reach: 89% • Search: 85% • Events: 90%</small>
                </div>
              </div>

              <div className="breakdownCard">
                <div className="breakdownHeader">
                  <span className="breakdownLabel">Controversy</span>
                  <span className="breakdownScore">72</span>
                </div>
                <div className="breakdownBar">
                  <div className="breakdownBarFill controversy" style={{ width: "72%" }}></div>
                </div>
                <div className="breakdownDetail">
                  <small>Negative coverage: 68% • Scandals: 45% • Polarization: 89% • Criticism: 76%</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Update Frequency */}
      <section className="section" style={{ background: "var(--panel)" }}>
        <div className="container">
          <div className="sectionHeading">
            <h2>Update Frequency & Freshness</h2>
          </div>

          <div className="cardGrid three" style={{ marginTop: "clamp(24px, 5vw, 32px)" }}>
            <div className="updateCard">
              <div className="updateFreq">Daily</div>
              <h4>News Sentiment</h4>
              <p>Media coverage and sentiment analysis updated every 24 hours</p>
            </div>
            <div className="updateCard">
              <div className="updateFreq">Weekly</div>
              <h4>Social Tracking</h4>
              <p>Social media sentiment and trending topics refreshed weekly</p>
            </div>
            <div className="updateCard">
              <div className="updateFreq">As Published</div>
              <h4>Polls & Surveys</h4>
              <p>Polling data integrated within 48 hours of public release</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div className="ctaBox" style={{ textAlign: "center", padding: "clamp(32px, 8vw, 64px) clamp(20px, 5vw, 32px)", background: "var(--panel-2)", borderRadius: "16px" }}>
            <h2>Ready to explore profiles?</h2>
            <p style={{ color: "var(--muted)", marginBottom: "clamp(20px, 5vw, 32px)" }}>
              Browse our database of world figures and see the methodology in action
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/top-100" className="btn btnPrimary">See Top 100</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
