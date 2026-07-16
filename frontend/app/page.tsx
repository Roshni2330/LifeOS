import Navbar from "@/components/layout/Navbar";
import Hero from "@/sections/hero/Hero";
import HowItWorks from "@/sections/how-it-works/HowItWorks";
import Features from "@/sections/features/Features";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
    </main>
  );
}