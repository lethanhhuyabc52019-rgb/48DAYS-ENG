"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Award, Timer, CheckCircle, XCircle, HelpCircle, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export const ExamEngineSection: React.FC = () => {
  const { t } = useLanguage();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Demo interactive quiz question
  const demoQuestion = {
    question: "Choose the correct sentence in Present Simple:",
    options: [
      "A. She go to school every morning.",
      "B. She goes to school every morning.",
      "C. She is go to school every morning.",
      "D. She going to school every morning.",
    ],
    correct: 1, // B
    explanation:
      "Với chủ ngữ ngôi thứ 3 số ít ('She') trong thì Hiện tại đơn, động từ 'go' kết thúc bằng 'o' nên phải thêm đuôi '-es' thành 'goes'. Phương án B là chính xác nhất.",
  };

  const handleSelect = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  return (
    <section id="exam" className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>{t.examEngine.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            {t.examEngine.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            {t.examEngine.subtitle}
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: 4 Key Features */}
          <div className="lg:col-span-6 space-y-4">
            {t.examEngine.features.map((feat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/30 transition-all backdrop-blur-xl"
              >
                <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed pl-4">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Right Column: Interactive Quiz Sandbox */}
          <div className="lg:col-span-6">
            <div className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
              {/* Quiz Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Thử sức câu hỏi mẫu
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Unit 11</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono">
                  <Timer className="w-4 h-4" />
                  <span>14:45</span>
                </div>
              </div>

              {/* Question Text */}
              <h4 className="text-base sm:text-lg font-bold text-white mb-5">
                {demoQuestion.question}
              </h4>

              {/* Option Choices */}
              <div className="space-y-2.5 mb-6">
                {demoQuestion.options.map((opt, idx) => {
                  let style =
                    "bg-white/5 border-white/10 text-slate-200 hover:bg-white/10";
                  if (selectedOption === idx && !isSubmitted) {
                    style = "bg-blue-500/20 border-blue-400 text-white font-medium";
                  }
                  if (isSubmitted) {
                    if (idx === demoQuestion.correct) {
                      style =
                        "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-semibold";
                    } else if (selectedOption === idx && idx !== demoQuestion.correct) {
                      style =
                        "bg-red-500/20 border-red-400 text-red-300 font-semibold";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all text-sm flex items-center justify-between ${style}`}
                    >
                      <span>{opt}</span>
                      {isSubmitted && idx === demoQuestion.correct && (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {isSubmitted &&
                        selectedOption === idx &&
                        idx !== demoQuestion.correct && (
                          <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                        )}
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons & Detailed Explanation */}
              {!isSubmitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={selectedOption === null}
                  className="w-full py-3 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-cyan-400 text-black disabled:opacity-40 transition-all hover:opacity-90"
                >
                  Kiểm Tra Đáp Án & Xem Giải Thích
                </button>
              ) : (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm text-emerald-200">
                    <span className="font-bold block text-emerald-400 mb-1">
                      ✓ Phân Tích Chi Tiết Đáp Án:
                    </span>
                    <p className="leading-relaxed text-slate-300">
                      {demoQuestion.explanation}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleReset}
                      className="flex-1 py-2.5 rounded-full text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-all"
                    >
                      Làm Lại
                    </button>
                    <Link
                      href="/app"
                      className="flex-1 py-2.5 rounded-full text-xs font-bold bg-cyan-400 text-black text-center hover:bg-cyan-300 transition-all"
                    >
                      Luyện 2.000+ Câu Trong App →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
