"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { dynamoData } from "@/data/dynamoData";
import { ChevronLeft, ChevronRight, Cpu } from "lucide-react";

export function DynamoSection() {
  const { lang } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalItems = dynamoData.length;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalItems - 1 ? 0 : prev + 1));
  };

  const currentItem = dynamoData[currentIndex];

  return (
    <section id="dynamo" className="py-20 lg:py-28 bg-[#050508] relative overflow-hidden text-left border-t border-white/10">
      {/* Background Video / Ambient Lighting - Ready for future custom Dynamo video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-[1px] scale-105"
        >
          <source src="/videos/intro-smob.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-[#050508]/85 to-[#050508]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#2997FF]/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#2997FF]/30 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#2997FF] bg-[#2997FF]/10 border border-[#2997FF]/20 mb-3 backdrop-blur-md">
              <Cpu className="w-3.5 h-3.5" />
              <span>{lang === "en" ? "COMPUTATIONAL DESIGN & AUTOMATION" : "TỰ ĐỘNG HÓA THUẬT TOÁN DYNAMO"}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
              {lang === "en" ? "Dynamo & Revit Automation" : "Tự Động Hóa Dynamo & Thuật Toán Xử Lý Dữ Liệu"}
            </h2>
          </div>

          <div className="max-w-xl text-left lg:text-right">
            <p className="text-sm sm:text-base text-[#A1A1A6] leading-relaxed">
              {lang === "en"
                ? "Custom visual programming graphs engineered to eliminate hours of manual modeling, auto-generate geometry, and accelerate delivery."
                : "Phát triển các kịch bản Dynamo thuật toán chuyên sâu giúp giải phóng hoàn toàn sức lao động, xử lý dữ liệu thông minh và tăng tốc độ ra bản vẽ vượt trội."}
            </p>
          </div>
        </div>

        {/* Pure High-Def Visual Dynamo Showcase Slider */}
        <div className="relative">
          {/* Main Showcase Image Container */}
          <div className="bg-[#0b0c10]/95 backdrop-blur-2xl border border-white/15 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300">
            {/* Big Crisp Node Image Area */}
            <div className="relative w-full h-[320px] sm:h-[480px] md:h-[600px] lg:h-[650px] bg-[#020204] overflow-hidden group">
              <Image
                src={currentItem.image}
                alt={currentItem.title[lang]}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-contain p-2 sm:p-4 group-hover:scale-[1.01] transition-transform duration-500"
                priority
              />

              {/* Script Counter Badge */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/85 border border-white/20 backdrop-blur-md text-xs font-mono text-white shadow-lg">
                <span className="w-2 h-2 rounded-full bg-[#30D158] animate-pulse" />
                <span>Script 0{currentItem.number} / 0{totalItems}</span>
              </div>
            </div>
          </div>

          {/* Navigation Controls Floating at Bottom */}
          <div className="flex items-center justify-between gap-4 mt-6">
            {/* Left Button */}
            <button
              onClick={handlePrev}
              className="p-3 sm:p-3.5 rounded-full bg-black/80 hover:bg-white/10 text-[#2997FF] hover:text-[#00E5FF] border border-white/15 transition-all shadow-lg hover:scale-110 active:scale-95 cursor-pointer flex items-center gap-2 text-xs font-semibold"
              aria-label="Previous Dynamo Graph"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              <span className="hidden sm:inline">{lang === "en" ? "Previous" : "Trước"}</span>
            </button>

            {/* Slider Indicator Dots */}
            <div className="flex items-center gap-2">
              {dynamoData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx ? "w-8 bg-[#2997FF]" : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Right Button */}
            <button
              onClick={handleNext}
              className="p-3 sm:p-3.5 rounded-full bg-black/80 hover:bg-white/10 text-[#2997FF] hover:text-[#00E5FF] border border-white/15 transition-all shadow-lg hover:scale-110 active:scale-95 cursor-pointer flex items-center gap-2 text-xs font-semibold"
              aria-label="Next Dynamo Graph"
            >
              <span className="hidden sm:inline">{lang === "en" ? "Next" : "Tiếp theo"}</span>
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
