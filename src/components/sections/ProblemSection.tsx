"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import {
  MousePointerClick,
  Hash,
  EyeOff,
  Layers,
  Ruler,
  FolderArchive,
  ArrowRight,
} from "lucide-react";

export function ProblemSection() {
  const { lang } = useLanguage();
  const t = translations[lang].problem;

  const painIcons = [
    MousePointerClick,
    Hash,
    EyeOff,
    Layers,
    Ruler,
    FolderArchive,
  ];

  return (
    <section className="py-24 lg:py-32 bg-black relative overflow-hidden border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FF453A] mb-3 inline-block">
            {t.tag}
          </span>

          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.12] mb-6">
            {t.headline}
          </h2>

          <p className="text-base sm:text-lg text-[#A1A1A6] leading-relaxed">
            {t.subheadline}
          </p>
        </div>

        {/* 6 Minimalist Bento Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-12">
          {t.painPoints.map((item, idx) => {
            const Icon = painIcons[idx % painIcons.length];
            return (
              <div
                key={item.title}
                className="apple-glass-card p-7 sm:p-8 rounded-3xl transition-all duration-300 flex flex-col justify-between group hover:border-white/20"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-[#FF453A]" />
                    </div>
                    <span className="text-xs font-semibold text-white/30 tracking-wider">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2.5 tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-sm text-[#A1A1A6] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Apple-style Manifesto Banner */}
        <div className="rounded-3xl apple-glass p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left space-y-1.5">
            <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {lang === "en"
                ? "Turn hours of manual drafting into instant 1-click execution."
                : "Biến hàng giờ thao tác thủ công thành quy trình 1-click tức thì."}
            </h4>
            <p className="text-sm text-[#A1A1A6]">
              {lang === "en"
                ? "Built by BIM engineers who know real-world project deadlines."
                : "Phát triển bởi đội ngũ kỹ sư BIM thấu hiểu áp lực tiến độ dự án thực tế."}
            </p>
          </div>

          <a
            href="#smob-tool"
            className="apple-pill-btn shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-black bg-white hover:bg-slate-200 transition-all"
          >
            <span>{lang === "en" ? "Explore Solutions" : "Xem Giải Pháp"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
