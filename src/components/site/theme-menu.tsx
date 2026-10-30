import * as stylex from "@stylexjs/stylex";
import { Monitor, Moon, Sun } from "lucide-react";

import {
  MenuLabel,
  MenuPopup,
  MenuRadioGroup,
  MenuRoot,
  MenuTrigger,
} from "@/src/components/kit/menu";
import { setThemePreference, themePreferences, useThemePreference } from "@/src/lib/theme";
import { colors } from "@/src/styles/tokens.stylex";

const themeIcons = { light: Sun, dark: Moon, system: Monitor };

export function ThemeMenu() {
  const preference = useThemePreference();
  const Icon = themeIcons[preference];

  return (
    <MenuRoot>
      <MenuTrigger aria-label="theme" xstyle={styles.trigger}>
        <Icon size={15} />
      </MenuTrigger>
      <MenuPopup align="end" xstyle={styles.popup}>
        <MenuLabel>theme</MenuLabel>
        <MenuRadioGroup
          value={preference}
          onValueChange={setThemePreference}
          options={themePreferences}
        />
      </MenuPopup>
    </MenuRoot>
  );
}

const styles = stylex.create({
  trigger: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: 32,
    height: 32,
    padding: 0,
    borderWidth: 0,
    borderRadius: 6,
    backgroundColor: { default: "transparent", ":hover": colors.surfaceMuted },
    color: colors.inkMuted,
    boxShadow: `inset 0 0 0 1px ${colors.line}`,
    cursor: "pointer",
  },
  popup: { minWidth: 140 },
});
