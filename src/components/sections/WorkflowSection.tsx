"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Clock, Play, BookOpen, CheckSquare, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export const WorkflowSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Clock className="w-3.5 h-3.5" />
            <span>{t.workflow.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            {t.workflow.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            {t.workflow.subtitle}
          </p>
        </div>

        {/* 4 Steps Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {t.workflow.steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:bg-white/[0.06] hover:border-cyan-400/30 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 font-mono mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base bg-gradient-to-r from-blue-500 to-cyan-400 text-black shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all"
          >
            <span>Bắt Đầu Ngày 01 Ngay Bây Giờ</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
