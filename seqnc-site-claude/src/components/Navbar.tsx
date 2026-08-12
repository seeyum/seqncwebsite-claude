import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";
import { c } from "../theme";
import logo from "../assets/seqnc-lockup-night.svg";
import LangToggle from "./LangToggle";
import Cta from "./Cta";

const BREAKPOINT = 820;
const SECTIONS = ["leaks", "systems", "process", "pricing"];

export default function Navbar({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();
  const [mobile, setMobile] = useState(() => (typeof window === "undefined" ? false : window.innerWidth < BREAKPOINT));
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onResize = () => {
      const next = window.innerWidth < BREAKPOINT;
      setMobile(next);
      if (!next) setMenuOpen(false);
    };
    const onScroll = () => {
      let current = "";
      SECTIONS.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) current = id;
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const items = [
    { id: "leaks", href: "/#leaks", label: t.nav.problem },
    { id: "systems", href: "/#systems", label: t.nav.systems },
    { id: "process", href: "/#process", label: t.nav.process },
    { id: "pricing", href: "/#pricing", label: t.nav.pricing },
  ];

  const showLinks = !compact && !mobile;
  const showBurger = !compact && mobile;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "rgba(14,8,32,0.82)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid " + c.line,
      }}
    >
      <div
        style={{
          maxWidth: compact ? 900 : 1400,
          margin: "0 auto",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <Link to="/" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <img src={logo} alt="Seqnc Automations" style={{ height: compact ? 30 : 34, width: "auto", display: "block" }} />
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(14px,2vw,30px)", justifyContent: "flex-end" }}>
          {showLinks && (
            <nav aria-label="Main" style={{ display: "flex", alignItems: "center", gap: "clamp(14px,2vw,30px)" }}>
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={active === item.id ? "true" : undefined}
                  style={{ color: active === item.id ? c.text : c.muted, fontSize: 14 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = c.text)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = active === item.id ? c.text : c.muted)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}
          <LangToggle />
          <Cta label={t.nav.cta} size="sm" arrow={false} />
          {showBurger && (
            <button
              type="button"
              aria-label="Menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5, width: 44, height: 44, marginRight: -10, background: "none", border: "none", padding: 0, cursor: "pointer" }}
            >
              <span style={{ display: "block", width: 20, height: 1.5, background: c.text }} />
              <span style={{ display: "block", width: 20, height: 1.5, background: c.text }} />
            </button>
          )}
        </div>
      </div>

      {showBurger && menuOpen && (
        <nav aria-label="Mobile" style={{ maxWidth: 1400, margin: "0 auto", padding: "8px 32px 22px", display: "flex", flexDirection: "column", borderTop: "1px solid rgba(124,77,204,0.14)" }}>
          {items.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{ color: c.textSoft, fontSize: 16, padding: "14px 0", borderBottom: i === items.length - 1 ? undefined : "1px solid rgba(124,77,204,0.12)" }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
