import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { c, display, hexGrid, mono } from "../theme";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type Section = { heading: string; paragraphs?: string[]; list?: string[]; after?: string[] };

const EMAIL = "seqnc.ai@gmail.com";

function withEmail(text: string) {
  if (!text.includes(EMAIL)) return text;
  const [before, after] = text.split(EMAIL);
  return (
    <>
      {before}
      <a href={"mailto:" + EMAIL}>{EMAIL}</a>
      {after}
    </>
  );
}

function withBold(text: string) {
  if (!text.includes("**")) return text;
  return text.split("**").map((part, i) => (i % 2 === 1 ? <strong key={i} style={{ color: c.text, fontWeight: 600 }}>{part}</strong> : part));
}

const body: React.CSSProperties = { margin: 0, fontSize: 16, lineHeight: 1.7, color: c.muted, textWrap: "pretty" as never };

export default function LegalPage({ title, sections, current }: { title: string; sections: readonly Section[]; current: "privacy" | "terms" }) {
  const { t } = useLanguage();

  return (
    <div style={{ background: c.bg, color: c.text, minHeight: "100vh", backgroundImage: hexGrid }}>
      <Navbar compact />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(48px,6vw,88px) 32px clamp(64px,7vw,110px)" }}>
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: mono, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: c.muted, marginBottom: 44 }}>
          <span style={{ display: "block", width: 18, height: 1, background: c.violet }} />
          {t.legal.backToHome}
        </Link>

        <h1 style={{ fontFamily: display, fontSize: "clamp(34px,4.6vw,54px)", lineHeight: 1.02, letterSpacing: "-0.035em", fontWeight: 700, margin: "0 0 12px" }}>{title}</h1>
        <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: c.faint, paddingBottom: 38, borderBottom: "1px solid rgba(124,77,204,0.2)" }}>{t.legal.lastUpdated}</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 44, paddingTop: 44 }}>
          {sections.map((section) => (
            <section key={section.heading} style={{ display: "grid", gap: 12 }}>
              <h2 style={{ fontFamily: display, fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>{section.heading}</h2>
              {section.paragraphs?.map((p) => <p key={p} style={body}>{withEmail(p)}</p>)}
              {section.list && (
                <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 7, fontSize: 16, lineHeight: 1.7, color: c.muted }}>
                  {section.list.map((item) => <li key={item}>{withBold(item)}</li>)}
                </ul>
              )}
              {section.after?.map((p) => <p key={p} style={body}>{withEmail(p)}</p>)}
            </section>
          ))}
        </div>
      </main>
      <Footer compact current={current} />
    </div>
  );
}
