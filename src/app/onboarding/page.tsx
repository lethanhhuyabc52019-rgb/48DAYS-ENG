"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useOnboarding } from "@/context/OnboardingContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  Building2,
  Users,
  Layers,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Calendar,
  Send,
  Wrench,
  FileSpreadsheet,
  Check,
} from "lucide-react";

export default function OnboardingPage() {
  const { step, nextStep, prevStep, formData, updateFormData, resetOnboarding } = useOnboarding();
  const { lang } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const teamSizes = ["1–5 engineers", "6–15 engineers", "16–30 engineers", "30+ engineers"];
  const disciplineOptions = [
    "Architectural BIM",
    "Structural Engineering",
    "MEP / Systems",
    "General Contracting",
    "BIM Management & QA/QC",
  ];

  const painPointOptions = [
    { id: "joins", label: lang === "en" ? "Manual element joins & volume clashes" : "Xử lý join giao cắt & xung đột thể tích thủ công" },
    { id: "numbering", label: lang === "en" ? "Repetitive element renumbering (piles, doors, rooms)" : "Đánh số cọc, cửa, phòng thủ công dễ trùng lặp" },
    { id: "renaming", label: lang === "en" ? "F2 batch renaming of views/sheets/families" : "Đổi tên hàng loạt view, sheet, family tốn thời gian" },
    { id: "elevation", label: lang === "en" ? "Undetected floor elevation & offset errors" : "Sai lệch cao độ sàn ngầm khó phát hiện bằng mắt" },
    { id: "dynamo", label: lang === "en" ? "Need custom Dynamo automation & Excel links" : "Cần lập trình Dynamo script & đồng bộ Excel 2 chiều" },
    { id: "api", label: lang === "en" ? "Need bespoke 1-click Revit API add-ins" : "Cần phát triển Revit API Add-in riêng cho công ty" },
    { id: "modeling", label: lang === "en" ? "Need full-scope 2D-to-BIM modeling outsourcing" : "Cần dựng mô hình BIM trọn gói từ bản vẽ 2D" },
  ];

  const projectScales = [
    lang === "en" ? "Single Commercial / Residential Building" : "Công trình đơn lẻ (Nhà ở / Thương mại)",
    lang === "en" ? "Multi-Building Campus / Resort" : "Tổ hợp nhiều khối nhà / Khu nghỉ dưỡng",
    lang === "en" ? "High-Rise Tower / Complex Facility" : "Nhà cao tầng / Công trình phức hợp",
    lang === "en" ? "Multiple Ongoing Projects" : "Nhiều dự án triển khai liên tục",
  ];

  const timelines = [
    lang === "en" ? "Immediate (within 1–2 weeks)" : "Cần ngay (trong 1–2 tuần tới)",
    lang === "en" ? "Next 1–2 months" : "Trong 1–2 tháng tới",
    lang === "en" ? "Long-term partnership" : "Hợp tác chiến lược dài hạn",
  ];

  const consultationSlots = [
    lang === "en" ? "Morning Slot (9:00 AM – 11:30 AM)" : "Buổi sáng (9:00 – 11:30)",
    lang === "en" ? "Afternoon Slot (2:00 PM – 5:00 PM)" : "Buổi chiều (14:00 – 17:00)",
    lang === "en" ? "Flexible / Contact via Email or WhatsApp" : "Linh hoạt / Trao đổi qua Email hoặc WhatsApp",
  ];

  const toggleArrayItem = (key: "disciplines" | "painPoints" | "inputFormats", val: string) => {
    const current = (formData[key] as string[]) || [];
    if (current.includes(val)) {
      updateFormData({ [key]: current.filter((x) => x !== val) });
    } else {
      updateFormData({ [key]: [...current, val] });
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const leadId = `SMOB-${Date.now().toString(36).toUpperCase()}`;
      if (typeof window !== "undefined") {
        const stored = JSON.parse(localStorage.getItem("smob_onboarding_leads") || "[]");
        stored.push({ ...formData, leadId, timestamp: new Date().toISOString() });
        localStorage.setItem("smob_onboarding_leads", JSON.stringify(stored));
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch {
      // ignore
    }
    setIsSubmitting(false);
    nextStep();
  };

  return (
    <div className="w-full max-w-2xl mx-auto apple-glass p-8 sm:p-12 rounded-3xl text-left space-y-8 shadow-2xl animate-fadeIn">
      {/* Step 1: Company Profile */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#2997FF]">
              {lang === "en" ? "STEP 1 OF 5 — TEAM PROFILE" : "BƯỚC 1 / 5 — THÔNG TIN ĐỘI NGŨ"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              {lang === "en" ? "Tell us about your organization" : "Hãy chia sẻ về doanh nghiệp của bạn"}
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1A6] mt-1">
              {lang === "en"
                ? "This helps us calculate your team's exact automation opportunities."
                : "Giúp chúng tôi đề xuất quy mô và giải pháp tối ưu nhất cho bạn."}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#A1A1A6]">
                {lang === "en" ? "Company / Firm Name" : "Tên Công ty / Đơn vị"} *
              </label>
              <input
                type="text"
                value={formData.companyName || ""}
                onChange={(e) => updateFormData({ companyName: e.target.value })}
                placeholder={lang === "en" ? "e.g. Apex Architecture & Engineering" : "VD: Công ty Tư vấn Thiết kế ABC"}
                className="w-full px-4 py-3 rounded-2xl bg-[#0e0e14] border border-white/10 text-white text-sm focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[#A1A1A6]">
                {lang === "en" ? "Revit Modeling Team Size" : "Quy mô đội ngũ Revit"} *
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {teamSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => updateFormData({ teamSize: size })}
                    className={`p-3 rounded-2xl border text-xs sm:text-sm font-medium transition-all text-left ${
                      formData.teamSize === size
                        ? "bg-white text-black font-semibold border-white"
                        : "bg-[#0e0e14] border-white/10 text-[#A1A1A6] hover:text-white hover:border-white/20"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-medium text-[#A1A1A6]">
                {lang === "en" ? "Primary Disciplines (Select all that apply)" : "Bộ môn chính (Chọn các bộ môn áp dụng)"}
              </label>
              <div className="flex flex-wrap gap-2">
                {disciplineOptions.map((disc) => {
                  const isChecked = (formData.disciplines || []).includes(disc);
                  return (
                    <button
                      key={disc}
                      type="button"
                      onClick={() => toggleArrayItem("disciplines", disc)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        isChecked
                          ? "bg-[#2997FF]/20 text-[#2997FF] border-[#2997FF]/40 font-semibold"
                          : "bg-[#0e0e14] text-[#86868B] border-white/10 hover:text-white"
                      }`}
                    >
                      {isChecked ? `✓ ${disc}` : `+ ${disc}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-end">
            <button
              type="button"
              disabled={!formData.companyName || !formData.teamSize}
              onClick={nextStep}
              className="apple-pill-btn px-7 py-3 rounded-full text-xs sm:text-sm font-semibold text-black bg-white hover:bg-slate-200 transition-all flex items-center gap-2 disabled:opacity-40"
            >
              <span>{lang === "en" ? "Continue to Pain Points" : "Tiếp Tục: Chọn Điểm Nghẽn"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Pain Points */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#2997FF]">
              {lang === "en" ? "STEP 2 OF 5 — WORKFLOW BOTTLENECKS" : "BƯỚC 2 / 5 — ĐIỂM NGHẼN THAO TÁC"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              {lang === "en" ? "Which tasks drain most of your team's hours?" : "Những tác vụ nào đang tốn nhiều thời gian nhất?"}
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1A6] mt-1">
              {lang === "en" ? "Select the bottlenecks you want to automate first." : "Chọn các tác vụ bạn muốn tự động hóa ưu tiên."}
            </p>
          </div>

          <div className="space-y-2.5">
            {painPointOptions.map((opt) => {
              const isChecked = (formData.painPoints || []).includes(opt.label);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleArrayItem("painPoints", opt.label)}
                  className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${
                    isChecked
                      ? "bg-white/10 border-white text-white"
                      : "bg-[#0e0e14] border-white/10 text-[#A1A1A6] hover:text-white"
                  }`}
                >
                  <span>{opt.label}</span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                    isChecked ? "bg-white text-black border-white" : "border-white/20"
                  }`}>
                    {isChecked && <Check className="w-3 h-3 text-black" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={prevStep}
              className="apple-pill-btn px-5 py-2.5 rounded-full text-xs font-medium text-[#A1A1A6] hover:text-white bg-white/5"
            >
              {lang === "en" ? "Back" : "Quay Lại"}
            </button>
            <button
              type="button"
              disabled={(formData.painPoints || []).length === 0}
              onClick={nextStep}
              className="apple-pill-btn px-7 py-3 rounded-full text-xs sm:text-sm font-semibold text-black bg-white hover:bg-slate-200 transition-all flex items-center gap-2 disabled:opacity-40"
            >
              <span>{lang === "en" ? "Continue to Scope" : "Tiếp Tục: Quy Mô Dự Án"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Project Scope & Schedule */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#2997FF]">
              {lang === "en" ? "STEP 3 OF 5 — PROJECT SCOPE" : "BƯỚC 3 / 5 — QUY MÔ DỰ ÁN"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              {lang === "en" ? "What is the typical scale of your projects?" : "Quy mô dự án tiêu biểu của bạn"}
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1A6] mt-1">
              {lang === "en" ? "Detail level is tailored to your specific project needs." : "Mức độ chi tiết được tùy biến theo đúng yêu cầu dự án."}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#A1A1A6]">
                {lang === "en" ? "Project Typology" : "Loại hình công trình"} *
              </label>
              <div className="space-y-2">
                {projectScales.map((scale) => (
                  <button
                    key={scale}
                    type="button"
                    onClick={() => updateFormData({ projectScale: scale })}
                    className={`w-full p-3 rounded-2xl border text-xs sm:text-sm font-medium transition-all text-left ${
                      formData.projectScale === scale
                        ? "bg-white text-black font-semibold border-white"
                        : "bg-[#0e0e14] border-white/10 text-[#A1A1A6] hover:text-white"
                    }`}
                  >
                    {scale}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-medium text-[#A1A1A6]">
                {lang === "en" ? "Target Implementation Timeline" : "Tiến độ triển khai mong muốn"} *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {timelines.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => updateFormData({ targetTimeline: time })}
                    className={`p-3 rounded-2xl border text-xs font-medium transition-all text-left ${
                      formData.targetTimeline === time
                        ? "bg-white text-black font-semibold border-white"
                        : "bg-[#0e0e14] border-white/10 text-[#A1A1A6] hover:text-white"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={prevStep}
              className="apple-pill-btn px-5 py-2.5 rounded-full text-xs font-medium text-[#A1A1A6] hover:text-white bg-white/5"
            >
              {lang === "en" ? "Back" : "Quay Lại"}
            </button>
            <button
              type="button"
              disabled={!formData.projectScale || !formData.targetTimeline}
              onClick={nextStep}
              className="apple-pill-btn px-7 py-3 rounded-full text-xs sm:text-sm font-semibold text-black bg-white hover:bg-slate-200 transition-all flex items-center gap-2 disabled:opacity-40"
            >
              <span>{lang === "en" ? "Continue to Contact" : "Tiếp Tục: Lịch Tư Vấn"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Contact & Discovery Schedule */}
      {step === 4 && (
        <div className="space-y-6">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#2997FF]">
              {lang === "en" ? "STEP 4 OF 5 — DISCOVERY DETAILS" : "BƯỚC 4 / 5 — LỊCH KHẢO SÁT"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              {lang === "en" ? "Where should we send your custom proposal?" : "Thông tin nhận bản đề xuất giải pháp"}
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1A6] mt-1">
              {lang === "en" ? "Guaranteed 24-hour response with initial discovery findings." : "Phản hồi trong vòng 24h kèm phân tích cơ hội tự động hóa."}
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#A1A1A6]">
                  {lang === "en" ? "Your Name" : "Họ và tên"} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactName || ""}
                  onChange={(e) => updateFormData({ contactName: e.target.value })}
                  placeholder={lang === "en" ? "e.g. David Nguyen" : "VD: Nguyễn Văn Nam"}
                  className="w-full px-4 py-3 rounded-2xl bg-[#0e0e14] border border-white/10 text-white text-sm focus:outline-none focus:border-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#A1A1A6]">
                  {lang === "en" ? "Work Email" : "Email công việc"} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.workEmail || ""}
                  onChange={(e) => updateFormData({ workEmail: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full px-4 py-3 rounded-2xl bg-[#0e0e14] border border-white/10 text-white text-sm focus:outline-none focus:border-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#A1A1A6]">
                {lang === "en" ? "Phone / WhatsApp" : "Số điện thoại / WhatsApp"} *
              </label>
              <input
                type="tel"
                required
                value={formData.phone || ""}
                onChange={(e) => updateFormData({ phone: e.target.value })}
                placeholder="+84 90 123 4567"
                className="w-full px-4 py-3 rounded-2xl bg-[#0e0e14] border border-white/10 text-white text-sm focus:outline-none focus:border-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[#A1A1A6]">
                {lang === "en" ? "Preferred Consultation Time" : "Khung giờ tư vấn thuận tiện"}
              </label>
              <div className="space-y-2">
                {consultationSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => updateFormData({ consultationSlot: slot })}
                    className={`w-full p-3 rounded-2xl border text-xs sm:text-sm font-medium transition-all text-left ${
                      formData.consultationSlot === slot
                        ? "bg-white text-black font-semibold border-white"
                        : "bg-[#0e0e14] border-white/10 text-[#A1A1A6] hover:text-white"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={prevStep}
              className="apple-pill-btn px-5 py-2.5 rounded-full text-xs font-medium text-[#A1A1A6] hover:text-white bg-white/5"
            >
              {lang === "en" ? "Back" : "Quay Lại"}
            </button>
            <button
              type="button"
              disabled={isSubmitting || !formData.contactName || !formData.workEmail || !formData.phone}
              onClick={handleFinalSubmit}
              className="apple-pill-btn px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold text-black bg-white hover:bg-slate-200 transition-all flex items-center gap-2 disabled:opacity-40"
            >
              {isSubmitting ? (
                <span>{lang === "en" ? "Generating Report..." : "Đang tạo bản đề xuất..."}</span>
              ) : (
                <>
                  <span>{lang === "en" ? "Submit & Get Proposal" : "Gửi & Nhận Đề Xuất"}</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Automated Tailored Recommendation & Confirmation */}
      {step === 5 && (
        <div className="space-y-6 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-[#30D158]/10 flex items-center justify-center text-[#30D158] mx-auto border border-[#30D158]/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#30D158]">
              {lang === "en" ? "ASSESSMENT COMPLETE" : "KHẢO SÁT HOÀN TẤT"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {lang === "en" ? "Your Custom Automation Roadmap is Ready" : "Bản Lộ Trình Tự Động Hóa Dành Riêng Cho Bạn"}
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1A6] max-w-md mx-auto">
              {lang === "en"
                ? `Thank you, ${formData.contactName || "partner"}. We have received your parameters and will reach out within 24 hours.`
                : `Cảm ơn bạn, ${formData.contactName || "đối tác"}. Chúng tôi đã nhận thông tin và sẽ liên hệ trong vòng 24 giờ.`}
            </p>
          </div>

          {/* Solution Summary Bento */}
          <div className="p-6 rounded-2xl bg-[#08080c] border border-white/10 text-left space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-[#A1A1A6] font-bold border-b border-white/10 pb-2">
              {lang === "en" ? "Recommended Strategy" : "Phương Án Khuyến Nghị"}
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-start gap-2 text-white">
                <span className="text-[#30D158]">✓</span>
                <span>
                  <strong>SMO-BIM Add-in:</strong> {lang === "en" ? "Immediate deployment of 9 core modules to solve repetitive joins & numbering." : "Triển khai ngay 9 module tăng năng suất giải quyết join & đánh số."}
                </span>
              </div>
              <div className="flex items-start gap-2 text-white">
                <span className="text-[#2997FF]">✓</span>
                <span>
                  <strong>Custom Engineering:</strong> {lang === "en" ? "30-min discovery session to establish custom Dynamo algorithms & BEP compliance." : "Buổi trao đổi 30 phút rà soát quy trình để viết Dynamo script tùy biến."}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="apple-pill-btn w-full sm:w-auto px-7 py-3 rounded-full text-xs sm:text-sm font-semibold text-black bg-white hover:bg-slate-200 transition-all"
            >
              {lang === "en" ? "Back to Homepage" : "Về Trang Chủ"}
            </Link>
            <a
              href="mailto:smob.bim@gmail.com"
              className="apple-pill-btn w-full sm:w-auto px-6 py-3 rounded-full text-xs sm:text-sm font-medium text-white bg-white/10 hover:bg-white/20 transition-all"
            >
              {lang === "en" ? "Direct Email Support" : "Gửi Email Trực Tiếp"}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
