import { Hero } from "@/components/landing/Hero";
import { ParticleBackground } from "@/components/animations/ParticleBackground";
import { StatsPanel } from "@/components/landing/StatsPanel";
import { Roadmap } from "@/components/landing/Roadmap";
import { FAQ } from "@/components/landing/FAQ";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <Hero />
      <StatsPanel />
      <Roadmap />
      <FAQ />
    </div>
  );
}
