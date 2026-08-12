import { useLanguage } from "../i18n/LanguageContext";
import { c, display, h2, label } from "../theme";
import Reveal from "./Reveal";
import Counter from "./Counter";

export default function Problem() {
  const { t } = useLanguage();

  return (
    <div id="leaks" style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(72px,8vw,120px) 32px" }}>
      <Reveal style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(320px,100%),1fr))", gap: "clamp(36px,5vw,72px)", alignItems: "start" }}>
        <div>
          <div style={label}>{t.problem.label}</div>
          <h2 style={h2}>{t.problem.title}</h2>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: c.muted, margin: 0, maxWidth: "26em" }}>{t.problem.body}</p>
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          {t.problem.items.map((item) => (
            <div
              key={item}
              style={{ padding: 22, border: "1px solid " + c.line, borderRadius: 13, background: c.card, transition: "border-color 200ms ease, transform 200ms ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(124,77,204,0.45)"; e.currentTarget.style.transform = "translateX(4px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(124,77,204,0.18)"; e.currentTarget.style.transform = "translateX(0)"; }}
            >
              <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: c.text }}>{item}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* dividers are drawn by the 1px grid gap so they stay correct when the row wraps */}
      <Reveal
        fade
        style={{
          margin: "clamp(40px,5vw,64px) -28px 0",
          borderTop: "1px solid " + c.line,
          borderBottom: "1px solid " + c.line,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(min(240px,100%),1fr))",
          gap: 1,
          background: c.line,
        }}
      >
        {t.benchmarks.stats.map((stat, i) => (
          <div key={stat.label} style={{ background: c.bg, padding: "26px 28px" }}>
            <Counter
              value={stat.value}
              suffix={stat.suffix}
              style={{ fontFamily: display, fontSize: "clamp(30px,3vw,38px)", fontWeight: 700, letterSpacing: "-0.03em", color: i === 2 ? c.peri : c.violetLight, lineHeight: 1, marginBottom: 10 }}
            />
            <div style={{ fontSize: 14, color: c.muted, lineHeight: 1.5 }}>{stat.label}</div>
          </div>
        ))}
      </Reveal>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: c.faintest, margin: "16px 0 0", maxWidth: "52em" }}>{t.benchmarks.disclaimer}</p>
    </div>
  );
}
