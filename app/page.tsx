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

      return {
        ...person,
        scores: {
          approval: apiData.breakdown.approval.score,
          trust: apiData.breakdown.trust.score,
          impact: apiData.breakdown.impact.score,
          controversy: apiData.breakdown.controversy.score,
        },
      };
    }
    
    return person;
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

  // Select trending people (highest impact + recent trend)
  const trendingPeople = [...enrichedPeople]
    .sort((a, b) => {
      const scoreA = a.scores.impact * 0.7 + Math.abs(a.trend7d) * 10;
      const scoreB = b.scores.impact * 0.7 + Math.abs(b.trend7d) * 10;
      return scoreB - scoreA;
    })
    .slice(0, 3)
    .map(person => ({
      name: person.name,
      slug: person.slug,
      image: person.image,
      opinion: person.label,
      delta: person.trend7d,
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
