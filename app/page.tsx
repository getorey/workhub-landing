import Image from "next/image";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import BotShowcase from "@/components/BotShowcase";
import Comparison from "@/components/Comparison";
import TechStack from "@/components/TechStack";
import Security from "@/components/Security";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* Global fixed background — hub interchange */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/bg-hub.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-40 blur-[1px]"
        />
        <div className="absolute inset-0 bg-gray-950/50" />
      </div>

      <Navbar />
      <main>
        <Hero />
        <Features />
        <BotShowcase />
        <Comparison />
        <TechStack />
        <Security />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
