import Header from "@/components/header";
import HeroSection from "@/components/section/hero-section";
import BridgeSection from "@/components/bridge-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-montserrat">
      <Header />
      <main>
        <HeroSection />
        <BridgeSection />
      </main>
    </div>
  );
}
