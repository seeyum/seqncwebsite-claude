import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { en, type Translations } from "./en";
import { fr } from "./fr";

export type Lang = "en" | "fr";

const dictionaries: Record<Lang, Translations> = { en, fr };

type LanguageContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "seqnc-lang";

function initialLang(): Lang {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "en" || saved === "fr") return saved;
  return window.navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const value: LanguageContextValue = {
    lang,
    setLang,
    toggleLang: () => setLang((l) => (l === "en" ? "fr" : "en")),
    t: dictionaries[lang],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside a LanguageProvider");
  return ctx;
}
