import { useLanguage } from "../i18n/LanguageContext";
import { c, display, label, mono } from "../theme";
import Reveal from "./Reveal";

export default function CaseStudy() {
  const { t } = useLanguage();
  const w = t.work;

  return (
    <div id="work" style={{ borderTop: "1px solid " + c.line }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(72px,8vw,120px) 32px" }}>
        <Reveal style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(280px,100%),1fr))", gap: "clamp(36px,5vw,64px)", alignItems: "start" }}>
          <div>
            <div style={label}>{w.label}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10 }}>
              <div style={{ width: 62, height: 62, flexShrink: 0, borderRadius: 12, border: "1px solid rgba(124,77,204,0.28)", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <img src="/divos-logo.jpg" alt="Divos Detailing logo" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
              </div>
              <h2 style={{ fontFamily: display, fontSize: "clamp(28px,3vw,38px)", lineHeight: 1.06, letterSpacing: "-0.03em", fontWeight: 700, margin: 0 }}>{w.client}</h2>
            </div>
            <div style={{ fontSize: 14, color: c.faint, marginBottom: 22 }}>{w.meta}</div>
            <a href={w.liveUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: c.violetLight }}>
              {w.link}
              <span style={{ fontSize: 13 }}>↗</span>
            </a>
          </div>
          <div style={{ display: "grid", gap: 22 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(260px,100%),1fr))", gap: 1, background: c.line, border: "1px solid " + c.line, borderRadius: 14, overflow: "hidden" }}>
              <div style={{ background: c.bg, padding: 26 }}>
                <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: c.faint, marginBottom: 12 }}>{w.beforeLabel}</div>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: c.muted }}>{w.before}</p>
              </div>
              <div style={{ background: c.cardAlt, padding: 26 }}>
                <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: c.violetLight, marginBottom: 12 }}>{w.afterLabel}</div>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: c.text }}>{w.after}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {w.chips.map((chip) => (
                <span key={chip} style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: c.textSoft, border: "1px solid rgba(124,77,204,0.3)", borderRadius: 999, padding: "7px 13px" }}>{chip}</span>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 22px", border: "1px dashed rgba(124,77,204,0.32)", borderRadius: 13 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.peri, display: "block", flexShrink: 0, animation: "seqnc-pulse 2.4s ease-in-out infinite" }} />
              <p style={{ margin: 0, fontSize: 15, color: c.muted, lineHeight: 1.5 }}>{w.comingSoon}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
