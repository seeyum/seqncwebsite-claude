import { CALENDLY } from "../theme";

type Size = "sm" | "md" | "lg";

const sizes: Record<Size, React.CSSProperties> = {
  sm: { fontSize: 14, padding: "14px 18px", borderRadius: 9 },
  md: { fontSize: 16, padding: "15px 24px", borderRadius: 11 },
  lg: { fontSize: 17, padding: "18px 32px", borderRadius: 12 },
};

export default function Cta({ label, size = "md", glow = false, arrow = true }: { label: string; size?: Size; glow?: boolean; arrow?: boolean }) {
  return (
    <a
      href={CALENDLY}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        background: "#7C4DCC",
        color: "#fff",
        fontWeight: 600,
        whiteSpace: "nowrap",
        boxShadow: glow ? "0 0 50px rgba(124,77,204,0.36)" : undefined,
        transition: "background 180ms ease, transform 180ms ease, box-shadow 180ms ease",
        ...sizes[size],
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#8F62DC";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#7C4DCC";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {label}
      {arrow && <span style={{ fontSize: 18, lineHeight: 1 }}>→</span>}
    </a>
  );
}
