import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      
      <section className="section" style={{ paddingTop: "100px" }}>
        <div className="container">
          <div className="sectionHeading" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <span style={{ color: "var(--accent)" }}>About</span>
            <h1 style={{ fontSize: "clamp(2rem, 8vw, 3rem)", margin: "16px 0" }}>WorldFigures</h1>
            <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.1rem)", color: "var(--muted)", lineHeight: "1.7" }}>
              A transparent platform for understanding how the world views public figures through 
              data-driven analysis and clear methodology.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: "800px" }}>
          <div className="aboutContent">
            <h2>Our Mission</h2>
            <p>
              WorldFigures exists to bring transparency and objectivity to public perception tracking. 
              In an era of polarized opinions and fragmented media, we aggregate diverse data sources 
              to show measurable patterns in how public figures are perceived globally.
            </p>
            <p>
              We don't claim to know absolute truth about any individual. Instead, we measure and 
              present perception signals—approval ratings, trust metrics, media sentiment, and 
              controversy levels—with full transparency about our sources and methodology.
            </p>

            <h2 style={{ marginTop: "48px" }}>What We Track</h2>
            <p>
              Our platform analyzes four core signals across tracked public figures:
            </p>
            <ul style={{ lineHeight: "1.8", color: "var(--muted)" }}>
              <li><strong style={{ color: "var(--text)" }}>Approval:</strong> Public support through polling data and sentiment analysis</li>
              <li><strong style={{ color: "var(--text)" }}>Trust:</strong> Credibility signals from institutional ratings and fact-checking</li>
              <li><strong style={{ color: "var(--text)" }}>Impact:</strong> Measured influence through media coverage and policy relevance</li>
              <li><strong style={{ color: "var(--text)" }}>Controversy:</strong> Tracking criticism, disputes, and opinion polarization</li>
            </ul>

            <h2 style={{ marginTop: "48px" }}>Our Principles</h2>
            <div className="principlesList">
              <div className="principleItem">
                <h3>🔍 Transparency First</h3>
                <p>
                  Every score comes with source citations. We show our methodology openly and update 
                  data regularly with clear timestamps.
                </p>
              </div>
              
              <div className="principleItem">
                <h3>📊 Data-Driven</h3>
                <p>
                  We rely on reputable polling organizations, fact-checkers, news aggregators, and 
                  academic sources—not opinions or editorial judgment.
                </p>
              </div>
              
              <div className="principleItem">
                <h3>🎯 No Bias Claims</h3>
                <p>
                  We acknowledge that perception itself is complex. Our goal is to measure it 
                  accurately, not to judge or advocate for any position.
                </p>
              </div>
              
              <div className="principleItem">
                <h3>🌍 Global Perspective</h3>
                <p>
                  Public perception varies by region, demographics, and time. We track these 
                  variations instead of claiming one universal truth.
                </p>
              </div>
            </div>

            <h2 style={{ marginTop: "48px" }}>Who We Serve</h2>
            <p>
              WorldFigures is built for anyone seeking objective data about public figures:
            </p>
            <ul style={{ lineHeight: "1.8", color: "var(--muted)" }}>
              <li>Journalists and researchers looking for perception trend data</li>
              <li>Political analysts tracking leadership credibility</li>
              <li>Educators teaching about media literacy and public opinion</li>
              <li>Citizens wanting context beyond headlines and social media</li>
            </ul>

            <h2 style={{ marginTop: "48px" }}>Data Sources</h2>
            <p>
              We aggregate data from over 50 verified sources including:
            </p>
            <div className="cardGrid three" style={{ gap: "16px", marginTop: "24px" }}>
              <div className="sourceTypeCard">
                <strong>Polling Organizations</strong>
                <p style={{ fontSize: "0.9rem", margin: "8px 0 0" }}>Gallup, Pew, YouGov, Ipsos</p>
              </div>
              <div className="sourceTypeCard">
                <strong>News Aggregators</strong>
                <p style={{ fontSize: "0.9rem", margin: "8px 0 0" }}>Reuters, AP, BBC, GDELT</p>
              </div>
              <div className="sourceTypeCard">
                <strong>Fact-Checkers</strong>
                <p style={{ fontSize: "0.9rem", margin: "8px 0 0" }}>PolitiFact, FactCheck.org</p>
              </div>
            </div>

            <h2 style={{ marginTop: "48px" }}>Get In Touch</h2>
            <p>
              We welcome feedback, corrections, and questions about our methodology. 
              If you notice an error or have suggestions for improvement, please reach out.
            </p>
            <div style={{ marginTop: "32px" }}>
              <a href="/contact" className="btn btnPrimary">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
