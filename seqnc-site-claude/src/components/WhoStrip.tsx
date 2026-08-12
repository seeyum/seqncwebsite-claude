import { useLanguage } from "../i18n/LanguageContext";
import { c, display, mono } from "../theme";

export default function WhoStrip() {
  const { t } = useLanguage();
  return (
    <div id="who" style={{ borderBottom: "1px solid " + c.line, background: c.bgAlt }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "38px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "clamp(24px,4vw,56px)", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: c.violetLight, marginBottom: 12 }}>{t.who.label}</div>
          <p style={{ fontFamily: display, fontSize: "clamp(19px,1.7vw,24px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.3, margin: 0, maxWidth: "20em" }}>{t.who.statement}</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", maxWidth: 640 }}>
          {t.who.chips.map((chip) => (
            <span key={chip} style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: c.textSoft, border: "1px solid rgba(124,77,204,0.3)", borderRadius: 999, padding: "8px 14px" }}>{chip}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
