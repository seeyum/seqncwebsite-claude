import { useLanguage } from "../i18n/LanguageContext";
import { c, display, mono } from "../theme";
import Reveal from "./Reveal";
import Cta from "./Cta";

export default function ClosingCta() {
  const { t } = useLanguage();

  return (
    <div
      style={{
        position: "relative",
        borderTop: "1px solid " + c.line,
        overflow: "hidden",
        backgroundImage:
          "repeating-linear-gradient(60deg,rgba(174,107,236,0.05) 0 1px,transparent 1px 64px)," +
          "repeating-linear-gradient(-60deg,rgba(174,107,236,0.05) 0 1px,transparent 1px 64px)",
      }}
    >
      <div data-orb="1" style={{ position: "absolute", bottom: -220, left: "50%", transform: "translateX(-50%)", width: 900, height: 520, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,77,204,0.24),transparent 70%)", filter: "blur(80px)", pointerEvents: "none", animation: "seqnc-drift 16s ease-in-out infinite" }} />
      <Reveal style={{ position: "relative", maxWidth: 820, margin: "0 auto", padding: "clamp(80px,9vw,132px) 32px", textAlign: "center" }}>
        <h2 style={{ fontFamily: display, fontSize: "clamp(32px,4.4vw,58px)", lineHeight: 1.02, letterSpacing: "-0.035em", fontWeight: 700, margin: "0 0 20px", textWrap: "balance" as never }}>{t.closing.title}</h2>
        <p style={{ fontSize: "clamp(16px,1.3vw,19px)", lineHeight: 1.6, color: c.muted, margin: "0 auto 32px", maxWidth: "32em" }}>{t.closing.body}</p>
        <Cta label={t.closing.cta} size="lg" glow />
        <p style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: c.faintest, margin: "22px 0 0" }}>{t.closing.note}</p>
      </Reveal>
    </div>
  );
}
