"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { AlertCircle, XCircle, BrainCircuit, HelpCircle, Compass, Flame } from "lucide-react";

export const ProblemSection: React.FC = () => {
  const { t } = useLanguage();

  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Compass className="w-5 h-5 text-orange-400" />;
      case 1:
        return <BrainCircuit className="w-5 h-5 text-red-400" />;
      case 2:
        return <HelpCircle className="w-5 h-5 text-amber-400" />;
      case 3:
        return <XCircle className="w-5 h-5 text-rose-400" />;
      case 4:
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return <Flame className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{t.problem.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            {t.problem.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            {t.problem.subtitle}
          </p>
        </div>

        {/* 6 Bento Grid Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.problem.items.map((item, index) => (
            <div
              key={index}
              className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl hover:bg-white/[0.06] hover:border-white/20 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getIcon(index)}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
