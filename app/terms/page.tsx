import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";

export default function TermsPage() {
  return (
    <main>
      <Navbar />
      
      <section className="section" style={{ paddingTop: "100px" }}>
        <div className="container">
          <div className="sectionHeading" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <span style={{ color: "var(--accent)" }}>Legal</span>
            <h1 style={{ fontSize: "clamp(2rem, 8vw, 3rem)", margin: "16px 0" }}>Terms of Service</h1>
            <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.1rem)", color: "var(--muted)", lineHeight: "1.7" }}>
              Last updated: April 15, 2026
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: "800px" }}>
          <div className="legalContent">
            
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using WorldFigures ("the Site"), you accept and agree to be bound by these Terms 
              of Service ("Terms"). If you do not agree to these Terms, please do not use the Site.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              WorldFigures provides a platform for tracking and presenting public perception data about global 
              political figures, leaders, and influential people. The Site aggregates data from multiple public 
              sources and presents it through scores, trends, and analysis.
            </p>

            <h2>3. Use License</h2>
            <p>
              We grant you a limited, non-exclusive, non-transferable license to access and use the Site for 
              personal, non-commercial purposes. You may not:
            </p>
            <ul>
              <li>Modify or copy the materials</li>
              <li>Use the materials for commercial purposes without permission</li>
              <li>Remove any copyright or proprietary notations</li>
              <li>Transfer the materials to another person or "mirror" the materials on another server</li>
              <li>Scrape, harvest, or collect data using automated tools without permission</li>
            </ul>

            <h2>4. Disclaimer and Limitation of Information</h2>
            
            <h3>Not Professional Advice</h3>
            <p>
              The information provided on WorldFigures is for general informational purposes only. It is not 
              intended as professional advice (political, financial, legal, or otherwise). The scores and data 
              presented represent public perception patterns, not absolute truth or recommendations.
            </p>

            <h3>Accuracy of Information</h3>
            <p>
              While we strive to provide accurate and up-to-date information, we make no representations or 
              warranties of any kind, express or implied, about:
            </p>
            <ul>
              <li>The accuracy, reliability, or completeness of the data</li>
              <li>The suitability of the information for any particular purpose</li>
              <li>The timeliness of updates or corrections</li>
            </ul>

            <h3>Third-Party Data</h3>
            <p>
              Our scores are derived from third-party sources. We are not responsible for the accuracy of 
              source data or for any decisions made based on information presented on our Site.
            </p>

            <h2>5. User Content and Conduct</h2>
            <p>
              If you submit corrections, feedback, or other content to the Site, you agree that:
            </p>
            <ul>
              <li>You have the right to submit the content</li>
              <li>The content is accurate and not misleading</li>
              <li>You will not submit defamatory, abusive, or illegal content</li>
              <li>We may use your submissions to improve the Site</li>
            </ul>

            <h2>6. Intellectual Property Rights</h2>
            <p>
              All content on the Site, including text, graphics, logos, icons, images, and software, is the 
              property of WorldFigures or its content suppliers and protected by copyright and other intellectual 
              property laws.
            </p>
            <p>
              You may use our data for research, journalism, or educational purposes with proper attribution, 
              but commercial use requires explicit permission.
            </p>

            <h2>7. Links to Third-Party Sites</h2>
            <p>
              The Site may contain links to third-party websites or resources. We are not responsible for the 
              content, accuracy, or opinions expressed on these sites. Inclusion of any link does not imply 
              endorsement.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, WorldFigures shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, or any loss of profits or revenues, 
              whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible 
              losses resulting from:
            </p>
            <ul>
              <li>Your use or inability to use the Site</li>
              <li>Any unauthorized access to or use of our servers</li>
              <li>Any errors or omissions in any content</li>
              <li>Reliance on any information obtained from the Site</li>
            </ul>

            <h2>9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless WorldFigures and its affiliates from any claims, damages, 
              losses, liabilities, and expenses (including legal fees) arising from your use of the Site or 
              violation of these Terms.
            </p>

            <h2>10. Modifications to Service</h2>
            <p>
              We reserve the right to modify or discontinue, temporarily or permanently, the Site (or any part 
              thereof) with or without notice. We shall not be liable to you or any third party for any 
              modification, suspension, or discontinuance of the Site.
            </p>

            <h2>11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of any material 
              changes by posting the new Terms on this page and updating the "Last updated" date. Your continued 
              use of the Site after any changes constitutes acceptance of the new Terms.
            </p>

            <h2>12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], 
              without regard to its conflict of law provisions.
            </p>

            <h2>13. Dispute Resolution</h2>
            <p>
              Any disputes arising out of or relating to these Terms or the Site shall first be attempted to 
              be resolved through good faith negotiation. If unresolved, disputes will be submitted to binding 
              arbitration in accordance with the rules of [Arbitration Body].
            </p>

            <h2>14. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be 
              limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain 
              in full force and effect.
            </p>

            <h2>15. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us:
            </p>
            <ul>
              <li>Email: legal@worldfigures.com</li>
              <li>Website: <a href="/contact" style={{ color: "var(--accent)" }}>worldfigures.com/contact</a></li>
            </ul>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
