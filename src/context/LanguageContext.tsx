"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, SUPPORTED_LANGUAGES } from "@/lib/i18n/types";
import { translations, TranslationDictionary } from "@/lib/i18n/translations";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

const STORAGE_KEY = "inoibai_preferred_language";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("vi");

  useEffect(() => {
    // Load from localStorage or browser preferences
    const saved = localStorage.getItem(STORAGE_KEY) as Language;
    if (saved && ["vi", "en", "ko", "ru", "zh"].includes(saved)) {
      setLanguageState(saved);
    } else {
      // Auto-detect browser language if available
      const browserLang = navigator.language.slice(0, 2);
      if (["en", "ko", "ru", "zh"].includes(browserLang)) {
        setLanguageState(browserLang as Language);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  };

  const t = (translations[language] || translations.vi) as TranslationDictionary;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      language: "vi",
      setLanguage: () => {},
      t: translations.vi as TranslationDictionary,
    };
  }
  return context;
};
