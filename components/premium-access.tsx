export function PremiumAccess() {
  return (
    <section className="section" id="premium">
      <div className="container">
        <div className="premiumAccessWrapper">
          <div className="premiumAccessContent">
            <div className="sectionHeading">
              <span>Premium Access</span>
              <h2>Unlock Deep Analytics & Insights</h2>
              <p style={{ maxWidth: "600px" }}>
                Get access to comprehensive historical data, advanced analytics, detailed source 
                breakdowns, API integration, and exclusive insights trusted by professionals worldwide.
              </p>
            </div>

            <div className="premiumFeatureList">
              <div className="premiumFeatureItem">
                <div className="premiumFeatureIcon">📊</div>
                <div>
                  <h4>Historical Trend Analysis</h4>
                  <p>Track perception changes over months and years with interactive charts</p>
                </div>
              </div>

              <div className="premiumFeatureItem">
                <div className="premiumFeatureIcon">🔍</div>
                <div>
                  <h4>Detailed Source Attribution</h4>
                  <p>See exactly which sources contribute to each score with confidence metrics</p>
                </div>
              </div>

              <div className="premiumFeatureItem">
                <div className="premiumFeatureIcon">⚖️</div>
                <div>
                  <h4>Comparative Analysis</h4>
                  <p>Compare multiple figures side-by-side across all metrics and time periods</p>
                </div>
              </div>

              <div className="premiumFeatureItem">
                <div className="premiumFeatureIcon">🔔</div>
                <div>
                  <h4>Custom Alerts & Reports</h4>
                  <p>Get notified of significant changes and receive weekly analytics reports</p>
                </div>
              </div>

              <div className="premiumFeatureItem">
                <div className="premiumFeatureIcon">🔌</div>
                <div>
                  <h4>API Access (Enterprise)</h4>
                  <p>Integrate WorldFigures data directly into your applications and workflows</p>
                </div>
              </div>

              <div className="premiumFeatureItem">
                <div className="premiumFeatureIcon">📥</div>
                <div>
                  <h4>Data Exports</h4>
                  <p>Download comprehensive datasets in CSV or JSON for your research</p>
                </div>
              </div>
            </div>

            <div className="premiumAudience">
              <h3>Perfect for:</h3>
              <ul>
                <li><strong>Journalists</strong> seeking credible perception data for reporting</li>
                <li><strong>Researchers</strong> analyzing long-term trends in public opinion</li>
                <li><strong>Political Analysts</strong> tracking leadership credibility</li>
                <li><strong>Educators</strong> teaching media literacy and public perception</li>
                <li><strong>Organizations</strong> requiring API access and custom integrations</li>
              </ul>
            </div>

            <div className="premiumActions">
              <a href="/subscribe" className="btn btnPrimary">
                View Plans & Pricing
              </a>
              <a href="/contact" className="btn btnSecondary">
                Contact Sales
              </a>
            </div>

            <p className="premiumNote">
              Free tier available • 14-day trial for Professional • Academic discounts offered
            </p>
          </div>

          <div className="premiumShowcase">
            <div className="premiumShowcaseCard">
              <div className="premiumShowcaseHeader">
                <span className="pill">Premium Feature</span>
                <h4>Historical Trends</h4>
              </div>
              <div className="premiumShowcaseMock">
                <div className="mockChart">
                  <div className="mockChartLine"></div>
                  <div className="mockChartBars">
                    <div className="mockBar" style={{ height: "45%" }}></div>
                    <div className="mockBar" style={{ height: "60%" }}></div>
                    <div className="mockBar" style={{ height: "55%" }}></div>
                    <div className="mockBar" style={{ height: "70%" }}></div>
                    <div className="mockBar" style={{ height: "65%" }}></div>
                    <div className="mockBar" style={{ height: "80%" }}></div>
                  </div>
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: "12px" }}>
                  Track approval, trust, and impact metrics across 12+ months
                </p>
              </div>
            </div>

            <div className="premiumShowcaseCard">
              <div className="premiumShowcaseHeader">
                <span className="pill">Premium Feature</span>
                <h4>Source Breakdown</h4>
              </div>
              <div className="premiumShowcaseMock">
                <div className="mockSourceList">
                  <div className="mockSourceItem">
                    <div className="mockSourceDot"></div>
                    <span>Gallup Poll (Nov 2025)</span>
                    <strong>40%</strong>
                  </div>
                  <div className="mockSourceItem">
                    <div className="mockSourceDot"></div>
                    <span>Reuters Sentiment</span>
                    <strong>30%</strong>
                  </div>
                  <div className="mockSourceItem">
                    <div className="mockSourceDot"></div>
                    <span>Pew Research</span>
                    <strong>20%</strong>
                  </div>
                  <div className="mockSourceItem">
                    <div className="mockSourceDot"></div>
                    <span>Social Tracking</span>
                    <strong>10%</strong>
                  </div>
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: "12px" }}>
                  Full transparency on how each score is calculated
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
