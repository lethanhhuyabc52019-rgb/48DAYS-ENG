"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Sparkles, Volume2, RotateCcw, ChevronLeft, ChevronRight, CheckCircle2, HelpCircle } from "lucide-react";
import { popularIrregularVerbs } from "@/data/irregularVerbsData";
import Link from "next/link";

export const InteractiveVerbStudio: React.FC = () => {
  const { t, language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const currentVerb = popularIrregularVerbs[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % popularIrregularVerbs.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + popularIrregularVerbs.length) % popularIrregularVerbs.length);
  };

  const handleSpeak = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!("speechSynthesis" in window)) {
      alert("Trình duyệt không hỗ trợ Web Speech API.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <section id="verbs" className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Volume2 className="w-3.5 h-3.5" />
            <span>{t.verbStudio.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            {t.verbStudio.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            {t.verbStudio.subtitle}
          </p>
        </div>

        {/* Interactive Studio Workspace */}
        <div className="max-w-3xl mx-auto">
          {/* Flashcard Box */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer min-h-[320px] rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/15 p-8 sm:p-10 backdrop-blur-2xl shadow-2xl relative flex flex-col justify-between hover:border-emerald-400/40 transition-all select-none"
          >
            {/* Top Bar of Card */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-white/10 text-slate-300">
                  #{currentIndex + 1} / {popularIrregularVerbs.length}
                </span>
                <span className="text-xs text-slate-400">
                  {isFlipped ? "Mặt Sau (V2, V3 & Ví dụ)" : "Mặt Trước (V1)"}
                </span>
              </div>

              <button
                type="button"
                onClick={(e) =>
                  handleSpeak(
                    isFlipped
                      ? `${currentVerb.v1}, ${currentVerb.v2}, ${currentVerb.v3}`
                      : currentVerb.v1,
                    e
                  )
                }
                className={`p-3 rounded-full border transition-all ${
                  isPlayingAudio
                    ? "bg-emerald-500 text-black border-emerald-400 animate-pulse"
                    : "bg-white/10 text-white border-white/20 hover:bg-emerald-500 hover:text-black hover:border-emerald-400"
                }`}
                title="Nghe phát âm chuẩn"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Main Content Area */}
            {!isFlipped ? (
              <div className="my-auto text-center py-6">
                <div className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-3">
                  {currentVerb.v1}
                </div>
                <div className="text-sm font-mono text-cyan-400 mb-2">
                  {currentVerb.phonetic.split("-")[0]?.trim()}
                </div>
                <div className="text-lg sm:text-xl font-medium text-slate-300">
                  {language === "vi" ? currentVerb.meaningVi : currentVerb.meaningEn}
                </div>
              </div>
            ) : (
              <div className="my-auto py-4">
                <div className="grid grid-cols-3 gap-3 text-center mb-6">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <div className="text-xs text-slate-400 font-mono mb-1">V1 (Infinitive)</div>
                    <div className="text-lg font-bold text-white">{currentVerb.v1}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                    <div className="text-xs text-cyan-300 font-mono mb-1">V2 (Past Simple)</div>
                    <div className="text-lg font-bold text-cyan-300">{currentVerb.v2}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="text-xs text-emerald-300 font-mono mb-1">V3 (Past Participle)</div>
                    <div className="text-lg font-bold text-emerald-300">{currentVerb.v3}</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-sm">
                  <span className="text-xs text-slate-400 font-semibold block mb-1">
                    Ví dụ thực tế:
                  </span>
                  <p className="text-slate-200 italic">"{currentVerb.example}"</p>
                </div>
              </div>
            )}

            {/* Bottom Hint */}
            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-4">
              <span className="flex items-center gap-1 text-slate-400">
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                {t.verbStudio.flipHint}
              </span>
              <span className="text-emerald-400 font-medium">Bấm loa để nghe</span>
            </div>
          </div>

          {/* Flashcard Controller Buttons */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handlePrev}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.verbStudio.prevVerb}</span>
            </button>

            <Link
              href="/app"
              className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-500 to-cyan-400 text-black shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
            >
              Luyện 398+ Động Từ Trong App
            </Link>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            >
              <span>{t.verbStudio.nextVerb}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
