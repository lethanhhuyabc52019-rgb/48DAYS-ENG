"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import {
  Lightbulb,
  ShieldCheck,
  FolderArchive,
  AlertTriangle,
  Play,
} from "lucide-react";

interface InstallationGuideCardProps {
  className?: string;
  compact?: boolean;
}

export function InstallationGuideCard({
  className = "",
  compact = false,
}: InstallationGuideCardProps) {
  const { lang } = useLanguage();
  const t = translations[lang].tool;

  return (
    <div
      className={`relative rounded-2xl bg-[#0B0C10] border border-[#2A2B36] p-5 sm:p-6 shadow-2xl overflow-hidden backdrop-blur-xl ${className}`}
    >
      {/* Subtle Ambient Glows */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#30D158]/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#2997FF]/5 blur-3xl rounded-full pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-[#2A2B36]/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FF9F0A]/15 border border-[#FF9F0A]/30 flex items-center justify-center text-[#FF9F0A] shadow-inner shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>{t.quickInstallTitle}</span>
            </h4>
            <p className="text-[11px] text-[#86868B] font-mono">
              {t.quickInstallSub}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#30D158]/10 border border-[#30D158]/20 text-[#30D158] text-[10px] font-mono font-medium">
          <ShieldCheck className="w-3 h-3" />
          <span>{t.cleanSafeBadge}</span>
        </div>
      </div>

      {/* 3 Concise Steps Grid / List */}
      <div className="space-y-3 sm:space-y-3.5 text-xs">
        {/* Step 1 */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex items-start gap-3">
          <div className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
            1
          </div>
          <div className="space-y-1 text-left flex-1 min-w-0">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <FolderArchive className="w-3.5 h-3.5 text-[#2997FF]" />
              <span>{t.step1Title}</span>
            </div>
            <p className="text-[#A1A1A6] text-xs leading-relaxed">
              {t.step1Desc1}{" "}
              <code className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[11px] border border-white/15">
                SMOB_Setup.zip
              </code>{" "}
              {t.step1Desc2}
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex items-start gap-3">
          <div className="w-6 h-6 rounded-lg bg-[#FF9F0A]/20 text-[#FF9F0A] font-mono font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5 border border-[#FF9F0A]/30">
            2
          </div>
          <div className="space-y-1.5 text-left flex-1 min-w-0">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#FF9F0A]" />
              <span>{t.step2Title}</span>
            </div>
            <p className="text-[#A1A1A6] text-xs leading-relaxed">
              {t.step2Desc}
            </p>
            {/* Interactive Breadcrumb UI */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[11px] border border-white/20 shadow-sm font-semibold">
                {t.step2MoreOptions}
              </span>
              <span className="text-[#86868B] font-bold text-xs">➔</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[11px] border border-white/20 shadow-sm font-semibold">
                {t.step2Keep}
              </span>
              <span className="text-[#86868B] font-bold text-xs">➔</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#30D158]/20 text-[#30D158] font-mono text-[11px] border border-[#30D158]/30 shadow-sm font-bold">
                {t.step2KeepAnyway}
              </span>
            </div>
            <div className="text-[11px] text-[#86868B] italic pt-0.5">
              ({t.step2Or}{" "}
              <span className="text-[#D1D1D6] font-medium not-italic">
                {t.step2MoreInfo}
              </span>{" "}
              ➔{" "}
              <span className="text-[#30D158] font-medium not-italic">
                {t.step2RunAnyway}
              </span>
              )
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex items-start gap-3">
          <div className="w-6 h-6 rounded-lg bg-[#30D158]/20 text-[#30D158] font-mono font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5 border border-[#30D158]/30">
            3
          </div>
          <div className="space-y-1 text-left flex-1 min-w-0">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-[#30D158]" />
              <span>{t.step3Title}</span>
            </div>
            <p className="text-[#A1A1A6] text-xs leading-relaxed">
              {t.step3Desc1}{" "}
              <code className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[11px] border border-white/15">
                SMOB_Setup.exe
              </code>
              {t.step3Desc2}
              <span className="text-[#30D158] font-mono font-semibold">
                2020 – 2026
              </span>
              {t.step3Desc3}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
