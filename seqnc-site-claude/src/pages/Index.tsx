import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import WhoStrip from "../components/WhoStrip";
import Problem from "../components/Problem";
import Systems from "../components/Systems";
import CaseStudy from "../components/CaseStudy";
import Process from "../components/Process";
import Pricing from "../components/Pricing";
import Faq from "../components/Faq";
import ClosingCta from "../components/ClosingCta";
import Footer from "../components/Footer";
import { c } from "../theme";

export default function Index() {
  return (
    <div style={{ background: c.bg, color: c.text, overflowX: "clip" }}>
      <a
        href="#main"
        style={{ position: "absolute", left: -9999, top: 0, zIndex: 60, background: c.violet, color: "#fff", fontSize: 14, fontWeight: 600, padding: "12px 18px", borderRadius: "0 0 9px 0" }}
        onFocus={(e) => (e.currentTarget.style.left = "0px")}
        onBlur={(e) => (e.currentTarget.style.left = "-9999px")}
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
      <Hero />
      <WhoStrip />
      <Problem />
      <Systems />
      <CaseStudy />
      <Process />
      <Pricing />
      <Faq />
      <ClosingCta />
      </main>
      <Footer />
    </div>
  );
}
