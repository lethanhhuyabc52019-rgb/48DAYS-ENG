"use client";

import React, { createContext, useContext, useState } from "react";
import { OnboardingData } from "@/lib/validation";

interface OnboardingContextType {
  step: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  formData: Partial<OnboardingData>;
  updateFormData: (data: Partial<OnboardingData>) => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    disciplines: ["Architecture", "Structure"],
    painPoints: ["Manual element joins", "Slow auto-numbering"],
    inputFormats: ["2D PDF/DWG"],
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const updateFormData = (data: Partial<OnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetOnboarding = () => {
    setStep(1);
    setFormData({
      disciplines: ["Architecture", "Structure"],
      painPoints: ["Manual element joins", "Slow auto-numbering"],
      inputFormats: ["2D PDF/DWG"],
    });
  };

  return (
    <OnboardingContext.Provider
      value={{
        step,
        setStep,
        nextStep,
        prevStep,
        formData,
        updateFormData,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
