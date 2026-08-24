"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language } from "@/lib/i18n/types";
import { translations, TranslationDictionary } from "@/lib/i18n/translations";
import { useSiteContent } from "@/context/SiteContentContext";

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

function mergeTranslations<T>(base: T, override: unknown): T {
  if (!override || typeof override !== "object" || Array.isArray(override)) return base;

  const output: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(override as Record<string, unknown>)) {
    const baseValue = output[key];
    output[key] =
      baseValue &&
      typeof baseValue === "object" &&
      !Array.isArray(baseValue) &&
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
        ? mergeTranslations(baseValue, value)
        : value;
  }
  return output as T;
}

export const LanguageProvider: React.FC<{
  children: React.ReactNode;
  initialLanguage?: Language;
}> = ({ children, initialLanguage }) => {
  const { content } = useSiteContent();
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

  const cmsTranslations = content.ui_translations as Partial<Record<Language, unknown>> | undefined;
  const t = mergeTranslations(
    (translations[language] || translations.vi) as TranslationDictionary,
    cmsTranslations?.[language]
  );

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
