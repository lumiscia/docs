import { Button } from "@base-ui/react/button";
import * as stylex from "@stylexjs/stylex";
import { ArrowUpRight, Check, ChevronDown, Copy } from "lucide-react";
import { useState } from "react";

import { MenuLinkItem, MenuPopup, MenuRoot, MenuTrigger } from "@/src/components/kit/menu";
import { docsOrigin, markdownUrl } from "@/src/lib/docs-href";
import { colors } from "@/src/styles/tokens.stylex";

export function PageActions({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const href = markdownUrl(url);
  const prompt = encodeURIComponent(`Read ${docsOrigin}${href} and help me with Lumiscia.`);

  async function copy() {
    // A promise-backed ClipboardItem keeps the click's user activation while the Markdown loads.
    const blob = fetch(href)
      .then((response) => response.text())
      .then((text) => new Blob([text], { type: "text/plain" }));
    await navigator.clipboard.write([new ClipboardItem({ "text/plain": blob })]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div {...stylex.props(styles.group)}>
      <Button
        onClick={copy}
        aria-label="copy page as markdown"
        {...stylex.props(styles.button, styles.copy, copied && styles.copied)}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? "copied" : "copy page"}
      </Button>
      <MenuRoot>
        <MenuTrigger aria-label="more page actions" xstyle={[styles.button, styles.trigger]}>
          <ChevronDown size={14} />
        </MenuTrigger>
        <MenuPopup align="end">
          <MenuLinkItem href={href}>
            view as markdown
            <ArrowUpRight size={14} {...stylex.props(styles.external)} />
          </MenuLinkItem>
          <MenuLinkItem href={`https://claude.ai/new?q=${prompt}`}>
            open in claude
            <ArrowUpRight size={14} {...stylex.props(styles.external)} />
          </MenuLinkItem>
          <MenuLinkItem href={`https://chatgpt.com/?hints=search&q=${prompt}`}>
            open in chatgpt
            <ArrowUpRight size={14} {...stylex.props(styles.external)} />
          </MenuLinkItem>
        </MenuPopup>
      </MenuRoot>
    </div>
  );
}

const styles = stylex.create({
  group: {
    display: "inline-flex",
    alignSelf: "flex-start",
    borderRadius: 6,
    boxShadow: `inset 0 0 0 1px ${colors.line}`,
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    height: 30,
    paddingInline: 10,
    borderWidth: 0,
    borderRadius: 6,
    backgroundColor: { default: "transparent", ":hover": colors.surfaceMuted },
    color: { default: colors.inkMuted, ":hover": colors.ink },
    fontFamily: "inherit",
    fontSize: 13,
    cursor: "pointer",
  },
  copy: { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
  trigger: {
    paddingInline: 8,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderLeftWidth: 1,
    borderLeftStyle: "solid",
    borderLeftColor: colors.line,
  },
  copied: { color: colors.success },
  external: { marginLeft: "auto", color: colors.inkFaint },
});
