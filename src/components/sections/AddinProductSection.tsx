"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { toolFeatures } from "@/data/toolFeaturesData";
import { DownloadModal } from "@/components/ui/DownloadModal";
import { InteractiveVideoStudio } from "./InteractiveVideoStudio";
import {
  Package,
  Filter,
  Copy,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Download,
  RotateCcw,
  Link2Off,
  Hash,
  Tag,
  Ruler,
  Split,
  Trash2,
  KeyRound,
  Info,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Package: Package,
  Filter: Filter,
  Copy: Copy,
  RotateCcw: RotateCcw,
  Link2Off: Link2Off,
  Hash: Hash,
  Tag: Tag,
  Split: Split,
  Trash2: Trash2,
  Layers: Layers,
  Ruler: Ruler,
  ShieldCheck: ShieldCheck,
  KeyRound: KeyRound,
  Info: Info,
  Sparkles: Sparkles,
};

export function AddinProductSection() {
  const { lang } = useLanguage();
  const t = translations[lang].tool;
  const [activeFeatureId, setActiveFeatureId] = useState<string>("join-unjoin");
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);

  return (
    <section id="smob-tool" className="py-24 lg:py-32 bg-black relative overflow-hidden border-t border-white/10">
      {/* Subtle Glow Backdrops */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#30D158]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-2/3 right-10 w-[500px] h-[300px] bg-[#2997FF]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-[#30D158] bg-[#30D158]/10 border border-[#30D158]/20 mb-4 backdrop-blur-md">
            <Cpu className="w-3.5 h-3.5" />
            <span>{t.tag}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.12] mb-4">
            {t.headline}
          </h2>

          <p className="text-base sm:text-lg text-[#A1A1A6]">
            {t.subheadline}
          </p>
        </div>

        {/* Hero Product Card with Ribbon Preview and Pricing */}
        <div className="apple-glass rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border border-white/15">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Product Value & 49k Pricing */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold text-[#30D158] bg-[#30D158]/10 border border-[#30D158]/20">
                  Autodesk Revit® Extension Suite
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-3">
                  SMOB Productivity Toolbar
                </h3>
              </div>

              {/* Price Callout: 149.000 VNĐ Early Bird */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-[#FF9F0A]/30 space-y-3 relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide bg-[#FF9F0A]/15 text-[#FF9F0A] border border-[#FF9F0A]/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {lang === "en"
                        ? "Early-Bird Launch Special · 50 Slots"
                        : "Ưu Đãi Ra Mắt · Giới Hạn 50 Suất Đầu"}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#FF453A] bg-[#FF453A]/10 px-2.5 py-0.5 rounded-full border border-[#FF453A]/20">
                    {lang === "en" ? "SAVE 77%" : "TIẾT KIỆM 70%"}
                  </span>
                </div>

                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight tabular-nums">
                    {lang === "en" ? "$9 USD" : "149.000 VNĐ"}
                  </span>
                  <span className="text-lg sm:text-xl text-[#86868B] line-through tabular-nums">
                    {lang === "en" ? "$39 USD" : "499.000 VNĐ"}
                  </span>
                  <span className="text-xs text-[#86868B] tabular-nums font-medium">
                    {lang === "en" ? "(~149.000 VNĐ)" : "($9 USD)"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-[#30D158]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.priceTag}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#A1A1A6] leading-relaxed">
                {lang === "en"
                  ? "Directly integrated into Autodesk Revit ribbon. Automate batch renaming, auto-numbering, multi-view filter synchronization, and clean family exporting in 1 click."
                  : "Tích hợp trực tiếp lên thanh Ribbon của Revit. Tự động hóa đổi tên hàng loạt, đánh số cấu kiện, đồng bộ View Filter và trích xuất thư viện Family sạch chỉ trong 1 click."}
              </p>

              {/* Action Buttons: Direct Download (.ZIP) & Modal Center */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="/downloads/SMOB_Setup.zip"
                  download="SMOB_Setup.zip"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-black bg-white hover:bg-[#E8E8ED] shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer group"
                >
                  <Download className="w-4 h-4 text-black group-hover:translate-y-0.5 transition-transform" />
                  <span>{lang === "en" ? "Download SMOB_Setup.zip" : "Tải SMOB_Setup.zip"}</span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-black/10 text-black">
                    1.6 MB
                  </span>
                </a>

                <button
                  onClick={() => setIsDownloadModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-medium text-[#E5E5EA] bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-md transition-all cursor-pointer"
                >
                  <Info className="w-4 h-4 text-[#2997FF]" />
                  <span>{lang === "en" ? "Version Matrix & Notes" : "Lịch Sử & Bộ Cài"}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Ribbon Preview Screenshot */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-white/20 bg-[#0a0a0f] p-4 shadow-2xl space-y-3">
                <div className="text-xs text-[#86868B] flex items-center justify-between pb-2 border-b border-white/10 font-medium">
                  <span className="text-white">Revit Ribbon Tab Preview</span>
                  <span className="text-[#30D158] font-bold">1-Click Automation</span>
                </div>

                {/* Big Toolbar Image Container */}
                <div className="relative w-full rounded-xl overflow-hidden bg-[#16161e] border border-white/10 p-2 sm:p-3 shadow-inner">
                  <Image
                    src="/images/tools/Tool.webp"
                    alt="SMOB Revit Add-in Toolbar - Thanh công cụ Ribbon tự động hóa Autodesk Revit 2020–2026"
                    width={800}
                    height={160}
                    className="w-full h-auto object-contain rounded-lg filter contrast-105"
                    priority
                  />
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#A1A1A6]">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#30D158] animate-pulse" />
                    Revit 2020 – 2026 Compatible
                  </span>
                  <span className="text-white text-[11px] font-medium">
                    {lang === "en" ? "Continuously Updated With New Tools" : "Liên tục cập nhật tính năng mới"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Interactive Video Showcase Hub (Option 1 - YouTube Playlist Integration) */}
        <InteractiveVideoStudio onSelectFeature={(id) => setActiveFeatureId(id)} />

        {/* Feature Bento Grid */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
            <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mb-3">
              {t.modulesTitle}
            </h3>
            <p className="text-sm text-[#A1A1A6] max-w-2xl mx-auto">
              {lang === "en"
                ? "Engineered specifically to remove repetitive clicks in everyday Revit workflows. Future versions will continue to add more powerful tools."
                : "Tập trung giải quyết triệt để các tác vụ nhấp chuột lặp lại hàng ngày. Các phiên bản tiếp theo sẽ tiếp tục được cập nhật thêm nhiều tính năng mới."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {toolFeatures.map((feat) => {
              const Icon = iconMap[feat.icon] || Package;
              const isSelected = feat.id === activeFeatureId;

              return (
                <div
                  key={feat.id}
                  onClick={() => setActiveFeatureId(feat.id)}
                  className={`p-7 rounded-3xl border transition-all duration-200 cursor-pointer text-left flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#16161e] border-white/40 shadow-xl"
                      : "apple-glass-card hover:border-white/20"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                          isSelected ? "bg-white text-black" : "bg-white/10 text-white"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs text-[#6E6E73] font-medium">
                        {feat.number.padStart(3, "0")}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white mb-2.5">
                      {feat.title[lang]}
                    </h4>

                    <div className="space-y-2 text-xs leading-relaxed">
                      <div className="text-[#86868B]">
                        <span className="text-[#FF453A] font-medium">
                          {lang === "en" ? "Pain: " : "Vấn đề: "}
                        </span>
                        {feat.problem[lang]}
                      </div>

                      <div className="text-[#E5E5EA]">
                        <span className="text-[#2997FF] font-medium">
                          {lang === "en" ? "Solution: " : "Giải pháp: "}
                        </span>
                        {feat.solution[lang]}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-white/5 text-xs text-[#30D158] font-medium">
                    {feat.value[lang]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Download Center Modal Popup */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </section>
  );
}
