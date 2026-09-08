import { useLanguage } from "../i18n/LanguageContext";
import { c, mono } from "../theme";

export default function LangToggle() {
  const { lang, toggleLang } = useLanguage();
  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={lang === "en" ? "Passer en français" : "Switch to English"}
      style={{
        background: "none",
        border: "none",
        padding: "12px 8px",
        margin: "-12px -8px",
        cursor: "pointer",
        fontFamily: mono,
        fontSize: 11,
        letterSpacing: "0.14em",
        color: c.faint,
      }}
    >
      <span style={{ color: lang === "en" ? c.text : c.faint, fontWeight: lang === "en" ? 500 : 400 }}>EN</span>
      {" / "}
      <span style={{ color: lang === "fr" ? c.text : c.faint, fontWeight: lang === "fr" ? 500 : 400 }}>FR</span>
    </button>
  );
}
