import * as stylex from "@stylexjs/stylex";

import { colors } from "./tokens.stylex";

const softDark = {
  page: "#141318",
  surface: "#1a191f",
  surfaceMuted: "#212027",
  ink: "#e3e1e8",
  inkMuted: "#a3a1ab",
  inkFaint: "#706e78",
  line: "#2a2930",
  lineStrong: "#3a3842",
  accent: "#5b80ff",
  accentInk: "#8fb8ff",
  accentSoft: "#1a2445",
  buttonBg: "#e3e1e8",
  buttonInk: "#141318",
  buttonGhostBg: "#1a191f",
  buttonGhostHover: "#23222a",
  success: "#5fd08f",
  successSoft: "#13281d",
  warning: "#f0b54a",
  warningSoft: "#2e220e",
  danger: "#ff7a66",
  dangerSoft: "#311612",
};

export const softDarkTheme = stylex.createTheme(colors, softDark);

const prefersDark = "@media (prefers-color-scheme: dark)";
// StyleX leaves a `null` default unset, so light keeps the base tokens; its types only allow strings.
const unset = null as unknown as string;

// softDarkTheme applied only when the OS prefers dark, for the "system" preference.
export const systemSoftDarkTheme = stylex.createTheme(colors, {
  page: { default: unset, [prefersDark]: softDark.page },
  surface: { default: unset, [prefersDark]: softDark.surface },
  surfaceMuted: { default: unset, [prefersDark]: softDark.surfaceMuted },
  ink: { default: unset, [prefersDark]: softDark.ink },
  inkMuted: { default: unset, [prefersDark]: softDark.inkMuted },
  inkFaint: { default: unset, [prefersDark]: softDark.inkFaint },
  line: { default: unset, [prefersDark]: softDark.line },
  lineStrong: { default: unset, [prefersDark]: softDark.lineStrong },
  accent: { default: unset, [prefersDark]: softDark.accent },
  accentInk: { default: unset, [prefersDark]: softDark.accentInk },
  accentSoft: { default: unset, [prefersDark]: softDark.accentSoft },
  buttonBg: { default: unset, [prefersDark]: softDark.buttonBg },
  buttonInk: { default: unset, [prefersDark]: softDark.buttonInk },
  buttonGhostBg: { default: unset, [prefersDark]: softDark.buttonGhostBg },
  buttonGhostHover: { default: unset, [prefersDark]: softDark.buttonGhostHover },
  success: { default: unset, [prefersDark]: softDark.success },
  successSoft: { default: unset, [prefersDark]: softDark.successSoft },
  warning: { default: unset, [prefersDark]: softDark.warning },
  warningSoft: { default: unset, [prefersDark]: softDark.warningSoft },
  danger: { default: unset, [prefersDark]: softDark.danger },
  dangerSoft: { default: unset, [prefersDark]: softDark.dangerSoft },
});
