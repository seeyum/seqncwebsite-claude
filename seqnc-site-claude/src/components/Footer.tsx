import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { c, mono } from "../theme";
import logo from "../assets/seqnc-lockup-night.svg";

export default function Footer({ compact = false, current }: { compact?: boolean; current?: "privacy" | "terms" }) {
  const { t } = useLanguage();
  const linkStyle = (active: boolean): React.CSSProperties => ({ color: active ? c.text : c.muted, fontSize: 14 });

  return (
    <footer style={{ borderTop: "1px solid " + c.line }}>
      <div
        style={{
          maxWidth: compact ? 900 : 1400,
          margin: "0 auto",
          padding: compact ? "30px 32px" : "44px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 28,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {!compact && <img src={logo} alt="Seqnc Automations" style={{ height: 30, width: "auto", display: "block" }} />}
          <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.1em", color: c.faintest }}>{t.footer.tagline}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <Link to="/privacy" style={linkStyle(current === "privacy")}>{t.footer.privacy}</Link>
          <Link to="/terms" style={linkStyle(current === "terms")}>{t.footer.terms}</Link>
        </div>
      </div>
    </footer>
  );
}
