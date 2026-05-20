"use client";

import { useState } from "react";
import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";

export default function SubscribePage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const monthlyPrice = 49;
  const yearlyPrice = 490; // ~$40.83/month, 17% discount
  const yearlySavings = (monthlyPrice * 12) - yearlyPrice;

  return (
    <main>
      <Navbar />
      
      <section className="section" style={{ paddingTop: "100px" }}>
        <div className="container">
          <div className="sectionHeading" style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
            <span style={{ color: "var(--accent)" }}>Premium Access</span>
            <h1 style={{ fontSize: "clamp(2.2rem, 8vw, 3.5rem)", margin: "16px 0" }}>
              Unlock Deep Insights & Analytics
            </h1>
            <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.15rem)", color: "var(--muted)", lineHeight: "1.7", maxWidth: "750px", margin: "0 auto" }}>
              Get access to comprehensive data, advanced analytics, historical trends, API integration, 
              and exclusive insights trusted by journalists, researchers, and analysts worldwide.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="billingToggle">
            <button
              className={`billingOption ${billingPeriod === "monthly" ? "active" : ""}`}
              onClick={() => setBillingPeriod("monthly")}
            >
              Monthly
            </button>
            <button
              className={`billingOption ${billingPeriod === "yearly" ? "active" : ""}`}
              onClick={() => setBillingPeriod("yearly")}
            >
              Yearly
              <span className="savingsBadge">Save ${yearlySavings}</span>
            </button>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "20px" }}>
        <div className="container" style={{ maxWidth: "1200px" }}>
          
          <div className="pricingGrid">
            
            {/* Free Tier */}
            <div className="pricingCard">
              <div className="pricingHeader">
                <h3>Explorer</h3>
                <div className="pricingPrice">
                  <span className="pricingAmount">Free</span>
                </div>
                <p className="pricingDescription">
                  Basic access to public perception data and trends
                </p>
              </div>
              
              <div className="pricingFeatures">
                <div className="pricingFeature">
                  <span className="pricingCheck">✓</span>
                  <span>View Top 100 rankings</span>
                </div>
                <div className="pricingFeature">
                  <span className="pricingCheck">✓</span>
                  <span>Basic profile scores (Approval, Trust, Impact, Controversy)</span>
                </div>
                <div className="pricingFeature">
                  <span className="pricingCheck">✓</span>
                  <span>7-day and 30-day trend indicators</span>
                </div>
                <div className="pricingFeature">
                  <span className="pricingCheck">✓</span>
                  <span>Browse by category and region</span>
                </div>
                <div className="pricingFeature disabled">
                  <span className="pricingCheck">✗</span>
                  <span>Historical data and trend charts</span>
                </div>
                <div className="pricingFeature disabled">
                  <span className="pricingCheck">✗</span>
                  <span>Detailed source breakdowns</span>
                </div>
                <div className="pricingFeature disabled">
                  <span className="pricingCheck">✗</span>
                  <span>Custom analytics and exports</span>
                </div>
              </div>
              
              <a href="/top-100" className="btn btnSecondary" style={{ width: "100%", marginTop: "auto" }}>
                Explore Free
              </a>
            </div>

            {/* Professional Tier */}
            <div className="pricingCard pricingCardFeatured">
              <div className="pricingBadge">Most Popular</div>
              <div className="pricingHeader">
                <h3>Professional</h3>
                {billingPeriod === "monthly" ? (
                  <>
                    <div className="pricingPrice">
                      <span className="pricingCurrency">$</span>
                      <span className="pricingAmount">{monthlyPrice}</span>
                      <span className="pricingPeriod">/month</span>
                    </div>
                    <p className="pricingDescription">
                      For journalists, analysts, and researchers
                    </p>
                  </>
                ) : (
                  <>
                    <div className="pricingPrice">
                      <span className="pricingCurrency">$</span>
                      <span className="pricingAmount">{yearlyPrice}</span>
                      <span className="pricingPeriod">/year</span>
                    </div>
                    <p className="pricingDescription">
                      ${Math.round(yearlyPrice / 12)}/month billed annually • Save 17%
                    </p>
                  </>
                )}
              </div>
              
              <div className="pricingFeatures">
                <div className="pricingFeature">
                  <span className="pricingCheck">✓</span>
                  <span><strong>Everything in Explorer</strong></span>
                </div>
                <div className="pricingFeature">
                  <span className="pricingCheck">✓</span>
                  <span>Historical data (12 months)</span>
                </div>
                <div className="pricingFeature">
                  <span className="pricingCheck">✓</span>
                  <span>Interactive trend charts and visualizations</span>
                </div>
                <div className="pricingFeature">
                  <span className="pricingCheck">✓</span>
                  <span>Detailed source attribution and confidence metrics</span>
                </div>
                <div className="pricingFeature">
                  <span className="pricingCheck">✓</span>
                  <span>Export data (CSV, JSON)</span>
                </div>
                <div className="pricingFeature">
                  <span className="pricingCheck">✓</span>
                  <span>Advanced filtering and search</span>
                </div>
                <div className="pricingFeature">
                  <span className="pricingCheck">✓</span>
                  <span>Weekly email reports and alerts</span>
                </div>
                <div className="pricingFeature">
                  <span className="pricingCheck">✓</span>
                  <span>Compare up to 5 profiles side-by-side</span>
                </div>
                <div className="pricingFeature disabled">
                  <span className="pricingCheck">✗</span>
                  <span>API access</span>
                </div>
              </div>
              
              <button className="btn btnPrimary" style={{ width: "100%", marginTop: "auto" }}>
                Start Free Trial
              </button>
              <p style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--muted)", marginTop: "12px" }}>
                14-day free trial • No credit card required
              </p>
            </div>

            {/* Enterprise Tier */}
            <div className="pricingCard">
              <div className="pricingHeader">
                <h3>Enterprise</h3>
                <div className="pricingPrice">
                  <span className="pricingAmount" style={{ fontSize: "1.8rem" }}>Custom</span>
                </div>
                <p className="pricingDescription">
                  For organizations and teams requiring API access
                </p>
              </div>
              
              <div className="pricingFeatures">
                <div className="pricingFeature">
                  <span className="pricingCheck">✓</span>
                  <span><strong>Everything in Professional</strong></span>
                </div>
                <div className="pricingFeature">
                  <span className="pricingCheck">✓</span>
                  <span>Full historical data (all available records)</span>
                </div>
                <div className="pricingFeature">
                  <span className="pricingCheck">✓</span>
                  <span>RESTful API access with high rate limits</span>
                </div>
                <div className="pricingFeature">
                  <span className="pricingCheck">✓</span>
                  <span>Real-time data updates via webhooks</span>
                </div>
                <div className="pricingFeature">
                  <span className="pricingCheck">✓</span>
                  <span>Bulk data exports and custom integrations</span>
                </div>
                <div className="pricingFeature">
                  <span className="pricingCheck">✓</span>
                  <span>White-label options available</span>
                </div>
                <div className="pricingFeature">
                  <span className="pricingCheck">✓</span>
                  <span>Dedicated account manager</span>
                </div>
                <div className="pricingFeature">
                  <span className="pricingCheck">✓</span>
                  <span>SLA guarantees and priority support</span>
                </div>
                <div className="pricingFeature">
                  <span className="pricingCheck">✓</span>
                  <span>Custom data requests and analysis</span>
                </div>
              </div>
              
              <a href="/contact" className="btn btnSecondary" style={{ width: "100%", marginTop: "auto" }}>
                Contact Sales
              </a>
            </div>

          </div>

          {/* Feature Comparison */}
          <div style={{ marginTop: "80px" }}>
            <h2 style={{ textAlign: "center", marginBottom: "48px", fontSize: "2rem" }}>
              What You Get with Premium Access
            </h2>
            
            <div className="featureShowcaseGrid">
              
              <div className="featureShowcaseCard">
                <div className="featureShowcaseIcon">📊</div>
                <h3>Historical Trend Analysis</h3>
                <p>
                  Track perception changes over time with interactive charts showing approval, trust, 
                  and controversy shifts across weeks, months, and years.
                </p>
              </div>

              <div className="featureShowcaseCard">
                <div className="featureShowcaseIcon">🔍</div>
                <h3>Detailed Source Attribution</h3>
                <p>
                  See exactly which polls, news sources, and fact-checkers contribute to each score, 
                  with confidence metrics and publication dates.
                </p>
              </div>

              <div className="featureShowcaseCard">
                <div className="featureShowcaseIcon">⚖️</div>
                <h3>Comparative Analysis</h3>
                <p>
                  Compare multiple public figures side-by-side across all metrics, regions, and time 
                  periods to identify patterns and trends.
                </p>
              </div>

              <div className="featureShowcaseCard">
                <div className="featureShowcaseIcon">🔔</div>
                <h3>Custom Alerts & Reports</h3>
                <p>
                  Get notified when figures you're tracking see significant movement, new controversies, 
                  or major approval changes.
                </p>
              </div>

              <div className="featureShowcaseCard">
                <div className="featureShowcaseIcon">📥</div>
                <h3>Data Export & Integration</h3>
                <p>
                  Download data in CSV or JSON format, or integrate directly with your tools via our 
                  RESTful API (Enterprise only).
                </p>
              </div>

              <div className="featureShowcaseCard">
                <div className="featureShowcaseIcon">🎯</div>
                <h3>Advanced Filtering</h3>
                <p>
                  Filter by region, role, score ranges, trend direction, controversy level, and dozens 
                  of other dimensions to find exactly what you need.
                </p>
              </div>

            </div>
          </div>

          {/* Use Cases */}
          <div style={{ marginTop: "80px", background: "var(--panel)", padding: "60px 40px", borderRadius: "24px" }}>
            <h2 style={{ textAlign: "center", marginTop: 0, marginBottom: "48px", fontSize: "2rem" }}>
              Trusted by Professionals Worldwide
            </h2>
            
            <div className="useCaseGrid">
              
              <div className="useCaseCard">
                <h4>📰 Journalists & Media</h4>
                <p>
                  Access credible perception data for fact-checking, investigative reporting, and 
                  providing context to political coverage. Export charts and data for publications.
                </p>
              </div>

              <div className="useCaseCard">
                <h4>🔬 Researchers & Academics</h4>
                <p>
                  Analyze long-term trends in public opinion, study polarization patterns, and access 
                  historical datasets for peer-reviewed research.
                </p>
              </div>

              <div className="useCaseCard">
                <h4>📈 Political Analysts</h4>
                <p>
                  Track leadership credibility, predict electoral outcomes, monitor approval ratings, 
                  and identify emerging narratives across regions.
                </p>
              </div>

              <div className="useCaseCard">
                <h4>🏢 Organizations & NGOs</h4>
                <p>
                  Integrate perception data into your systems via API, monitor stakeholder sentiment, 
                  and make data-driven strategic decisions.
                </p>
              </div>

            </div>
          </div>

          {/* FAQ Section */}
          <div style={{ marginTop: "80px", maxWidth: "800px", margin: "80px auto 0" }}>
            <h2 style={{ textAlign: "center", marginBottom: "40px", fontSize: "2rem" }}>
              Frequently Asked Questions
            </h2>
            
            <div className="subscriptionFaqList">
              
              <div className="subscriptionFaqItem">
                <h4>What's included in the free trial?</h4>
                <p>
                  The 14-day free trial gives you full access to all Professional features. No credit 
                  card required to start. Cancel anytime before the trial ends to avoid charges.
                </p>
              </div>

              <div className="subscriptionFaqItem">
                <h4>Can I cancel my subscription?</h4>
                <p>
                  Yes, you can cancel anytime. Your access will continue until the end of your current 
                  billing period. No refunds for partial months.
                </p>
              </div>

              <div className="subscriptionFaqItem">
                <h4>How much do I save with yearly billing?</h4>
                <p>
                  Save $98 per year when you choose annual billing! The Professional plan is $490/year 
                  (approximately $40.83/month), compared to $588/year with monthly billing. That's a 17% 
                  discount for paying annually.
                </p>
              </div>

              <div className="subscriptionFaqItem">
                <h4>What does API access include?</h4>
                <p>
                  Enterprise plans include RESTful API access with authentication, rate limiting based 
                  on your plan, webhook support, and comprehensive documentation. Contact sales for 
                  custom rate limits.
                </p>
              </div>

              <div className="subscriptionFaqItem">
                <h4>How often is data updated?</h4>
                <p>
                  Free users see data updated weekly. Professional and Enterprise subscribers get daily 
                  updates, with some signals (like news sentiment) refreshed multiple times per day.
                </p>
              </div>

              <div className="subscriptionFaqItem">
                <h4>Do you offer academic or nonprofit discounts?</h4>
                <p>
                  Yes! We offer 50% discounts for verified academic researchers and nonprofit organizations. 
                  Contact us at research@worldfigures.com with your credentials.
                </p>
              </div>

              <div className="subscriptionFaqItem">
                <h4>Can I upgrade or downgrade my plan?</h4>
                <p>
                  Absolutely. You can change your plan at any time. Upgrades are prorated and take effect 
                  immediately. Downgrades take effect at the end of your current billing cycle.
                </p>
              </div>

            </div>
          </div>

          {/* CTA */}
          <div style={{ marginTop: "80px", textAlign: "center", padding: "60px 40px", background: "linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(29, 78, 216, 0.1))", borderRadius: "24px", border: "1px solid rgba(96, 165, 250, 0.2)" }}>
            <h2 style={{ marginTop: 0, fontSize: "2rem" }}>Ready to Get Started?</h2>
            <p style={{ color: "var(--muted)", fontSize: "1.1rem", maxWidth: "600px", margin: "16px auto 32px" }}>
              Start your 14-day free trial of Professional access today. No credit card required.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn btnPrimary" style={{ padding: "14px 32px", fontSize: "1.05rem" }}>
                Start Free Trial
              </button>
              <a href="/contact" className="btn btnSecondary" style={{ padding: "14px 32px", fontSize: "1.05rem" }}>
                Contact Sales
              </a>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
