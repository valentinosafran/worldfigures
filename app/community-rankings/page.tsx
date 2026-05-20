import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";
import { CommunityRankingsClient } from "../../components/community-rankings-client";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function CommunityRankingsPage() {
  return (
    <main>
      <Navbar />
      <CommunityRankingsClient />
      <Footer />
    </main>
  );
}
