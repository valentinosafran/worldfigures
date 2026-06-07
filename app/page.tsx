import { Navbar } from "../components/navbar";
import { Hero } from "../components/hero";
import { Features } from "../components/features";
import { Trending } from "../components/trending";
import { Scoring } from "../components/scoring";
import { Categories } from "../components/categories";
import { ProfilePreview } from "../components/profile-preview";
import { PremiumAccess } from "../components/premium-access";
import { TrustSection } from "../components/trust-section";
import { CTA } from "../components/cta";
import { Footer } from "../components/footer";
import { people } from "../data/people";
import { calculateLabel } from "../lib/label-calculator";

function getStaticSignalScore(scores: {
  approval: number;
  trust: number;
  impact: number;
  controversy: number;
}, trend7d: number) {
  const movementBonus = Math.min(Math.abs(trend7d) * 1.2, 12);
  const base = (scores.impact * 0.65) + (scores.controversy * 0.3) + (((scores.approval + scores.trust) / 2) * 0.05);
  return Math.round(base + movementBonus);
}

export default function HomePage() {
  // Calculate benchmark stats (averages across all people)
  let totalApproval = 0;
  let totalTrust = 0;
  let totalImpact = 0;
  let totalControversy = 0;

  const enrichedPeople = people.map(person => {
    totalApproval += person.scores.approval;
    totalTrust += person.scores.trust;
    totalImpact += person.scores.impact;
    totalControversy += person.scores.controversy;

    return {
      ...person,
      label: calculateLabel(person.scores),
      movement: person.trend7d,
      hasMovementData: true,
      signalScore: getStaticSignalScore(person.scores, person.trend7d),
    };
  });

  const benchmarkStats = [
    { label: "Approval", value: Math.round(totalApproval / people.length) },
    { label: "Trust", value: Math.round(totalTrust / people.length) },
    { label: "Impact", value: Math.round(totalImpact / people.length) },
    { label: "Controversy", value: Math.round(totalControversy / people.length) },
  ];

  // Select trending people from static snapshot for zero-blocking first paint
  const trendingPeople = [...enrichedPeople]
    .sort((a, b) => b.signalScore - a.signalScore)
    .slice(0, 3)
    .map(person => ({
      name: person.name,
      slug: person.slug,
      image: person.image,
      opinion: person.label,
      delta: person.movement,
      hasMovementData: person.hasMovementData,
    }));

  return (
    <main>
      <Navbar />
      <Hero benchmarkStats={benchmarkStats} trendingPeople={trendingPeople} />
      <Features />
      <Trending />
      <Scoring />
      <Categories />
      <ProfilePreview />
      <PremiumAccess />
      <TrustSection />
      <CTA />
      <Footer />
    </main>
  );
}
