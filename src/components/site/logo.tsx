import * as stylex from "@stylexjs/stylex";
import { useId, type SVGProps } from "react";

import { colors } from "@/src/styles/tokens.stylex";

// The body takes the current text color and the cut-out takes the page color, so it works on any theme.
export function Logo({
  xstyle,
  ...rest
}: SVGProps<SVGSVGElement> & { xstyle?: stylex.StyleXStyles }) {
  const gradientId = useId();

  return (
    <svg viewBox="0 0 512 512" aria-hidden {...rest} {...stylex.props(xstyle)}>
      <g transform="matrix(2.10849,0,0,1.78651,-106.42,-57.3056)">
        <ellipse cx="171.886" cy="175.373" rx="113.826" ry="134.34" fill="currentColor" />
      </g>
      <path d="M456,124L164,256L456,388L456,124Z" fill={`url(#${gradientId})`} />
      <g transform="matrix(1,0,0,0.46909,30.0065,135.913)">
        <path
          d="M297.036,104.286L196.516,204.805C136.124,263.621 132.886,243.003 196.516,307.195L297.036,407.714L251.629,463.599C250.615,462.693 249.62,461.752 248.646,460.778L95.062,307.195C66.807,278.94 66.807,233.06 95.062,204.805L248.646,51.222C249.62,50.248 250.615,49.307 251.629,48.401L297.036,104.286Z"
          {...stylex.props(styles.cut)}
        />
      </g>
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="1"
          y2="0"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(292,0,0,264,164,256)"
        >
          <stop offset="0" stopColor="#8342e5" />
          <stop offset="1" stopColor="#8342e5" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const styles = stylex.create({
  cut: { fill: colors.page },
});
