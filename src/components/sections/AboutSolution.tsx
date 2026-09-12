"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { Check, ArrowUpRight, Cpu } from "lucide-react";

export function AboutSolution() {
  const { lang } = useLanguage();
  const t = translations[lang].about;

  return (
    <section id="about" className="py-24 lg:py-32 bg-black relative overflow-hidden border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Story & Principles */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#2997FF]">
              {t.tag}
            </span>

            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.12]">
              {t.headline}
            </h2>

            <p className="text-lg sm:text-xl text-[#E5E5EA] font-normal leading-relaxed">
              {t.lead}
            </p>

            <div className="space-y-4 text-sm sm:text-base text-[#A1A1A6] leading-relaxed">
              <p>{t.p1}</p>
              <p>{t.p2}</p>
            </div>

            {/* Apple Check Bullet Points */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {t.bullets.map((bullet) => (
                <div key={bullet} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#30D158]" />
                  </div>
                  <span className="text-xs sm:text-sm text-[#E5E5EA]">{bullet}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center gap-4">
              <a
                href="#services"
                className="apple-pill-btn inline-flex items-center gap-1.5 px-6 py-3 rounded-full text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all"
              >
                <span>{lang === "en" ? "Explore Services" : "Xem Các Dịch Vụ"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Apple Obsidian Showcase Card */}
          <div className="lg:col-span-5">
            <div className="apple-glass p-7 sm:p-8 rounded-3xl space-y-6 shadow-2xl">
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white">
                    <Cpu className="w-5 h-5 text-[#2997FF]" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-semibold text-white tracking-tight">
                      {t.badgeTitle}
                    </h4>
                    <p className="text-[11px] text-[#86868B]">{t.badgeDesc}</p>
                  </div>
                </div>
              </div>

              {/* Quick Metrics Summary */}
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/5">
                  <div className="text-xl font-bold text-white font-mono">70%–90%</div>
                  <div className="text-[11px] text-[#86868B] mt-0.5">
                    {lang === "en" ? "Time saved on clicks" : "Tiết kiệm thao tác lặp lại"}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/5">
                  <div className="text-xl font-bold text-[#30D158] font-mono">&lt; 3 Giây</div>
                  <div className="text-[11px] text-[#86868B] mt-0.5">
                    {lang === "en" ? "Batch execution speed" : "Tốc độ xử lý hàng loạt"}
                  </div>
                </div>
              </div>

              {/* Real Tool UI Thumbnail */}
              <div className="rounded-2xl overflow-hidden border border-white/15 bg-[#16161e] p-2.5 shadow-inner">
                <div className="text-[10px] font-mono text-[#6E6E73] flex items-center justify-between pb-1.5 border-b border-white/5 mb-1.5">
                  <span className="text-[#A1A1A6]">Revit Ribbon Add-in</span>
                  <span className="text-[#30D158] font-bold">1-Click Tools</span>
                </div>
                <Image
                  src="/images/tools/Tool.webp"
                  alt="SMOB Tool UI - Giao diện thanh công cụ tự động hóa Revit Add-in"
                  width={600}
                  height={120}
                  className="w-full h-auto object-contain rounded-lg filter contrast-105"
                />
              </div>

              {/* Status Pill */}
              <div className="pt-2 flex items-center justify-between text-xs text-[#86868B]">
                <span className="text-[#30D158] font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#30D158]" />
                  Production Tested
                </span>
                <span>Revit 2020 – 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
