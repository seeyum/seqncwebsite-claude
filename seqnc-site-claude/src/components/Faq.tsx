import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { c, display, label, mono } from "../theme";
import Reveal from "./Reveal";

export default function Faq() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(0);

  return (
    <div id="faq" style={{ borderTop: "1px solid " + c.line, background: c.bgAlt }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "clamp(72px,8vw,120px) 32px" }}>
        <Reveal fade style={{ marginBottom: "clamp(32px,4vw,48px)" }}>
          <div style={label}>{t.faq.label}</div>
          <h2 style={{ fontFamily: display, fontSize: "clamp(30px,3.6vw,44px)", lineHeight: 1.05, letterSpacing: "-0.03em", fontWeight: 700, margin: 0 }}>{t.faq.title}</h2>
        </Reveal>
        <Reveal fade style={{ borderTop: "1px solid " + c.line }}>
          {t.faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} style={{ borderBottom: "1px solid " + c.line }}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  style={{ width: "100%", background: "none", border: "none", padding: "22px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, cursor: "pointer", textAlign: "left", color: c.text, fontFamily: display }}
                >
                  <span style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.45 }}>{item.q}</span>
                  <span style={{ fontFamily: mono, fontSize: 16, color: c.violetLight, flexShrink: 0, lineHeight: 1.5 }}>{isOpen ? "−" : "+"}</span>
                </button>
                <div style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0, transition: "grid-template-rows 320ms cubic-bezier(0.2,0.7,0.2,1), opacity 260ms ease" }}>
                  <div style={{ overflow: "hidden" }}>
                    <p style={{ margin: "0 0 24px", paddingRight: "clamp(0px,4vw,48px)", fontSize: 16, lineHeight: 1.65, color: c.muted }}>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </div>
  );
}
