"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ProjectItem } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { X, ChevronLeft, ChevronRight, Check, Layers, Cpu } from "lucide-react";

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { lang } = useLanguage();
  const t = translations[lang].portfolio;
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const currentImage = project.galleryImages[activeImageIndex] || project.coverImage;

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % project.galleryImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + project.galleryImages.length) % project.galleryImages.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-black/85 backdrop-blur-2xl overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-5xl bg-[#0d0d12] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-6 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/60">
          <div>
            <span className="text-[11px] font-mono text-[#2997FF] uppercase tracking-wider font-semibold">
              {project.category.toUpperCase()}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {project.title[lang]}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 text-[#A1A1A6] hover:text-white hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-7">
          {/* Main Photo Viewport */}
          <div className="relative rounded-2xl overflow-hidden bg-black border border-white/10 aspect-[16/10] sm:aspect-[16/9]">
            <Image
              src={currentImage}
              alt={project.title[lang]}
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-contain"
            />

            {/* Prev / Next Arrows */}
            {project.galleryImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 text-white hover:bg-white hover:text-black border border-white/15 transition-all shadow-lg"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 text-white hover:bg-white hover:text-black border border-white/15 transition-all shadow-lg"
                  aria-label="Next"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Counter Pill */}
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/80 border border-white/10 text-xs font-mono text-[#A1A1A6]">
                  {activeImageIndex + 1} / {project.galleryImages.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Gallery Strip */}
          {project.galleryImages.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {project.galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIndex === idx
                      ? "border-white scale-105 shadow-md"
                      : "border-white/10 opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/10">
            {/* The Brief & Tools */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#A1A1A6] font-semibold">
                {t.briefLabel}
              </h4>
              <p className="text-sm text-[#E5E5EA] leading-relaxed">
                {project.brief[lang]}
              </p>

              <div className="pt-3">
                <div className="text-xs text-[#86868B] mb-2">{t.toolsLabel}:</div>
                <div className="flex flex-wrap gap-1.5">
                  {project.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-white/[0.05] text-[#A1A1A6] border border-white/10"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Deliverables & Outcomes */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#A1A1A6] font-semibold mb-2.5">
                  {t.deliverablesLabel}
                </h4>
                <ul className="space-y-2">
                  {project.deliverables[lang].map((item, i) => (
                    <li key={i} className="text-xs text-[#E5E5EA] flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#30D158] shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#FF9F0A] font-semibold mb-1.5">
                  {t.keyResultsLabel}
                </h4>
                <ul className="space-y-1">
                  {project.keyResults[lang].map((res, i) => (
                    <li key={i} className="text-xs text-[#FFD60A]">
                      ✓ {res}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-black/60">
          <span className="text-xs text-[#86868B]">
            {lang === "en" ? "Production deliverable" : "Sản phẩm thực tế"}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="apple-pill-btn px-4 py-2 rounded-full text-xs font-medium text-[#A1A1A6] hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              {t.modalClose}
            </button>
            <a
              href="#contact"
              onClick={onClose}
              className="apple-pill-btn px-4 py-2 rounded-full text-xs font-semibold text-black bg-white hover:bg-slate-200 transition-colors"
            >
              {lang === "en" ? "Request Similar Project" : "Tư vấn dự án tương tự"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
