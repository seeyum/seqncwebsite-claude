export const c = {
  bg: "#0E0820",
  bgAlt: "#0B0619",
  card: "#140E24",
  cardAlt: "#171029",
  inner: "#0F0A1E",
  text: "#EFEAF9",
  textSoft: "#C9C3DC",
  muted: "#9B95B4",
  faint: "#7E7898",
  faintest: "#7E7898",
  violet: "#7C4DCC",
  violetLight: "#A87BE8",
  violetBright: "#AE6BEC",
  peri: "#7E9AF5",
  line: "rgba(124,77,204,0.18)",
};

export const display = "'Plus Jakarta Sans', sans-serif";
export const mono = "'Azeret Mono', monospace";

export const label: React.CSSProperties = {
  fontFamily: mono,
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: c.violetLight,
  marginBottom: 16,
};

export const h2: React.CSSProperties = {
  fontFamily: display,
  fontSize: "clamp(30px,3.6vw,46px)",
  lineHeight: 1.05,
  letterSpacing: "-0.03em",
  fontWeight: 700,
  margin: "0 0 18px",
  textWrap: "balance" as never,
};

export const hexGrid =
  "repeating-linear-gradient(60deg,rgba(174,107,236,0.04) 0 1px,transparent 1px 64px)," +
  "repeating-linear-gradient(-60deg,rgba(174,107,236,0.04) 0 1px,transparent 1px 64px)";

export const CALENDLY = "https://calendly.com/seqnc/free-review";
