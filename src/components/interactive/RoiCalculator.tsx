"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Calculator, ArrowRight, Sparkles, TrendingUp, Clock, DollarSign } from "lucide-react";

export function RoiCalculator() {
  const { lang } = useLanguage();

  const [teamSize, setTeamSize] = useState<number>(6);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(14);
  const [hourlyRate, setHourlyRate] = useState<number>(lang === "en" ? 22 : 180000);

  // Automation factor: SMO-BIM saves ~80% of repetitive time
  const monthlyHoursPerEngineer = hoursPerWeek * 4.33;
  const totalMonthlyRepetitiveHours = teamSize * monthlyHoursPerEngineer;
  const monthlyHoursSaved = Math.round(totalMonthlyRepetitiveHours * 0.82);
  const monthlyCostSaved = Math.round(monthlyHoursSaved * hourlyRate);
  const annualCostSaved = monthlyCostSaved * 12;

  const formatCurrency = (val: number) => {
    if (lang === "en") {
      return `$${val.toLocaleString()}`;
    }
    return `${(val / 1000000).toFixed(1)} Triệu VNĐ`;
  };

  return (
    <section id="roi-calculator" className="py-24 lg:py-32 bg-black relative overflow-hidden border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#30D158] mb-3 inline-block">
            {lang === "en" ? "INTERACTIVE ROI SIMULATOR" : "TÍNH TOÁN HIỆU QUẢ ĐẦU TƯ ROI"}
          </span>

          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.12] mb-4">
            {lang === "en"
              ? "See How Much Time & Budget Your Team Will Save"
              : "Ước Tính Số Giờ & Chi Phí Tiết Kiệm Hàng Tháng"}
          </h2>

          <p className="text-base sm:text-lg text-[#A1A1A6]">
            {lang === "en"
              ? "Adjust your team parameters below to calculate direct productivity gains with SMO-BIM automation."
              : "Kéo thanh điều chỉnh quy mô đội ngũ của bạn để xem hiệu quả tăng tốc cụ thể."}
          </p>
        </div>

        {/* Calculator Widget Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Interactive Controls */}
          <div className="lg:col-span-6 apple-glass p-8 sm:p-10 rounded-3xl space-y-8 flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-3 pb-6 border-b border-white/10">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                  <Calculator className="w-5 h-5 text-[#30D158]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {lang === "en" ? "Team Workflow Parameters" : "Thông Số Đội Ngũ Của Bạn"}
                  </h3>
                  <p className="text-xs text-[#86868B]">
                    {lang === "en" ? "Customized to your active operations" : "Tùy chỉnh theo nhân sự thực tế"}
                  </p>
                </div>
              </div>

              {/* Slider 1: Team Size */}
              <div className="space-y-3 pt-6">
                <div className="flex items-center justify-between text-sm">
                  <label className="text-[#E5E5EA] font-medium">
                    {lang === "en" ? "Revit Modelers & Engineers" : "Số lượng Kỹ sư / Họa viên Revit"}
                  </label>
                  <span className="font-mono font-bold text-white text-base px-3 py-1 bg-white/10 rounded-full">
                    {teamSize} {lang === "en" ? "people" : "người"}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="40"
                  step="1"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full h-2 bg-white/15 rounded-lg appearance-none cursor-pointer accent-white"
                />
                <div className="flex justify-between text-[11px] text-[#6E6E73] font-mono">
                  <span>1 person</span>
                  <span>20 people</span>
                  <span>40+ people</span>
                </div>
              </div>

              {/* Slider 2: Hours on repetitive work */}
              <div className="space-y-3 pt-6">
                <div className="flex items-center justify-between text-sm">
                  <label className="text-[#E5E5EA] font-medium">
                    {lang === "en" ? "Manual hours per week (Renumber, Joins, Sheet setup)" : "Số giờ làm thủ công / tuần (Join, Đánh số, Tạo sheet...)"}
                  </label>
                  <span className="font-mono font-bold text-[#2997FF] text-base px-3 py-1 bg-[#2997FF]/10 rounded-full border border-[#2997FF]/20">
                    {hoursPerWeek} {lang === "en" ? "hrs/week" : "giờ/tuần"}
                  </span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="30"
                  step="1"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="w-full h-2 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#2997FF]"
                />
                <div className="flex justify-between text-[11px] text-[#6E6E73] font-mono">
                  <span>4 hrs (Light)</span>
                  <span>15 hrs (Typical)</span>
                  <span>30 hrs (Heavy)</span>
                </div>
              </div>

              {/* Slider 3: Hourly Rate */}
              <div className="space-y-3 pt-6">
                <div className="flex items-center justify-between text-sm">
                  <label className="text-[#E5E5EA] font-medium">
                    {lang === "en" ? "Estimated Hourly Rate" : "Chi phí nhân sự trung bình / giờ"}
                  </label>
                  <span className="font-mono font-bold text-white text-base px-3 py-1 bg-white/10 rounded-full">
                    {lang === "en" ? `$${hourlyRate}/hr` : `${(hourlyRate / 1000).toLocaleString()}k VNĐ/h`}
                  </span>
                </div>
                <input
                  type="range"
                  min={lang === "en" ? 10 : 80000}
                  max={lang === "en" ? 60 : 400000}
                  step={lang === "en" ? 2 : 10000}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full h-2 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#30D158]"
                />
              </div>
            </div>

            <div className="pt-4 text-xs text-[#86868B] border-t border-white/5">
              * {lang === "en"
                ? "Calculations based on 82% average repetitive task compression verified across live projects."
                : "Tính toán dựa trên mức độ rút ngắn 82% thời gian thao tác lặp lại được kiểm chứng thực tế."}
            </div>
          </div>

          {/* Right Column: Dynamic Savings Result Card */}
          <div className="lg:col-span-6 apple-glass p-8 sm:p-10 rounded-3xl flex flex-col justify-between text-left space-y-8 bg-gradient-to-b from-[#121218] via-[#0d0d12] to-black border border-white/15 shadow-2xl">
            <div className="space-y-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#30D158] font-mono flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                {lang === "en" ? "PROJECTED PRODUCTIVITY IMPACT" : "KẾT QUẢ TIẾT KIỆM DỰ TÍNH"}
              </span>

              {/* Main Metric: Monthly Hours Saved */}
              <div className="p-6 rounded-2xl bg-[#08080c] border border-white/10 space-y-1">
                <div className="text-xs text-[#86868B] font-mono">
                  {lang === "en" ? "Estimated Monthly Hours Reclaimed" : "Số giờ tiết kiệm được mỗi tháng"}
                </div>
                <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-mono">
                  {monthlyHoursSaved.toLocaleString()} <span className="text-xl font-sans text-[#2997FF]">{lang === "en" ? "hours / mo" : "giờ / tháng"}</span>
                </div>
                <div className="text-xs text-[#30D158] pt-1">
                  ✓ {lang === "en" ? "Equivalent to freeing up" : "Tương đương giải phóng"} {(monthlyHoursSaved / 160).toFixed(1)} {lang === "en" ? "full-time engineers" : "kỹ sư làm việc toàn thời gian"}
                </div>
              </div>

              {/* Cost Savings Metric */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#08080c] border border-white/10 space-y-1">
                  <div className="text-xs text-[#86868B] font-mono">
                    {lang === "en" ? "Monthly Budget Saved" : "Ngân sách tiết kiệm / tháng"}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white font-mono">
                    {formatCurrency(monthlyCostSaved)}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#08080c] border border-white/10 space-y-1">
                  <div className="text-xs text-[#86868B] font-mono">
                    {lang === "en" ? "Annual Potential ROI" : "Ước tính tiết kiệm / năm"}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#FF9F0A] font-mono">
                    {formatCurrency(annualCostSaved)}
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Onboarding / Consultation Action */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <Link
                href="/onboarding"
                className="apple-pill-btn w-full inline-flex items-center justify-center gap-2 py-4 rounded-full text-sm font-bold text-black bg-white hover:bg-[#E8E8ED] shadow-xl transition-all"
              >
                <span>
                  {lang === "en"
                    ? "Claim These Savings — Start 30-Min BIM Audit"
                    : "Nhận Phương Án Tiết Kiệm — Đặt Lịch Khảo Sát 30 Phút"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="text-center text-xs text-[#6E6E73]">
                {lang === "en" ? "100% Free · No obligations · Tailored discovery" : "Miễn phí 100% · Không ràng buộc · Đề xuất giải pháp riêng"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
