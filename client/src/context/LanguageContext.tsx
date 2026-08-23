"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language } from "@/lib/i18n/types";
import { translations, TranslationDictionary } from "@/lib/i18n/translations";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

const STORAGE_KEY = "maigo79_preferred_language";
const VALID_LANGS: Language[] = ["vi", "en", "ko", "ru", "zh"];

export const LanguageProvider: React.FC<{
  children: React.ReactNode;
  initialLanguage?: Language;
}> = ({ children, initialLanguage }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (initialLanguage && VALID_LANGS.includes(initialLanguage)) return initialLanguage;
    if (typeof window === "undefined") return "vi";
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language;
      if (saved && VALID_LANGS.includes(saved)) return saved;
      const browserLang = navigator.language.slice(0, 2) as Language;
      if (VALID_LANGS.includes(browserLang)) return browserLang;
    } catch {
      // Fallback
    }
    return "vi";
  });

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

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
