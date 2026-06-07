import { CATEGORY_DEFINITIONS } from '../lib/profile-taxonomy';

export function Categories() {
  return (
    <section className="section" id="categories">
      <div className="container">
        <div className="sectionHeading">
          <span>Browse by lens</span>
          <h2>Explore by category</h2>
        </div>

        <div className="cardGrid three">
          {CATEGORY_DEFINITIONS.map((category) => (
            <a className="categoryCard" key={category.key} href={`/top-100?category=${encodeURIComponent(category.key)}`}>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}