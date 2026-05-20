import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";
import { people } from "../../data/people";

const categories = [
  {
    name: "Technology & AI",
    description: "Tech CEOs, AI researchers, and innovation leaders shaping the future",
    icon: "🤖",
    filter: (role: string) => 
      role.toLowerCase().includes("tech") || 
      role.toLowerCase().includes("ai") ||
      role.toLowerCase().includes("researcher"),
  },
  {
    name: "Politics & Geopolitics",
    description: "Presidents, prime ministers, and world leaders",
    icon: "🌍",
    filter: (role: string) => 
      role.toLowerCase().includes("president") || 
      role.toLowerCase().includes("prime minister") ||
      role.toLowerCase().includes("crown prince") ||
      role.toLowerCase().includes("political"),
  },
  {
    name: "Finance & Business",
    description: "CEOs, investors, and business leaders driving markets",
    icon: "💼",
    filter: (role: string) => 
      role.toLowerCase().includes("finance") ||
      role.toLowerCase().includes("bank") ||
      role.toLowerCase().includes("investor") ||
      (role.toLowerCase().includes("business") && !role.toLowerCase().includes("tech")),
  },
  {
    name: "Media & Culture",
    description: "Musicians, creators, athletes, and cultural icons",
    icon: "🎭",
    filter: (role: string) => 
      role.toLowerCase().includes("musician") ||
      role.toLowerCase().includes("podcaster") ||
      role.toLowerCase().includes("content creator") ||
      role.toLowerCase().includes("athlete") ||
      role.toLowerCase().includes("media mogul"),
  },
  {
    name: "Science & Thought Leaders",
    description: "Scientists, historians, and intellectual influencers",
    icon: "🔬",
    filter: (role: string) => 
      role.toLowerCase().includes("scientist") ||
      role.toLowerCase().includes("historian") ||
      role.toLowerCase().includes("researcher"),
  },
  {
    name: "EU Leaders",
    description: "European Union officials and representatives",
    icon: "🇪🇺",
    filter: (role: string) => role.toLowerCase().includes("eu"),
  },
];

export default function CategoriesPage() {
  return (
    <main>
      <Navbar />
      
      <section className="section" style={{ paddingTop: "100px" }}>
        <div className="container">
          <div className="sectionHeading" style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <span style={{ color: "var(--accent)" }}>Browse</span>
            <h1 style={{ fontSize: "clamp(2rem, 8vw, 3rem)", margin: "16px 0" }}>Categories</h1>
            <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.1rem)", color: "var(--muted)", lineHeight: "1.7" }}>
              Explore public figures organized by role, region, and influence type. Each category shows 
              perception patterns specific to that group.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cardGrid two" style={{ gap: "clamp(20px, 4vw, 24px)" }}>
            {categories.map((category) => {
              const count = people.filter(person => category.filter(person.role)).length;
              const categoryPeople = people.filter(person => category.filter(person.role)).slice(0, 3);
              
              return (
                <article className="categoryDetailCard" key={category.name}>
                  <div className="categoryDetailIcon">{category.icon}</div>
                  <h2>{category.name}</h2>
                  <p style={{ color: "var(--muted)", margin: "8px 0 16px" }}>{category.description}</p>
                  <div className="categoryCount">{count} {count === 1 ? 'profile' : 'profiles'}</div>
                  
                  {categoryPeople.length > 0 && (
                    <div className="categoryPreviews">
                      {categoryPeople.map(person => (
                        <a 
                          key={person.slug} 
                          href={`/profile/${person.slug}`}
                          className="categoryPreviewItem"
                        >
                          <img src={person.image} alt={person.name} />
                          <div>
                            <strong>{person.name}</strong>
                            <span>{person.role}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                  
                  <a href="/top-100" className="btn btnSecondary" style={{ marginTop: "16px", width: "100%" }}>
                    View all in dashboard
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--panel)" }}>
        <div className="container">
          <div className="sectionHeading">
            <h2>All Regions</h2>
            <p>Browse public figures by geographic region</p>
          </div>

          <div className="cardGrid three" style={{ gap: "16px" }}>
            {Array.from(new Set(people.map(p => p.region))).map(region => {
              const regionCount = people.filter(p => p.region === region).length;
              return (
                <div key={region} className="regionCard">
                  <h3>{region}</h3>
                  <p style={{ color: "var(--muted)", margin: "8px 0 0", fontSize: "0.9rem" }}>
                    {regionCount} {regionCount === 1 ? 'profile' : 'profiles'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
