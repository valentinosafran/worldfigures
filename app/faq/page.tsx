import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";

export default function FAQPage() {
  return (
    <main>
      <Navbar />
      
      <section className="section" style={{ paddingTop: "100px" }}>
        <div className="container">
          <div className="sectionHeading" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <span style={{ color: "var(--accent)" }}>Help Center</span>
            <h1 style={{ fontSize: "clamp(2rem, 8vw, 3rem)", margin: "16px 0" }}>Frequently Asked Questions</h1>
            <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.1rem)", color: "var(--muted)", lineHeight: "1.7" }}>
              Common questions about WorldFigures, our methodology, and how to use the platform.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: "900px" }}>
          <div className="faqList">
            
            <div className="faqItem">
              <h2>What is WorldFigures?</h2>
              <p>
                WorldFigures is a data-driven platform that tracks and presents public perception of global 
                political figures, leaders, and influential people. We aggregate data from polling organizations, 
                news sentiment, fact-checkers, and other verified sources to show how public figures are perceived 
                across four core metrics: Approval, Trust, Impact, and Controversy.
              </p>
            </div>

            <div className="faqItem">
              <h2>How do you calculate scores?</h2>
              <p>
                Each score (0-100) is calculated using weighted algorithms that combine multiple data sources. 
                For example, Approval combines polling data (40%), news sentiment (30%), polling trends (20%), 
                and social sentiment (10%). We provide full transparency about our methodology on the 
                <a href="/how-it-works" style={{ color: "var(--accent)", textDecoration: "underline", marginLeft: "4px" }}>How It Works</a> page.
              </p>
            </div>

            <div className="faqItem">
              <h2>Where does your data come from?</h2>
              <p>
                We aggregate data from over 50 verified sources including:
              </p>
              <ul style={{ color: "var(--muted)", lineHeight: "1.8", marginTop: "12px" }}>
                <li>Polling organizations (Gallup, Pew Research, YouGov, Ipsos)</li>
                <li>News aggregators (Reuters, AP, BBC, GDELT Project)</li>
                <li>Fact-checking organizations (PolitiFact, FactCheck.org)</li>
                <li>Academic research databases and think tanks</li>
                <li>Public sentiment trackers and analytics platforms</li>
              </ul>
              <p style={{ marginTop: "16px" }}>
                All sources are cited, and we regularly update our data to reflect current information.
              </p>
            </div>

            <div className="faqItem">
              <h2>How often are profiles updated?</h2>
              <p>
                Update frequency varies by data type:
              </p>
              <ul style={{ color: "var(--muted)", lineHeight: "1.8", marginTop: "12px" }}>
                <li><strong style={{ color: "var(--text)" }}>Daily:</strong> News sentiment and media coverage analysis</li>
                <li><strong style={{ color: "var(--text)" }}>Weekly:</strong> Social media sentiment and trending topics</li>
                <li><strong style={{ color: "var(--text)" }}>As Published:</strong> Polling data integrated within 48 hours of release</li>
              </ul>
              <p style={{ marginTop: "16px" }}>
                Each profile displays its "Last Updated" date so you know when the data was last refreshed.
              </p>
            </div>

            <div className="faqItem">
              <h2>What does "Source Confidence" mean?</h2>
              <p>
                Source Confidence (0-100%) indicates how much reliable data is available for a particular profile. 
                A higher percentage means more diverse, recent, and verified sources contribute to the scores. 
                Profiles with lower source confidence may have limited polling data or less media coverage.
              </p>
            </div>

            <div className="faqItem">
              <h2>Are your scores biased?</h2>
              <p>
                We don't claim to be "unbiased"—we acknowledge that perception itself is complex and varies by 
                region, demographics, and time. Our goal is to measure perception accurately using transparent, 
                data-driven methods. We don't inject editorial opinions or advocate for any political position. 
                All methodology is public, and sources are cited.
              </p>
            </div>

            <div className="faqItem">
              <h2>Why is Controversy scored differently?</h2>
              <p>
                For Controversy, <strong>higher scores indicate more criticism and polarization</strong>, whereas 
                for Approval, Trust, and Impact, higher scores are generally positive. A high Controversy score 
                (80-100) means the figure faces significant disputes, frequent criticism, or sharply divided public 
                opinion.
              </p>
            </div>

            <div className="faqItem">
              <h2>Can I request a profile for someone not listed?</h2>
              <p>
                We prioritize profiles that have sufficient public data available. If you'd like to suggest a 
                public figure for inclusion, please contact us through our 
                <a href="/contact" style={{ color: "var(--accent)", textDecoration: "underline", marginLeft: "4px" }}>Contact page</a>. 
                We evaluate suggestions based on data availability, public interest, and global relevance.
              </p>
            </div>

            <div className="faqItem">
              <h2>What if I find incorrect information?</h2>
              <p>
                We take accuracy seriously. If you notice an error, outdated data, or incorrect sourcing, please 
                submit a correction through our 
                <a href="/corrections" style={{ color: "var(--accent)", textDecoration: "underline", marginLeft: "4px" }}>Corrections page</a>. 
                We review all submissions and update profiles when errors are confirmed.
              </p>
            </div>

            <div className="faqItem">
              <h2>How do I interpret the trend indicators?</h2>
              <p>
                Trend indicators show movement over time:
              </p>
              <ul style={{ color: "var(--muted)", lineHeight: "1.8", marginTop: "12px" }}>
                <li><strong style={{ color: "#86efac" }}>+2 (green):</strong> Positive movement (approval or trust increasing)</li>
                <li><strong style={{ color: "#fca5a5" }}>-3 (red):</strong> Negative movement (approval or trust decreasing)</li>
                <li><strong style={{ color: "var(--muted)" }}>0 (gray):</strong> No significant change</li>
              </ul>
              <p style={{ marginTop: "16px" }}>
                We track both 7-day and 30-day trends to show short-term volatility and longer-term patterns.
              </p>
            </div>

            <div className="faqItem">
              <h2>Can I use your data for research?</h2>
              <p>
                Yes! Researchers, journalists, and educators are welcome to use our data with proper attribution. 
                Please cite WorldFigures as your source and link to the relevant profile or methodology page. 
                For bulk data access or API inquiries, please 
                <a href="/contact" style={{ color: "var(--accent)", textDecoration: "underline", marginLeft: "4px" }}>contact us</a>.
              </p>
            </div>

            <div className="faqItem">
              <h2>Do you have a mobile app?</h2>
              <p>
                Not yet! WorldFigures is currently a web-based platform optimized for both desktop and mobile 
                browsers. You can access all features through any modern web browser on your phone or tablet.
              </p>
            </div>

            <div className="faqItem">
              <h2>How can I stay updated?</h2>
              <p>
                We regularly update profiles and add new features. Check back frequently or subscribe to our 
                newsletter (coming soon) to receive updates about new profiles, methodology improvements, and 
                platform features.
              </p>
            </div>

          </div>

          <div style={{ marginTop: "64px", textAlign: "center", padding: "40px", background: "var(--panel)", borderRadius: "16px" }}>
            <h2 style={{ marginTop: 0 }}>Still have questions?</h2>
            <p style={{ color: "var(--muted)", marginBottom: "24px" }}>
              Can't find the answer you're looking for? Get in touch with our team.
            </p>
            <a href="/contact" className="btn btnPrimary">
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
