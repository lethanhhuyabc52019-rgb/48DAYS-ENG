import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { AboutSolution } from "@/components/sections/AboutSolution";
import { TrustMetrics } from "@/components/sections/TrustMetrics";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { AddinProductSection } from "@/components/sections/AddinProductSection";
import { DynamoSection } from "@/components/sections/DynamoSection";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { WorkflowSection } from "@/components/sections/WorkflowSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
import { ContactBookingSection } from "@/components/sections/ContactBookingSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-slate-100 flex flex-col selection:bg-white selection:text-black">
      <Header />
      <Hero />
      <ProblemSection />
      <AboutSolution />
      <TrustMetrics />
      <ServicesSection />
      <AddinProductSection />
      <DynamoSection />
      <PortfolioSection />
      <TestimonialsSection />
      <WorkflowSection />
      <FaqSection />
      <FinalCtaSection />
      <ContactBookingSection />
      <Footer />
    </main>
  );
}
