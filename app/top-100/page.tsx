import { Footer } from "../../components/footer";
import { Navbar } from "../../components/navbar";
import { Top100Dashboard } from "../../components/top-100-dashboard";

export default async function Top100Page() {
  return (
    <main>
      <Navbar />
      <Top100Dashboard />
      <Footer />
    </main>
  );
}