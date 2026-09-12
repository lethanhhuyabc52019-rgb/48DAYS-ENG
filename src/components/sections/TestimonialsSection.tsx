"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { testimonialsData } from "@/data/testimonialsData";
import { ChevronLeft, ChevronRight, Star, CheckCircle } from "lucide-react";

export function TestimonialsSection() {
  const { lang } = useLanguage();
  const t = translations[lang].testimonials;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const totalItems = testimonialsData.length;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalItems - 2 : prev - 2 < 0 ? 0 : prev - 2));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 2 >= totalItems ? 0 : prev + 2));
  };

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 2 cards per view on desktop
  const item1 = testimonialsData[currentIndex];
  const item2 = testimonialsData[(currentIndex + 1) % totalItems];
  const activePair = [item1, item2];

  return (
    <section id="reviews" className="py-20 lg:py-28 bg-black relative overflow-hidden text-left border-t border-white/10">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#30D158]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header: Clean Bold "Testimonials" & Verified Subtitle */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#30D158]/30 mb-10">
          <div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
              {t.headline}
            </h2>
          </div>

          <div className="max-w-xl text-left lg:text-right">
            <p className="text-sm sm:text-base text-[#A1A1A6] leading-relaxed">
              {t.subheadline}
            </p>
          </div>
        </div>

        {/* Testimonials Slider Area with Left/Right Arrows */}
        <div className="relative flex items-center gap-3 sm:gap-6">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="shrink-0 p-2.5 sm:p-3.5 rounded-full bg-black/80 hover:bg-white/10 text-[#30D158] hover:text-[#4cd964] border border-white/15 transition-all shadow-lg hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="Previous Testimonials"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 stroke-[2.5]" />
          </button>

          {/* Cards Grid: 2 columns on desktop, 1 on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {activePair.map((item, idx) => {
              const isExpanded = !!expandedCards[item.id];
              return (
                <div
                  key={`${item.id}-${idx}`}
                  className="bg-[#0b0c10] border border-white/10 hover:border-white/20 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 relative group"
                >
                  <div className="space-y-4">
                    {/* Upwork Style Client Header */}
                    <div className="flex items-center gap-4">
                      {/* Client Avatar Photo */}
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-white/20 shrink-0 bg-[#16161e] shadow-lg">
                        <Image
                          src={item.author.avatarImage}
                          alt={item.author.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>

                      {/* Client Name, Stars & Location */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                            {item.author.name}
                          </h3>
                        </div>

                        {/* Stars & Location (Upwork Style) */}
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex items-center gap-0.5 text-[#FF9F0A]">
                            {[...Array(item.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-[#FF9F0A]" />
                            ))}
                          </div>
                          <span className="text-xs text-[#86868B]">·</span>
                          <span className="text-xs text-[#A1A1A6] font-medium truncate">
                            {item.author.location}
                          </span>
                        </div>

                        {/* Date if present */}
                        {item.date && (
                          <div className="text-[11px] font-mono text-[#6E6E73]">
                            {item.date}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Project Scope / Discipline Tag */}
                    <div className="inline-block px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-[#30D158]/10 text-[#30D158] border border-[#30D158]/20">
                      ✓ {item.projectType[lang]}
                    </div>

                    {/* Review Feedback Text */}
                    <p className={`text-xs sm:text-sm text-[#E5E5EA] leading-relaxed font-normal ${isExpanded ? "" : "line-clamp-4"}`}>
                      &ldquo;{item.content[lang]}&rdquo;
                    </p>

                    {/* Green More Pill Button */}
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="px-3.5 py-1 rounded-full text-xs font-semibold text-[#30D158] bg-[#30D158]/15 hover:bg-[#30D158]/25 border border-[#30D158]/25 transition-all inline-block cursor-pointer"
                    >
                      {isExpanded ? t.lessButton : t.moreButton}
                    </button>
                  </div>

                  {/* Verified Footer Pill */}
                  <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between text-xs text-[#86868B]">
                    <span className="flex items-center gap-1.5 text-[#30D158] font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {lang === "en" ? "Verified Client Review" : "Đánh giá đã xác thực"}
                    </span>
                    <span className="font-mono text-[11px] text-[#FF9F0A]">
                      ★ 5.0 / 5.0
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="shrink-0 p-2.5 sm:p-3.5 rounded-full bg-black/80 hover:bg-white/10 text-[#30D158] hover:text-[#4cd964] border border-white/15 transition-all shadow-lg hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="Next Testimonials"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 stroke-[2.5]" />
          </button>
        </div>

        {/* Counter & Indicator Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-4 border-t border-white/5 text-xs text-[#86868B]">
          <div className="font-mono">
            {lang === "en" ? "Showing" : "Đang hiển thị"}{" "}
            <span className="text-white font-bold">
              {currentIndex + 1}–{Math.min(currentIndex + 2, totalItems)}
            </span>{" "}
            / <span className="text-white">{totalItems}</span> {lang === "en" ? "client reviews" : "đánh giá thực tế"}
          </div>

          {/* Dot Indicators */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: Math.ceil(totalItems / 2) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx * 2)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  Math.floor(currentIndex / 2) === idx ? "w-6 bg-[#30D158]" : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
