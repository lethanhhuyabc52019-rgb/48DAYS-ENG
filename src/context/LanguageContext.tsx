"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language } from "@/types";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("smobim_lang") as Language;
      if (savedLang === "en" || savedLang === "vn") {
        setLangState(savedLang);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem("smobim_lang", newLang);
    } catch {
      // ignore
    }
  };

  const toggleLang = () => {
    const nextLang = lang === "en" ? "vn" : "en";
    setLang(nextLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
