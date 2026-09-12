"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { BookOpen, CheckCircle, Play, ChevronRight, Layers, ArrowRight } from "lucide-react";
import { sampleCurriculumUnits } from "@/data/curriculumData";

export const CurriculumSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeStage, setActiveStage] = useState<number>(1);

  const stages = t.curriculum.stages;

  return (
    <section id="curriculum" className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.curriculum.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            {t.curriculum.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            {t.curriculum.subtitle}
          </p>
        </div>

        {/* 4 Stage Selector Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {stages.map((st) => (
            <button
              key={st.stage}
              onClick={() => setActiveStage(st.stage)}
              className={`p-5 rounded-2xl border text-left transition-all ${
                activeStage === st.stage
                  ? "bg-white/10 border-cyan-400/50 shadow-lg shadow-cyan-500/10"
                  : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white/10 text-cyan-400">
                  {st.range}
                </span>
                <span className="text-xs text-slate-400 font-mono">Stage {st.stage}</span>
              </div>
              <h3 className="text-sm font-bold text-white line-clamp-2">
                {st.name.split(":")[1]?.trim() || st.name}
              </h3>
            </button>
          ))}
        </div>

        {/* Active Stage Content Display */}
        {stages
          .filter((st) => st.stage === activeStage)
          .map((st) => (
            <div
              key={st.stage}
              className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl mb-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    {st.range}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1">{st.name}</h3>
                  <p className="text-sm text-slate-400 mt-2 max-w-2xl">{st.desc}</p>
                </div>
                <Link
                  href="/app"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-cyan-400 text-black hover:bg-cyan-300 transition-colors shrink-0"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>Học Giai Đoạn {st.stage} Ngay</span>
                </Link>
              </div>

              {/* Sample Units Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleCurriculumUnits
                  .filter((u) => u.stage === activeStage)
                  .map((unit) => (
                    <div
                      key={unit.id}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-400/30 hover:bg-white/[0.05] transition-all flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {unit.unitNumber}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          {language === "vi" ? unit.titleVi : unit.titleEn}
                        </h4>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle className="w-3 h-3" />
                            {unit.questionCount} câu hỏi
                          </span>
                          <span>•</span>
                          <span className="text-blue-400">Video HD</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}

        {/* Action Link to Full 48 Units */}
        <div className="text-center">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
          >
            <span>Xem đầy đủ 48 Units và bắt đầu học ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
