import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/** fade: opacity only (section intros, full-width strips). lift: opacity + rise (cards). */
export default function Reveal({ children, style, delay = 0, fade = false, rail, railAxis = "x", onMouseEnter, onMouseLeave }: { children: ReactNode; style?: CSSProperties; delay?: number; fade?: boolean; rail?: CSSProperties; railAxis?: "x" | "y"; onMouseEnter?: () => void; onMouseLeave?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const show = () => {
      el.style.transition = reduce
        ? "opacity 200ms linear"
        : "opacity 700ms cubic-bezier(0.2,0.7,0.2,1), transform 700ms cubic-bezier(0.2,0.7,0.2,1)";
      el.style.transitionDelay = (narrow ? Math.round(delay * 0.4) : delay) + "ms";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
      setShown(true);
    };
    const narrow = window.matchMedia && window.matchMedia("(max-width: 820px)").matches;
    if (!("IntersectionObserver" in window)) { show(); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting || e.boundingClientRect.bottom < 0) { show(); io.unobserve(e.target); }
      });
    }, narrow ? { rootMargin: "0px 0px 18% 0px", threshold: 0 } : { rootMargin: "-8% 0px -12% 0px", threshold: 0.05 });
    io.observe(el);
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) show();
    return () => io.disconnect();
  }, [delay]);

  return (
    <div ref={ref} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} data-reveal="1" style={{ opacity: 0, transform: fade ? "none" : "translateY(26px)", ...style }}>
      {rail && (
        <span
          aria-hidden="true"
          style={{
            ...rail,
            transform: shown ? "scale(1,1)" : railAxis === "y" ? "scale(1,0)" : "scale(0,1)",
            transformOrigin: railAxis === "y" ? "top" : "left",
            transition: "transform 620ms cubic-bezier(0.2,0.7,0.2,1), background 220ms ease",
            transitionDelay: delay + 140 + "ms",
          }}
        />
      )}
      {children}
    </div>
  );
}
