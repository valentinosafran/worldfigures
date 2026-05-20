import { getOpinionClass, people } from "../data/people";

export function Trending() {
  return (
    <section className="section" id="rankings">
      <div className="container">
        <div className="sectionHeading">
          <span>Trending public figures</span>
          <h2>Explore the Top 100</h2>
          <p>
            Start with the current standout profiles, then open the full Top 100 dashboard
            for deeper rankings, momentum, and narrative signals.
          </p>
        </div>

        <div className="cardGrid four profileCards">
          {people.map((person) => (
            <article className="profileCard" key={person.name}>
              <img className="avatar" src={person.image} alt={person.name} />
              <h3>{person.name}</h3>
              <p className="muted">{person.role}</p>
              <div className={`pill opinionTag ${getOpinionClass(person.label)}`}>
                {person.label}
              </div>
              <a className="textLink" href={`/profile/${person.slug}`}>
                View profile &rarr;
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
