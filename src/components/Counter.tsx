import { useEffect, useRef, useState } from "react";

export default function Counter({ value, suffix = "", prefix = "", style }: { value: number; suffix?: string; prefix?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setShown(value); return; }
    let raf = 0;
    const run = () => {
      const dur = 1300;
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    if (!("IntersectionObserver" in window)) { run(); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting && e.boundingClientRect.bottom > 0) return;
        run();
        io.unobserve(e.target);
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value]);

  return <div ref={ref} style={{ fontVariantNumeric: "tabular-nums", ...style }}>{prefix}{shown}{suffix}</div>;
}
