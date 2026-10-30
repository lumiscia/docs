import { Button } from "@base-ui/react/button";
import * as stylex from "@stylexjs/stylex";
import { Check, Copy } from "lucide-react";
import { createContext, useContext, useRef, useState } from "react";
import type { ComponentProps, RefObject } from "react";

import { code, colors, fonts, media } from "@/src/styles/tokens.stylex";

const InCodeBlock = createContext(false);

// rehype-code passes code-fence meta through as props: `title="..."`, and `allowCopy="false"` for `noCopy`.
export function CodeBlock({
  title,
  allowCopy,
  children,
  ...props
}: ComponentProps<"pre"> & { allowCopy?: string }) {
  const ref = useRef<HTMLPreElement>(null);
  const copyable = allowCopy !== "false";

  return (
    <figure {...stylex.props(styles.window)}>
      {title && (
        <figcaption {...stylex.props(styles.bar)}>
          <span {...stylex.props(styles.dots)}>
            <span {...stylex.props(styles.dot)} />
            <span {...stylex.props(styles.dot)} />
            <span {...stylex.props(styles.dot)} />
          </span>
          <span {...stylex.props(styles.title)}>{title}</span>
          {copyable && <CopyButton target={ref} />}
        </figcaption>
      )}
      <div {...stylex.props(styles.frame)}>
        <InCodeBlock value>
          <pre ref={ref} {...props} {...stylex.props(styles.body)}>
            {children}
          </pre>
        </InCodeBlock>
        {!title && copyable && <CopyButton target={ref} floating />}
      </div>
    </figure>
  );
}

export function Code(props: ComponentProps<"code">) {
  const inBlock = useContext(InCodeBlock);
  return <code {...props} {...stylex.props(!inBlock && styles.inline)} />;
}

function CopyButton({
  target,
  floating = false,
}: {
  target: RefObject<HTMLPreElement | null>;
  floating?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(target.current?.textContent ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <Button
      onClick={copy}
      aria-label={copied ? "copied" : "copy code"}
      {...stylex.props(styles.copy, floating && styles.floating, copied && styles.copied)}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </Button>
  );
}

const styles = stylex.create({
  window: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    marginTop: { default: 20, ":first-child": 0 },
    backgroundColor: code.bg,
    color: code.ink,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: code.border,
    overflow: "hidden",
  },
  bar: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    height: 40,
    paddingLeft: 16,
    paddingRight: 8,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: code.border,
    backgroundColor: code.surface,
  },
  dots: { display: "inline-flex", gap: 6 },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 999,
    backgroundColor: code.border,
  },
  title: {
    flexGrow: 1,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontFamily: fonts.mono,
    fontSize: 12,
    color: code.muted,
  },
  frame: { position: "relative" },
  body: {
    margin: 0,
    paddingBlock: { default: 18, [media.phone]: 14 },
    paddingInline: { default: 20, [media.phone]: 16 },
    fontFamily: fonts.mono,
    fontSize: { default: 13, [media.phone]: 12 },
    lineHeight: 1.7,
    overflowX: "auto",
    backgroundColor: code.bg,
    color: code.ink,
    outline: "none",
  },
  copy: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: { default: "transparent", ":hover": code.border },
    color: { default: code.muted, ":hover": code.ink },
    cursor: "pointer",
    transform: { default: "scale(1)", ":active": "scale(0.94)" },
    transitionProperty: "transform, background-color",
    transitionDuration: "160ms",
  },
  floating: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: { default: code.surface, ":hover": code.border },
    boxShadow: `inset 0 0 0 1px ${code.border}`,
  },
  copied: { color: code.success },
  inline: {
    paddingBlock: "0.12em",
    paddingInline: "0.38em",
    borderRadius: 5,
    backgroundColor: colors.surfaceMuted,
    boxShadow: `inset 0 0 0 1px ${colors.line}`,
    color: colors.ink,
    fontFamily: fonts.mono,
    fontSize: "0.86em",
    overflowWrap: "break-word",
  },
});
