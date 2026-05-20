import { people } from "../data/people";
import { fetchMultiplePeopleData } from "../lib/api-client";
import { calculateLabel, getOpinionClass } from "../lib/label-calculator";

export async function Trending() {
  // Fetch real-time data for all people
  const apiDataMap = await fetchMultiplePeopleData(people.map(p => p.slug));

  // Merge static profiles with API data
  const enrichedPeople = people.map(person => {
    const apiData = apiDataMap.get(person.slug);
    const scores = apiData ? {
      approval: apiData.breakdown.approval.score,
      trust: apiData.breakdown.trust.score,
      impact: apiData.breakdown.impact.score,
      controversy: apiData.breakdown.controversy.score,
    } : person.scores;
    
    return {
      ...person,
      scores,
      label: calculateLabel(scores),
      hasLiveData: !!apiData,
    };
  });

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
          {enrichedPeople.map((person) => (
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
