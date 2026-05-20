"use client";

import { useState, useEffect, type KeyboardEvent } from "react";
import { people } from "../data/people";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [desktopQuery, setDesktopQuery] = useState("");
  const [mobileQuery, setMobileQuery] = useState("");
  const close = () => setOpen(false);

  // Close mobile menu when viewport becomes desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 860 && open) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  const getMatches = (query: string) => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    return people
      .filter((person) => person.name.toLowerCase().includes(normalized))
      .slice(0, 6);
  };

  const desktopMatches = getMatches(desktopQuery);
  const mobileMatches = getMatches(mobileQuery);

  const onSearchKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    matches: { slug: string }[]
  ) => {
    if (e.key === "Enter" && matches.length > 0) {
      window.location.href = `/profile/${matches[0].slug}`;
    }
  };

  return (
    <header className="border-b border-white/10 sticky top-0 z-50 backdrop-blur bg-slate-950/80">
      <div className="container">
        <div className="nav">
          <a className="logo" href="/">
            <img src="/images/logo/logo.svg" alt="WorldFigures" className="logoImage logoDesktop" />
            <img src="/images/icon/apple-touch-icon.png" alt="WorldFigures" className="logoImage logoMobile" />
          </a>

          <nav className="navLinks">
            <a href="/top-100">Rankings</a>
            <a href="/community-rankings">Community</a>
            <a href="/categories">Categories</a>
            <a href="/how-it-works">How It Works</a>
            <a href="/about">About</a>
          </nav>

          <div className="navActions">
            <div className="searchWrap">
              <input
                className="search"
                placeholder="Search public figures"
                aria-label="Search public figures"
                value={desktopQuery}
                onChange={(e) => setDesktopQuery(e.target.value)}
                onKeyDown={(e) => onSearchKeyDown(e, desktopMatches)}
              />
              {desktopQuery.trim() && (
                <div className="searchResults">
                  {desktopMatches.length > 0 ? (
                    desktopMatches.map((person) => (
                      <a
                        key={person.slug}
                        className="searchResultItem"
                        href={`/profile/${person.slug}`}
                      >
                        <img className="searchThumb" src={person.image} alt={person.name} />
                        <span>{person.name}</span>
                      </a>
                    ))
                  ) : (
                    <div className="searchNoResult">No matching person</div>
                  )}
                </div>
              )}
            </div>
            <a className="button buttonPrimary" href="/subscribe">
              Buy Premium
            </a>
          </div>

          <a className="mobilePremiumButton" href="/subscribe">
            Buy Premium
          </a>

          <button
            className={`hamburger${open ? " is-open" : ""}`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o: boolean) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className={`mobileMenu${open ? " open" : ""}`} role="navigation" aria-label="Mobile navigation">
          <a href="/top-100" onClick={close}>Rankings</a>
          <a href="/community-rankings" onClick={close}>Community</a>
          <a href="/categories" onClick={close}>Categories</a>
          <a href="/how-it-works" onClick={close}>How It Works</a>
          <a href="/about" onClick={close}>About</a>
          <div className="mobileMenuActions">
            <div className="searchWrap">
              <input
                className="search"
                placeholder="Search public figures"
                aria-label="Search public figures"
                value={mobileQuery}
                onChange={(e) => setMobileQuery(e.target.value)}
                onKeyDown={(e) => onSearchKeyDown(e, mobileMatches)}
              />
              {mobileQuery.trim() && (
                <div className="searchResults">
                  {mobileMatches.length > 0 ? (
                    mobileMatches.map((person) => (
                      <a
                        key={person.slug}
                        className="searchResultItem"
                        href={`/profile/${person.slug}`}
                        onClick={close}
                      >
                        <img className="searchThumb" src={person.image} alt={person.name} />
                        <span>{person.name}</span>
                      </a>
                    ))
                  ) : (
                    <div className="searchNoResult">No matching person</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
