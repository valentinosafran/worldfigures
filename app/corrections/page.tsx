import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";

export default function CorrectionsPage() {
  return (
    <main>
      <Navbar />
      
      <section className="section" style={{ paddingTop: "100px" }}>
        <div className="container">
          <div className="sectionHeading" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <span style={{ color: "var(--accent)" }}>Data Accuracy</span>
            <h1 style={{ fontSize: "clamp(2rem, 8vw, 3rem)", margin: "16px 0" }}>Submit a Correction</h1>
            <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.1rem)", color: "var(--muted)", lineHeight: "1.7" }}>
              Help us maintain accuracy. Report errors, outdated data, or incorrect information.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: "900px" }}>
          
          <div style={{ background: "var(--panel)", padding: "32px", borderRadius: "16px", marginBottom: "48px" }}>
            <h2 style={{ marginTop: 0 }}>Our Commitment to Accuracy</h2>
            <p style={{ color: "var(--muted)", lineHeight: "1.7" }}>
              WorldFigures is committed to providing accurate, reliable, and up-to-date information. While we 
              use verified sources and rigorous methodology, errors can occur. We appreciate your help in 
              identifying and correcting them.
            </p>
          </div>

          <h2>What You Can Report</h2>
          <div className="cardGrid two" style={{ gap: "20px", marginTop: "24px", marginBottom: "48px" }}>
            
            <div className="correctionTypeCard">
              <h3>❌ Data Errors</h3>
              <ul style={{ color: "var(--muted)", lineHeight: "1.7", margin: "12px 0 0", paddingLeft: "20px" }}>
                <li>Incorrect scores or statistics</li>
                <li>Misattributed quotes or statements</li>
                <li>Wrong role or region information</li>
                <li>Inaccurate trend indicators</li>
              </ul>
            </div>

            <div className="correctionTypeCard">
              <h3>📅 Outdated Information</h3>
              <ul style={{ color: "var(--muted)", lineHeight: "1.7", margin: "12px 0 0", paddingLeft: "20px" }}>
                <li>Profiles not updated with recent events</li>
                <li>Stale polling data or old sentiment</li>
                <li>Changed roles or positions</li>
                <li>Obsolete biographical details</li>
              </ul>
            </div>

            <div className="correctionTypeCard">
              <h3>🔗 Source Issues</h3>
              <ul style={{ color: "var(--muted)", lineHeight: "1.7", margin: "12px 0 0", paddingLeft: "20px" }}>
                <li>Broken or dead links</li>
                <li>Misattributed sources</li>
                <li>Unreliable source citations</li>
                <li>Missing source attributions</li>
              </ul>
            </div>

            <div className="correctionTypeCard">
              <h3>🐛 Technical Bugs</h3>
              <ul style={{ color: "var(--muted)", lineHeight: "1.7", margin: "12px 0 0", paddingLeft: "20px" }}>
                <li>Display or formatting issues</li>
                <li>Calculation errors in scores</li>
                <li>Broken features or links</li>
                <li>Mobile responsiveness problems</li>
              </ul>
            </div>

          </div>

          <div style={{ background: "var(--panel-2)", padding: "40px", borderRadius: "16px" }}>
            <h2 style={{ marginTop: 0 }}>Submit a Correction</h2>
            <p style={{ color: "var(--muted)", marginBottom: "32px" }}>
              Please provide as much detail as possible to help us verify and process your correction quickly.
            </p>

            <div className="correctionForm">
              <div className="formGroup">
                <label>Profile or Page Affected*</label>
                <input 
                  type="text" 
                  className="formInput" 
                  placeholder="e.g., Donald Trump profile, How It Works page"
                  disabled
                />
              </div>

              <div className="formGroup">
                <label>Type of Issue*</label>
                <select className="formInput" disabled>
                  <option>Select issue type</option>
                  <option>Data Error</option>
                  <option>Outdated Information</option>
                  <option>Source Issue</option>
                  <option>Technical Bug</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="formGroup">
                <label>What is incorrect?*</label>
                <textarea 
                  className="formInput" 
                  rows={4}
                  placeholder="Describe the error you found..."
                  disabled
                ></textarea>
              </div>

              <div className="formGroup">
                <label>What should it be?*</label>
                <textarea 
                  className="formInput" 
                  rows={4}
                  placeholder="Provide the correct information..."
                  disabled
                ></textarea>
              </div>

              <div className="formGroup">
                <label>Supporting Evidence (optional)</label>
                <textarea 
                  className="formInput" 
                  rows={3}
                  placeholder="Links to sources, screenshots, or other evidence..."
                  disabled
                ></textarea>
              </div>

              <div className="formGroup">
                <label>Your Email (optional)</label>
                <input 
                  type="email" 
                  className="formInput" 
                  placeholder="your@email.com"
                  disabled
                />
                <small style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "6px", display: "block" }}>
                  We'll notify you when the correction is reviewed. Not required.
                </small>
              </div>

              <div style={{ marginTop: "32px", padding: "20px", background: "rgba(96, 165, 250, 0.1)", borderRadius: "12px", border: "1px solid rgba(96, 165, 250, 0.2)" }}>
                <p style={{ margin: 0, color: "#93c5fd", fontSize: "0.95rem" }}>
                  <strong>Note:</strong> This form is not yet functional. For now, please send corrections to{" "}
                  <a href="mailto:corrections@worldfigures.com" style={{ color: "var(--accent)", textDecoration: "underline" }}>
                    corrections@worldfigures.com
                  </a>
                </p>
              </div>

              <button className="btn btnPrimary" style={{ marginTop: "24px" }} disabled>
                Submit Correction
              </button>
            </div>
          </div>

          <div style={{ marginTop: "48px", padding: "32px", background: "var(--panel)", borderRadius: "16px" }}>
            <h2 style={{ marginTop: 0 }}>Our Review Process</h2>
            <div style={{ display: "grid", gap: "20px" }}>
              <div className="processStep">
                <div className="processNumber">1</div>
                <div>
                  <h4 style={{ margin: "0 0 6px" }}>Submission Review</h4>
                  <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.95rem" }}>
                    We review all correction submissions within 24-48 hours
                  </p>
                </div>
              </div>

              <div className="processStep">
                <div className="processNumber">2</div>
                <div>
                  <h4 style={{ margin: "0 0 6px" }}>Verification</h4>
                  <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.95rem" }}>
                    Our team verifies the correction against original sources
                  </p>
                </div>
              </div>

              <div className="processStep">
                <div className="processNumber">3</div>
                <div>
                  <h4 style={{ margin: "0 0 6px" }}>Implementation</h4>
                  <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.95rem" }}>
                    Confirmed corrections are implemented and the profile is updated
                  </p>
                </div>
              </div>

              <div className="processStep">
                <div className="processNumber">4</div>
                <div>
                  <h4 style={{ margin: "0 0 6px" }}>Notification</h4>
                  <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.95rem" }}>
                    If you provided an email, we'll notify you of the outcome
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
