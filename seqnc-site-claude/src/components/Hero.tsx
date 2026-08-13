import { useLanguage } from "../i18n/LanguageContext";
import { c, display, mono } from "../theme";
import Reveal from "./Reveal";
import Counter from "./Counter";
import Cta from "./Cta";

const barWidths = ["74%", "52%", "38%"];
const barHours = [6, 4, 3];

export default function Hero() {
  const { t } = useLanguage();

  return (
    <div
      id="top"
      style={{
        position: "relative",
        backgroundImage:
          "repeating-linear-gradient(60deg,rgba(174,107,236,0.05) 0 1px,transparent 1px 64px)," +
          "repeating-linear-gradient(-60deg,rgba(174,107,236,0.05) 0 1px,transparent 1px 64px)," +
          "repeating-linear-gradient(0deg,rgba(174,107,236,0.03) 0 1px,transparent 1px 55px)",
        borderBottom: "1px solid " + c.line,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -160,
          left: "12%",
          width: 640,
          height: 520,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(124,77,204,0.22),transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
          animation: "seqnc-drift 14s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "relative",
          maxWidth: 1400,
          margin: "0 auto",
          padding: "clamp(36px,4vw,60px) 32px clamp(56px,6vw,84px)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(430px,100%),1fr))",
          gap: "clamp(40px,5vw,72px)",
          alignItems: "end",
        }}
      >
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: mono, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: c.violetLight, marginBottom: 26, flexWrap: "wrap" }}>
            <span style={{ width: 26, height: 1, background: c.violet, display: "block" }} />
            {t.hero.label}
          </div>
          <h1 style={{ fontFamily: display, fontSize: "clamp(38px,5.6vw,74px)", lineHeight: 0.99, letterSpacing: "-0.035em", fontWeight: 700, margin: "0 0 24px", textWrap: "balance" as never }}>
            {t.hero.titleStart} <span style={{ color: "#8F86A8" }}>{t.hero.titleMuted}</span>
          </h1>
          <p style={{ fontSize: "clamp(17px,1.3vw,19px)", lineHeight: 1.6, color: c.muted, maxWidth: "31em", margin: "0 0 36px", textWrap: "pretty" as never }}>{t.hero.body}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
            <Cta label={t.hero.cta} size="md" glow />
            <span style={{ fontSize: 14, color: c.faint, maxWidth: "22em", lineHeight: 1.5 }}>{t.hero.note}</span>
          </div>
        </Reveal>

        <Reveal style={{ border: "1px solid " + c.line, borderRadius: 16, background: "linear-gradient(180deg,#171029,#120C22)", padding: 26 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 22 }}>
            <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: c.faint }}>{t.leakChart.title}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: mono, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: c.faint }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.peri, display: "block", animation: "seqnc-pulse 2.4s ease-in-out infinite" }} />
              {t.leakChart.tag}
            </div>
          </div>
          <div style={{ display: "grid", gap: 18 }}>
            {t.leakChart.rows.map((row, i) => (
              <div key={row.label}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 15, color: c.text }}>{row.label}</span>
                  <Counter
                    value={barHours[i]}
                    prefix="~"
                    suffix=" h"
                    style={{ fontFamily: mono, fontSize: 13, color: i === 2 ? c.peri : c.violetLight }}
                  />
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "rgba(124,77,204,0.14)", overflow: "hidden" }}>
                  <div
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      width: barWidths[i],
                      height: "100%",
                      background: i === 2 ? "linear-gradient(90deg,#4A63C4,#7E9AF5)" : "linear-gradient(90deg,#7C4DCC,#AE6BEC)",
                      transformOrigin: "left",
                      animation: "seqnc-grow 900ms " + i * 120 + "ms cubic-bezier(0.2,0.7,0.2,1) both",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        width: "44%",
                        background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.38),transparent)",
                        transform: "translateX(-120%)",
                        animation: "seqnc-sweep 1300ms cubic-bezier(0.3,0,0.2,1) " + (900 + i * 120) + "ms both",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid " + c.line, fontSize: 13, color: c.faint, lineHeight: 1.55 }}>{t.leakChart.footnote}</div>
        </Reveal>
      </div>
    </div>
  );
}
