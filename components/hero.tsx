interface HeroProps {
  benchmarkStats: {
    label: string;
    value: number;
  }[];
  trendingPeople: {
    name: string;
    slug: string;
    image: string;
    opinion: string;
    delta: number;
  }[];
}

function getOpinionClass(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("highly polarizing")) return "opinion-high-polarizing";
  if (normalized.includes("polarizing")) return "opinion-polarizing";
  if (normalized.includes("negative")) return "opinion-negative";
  if (normalized.includes("mixed")) return "opinion-mixed";
  if (normalized.includes("positive")) return "opinion-positive";

  return "opinion-neutral";
}

function getDeltaClass(delta: number) {
  if (delta > 0) return "change-up";
  if (delta < 0) return "change-down";
  return "change-flat";
}

export function Hero({ benchmarkStats, trendingPeople }: HeroProps) {
  return (
    <section className="hero">
      <div className="container heroGrid">
        <div>
          <div className="badge">Transparent public perception tracking</div>
          <h1>See how the world views public figures</h1>
          <p className="heroText">
            WorldFigures helps you explore global public perception of politicians,
            leaders, and influential figures through sourced signals like
            polling, sentiment, expert assessments, trust, impact, and
            controversy.
          </p>

          <div className="heroActions">
            <a className="button buttonPrimary" href="/top-100">
              Explore Top 100
            </a>
            <a className="button buttonSecondary" href="/how-it-works">
              How scoring works
            </a>
          </div>

          <p className="heroNote">
            Built on transparent sources. No anonymous score dumping. Every
            profile includes methodology and citations.
          </p>
        </div>

        <div className="heroPanel">
          <div className="panelCard">
            <div className="panelHeader">
              <span>Global dashboard</span>
              <span className="panelUpdate">
                <span className="panelUpdateDot" aria-hidden="true" />
                Live signals
              </span>
            </div>

            <div className="statGrid">
              {benchmarkStats.map((stat) => (
                <div className="statCard" key={stat.label}>
                  <span className="statLabel">{stat.label}</span>
                  <strong className="statValue">{stat.value}</strong>
                </div>
              ))}
            </div>

            <p className="panelNote">
              These values show the current platform benchmark (Top 100 average), not a single person profile.
            </p>

            <div className="miniProfiles">
              {trendingPeople.map((profile) => (
                <a className="miniProfile miniProfileLink" href={`/profile/${profile.slug}`} key={profile.name}>
                  <div className="miniProfileMain">
                    <img
                      className="miniAvatar"
                      src={profile.image}
                      alt={profile.name}
                    />
                    <div>
                      <strong>{profile.name}</strong>
                      <p className={`opinionText ${getOpinionClass(profile.opinion)}`}>
                        {profile.opinion}
                      </p>
                    </div>
                  </div>
                  <span className={`changeTag ${getDeltaClass(profile.delta)}`}>
                    {profile.delta > 0 ? `+${profile.delta}` : `${profile.delta}`}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
