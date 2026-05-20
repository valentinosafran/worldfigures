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

// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
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
