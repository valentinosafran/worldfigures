import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";

export default function ContactPage() {
  return (
    <main>
      <Navbar />
      
      <section className="section" style={{ paddingTop: "100px" }}>
        <div className="container">
          <div className="sectionHeading" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <span style={{ color: "var(--accent)" }}>Get In Touch</span>
            <h1 style={{ fontSize: "clamp(2rem, 8vw, 3rem)", margin: "16px 0" }}>Contact Us</h1>
            <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.1rem)", color: "var(--muted)", lineHeight: "1.7" }}>
              Have questions, feedback, or suggestions? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: "900px" }}>
          <div className="cardGrid two" style={{ gap: "24px" }}>
            
            <div className="contactCard">
              <div className="contactIcon">📧</div>
              <h3>General Inquiries</h3>
              <p style={{ color: "var(--muted)", marginBottom: "16px" }}>
                For general questions about WorldFigures, our methodology, or how to use the platform.
              </p>
              <a href="mailto:hello@worldfigures.com" className="contactLink">
                hello@worldfigures.com
              </a>
            </div>

            <div className="contactCard">
              <div className="contactIcon">🔍</div>
              <h3>Data & Research</h3>
              <p style={{ color: "var(--muted)", marginBottom: "16px" }}>
                For research partnerships, data access requests, or academic inquiries.
              </p>
              <a href="mailto:research@worldfigures.com" className="contactLink">
                research@worldfigures.com
              </a>
            </div>

            <div className="contactCard">
              <div className="contactIcon">📰</div>
              <h3>Press & Media</h3>
              <p style={{ color: "var(--muted)", marginBottom: "16px" }}>
                For press inquiries, interviews, or media partnerships.
              </p>
              <a href="mailto:press@worldfigures.com" className="contactLink">
                press@worldfigures.com
              </a>
            </div>

            <div className="contactCard">
              <div className="contactIcon">⚠️</div>
              <h3>Report an Issue</h3>
              <p style={{ color: "var(--muted)", marginBottom: "16px" }}>
                Found incorrect data or a technical issue? Let us know.
              </p>
              <a href="/corrections" className="contactLink">
                Submit a correction →
              </a>
            </div>

          </div>

          <div style={{ marginTop: "64px", background: "var(--panel)", padding: "40px", borderRadius: "16px" }}>
            <h2 style={{ marginTop: 0 }}>Quick Links</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginTop: "24px" }}>
              <a href="/faq" className="quickLink">
                <strong>FAQ</strong>
                <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "var(--muted)" }}>Common questions</p>
              </a>
              <a href="/how-it-works" className="quickLink">
                <strong>Methodology</strong>
                <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "var(--muted)" }}>How we calculate scores</p>
              </a>
              <a href="/corrections" className="quickLink">
                <strong>Corrections</strong>
                <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "var(--muted)" }}>Report data errors</p>
              </a>
              <a href="/about" className="quickLink">
                <strong>About</strong>
                <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "var(--muted)" }}>Our mission & principles</p>
              </a>
            </div>
          </div>

          <div style={{ marginTop: "48px", textAlign: "center", color: "var(--muted)" }}>
            <p>
              We typically respond to all inquiries within 2-3 business days.
              <br />
              For urgent matters, please indicate "URGENT" in your subject line.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
