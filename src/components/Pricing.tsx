import { useLanguage } from "../i18n/LanguageContext";
import { c, display, h2, label } from "../theme";
import Reveal from "./Reveal";
import Cta from "./Cta";

export default function Pricing() {
  const { t } = useLanguage();

  return (
    <div id="pricing" style={{ borderTop: "1px solid " + c.line }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(72px,8vw,120px) 32px" }}>
        <Reveal style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(340px,100%),1fr))", gap: "clamp(36px,5vw,64px)", alignItems: "start" }}>
          <div>
            <div style={label}>{t.pricing.label}</div>
            <h2 style={h2}>{t.pricing.title}</h2>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: c.muted, margin: "0 0 28px", maxWidth: "28em" }}>{t.pricing.body}</p>
            <Cta label={t.pricing.cta} size="md" />
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {t.pricing.items.map((item, i) => {
              const highlight = i === 2;
              return (
                <div
                  key={item.title}
                  style={{
                    padding: "22px 24px",
                    border: "1px solid " + (highlight ? "rgba(126,154,245,0.3)" : c.line),
                    borderRadius: 13,
                    background: highlight ? "linear-gradient(180deg,#151635,#101126)" : c.card,
                  }}
                >
                  <div style={{ fontFamily: display, fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{item.title}</div>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: c.muted }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
