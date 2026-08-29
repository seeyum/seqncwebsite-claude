import { useLanguage } from "../i18n/LanguageContext";
import { c, display, h2, label, mono } from "../theme";
import Reveal from "./Reveal";

const CYCLE = "11s";

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
  e.currentTarget.style.borderColor = on ? "rgba(174,107,236,0.5)" : c.line;
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
const mockPanel: React.CSSProperties = {
  border: "1px solid rgba(124,77,204,0.16)",
  borderRadius: 11,
  background: c.inner,
  padding: 16,
  display: "grid",
  gap: 10,
  minHeight: 196,
  alignContent: "start",
};
const chipLabel: React.CSSProperties = { fontFamily: mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: c.faintest };
const cycleIn = (slot: number): React.CSSProperties => ({ opacity: 0, animation: `seqnc-in-${slot} ${CYCLE} ease-in-out infinite` });

function TryButton({ to, note }: { to: string; note: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", paddingTop: 4 }}>
      <a
        href={to}
        style={{ display: "inline-flex", alignItems: "center", gap: 9, background: c.violet, color: "#fff", fontSize: 15, fontWeight: 600, padding: "13px 22px", borderRadius: 10, transition: "background 200ms ease" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#8F5CE0")}
        onMouseLeave={(e) => (e.currentTarget.style.background = c.violet)}
      >
        {note}
        <span style={{ fontSize: 15, lineHeight: 1 }}>→</span>
      </a>
    </div>
  );
}

export default function Demos() {
  const { t } = useLanguage();
  const d = t.demos;
  const pickedSlot = (i: number) => d.inbound.options.slice(0, i).filter((o) => o.picked).length + 1;

  return (
    <div id="demos" style={{ borderTop: "1px solid " + c.line }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(72px,8vw,120px) 32px" }}>
        <Reveal>
          <div style={{ maxWidth: "44em", marginBottom: "clamp(40px,5vw,64px)" }}>
            <div style={label}>{d.label}</div>
            <h2 style={h2}>{d.title}</h2>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: c.muted, margin: 0 }}>{d.body}</p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(320px,100%),1fr))", gap: 20 }}>
          <Reveal>
            <div style={cardStyle} onMouseEnter={(e) => cardHover(e, true)} onMouseLeave={(e) => cardHover(e, false)}>
              {tagRow("01", d.inbound.tag, c.violet)}
              <h3 style={cardTitle}>{d.inbound.title}</h3>
              <p style={cardBody}>{d.inbound.body}</p>
              <div style={{ ...mockPanel, gap: 9 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <span style={chipLabel}>{d.inbound.question}</span>
                  <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.08em", color: c.peri, fontVariantNumeric: "tabular-nums" }}>{d.inbound.progress}</span>
                </div>
                {d.inbound.options.map((o, i) => (
                  <div
                    key={o.text}
                    data-mock={o.picked ? "sel" : undefined}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      border: "1px solid rgba(124,77,204,0.2)",
                      borderRadius: 9,
                      background: "#150F27",
                      padding: "10px 12px",
                      fontSize: 13,
                      color: o.picked ? c.text : "#8A84A2",
                      animation: o.picked ? `seqnc-sel-${pickedSlot(i)} ${CYCLE} ease-in-out infinite` : undefined,
                    }}
                  >
                    {o.picked ? (
                      <span data-mock="in" style={{ ...cycleIn(pickedSlot(i)), width: 14, height: 14, borderRadius: 4, background: "rgba(124,77,204,0.3)", border: "1px solid rgba(174,107,236,0.7)", color: c.text, fontSize: 9, lineHeight: "12px", textAlign: "center", flexShrink: 0, display: "block" }}>✓</span>
                    ) : (
                      <span style={{ width: 14, height: 14, borderRadius: 4, border: "1px solid rgba(124,77,204,0.35)", flexShrink: 0, display: "block" }} />
                    )}
                    {o.text}
                  </div>
                ))}
                <div data-mock="in" style={{ ...cycleIn(3), display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, border: "1px solid rgba(126,154,245,0.45)", borderRadius: 9, background: "rgba(126,154,245,0.1)", padding: "12px 13px", marginTop: 3 }}>
                  <span style={{ fontSize: 13, color: c.text, fontWeight: 500 }}>{d.inbound.result}</span>
                  <span style={{ fontFamily: display, fontSize: 15, fontWeight: 700, color: c.peri, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>$200–$460</span>
                </div>
              </div>
              <TryButton to="/demo/inbound/" note={d.cta} />
            </div>
          </Reveal>

          <Reveal>
            <div style={cardStyle} onMouseEnter={(e) => cardHover(e, true)} onMouseLeave={(e) => cardHover(e, false)}>
              {tagRow("02", d.operations.tag, c.violet)}
              <h3 style={cardTitle}>{d.operations.title}</h3>
              <p style={cardBody}>{d.operations.body}</p>
              <div style={{ ...mockPanel, gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <span style={chipLabel}>{d.operations.panelLabel}</span>
                  <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.08em", color: c.violetLight, fontVariantNumeric: "tabular-nums" }}>{d.operations.stepCount}</span>
                </div>
                <div style={{ height: 5, borderRadius: 99, background: "rgba(124,77,204,0.16)", overflow: "hidden" }}>
                  <div data-mock="bar" style={{ height: "100%", width: "4%", borderRadius: 99, background: `linear-gradient(90deg, ${c.violet}, ${c.peri})`, animation: `seqnc-fill ${CYCLE} ease-in-out infinite` }} />
                </div>
                <div style={{ display: "grid", gap: 9 }}>
                  {d.operations.steps.map((s, i) => (
                    <div key={s} style={{ display: "flex", alignItems: "center", gap: 11, fontSize: 13, color: c.text, lineHeight: 1.4 }}>
                      <span data-mock="in" style={{ ...cycleIn(i + 1), width: 15, height: 15, borderRadius: 4, background: "rgba(126,154,245,0.18)", border: "1px solid rgba(126,154,245,0.5)", color: c.peri, fontSize: 10, lineHeight: "13px", textAlign: "center", flexShrink: 0, display: "block" }}>
                        ✓
                      </span>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
              <TryButton to="/demo/operations/" note={d.cta} />
            </div>
          </Reveal>

          <Reveal>
            <div style={cardStyle} onMouseEnter={(e) => cardHover(e, true)} onMouseLeave={(e) => cardHover(e, false)}>
              {tagRow("03", d.outbound.tag, c.peri)}
              <h3 style={cardTitle}>{d.outbound.title}</h3>
              <p style={cardBody}>{d.outbound.body}</p>
              <div style={mockPanel}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, paddingBottom: 2 }}>
                  <span style={chipLabel}>{d.outbound.panelLabel}</span>
                  <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.08em", color: c.peri, fontVariantNumeric: "tabular-nums" }}>{d.outbound.count}</span>
                </div>
                {d.outbound.rows.map((r, i) => (
                  <div key={r.when}>
                    {i > 0 && <div style={{ height: 1, background: "rgba(124,77,204,0.12)", marginBottom: 10 }} />}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 10, fontSize: 13, color: c.text }}>
                      <span>{r.when}</span>
                      <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.08em", fontVariantNumeric: "tabular-nums", color: "#8A84A2" }}>{r.spend}</span>
                    </div>
                  </div>
                ))}
              </div>
              <TryButton to="/demo/outbound/" note={d.cta} />
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
