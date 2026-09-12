import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { AboutSolution } from "@/components/sections/AboutSolution";
import { TrustMetrics } from "@/components/sections/TrustMetrics";
import { CurriculumSection } from "@/components/sections/CurriculumSection";
import { InteractiveVerbStudio } from "@/components/sections/InteractiveVerbStudio";
import { ExamEngineSection } from "@/components/sections/ExamEngineSection";
import { WorkflowSection } from "@/components/sections/WorkflowSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-slate-100 flex flex-col selection:bg-cyan-400 selection:text-black">
      <Header />
      <Hero />
      <ProblemSection />
      <AboutSolution />
      <TrustMetrics />
      <CurriculumSection />
      <InteractiveVerbStudio />
      <ExamEngineSection />
      <WorkflowSection />
      <TestimonialsSection />
      <FaqSection />
      <FinalCtaSection />
      <Footer />
    </main>
  );
}
