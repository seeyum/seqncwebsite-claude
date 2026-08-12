import { useLanguage } from "../i18n/LanguageContext";
import { c, display, h2, label, mono } from "../theme";
import Reveal from "./Reveal";

const cardStyle: React.CSSProperties = {
  border: "1px solid " + c.line,
  borderRadius: 16,
  background: c.card,
  padding: 30,
  display: "flex",
  flexDirection: "column",
  gap: 18,
  transition: "border-color 220ms ease, transform 220ms ease, background 220ms ease",
  height: "100%",
};

const cardHover = (e: React.MouseEvent<HTMLDivElement>, on: boolean) => {
  e.currentTarget.style.borderColor = on ? "rgba(174,107,236,0.5)" : "rgba(124,77,204,0.18)";
  e.currentTarget.style.transform = on ? "translateY(-4px)" : "translateY(0)";
  e.currentTarget.style.background = on ? "#181031" : c.card;
};

const tagRow = (num: string, tag: string, accent: string) => (
  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
    <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.16em", color: accent }}>{num}</span>
    <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: c.faintest }}>{tag}</span>
  </div>
);

const cardTitle: React.CSSProperties = { fontFamily: display, fontSize: 24, lineHeight: 1.15, letterSpacing: "-0.02em", fontWeight: 700, margin: 0 };
const cardBody: React.CSSProperties = { fontSize: 16, lineHeight: 1.6, color: c.muted, margin: 0 };
const panel: React.CSSProperties = { border: "1px solid rgba(124,77,204,0.16)", borderRadius: 11, background: c.inner, padding: 16 };

function Bullets({ items }: { items: string[] }) {
  return (
    <div style={{ display: "grid", gap: 11, marginTop: "auto", paddingTop: 8 }}>
      {items.map((b) => (
        <div key={b} style={{ display: "flex", gap: 11, alignItems: "flex-start", fontSize: 15, color: c.textSoft, lineHeight: 1.5 }}>
          <span style={{ width: 10, height: 1, background: c.violet, marginTop: 11, flexShrink: 0, display: "block" }} />
          {b}
        </div>
      ))}
    </div>
  );
}

export default function Systems() {
  const { t } = useLanguage();
  const s = t.systems;

  return (
    <div id="systems" style={{ borderTop: "1px solid " + c.line, background: c.bgAlt }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(72px,8vw,120px) 32px" }}>
        <Reveal fade style={{ maxWidth: "44em", marginBottom: "clamp(40px,5vw,64px)" }}>
          <div style={label}>{s.label}</div>
          <h2 style={h2}>{s.title}</h2>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: c.muted, margin: 0 }}>{s.body}</p>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(320px,100%),1fr))", gap: 20 }}>
          <Reveal>
            <div style={cardStyle} onMouseEnter={(e) => cardHover(e, true)} onMouseLeave={(e) => cardHover(e, false)}>
              {tagRow("01", s.inbound.tag, c.violet)}
              <h3 style={cardTitle}>{s.inbound.title}</h3>
              <p style={cardBody}>{s.inbound.body}</p>
              <div style={panel}>
                <div style={{ display: "flex", gap: 6 }}>
                  {s.inbound.channels.map((ch) => (
                    <div key={ch} style={{ flex: 1, textAlign: "center", fontFamily: mono, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: c.muted, border: "1px solid rgba(124,77,204,0.22)", borderRadius: 7, padding: "9px 4px" }}>{ch}</div>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "9px 0" }}>
                  <span style={{ width: 1, height: 12, background: "rgba(124,77,204,0.4)", display: "block" }} />
                  <span style={{ fontSize: 11, color: c.violet, lineHeight: 1 }}>▼</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, border: "1px solid rgba(124,77,204,0.45)", borderRadius: 8, background: "rgba(124,77,204,0.12)", padding: "11px 13px" }}>
                  <span style={{ fontSize: 13, color: c.text, fontWeight: 500 }}>{s.inbound.reply}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: mono, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: c.peri, whiteSpace: "nowrap" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.peri, display: "block", animation: "seqnc-pulse 2.4s ease-in-out infinite" }} />
                    {s.inbound.instantly}
                  </span>
                </div>
              </div>
              <Bullets items={s.inbound.bullets} />
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div style={cardStyle} onMouseEnter={(e) => cardHover(e, true)} onMouseLeave={(e) => cardHover(e, false)}>
              {tagRow("02", s.operations.tag, c.violet)}
              <h3 style={cardTitle}>{s.operations.title}</h3>
              <p style={cardBody}>{s.operations.body}</p>
              <div style={{ ...panel, display: "grid", gap: 0 }}>
                {s.operations.steps.map((step, i) => {
                  const last = i === s.operations.steps.length - 1;
                  return (
                    <div key={step.label} style={{ display: "flex", alignItems: "center", gap: 11, padding: last ? "8px 0 0" : "8px 0", borderLeft: last ? undefined : "1px solid rgba(124,77,204,0.28)", paddingLeft: 14, marginLeft: 3 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: i === 0 ? c.violet : last ? c.peri : "rgba(124,77,204,0.5)", display: "block", marginLeft: -18, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: c.text, flex: 1, fontWeight: last ? 500 : 400 }}>{step.label}</span>
                      <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: i === 0 ? c.violetLight : last ? c.peri : c.faint }}>{step.badge}</span>
                    </div>
                  );
                })}
              </div>
              <Bullets items={s.operations.bullets} />
            </div>
          </Reveal>

          <Reveal delay={180}>
            <div style={cardStyle} onMouseEnter={(e) => cardHover(e, true)} onMouseLeave={(e) => cardHover(e, false)}>
              {tagRow("03", s.outbound.tag, c.peri)}
              <h3 style={cardTitle}>{s.outbound.title}</h3>
              <p style={cardBody}>{s.outbound.body}</p>
              <div style={{ ...panel, display: "grid", gap: 10 }}>
                {s.outbound.sequence.map((row, i) => (
                  <div key={row.day} style={{ display: "contents" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "62px 1fr auto", alignItems: "center", gap: 10 }}>
                      <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.08em", color: c.faint }}>{row.day}</span>
                      <span style={{ fontSize: 13, color: c.text }}>{row.msg}</span>
                      <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: i < 2 ? c.peri : i === 2 ? c.violetLight : c.faint }}>{row.badge}</span>
                    </div>
                    {i < s.outbound.sequence.length - 1 && <div style={{ height: 1, background: "rgba(124,77,204,0.14)" }} />}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
