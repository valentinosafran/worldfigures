import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";

export default function PrivacyPage() {
  return (
    <main>
      <Navbar />
      
      <section className="section" style={{ paddingTop: "100px" }}>
        <div className="container">
          <div className="sectionHeading" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <span style={{ color: "var(--accent)" }}>Legal</span>
            <h1 style={{ fontSize: "clamp(2rem, 8vw, 3rem)", margin: "16px 0" }}>Privacy Policy</h1>
            <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.1rem)", color: "var(--muted)", lineHeight: "1.7" }}>
              Last updated: April 15, 2026
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: "800px" }}>
          <div className="legalContent">
            
            <h2>1. Introduction</h2>
            <p>
              WorldFigures ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you visit our website 
              worldfigures.com (the "Site"). Please read this privacy policy carefully.
            </p>

            <h2>2. Information We Collect</h2>
            
            <h3>Information You Provide</h3>
            <p>
              We may collect information that you voluntarily provide to us when you:
            </p>
            <ul>
              <li>Subscribe to our newsletter (email address)</li>
              <li>Submit corrections or feedback (name, email, message content)</li>
              <li>Contact us for support or inquiries (name, email, message content)</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>
              When you visit our Site, we may automatically collect certain information about your device, including:
            </p>
            <ul>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>IP address</li>
              <li>Pages viewed and time spent on pages</li>
              <li>Referring website addresses</li>
              <li>General location data (country/region level)</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Provide, operate, and maintain our Site</li>
              <li>Improve and personalize your experience</li>
              <li>Respond to your inquiries and support requests</li>
              <li>Send you updates, newsletters, and marketing communications (with your consent)</li>
              <li>Analyze Site usage and trends to improve our services</li>
              <li>Detect, prevent, and address technical issues or security concerns</li>
            </ul>

            <h2>4. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our Site and store certain 
              information. Cookies are small data files that are placed on your device. You can instruct your 
              browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
            <p>
              We use:
            </p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for the Site to function properly</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our Site</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>

            <h2>5. Third-Party Services</h2>
            <p>
              We may use third-party service providers to help us operate our Site and analyze usage. These 
              third parties may include:
            </p>
            <ul>
              <li>Analytics providers (e.g., Google Analytics)</li>
              <li>Email service providers</li>
              <li>Hosting providers</li>
            </ul>
            <p>
              These third parties have access to your information only to perform specific tasks on our behalf 
              and are obligated not to disclose or use it for any other purpose.
            </p>

            <h2>6. Data Retention</h2>
            <p>
              We retain your personal information only for as long as necessary to fulfill the purposes outlined 
              in this Privacy Policy, unless a longer retention period is required or permitted by law.
            </p>

            <h2>7. Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Request corrections to inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Data Portability:</strong> Request your data in a portable format</li>
            </ul>
            <p>
              To exercise these rights, please contact us at privacy@worldfigures.com.
            </p>

            <h2>8. Children's Privacy</h2>
            <p>
              Our Site is not intended for children under 13 years of age. We do not knowingly collect personal 
              information from children under 13. If you believe we have collected information from a child under 
              13, please contact us immediately.
            </p>

            <h2>9. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information. 
              However, no method of transmission over the internet or electronic storage is 100% secure. While we 
              strive to protect your information, we cannot guarantee its absolute security.
            </p>

            <h2>10. International Data Transfers</h2>
            <p>
              Your information may be transferred to and maintained on servers located outside of your state, 
              province, country, or other governmental jurisdiction where data protection laws may differ. By 
              using our Site, you consent to such transfers.
            </p>

            <h2>11. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review 
              this Privacy Policy periodically.
            </p>

            <h2>12. Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy, please contact us:
            </p>
            <ul>
              <li>Email: privacy@worldfigures.com</li>
              <li>Website: <a href="/contact" style={{ color: "var(--accent)" }}>worldfigures.com/contact</a></li>
            </ul>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
