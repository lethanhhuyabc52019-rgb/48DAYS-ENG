"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { portfolioProjects } from "@/data/portfolioData";
import { ProjectItem } from "@/types";
import { ProjectModal } from "@/components/ui/ProjectModal";
import { ChevronLeft, ChevronRight, Eye, ArrowUpRight } from "lucide-react";

export function PortfolioSection() {
  const { lang } = useLanguage();
  const t = translations[lang].portfolio;

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const filteredProjects =
    activeCategory === "all"
      ? portfolioProjects
      : portfolioProjects.filter((p) => p.category === activeCategory);

  const categories = [
    { id: "all", label: t.filterAll },
    { id: "modeling", label: t.filterModeling },
    { id: "documentation", label: t.filterDocumentation },
    { id: "families", label: t.filterFamilies },
  ];

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setCurrentSlideIndex(0);
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % filteredProjects.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
  };

  const activeProject = filteredProjects[currentSlideIndex] || filteredProjects[0];

  return (
    <section id="portfolio" className="py-24 lg:py-32 bg-black relative overflow-hidden border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#2997FF] mb-3 inline-block">
            {t.tag}
          </span>

          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.12] mb-4">
            {t.headline}
          </h2>

          <p className="text-base sm:text-lg text-[#A1A1A6]">
            {t.subheadline}
          </p>
        </div>

        {/* Apple Segmented Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-12 p-1.5 bg-[#14141a] border border-white/10 rounded-full max-w-fit mx-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-[13px] font-medium transition-all duration-200 ${
                activeCategory === cat.id
                  ? "bg-white text-black font-semibold shadow-md"
                  : "text-[#86868B] hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Featured Project Slide Card */}
        {activeProject && (
          <div className="apple-glass rounded-3xl overflow-hidden shadow-2xl mb-10 transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Left Column: Big Project Photo Viewport */}
              <div
                className="lg:col-span-7 relative min-h-[360px] sm:min-h-[440px] lg:min-h-[500px] bg-[#121218] border-b lg:border-b-0 lg:border-r border-white/10 cursor-pointer group flex items-center justify-center overflow-hidden"
                onClick={() => setSelectedProject(activeProject)}
              >
                <Image
                  src={activeProject.coverImage}
                  alt={activeProject.title[lang]}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-contain p-2 sm:p-4 group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:hidden" />

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="apple-pill-btn px-4 py-2 bg-white text-black text-xs font-semibold flex items-center gap-2 shadow-xl">
                    <Eye className="w-4 h-4" />
                    {lang === "en" ? "View Full Gallery" : "Xem Toàn Bộ Ảnh"}
                  </span>
                </div>

                {/* Photo Counter */}
                <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/70 border border-white/10 text-xs font-medium text-[#A1A1A6] tabular-nums">
                  {activeProject.galleryImages.length} {lang === "en" ? "Photos" : "Ảnh thật"}
                </div>
              </div>

              {/* Right Column: Project Meta & Summary */}
              <div className="lg:col-span-5 p-7 sm:p-9 lg:p-10 flex flex-col justify-between text-left space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2997FF]">
                      {activeProject.category}
                    </span>
                    <span className="text-xs text-[#86868B] font-medium tabular-nums">
                      0{currentSlideIndex + 1} / 0{filteredProjects.length}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                    {activeProject.title[lang]}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#A1A1A6] font-normal leading-relaxed mb-6">
                    {activeProject.brief[lang]}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-white/10">
                    <div className="text-xs text-[#86868B] font-semibold">
                      {t.deliverablesLabel}:
                    </div>
                    {activeProject.deliverables[lang].slice(0, 2).map((item, idx) => (
                      <div key={idx} className="text-xs text-[#E5E5EA] leading-relaxed">
                        • {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
                  <button
                    onClick={() => setSelectedProject(activeProject)}
                    className="apple-pill-btn inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-black bg-white hover:bg-slate-200 transition-all"
                  >
                    <span>{t.viewProject}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevSlide}
                      className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                      aria-label="Next"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Thumbnail Selector Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {filteredProjects.map((proj, idx) => (
            <button
              key={proj.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`p-2 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
                currentSlideIndex === idx
                  ? "bg-[#16161e] border-white/40 shadow-lg scale-102"
                  : "bg-white/[0.02] border-white/10 opacity-60 hover:opacity-100"
              }`}
            >
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-black">
                <Image src={proj.coverImage} alt={proj.title[lang]} fill className="object-cover" />
              </div>
              <div className="text-[11px] font-medium text-[#E5E5EA] truncate">
                {proj.title[lang]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
