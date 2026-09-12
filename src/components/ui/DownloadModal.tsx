"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/data/translations";
import { releaseVersions, systemRequirements } from "@/data/versionData";
import { InstallationGuideCard } from "@/components/ui/InstallationGuideCard";
import {
  X,
  Download,
  ShieldCheck,
  CheckCircle2,
  HardDrive,
  Check,
  History,
  Laptop,
  FileCode,
  Trash2,
} from "lucide-react";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DownloadModal({ isOpen, onClose }: DownloadModalProps) {
  const { lang } = useLanguage();
  const t = translations[lang].tool;
  const [selectedVersion, setSelectedVersion] = useState<string>(releaseVersions[0].version);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentVersionData =
    releaseVersions.find((v) => v.version === selectedVersion) || releaseVersions[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-black/85 backdrop-blur-2xl overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#0d0d12] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto text-left max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-30 p-2.5 rounded-full bg-white/10 text-[#A1A1A6] hover:text-white hover:bg-white/20 transition-all cursor-pointer backdrop-blur-md"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 lg:p-10 overflow-y-auto space-y-8 custom-scrollbar pt-8">
          {/* Main Title & Overview */}
          <div className="text-left space-y-2 pr-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {t.downloadTitle}
            </h3>
            <p className="text-xs sm:text-sm text-[#A1A1A6] max-w-3xl leading-relaxed">
              {t.downloadSub}
            </p>
          </div>

          {/* Main Download & Action Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Direct Download Card (.ZIP) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-6 rounded-2xl bg-[#13131a] border border-white/15 space-y-5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#30D158]/10 blur-2xl rounded-full pointer-events-none" />

                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-[#30D158]/15 text-[#30D158] border border-[#30D158]/30">
                      {lang === "en" ? "Official Release" : "Bản Cài Đặt Đầy Đủ"}
                    </span>
                    <h4 className="text-xl font-bold text-white mt-2">
                      SMOB Productivity Suite
                    </h4>
                    <p className="text-xs text-[#86868B] font-mono mt-0.5">
                      {lang === "en"
                        ? "Autodesk Revit® 2020 – 2026 Package"
                        : "Dành cho Autodesk Revit® 2020 – 2026"}
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
                    <FileCode className="w-6 h-6 text-[#2997FF]" />
                  </div>
                </div>

                {/* Highlights Bullet List */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  {releaseVersions[0].highlights.map((hl, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#D1D1D6]">
                      <Check className="w-3.5 h-3.5 text-[#30D158] shrink-0 mt-0.5" />
                      <span>{hl[lang]}</span>
                    </div>
                  ))}
                </div>

                {/* Direct Download Buttons */}
                <div className="space-y-2.5 pt-2">
                  {/* Primary Setup.zip Button */}
                  <a
                    href={releaseVersions[0].setupDownloadUrl}
                    download={releaseVersions[0].setupFileName}
                    className="w-full inline-flex items-center justify-between px-5 py-3.5 rounded-xl text-sm font-bold text-black bg-white hover:bg-[#E8E8ED] shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Download className="w-4 h-4 text-black group-hover:translate-y-0.5 transition-transform" />
                      <span>{t.downloadZipBtn}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-black/10 text-black">
                      {releaseVersions[0].setupFileSize}
                    </span>
                  </a>

                  {/* All-in-One Package Info */}
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-2.5 text-xs text-[#D1D1D6]">
                    <ShieldCheck className="w-4 h-4 text-[#30D158] shrink-0" />
                    <span>{t.downloadPackageNote}</span>
                  </div>
                </div>

                {/* Included Files Specs */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-[11px] font-mono text-[#86868B]">
                  <span>{t.zipSpecsNote}</span>
                  <span className="text-[#30D158]">{t.revitSupportNote}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Installation Guide & System Requirements */}
            <div className="lg:col-span-6 space-y-4">
              {/* Quick Installation & Browser Trust Guide Card */}
              <InstallationGuideCard />

              {/* System Specs Box */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#86868B]">
                  {t.sysReqTitle}
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#86868B] block text-[11px]">{t.sysReqOs}</span>
                    <span className="text-white font-medium">{systemRequirements.os}</span>
                  </div>
                  <div>
                    <span className="text-[#86868B] block text-[11px]">{t.sysReqRevit}</span>
                    <span className="text-[#30D158] font-medium">{systemRequirements.revit}</span>
                  </div>
                  <div>
                    <span className="text-[#86868B] block text-[11px]">{t.sysReqRuntime}</span>
                    <span className="text-white font-medium">{systemRequirements.framework}</span>
                  </div>
                  <div>
                    <span className="text-[#86868B] block text-[11px]">{t.sysReqStorage}</span>
                    <span className="text-white font-medium">{systemRequirements.storage}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Version Matrix & Changelog Tabs */}
          <div className="pt-6 border-t border-white/10 text-left space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#2997FF]" />
                <h4 className="text-lg sm:text-xl font-bold text-white">
                  {t.versionHistoryTitle}
                </h4>
              </div>

              {/* Version Selector Tabs */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#0a0a0f] border border-white/10 self-start">
                {releaseVersions.map((ver) => (
                  <button
                    key={ver.version}
                    onClick={() => setSelectedVersion(ver.version)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
                      selectedVersion === ver.version
                        ? "bg-white text-black font-bold shadow-md"
                        : "text-[#86868B] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{ver.version}</span>
                    {ver.isLatest && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#30D158]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Version Detail */}
            <div className="p-6 rounded-2xl bg-[#13131a] border border-white/15 space-y-6">
              {/* Version Meta Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-white font-mono">
                    {currentVersionData.version}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-[#E5E5EA]">
                    {currentVersionData.badge[lang]}
                  </span>
                  <span className="text-xs text-[#86868B] font-mono">
                    Released: {currentVersionData.releaseDate[lang]}
                  </span>
                </div>

                {/* Revit Compatibility Chips (2020 - 2026) */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-mono text-[#86868B] mr-1">Revit Support:</span>
                  {currentVersionData.revitSupport.map((year) => (
                    <span
                      key={year}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#30D158]/10 text-[#30D158] border border-[#30D158]/20"
                    >
                      {year}
                    </span>
                  ))}
                </div>
              </div>

              {/* Detailed Changelog Items */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-[#86868B]">
                  {lang === "en" ? "What's New in this Release:" : "Những điểm mới trong bản cập nhật này:"}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentVersionData.changelog.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            item.type === "new"
                              ? "bg-[#30D158]/15 text-[#30D158]"
                              : item.type === "enhanced"
                              ? "bg-[#2997FF]/15 text-[#2997FF]"
                              : item.type === "security"
                              ? "bg-[#FF9F0A]/15 text-[#FF9F0A]"
                              : "bg-[#2997FF]/15 text-[#2997FF]"
                          }`}
                        >
                          {item.type}
                        </span>
                        <h5 className="text-xs sm:text-sm font-bold text-white">
                          {item.title[lang]}
                        </h5>
                      </div>
                      <p className="text-xs text-[#A1A1A6] leading-relaxed">
                        {item.desc[lang]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download Link Footer for Active Tab */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#86868B]">
                  <HardDrive className="w-4 h-4" />
                  <span>Installer: <strong className="text-white font-mono">{currentVersionData.setupFileName}</strong> ({currentVersionData.setupFileSize})</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={currentVersionData.setupDownloadUrl}
                    download={currentVersionData.setupFileName}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-white hover:bg-[#E8E8ED] transition-all hover:scale-105 shadow-md"
                  >
                    <Download className="w-3.5 h-3.5 text-black" />
                    <span>{lang === "en" ? "Download Setup (.ZIP)" : "Tải Bản Cài Đặt (.ZIP)"}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
