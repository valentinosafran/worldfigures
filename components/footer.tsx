export function Footer() {
  return (
    <footer className="footer" id="about">
      <div className="container footerGrid">
        <div>
          <div className="logo">
            <img src="/images/logo/logo.svg" alt="WorldFigures" style={{ height: "34px" }} />
          </div>
          <p className="muted">
            A sourced dashboard for understanding global public perception of
            major public figures.
          </p>
        </div>

        <div>
          <h4>Product</h4>
          <a href="/top-100">Rankings</a>
          <a href="/categories">Categories</a>
          <a href="/subscribe" className="footerSubscribeLink">Premium</a>
        </div>

        <div>
          <h4>Resources</h4>
          <a href="/how-it-works">How It Works</a>
          <a href="/faq">FAQ</a>
          <a href="/corrections">Corrections</a>
        </div>

        <div>
          <h4>Company</h4>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
      </div>
      
      <div className="footerBottom">
        <p>© 2026 WorldFigures. All rights reserved. - "See what the world thinks."</p>
      </div>
    </footer>
  );
}
