"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle,
  PlayCircle,
  Volume2,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Timer,
  ChevronRight,
  ChevronLeft,
  Award,
  Layers,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Home,
  Check,
} from "lucide-react";
import { popularIrregularVerbs } from "@/data/irregularVerbsData";
import { sampleCurriculumUnits } from "@/data/curriculumData";

export default function ClassroomApp() {
  const [activeTab, setActiveTab] = useState<"units" | "verbs" | "exam" | "dashboard">("units");
  const [selectedUnit, setSelectedUnit] = useState<number>(1);
  const [completedUnits, setCompletedUnits] = useState<number[]>([]);

  // Verb flashcard state
  const [verbIndex, setVerbIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Exam state
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("smob_completed_units");
    if (saved) {
      try {
        setCompletedUnits(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const toggleCompleteUnit = (unitId: number) => {
    let updated: number[];
    if (completedUnits.includes(unitId)) {
      updated = completedUnits.filter((id) => id !== unitId);
    } else {
      updated = [...completedUnits, unitId];
    }
    setCompletedUnits(updated);
    localStorage.setItem("smob_completed_units", JSON.stringify(updated));
  };

  const handleSpeak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  const currentVerb = popularIrregularVerbs[verbIndex];

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col selection:bg-cyan-400 selection:text-black">
      {/* Top Header */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-2xl px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-full bg-white/5 border border-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Trang Chủ</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">
                SMOB English Lab — Phòng Học Trực Tuyến
              </h1>
              <p className="text-[11px] text-slate-400">
                48-Day Foundation Course • Tiến độ: {completedUnits.length}/48 Units ({Math.round((completedUnits.length / 48) * 100)}%)
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("units")}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === "units"
                ? "bg-cyan-400 text-black shadow-lg shadow-cyan-500/20"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            48 Units Bài Học
          </button>
          <button
            onClick={() => setActiveTab("verbs")}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === "verbs"
                ? "bg-emerald-400 text-black shadow-lg shadow-emerald-500/20"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            398+ Động Từ Audio
          </button>
          <button
            onClick={() => setActiveTab("exam")}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === "exam"
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            Luyện Thi Trắc Nghiệm
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Tab 1: 48 Units Explorer */}
        {activeTab === "units" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar: 48 Units Catalog */}
            <div className="lg:col-span-4 bg-white/[0.03] border border-white/10 rounded-3xl p-4 sm:p-5 max-h-[80vh] overflow-y-auto">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 px-2">
                Danh Mục 48 Bài Học
              </h2>
              <div className="space-y-2">
                {Array.from({ length: 48 }, (_, i) => i + 1).map((num) => {
                  const isDone = completedUnits.includes(num);
                  const isSelected = selectedUnit === num;
                  const unitSample = sampleCurriculumUnits.find((u) => u.unitNumber === num);
                  const title = unitSample ? unitSample.titleVi : `Bài học Unit ${num} — Cấu trúc & Luyện tập ngữ pháp`;

                  return (
                    <button
                      key={num}
                      onClick={() => setSelectedUnit(num)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-cyan-500/20 border-cyan-400 text-white shadow-md"
                          : "bg-white/[0.02] border-white/5 text-slate-300 hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isDone
                              ? "bg-emerald-500 text-black"
                              : isSelected
                              ? "bg-cyan-400 text-black"
                              : "bg-white/10 text-slate-300"
                          }`}
                        >
                          {isDone ? <Check className="w-4 h-4" /> : num}
                        </div>
                        <span className="text-xs font-semibold line-clamp-1">{title}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Main Unit Study Studio */}
            <div className="lg:col-span-8 bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                  <div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      UNIT {selectedUnit} / 48
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
                      {sampleCurriculumUnits.find((u) => u.unitNumber === selectedUnit)?.titleVi ||
                        `Unit ${selectedUnit}: Ngữ Pháp & Cấu Trúc Trọng Tâm`}
                    </h2>
                  </div>

                  <button
                    onClick={() => toggleCompleteUnit(selectedUnit)}
                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${
                      completedUnits.includes(selectedUnit)
                        ? "bg-emerald-500 text-black border-emerald-400"
                        : "bg-white/10 text-white border-white/20 hover:bg-emerald-500 hover:text-black"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {completedUnits.includes(selectedUnit) ? "Đã Hoàn Thành" : "Đánh Dấu Hoàn Thành"}
                    </span>
                  </button>
                </div>

                {/* 3 Pillars Inside Classroom */}
                <div className="space-y-6">
                  {/* Pillar 1: Video Player Placeholder */}
                  <div className="bg-black/60 border border-white/10 rounded-2xl p-6 text-center">
                    <PlayCircle className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white mb-1">
                      Video Bài Giảng Unit {selectedUnit}
                    </h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                      Bài giảng trực quan phân tích chi tiết cấu trúc và ví dụ thực tế.
                    </p>
                    <a
                      href="https://www.youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-white/10 text-white hover:bg-white/20 transition-all"
                    >
                      <PlayCircle className="w-4 h-4 text-cyan-400" />
                      <span>Xem Bài Giảng Video Trực Tuyến</span>
                    </a>
                  </div>

                  {/* Pillar 2: Core Theory Breakdown */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                    <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-cyan-400" />
                      <span>Tổng Hợp Lý Thuyết & Công Thức Cốt Lõi</span>
                    </h3>
                    <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 font-mono text-cyan-300">
                        Công Thức: S + V(s/es) + O / S + do/does + not + V_inf + O
                      </div>
                      <p className="leading-relaxed">
                        • Quy tắc áp dụng: Sử dụng để diễn tả chân lý, sự thật hiển nhiên, thói quen lặp đi lặp lại hoặc lịch trình định sẵn.
                      </p>
                      <p className="leading-relaxed">
                        • Lưu ý trọng tâm: Với chủ ngữ ngôi thứ 3 số ít (He, She, It, Danh từ số ít), thêm '-s' hoặc '-es' vào sau động từ.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 3: Quick Practice Launcher */}
                  <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-cyan-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Làm Bài Tập Trắc Nghiệm Unit {selectedUnit}
                      </h4>
                      <p className="text-xs text-slate-400">
                        20 câu hỏi trắc nghiệm có chấm điểm và phân tích giải thích chi tiết.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("exam")}
                      className="px-5 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:opacity-90 shrink-0"
                    >
                      Bắt Đầu Làm Bài Tập →
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Pagination */}
              <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-8">
                <button
                  onClick={() => setSelectedUnit(Math.max(1, selectedUnit - 1))}
                  disabled={selectedUnit === 1}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 text-white disabled:opacity-30 hover:bg-white/10 transition-colors"
                >
                  ← Unit Trước
                </button>
                <span className="text-xs font-mono text-slate-400">
                  {selectedUnit} / 48
                </span>
                <button
                  onClick={() => setSelectedUnit(Math.min(48, selectedUnit + 1))}
                  disabled={selectedUnit === 48}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 text-white disabled:opacity-30 hover:bg-white/10 transition-colors"
                >
                  Unit Tiếp Theo →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Irregular Verbs Flashcards */}
        {activeTab === "verbs" && (
          <div className="max-w-2xl mx-auto py-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Flashcard 398+ Động Từ Bất Quy Tắc
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Luyện nhớ V1 - V2 - V3 với phát âm bản xứ.
              </p>
            </div>

            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="cursor-pointer min-h-[300px] rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/15 p-8 backdrop-blur-2xl shadow-2xl flex flex-col justify-between hover:border-emerald-400/40 transition-all select-none"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  #{verbIndex + 1} / {popularIrregularVerbs.length}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(
                      isFlipped
                        ? `${currentVerb.v1}, ${currentVerb.v2}, ${currentVerb.v3}`
                        : currentVerb.v1
                    );
                  }}
                  className="p-3 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500 hover:text-black transition-all"
                  title="Nghe phát âm"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {!isFlipped ? (
                <div className="text-center my-auto py-4">
                  <div className="text-5xl font-black text-white mb-2">{currentVerb.v1}</div>
                  <div className="text-xs font-mono text-cyan-400 mb-2">{currentVerb.phonetic}</div>
                  <div className="text-lg text-slate-300">{currentVerb.meaningVi}</div>
                </div>
              ) : (
                <div className="my-auto py-4">
                  <div className="grid grid-cols-3 gap-3 text-center mb-4">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-[10px] text-slate-400 font-mono">V1</div>
                      <div className="text-base font-bold text-white">{currentVerb.v1}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                      <div className="text-[10px] text-cyan-300 font-mono">V2</div>
                      <div className="text-base font-bold text-cyan-300">{currentVerb.v2}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <div className="text-[10px] text-emerald-300 font-mono">V3</div>
                      <div className="text-base font-bold text-emerald-300">{currentVerb.v3}</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 italic text-center">
                    "{currentVerb.example}"
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-4">
                <span className="flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                  Bấm thẻ để lật mặt sau
                </span>
                <span className="text-emerald-400 font-medium">Bấm loa để nghe</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => {
                  setIsFlipped(false);
                  setVerbIndex((prev) => (prev - 1 + popularIrregularVerbs.length) % popularIrregularVerbs.length);
                }}
                className="px-5 py-2.5 rounded-full text-xs font-bold bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                ← Từ Trước
              </button>
              <button
                onClick={() => {
                  setIsFlipped(false);
                  setVerbIndex((prev) => (prev + 1) % popularIrregularVerbs.length);
                }}
                className="px-5 py-2.5 rounded-full text-xs font-bold bg-emerald-400 text-black hover:bg-emerald-300 transition-all"
              >
                Từ Tiếp Theo →
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Mock Exam & Practice */}
        {activeTab === "exam" && (
          <div className="max-w-2xl mx-auto py-8">
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400">
                    Luyện Đề Trắc Nghiệm Có Giải Thích
                  </span>
                  <h3 className="text-lg font-bold text-white mt-2">
                    Kiểm Tra Ngữ Pháp Unit {selectedUnit}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono">
                  <Timer className="w-4 h-4" />
                  <span>15:00</span>
                </div>
              </div>

              <h4 className="text-base font-bold text-white mb-4">
                Câu 1: Which sentence uses the correct form of the verb?
              </h4>

              <div className="space-y-3 mb-6">
                {[
                  "A. They works in a multinational company.",
                  "B. They work in a multinational company.",
                  "C. They working in a multinational company.",
                  "D. They is work in a multinational company.",
                ].map((opt, idx) => {
                  let style = "bg-white/5 border-white/10 text-slate-200 hover:bg-white/10";
                  if (quizAnswer === idx && !quizSubmitted) {
                    style = "bg-blue-500/20 border-blue-400 text-white font-medium";
                  }
                  if (quizSubmitted) {
                    if (idx === 1) {
                      style = "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-semibold";
                    } else if (quizAnswer === idx && idx !== 1) {
                      style = "bg-red-500/20 border-red-400 text-red-300 font-semibold";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !quizSubmitted && setQuizAnswer(idx)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs sm:text-sm flex items-center justify-between ${style}`}
                    >
                      <span>{opt}</span>
                      {quizSubmitted && idx === 1 && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {quizSubmitted && quizAnswer === idx && idx !== 1 && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {!quizSubmitted ? (
                <button
                  onClick={() => quizAnswer !== null && setQuizSubmitted(true)}
                  disabled={quizAnswer === null}
                  className="w-full py-3 rounded-full text-xs sm:text-sm font-bold bg-cyan-400 text-black disabled:opacity-40 transition-all hover:bg-cyan-300"
                >
                  Nộp Bài & Xem Phân Tích Lời Giải
                </button>
              ) : (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm text-emerald-200">
                    <span className="font-bold block text-emerald-400 mb-1">
                      ✓ Lời Giải Chi Tiết:
                    </span>
                    <p className="leading-relaxed text-slate-300">
                      Chủ ngữ là đại từ ngôi thứ 3 số nhiều ('They'), vì vậy động từ thường ở thì Hiện tại đơn giữ nguyên dạng nguyên thể ('work'). Phương án B là đáp án chính xác.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setQuizAnswer(null);
                      setQuizSubmitted(false);
                    }}
                    className="w-full py-2.5 rounded-full text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-all"
                  >
                    Làm Câu Khác
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
