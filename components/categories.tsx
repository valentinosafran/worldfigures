const categories = [
  "Technology & AI",
  "Politics & Geopolitics",
  "Finance & Business",
  "Media & Culture",
  "Science & Thought Leaders",
  "EU Leaders",
];

export function Categories() {
  return (
    <section className="section" id="categories">
      <div className="container">
        <div className="sectionHeading">
          <span>Browse by lens</span>
          <h2>Explore by category</h2>
        </div>

        <div className="cardGrid three">
          {categories.map((category) => (
            <article className="categoryCard" key={category}>
              <h3>{category}</h3>
              <p>Browse profiles, rankings, and trends.</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}