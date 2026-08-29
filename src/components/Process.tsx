import { useEffect, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { c, display, h2, hexGrid, label, mono } from "../theme";
import Reveal from "./Reveal";

const BREAKPOINT = 820;

export default function Process() {
  const { t } = useLanguage();
  const [hot, setHot] = useState(-1);
  const [stacked, setStacked] = useState(() => (typeof window === "undefined" ? false : window.innerWidth < BREAKPOINT));

  useEffect(() => {
    const onResize = () => setStacked(window.innerWidth < BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div id="process" style={{ borderTop: "1px solid " + c.line, background: c.bgAlt, backgroundImage: hexGrid }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(72px,8vw,120px) 32px" }}>
        <Reveal fade style={{ maxWidth: "42em", marginBottom: "clamp(40px,5vw,64px)" }}>
          <div style={label}>{t.process.label}</div>
          <h2 style={h2}>{t.process.title}</h2>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: c.muted, margin: 0 }}>{t.process.body}</p>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: stacked ? "1fr" : "repeat(4,1fr)" }}>
          {t.process.steps.map((step, i) => {
            const active = hot === i;
            const last = i === t.process.steps.length - 1;
            const accent = last ? c.peri : c.violet;
            const bright = last ? "#9DB2F8" : c.violetBright;
            const lineColor = active ? bright : "rgba(124,77,204,0.42)";
            const paint = last
              ? "linear-gradient(" + (stacked ? "180deg" : "90deg") + "," + lineColor + " 42%,transparent)"
              : lineColor;

            return (
              <Reveal
                key={step.title}
                delay={i * 80}
                railAxis={stacked ? "y" : "x"}
                onMouseEnter={() => setHot(i)}
                onMouseLeave={() => setHot(-1)}
                rail={
                  stacked
                    ? { position: "absolute", top: 0, bottom: 0, left: 0, width: 1, background: paint }
                    : { position: "absolute", top: 0, left: 0, right: 0, height: 1, background: paint }
                }
                style={{
                  position: "relative",
                  padding: stacked ? "0 0 34px 26px" : "34px 34px 0 0",
                  background: active
                    ? stacked
                      ? "linear-gradient(90deg,rgba(124,77,204,0.11),rgba(124,77,204,0))"
                      : "linear-gradient(180deg,rgba(124,77,204,0.11),rgba(124,77,204,0))"
                    : "transparent",
                  transition: "background 220ms ease",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    ...(stacked ? { top: 0, left: -4 } : { top: -4, left: 0 }),
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    boxSizing: "border-box",
                    background: active ? bright : c.bgAlt,
                    border: "1.5px solid " + (active ? bright : accent),
                    transition: "background 220ms ease, border-color 220ms ease",
                  }}
                />
                <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.16em", color: active ? bright : accent, marginBottom: 16, transition: "color 220ms ease" }}>
                  {"0" + (i + 1)}
                </div>
                <h3 style={{ fontFamily: display, fontSize: 19, lineHeight: 1.25, fontWeight: 600, margin: "0 0 12px", letterSpacing: "-0.015em", color: active ? "#FFFFFF" : c.text, transition: "color 220ms ease" }}>
                  {step.title}
                </h3>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: active ? c.textSoft : c.muted, maxWidth: "26em", transition: "color 220ms ease" }}>
                  {step.desc}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
