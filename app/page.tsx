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
import { fetchMultiplePeopleData } from "../lib/api-client";
import { people } from "../data/people";
import { calculateLabel } from "../lib/label-calculator";

// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  // Fetch live data for all people
  const apiDataMap = await fetchMultiplePeopleData(people.map(p => p.slug));

  // Calculate benchmark stats (averages across all people)
  let totalApproval = 0;
  let totalTrust = 0;
  let totalImpact = 0;
  let totalControversy = 0;
  let count = 0;

  const enrichedPeople = people.map(person => {
    const apiData = apiDataMap.get(person.slug);
    
    if (apiData) {
      totalApproval += apiData.breakdown.approval.score;
      totalTrust += apiData.breakdown.trust.score;
      totalImpact += apiData.breakdown.impact.score;
      totalControversy += apiData.breakdown.controversy.score;
      count++;

      const scores = {
        approval: apiData.breakdown.approval.score,
        trust: apiData.breakdown.trust.score,
        impact: apiData.breakdown.impact.score,
        controversy: apiData.breakdown.controversy.score,
      };

      // Calculate signal movement from movement7d data
      let signalMovement = 0;
      if (apiData.movement7d) {
        // Signal formula: Impact×0.65 + Controversy×0.30 + (Approval+Trust)×0.05
        signalMovement = Math.round(
          apiData.movement7d.impact * 0.65 +
          apiData.movement7d.controversy * 0.30 +
          (apiData.movement7d.approval + apiData.movement7d.trust) * 0.025
        );
      }

      return {
        ...person,
        scores,
        label: calculateLabel(scores),
        movement: signalMovement,
        hasMovementData: !!apiData.movement7d,
      };
    }
    
    return { ...person, movement: 0, hasMovementData: false };
  });

  const benchmarkStats = count > 0 ? [
    { label: "Approval", value: Math.round(totalApproval / count) },
    { label: "Trust", value: Math.round(totalTrust / count) },
    { label: "Impact", value: Math.round(totalImpact / count) },
    { label: "Controversy", value: Math.round(totalControversy / count) },
  ] : [
    { label: "Approval", value: 72 },
    { label: "Trust", value: 64 },
    { label: "Impact", value: 88 },
    { label: "Controversy", value: 39 },
  ];

  // Select trending people (highest signal score from API)
  const trendingPeople = [...enrichedPeople]
    .filter(person => apiDataMap.has(person.slug))
    .map(person => {
      const apiData = apiDataMap.get(person.slug)!;
      return {
        ...person,
        signalScore: apiData.signalScore,
      };
    })
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
