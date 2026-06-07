import { Footer } from "../../components/footer";
import { Navbar } from "../../components/navbar";
import { Top100DashboardClient } from "../../components/top-100-dashboard-client";

// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Top100Page({
  searchParams,
}: {
  searchParams?: { category?: string; country?: string };
}) {
  const initialCategory = searchParams?.category || 'all';
  const initialCountry = searchParams?.country || 'all';

  return (
    <main>
      <Navbar />
      <Top100DashboardClient
        initialCategory={initialCategory}
        initialCountry={initialCountry}
      />
      <Footer />
    </main>
  );
}