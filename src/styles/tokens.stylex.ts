import * as stylex from "@stylexjs/stylex";

export const colors = stylex.defineVars({
  page: "#f9f9f7",
  surface: "#ffffff",
  surfaceMuted: "#f2f1ee",
  ink: "#0e0d12",
  inkMuted: "#57555e",
  inkFaint: "#8c8a93",
  line: "#e6e5e1",
  lineStrong: "#d0cec9",
  accent: "#425de3",
  accentInk: "#2c45c2",
  accentSoft: "#e9eefc",
  buttonBg: "#0e0d12",
  buttonInk: "#f9f9f7",
  buttonGhostBg: "#ffffff",
  buttonGhostHover: "#f2f1ee",
  success: "#16804a",
  successSoft: "#e6f4ec",
  warning: "#a86500",
  warningSoft: "#fbf0dc",
  danger: "#c8321f",
  dangerSoft: "#fbe9e6",
});

export const code = stylex.defineVars({
  bg: "#000000",
  surface: "#0b0a0e",
  border: "#25232b",
  ink: "#e9e8ec",
  muted: "#7b7984",
  accent: "#8fd3ff",
  success: "#7ed4a0",
  keyword: "#a9c4ff",
  type: "#e3f2ff",
  number: "#ffc9a8",
  punctuation: "#a3a1ab",
});

export const fonts = stylex.defineVars({
  sans: '"Inter Tight Variable", ui-sans-serif, system-ui, sans-serif',
  mono: '"Geist Mono Variable", ui-monospace, SFMono-Regular, Menlo, monospace',
});

export const media = stylex.defineConsts({
  laptop: "@media (max-width: 1240px)",
  tablet: "@media (max-width: 960px)",
  phone: "@media (max-width: 640px)",
  hover: "@media (hover: hover) and (pointer: fine)",
});

export const layout = stylex.defineConsts({
  maxWidth: "1280px",
  gutter: "clamp(1rem, 3vw, 2.5rem)",
  headerHeight: "56px",
});
