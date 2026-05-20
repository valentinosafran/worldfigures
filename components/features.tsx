const items = [
  {
    title: "Source-based profiles",
    text: "Each figure is evaluated from visible, explainable sources such as polling, public reporting, expert indexes, and coverage patterns.",
  },
  {
    title: "Multi-dimensional scoring",
    text: "We do not reduce a person to good or bad. WorldFigures shows approval, trust, impact, and controversy separately.",
  },
  {
    title: "Global perspective",
    text: "Track world leaders, politicians, and influential public figures across countries, regions, and time.",
  },
];

export function Features() {
  return (
    <section className="section">
      <div className="container">
        <div className="sectionHeading">
          <span>What WorldFigures does</span>
          <h2>A clearer view of public reputation</h2>
        </div>

        <div className="cardGrid three">
          {items.map((item) => (
            <article className="infoCard" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}