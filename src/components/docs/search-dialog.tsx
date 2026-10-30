import { Dialog } from "@base-ui/react/dialog";
import * as stylex from "@stylexjs/stylex";
import { useStaticSearch } from "fumadocs-core/search/client";
import type { SearchResultRecord } from "fumadocs-core/search/client";
import { FileText, Hash, Search, TextAlignStart } from "lucide-react";
import { useEffect, useId, useState, useSyncExternalStore } from "react";
import type { KeyboardEvent } from "react";

import { colors, fonts, media } from "@/src/styles/tokens.stylex";

export function SearchDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger aria-label="search docs" {...stylex.props(styles.trigger)}>
        <Search size={15} />
        <span {...stylex.props(styles.triggerLabel)}>search docs</span>
        <kbd {...stylex.props(styles.kbd)}>{useShortcutLabel()}</kbd>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop {...stylex.props(styles.backdrop)} />
        <Dialog.Popup {...stylex.props(styles.popup)}>
          <Dialog.Title {...stylex.props(styles.srOnly)}>search docs</Dialog.Title>
          <SearchPanel onNavigate={() => setOpen(false)} />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Prerendered HTML shows "Ctrl K"; Apple platforms switch to "⌘K" after hydration.
function useShortcutLabel() {
  return useSyncExternalStore(
    () => () => {},
    () => (/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘K" : "Ctrl K"),
    () => "Ctrl K",
  );
}

function SearchPanel({ onNavigate }: { onNavigate: () => void }) {
  const { search, onSearchChange, isLoading, data, error } = useStaticSearch({
    from: "/api/search.json",
  });
  const [active, setActive] = useState(0);
  const listId = useId();
  const results = data?.items.flatMap((item) => (item.type === "table" ? item.rows : [item])) ?? [];
  const activeIndex = Math.min(active, results.length - 1);

  useEffect(() => {
    document.getElementById(`${listId}-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [listId, activeIndex]);

  function navigate(result: SearchResultRecord) {
    onNavigate();
    window.location.assign(result.url);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive(Math.min(activeIndex + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(Math.max(activeIndex - 1, 0));
    } else if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault();
      navigate(results[activeIndex]);
    }
  }

  return (
    <>
      <div {...stylex.props(styles.field)}>
        <Search size={16} {...stylex.props(styles.fieldIcon)} />
        <input
          autoFocus
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls={listId}
          aria-activedescendant={results.length > 0 ? `${listId}-${activeIndex}` : undefined}
          aria-label="search docs"
          placeholder="search docs"
          value={search}
          onChange={(event) => {
            onSearchChange(event.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          {...stylex.props(styles.input)}
        />
        <Dialog.Close aria-label="close search" {...stylex.props(styles.kbd, styles.esc)}>
          esc
        </Dialog.Close>
      </div>
      <div {...stylex.props(styles.results)}>
        {results.length > 0 ? (
          <ul id={listId} role="listbox" {...stylex.props(styles.list)}>
            {results.map((result, index) => (
              <li key={result.id} role="presentation">
                <a
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  href={result.url}
                  tabIndex={-1}
                  onMouseMove={() => setActive(index)}
                  onClick={onNavigate}
                  {...stylex.props(
                    styles.result,
                    result.type !== "page" && styles.nested,
                    index === activeIndex && styles.resultActive,
                  )}
                >
                  <ResultIcon type={result.type} />
                  <span {...stylex.props(styles.resultText)}>
                    {result.type === "page" && result.breadcrumbs && (
                      <span {...stylex.props(styles.breadcrumbs)}>
                        {result.breadcrumbs.join(" / ")}
                      </span>
                    )}
                    <span
                      {...stylex.props(
                        styles.content,
                        result.type === "text" && styles.contentMuted,
                      )}
                    >
                      {textOf(result.hastContent)}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p {...stylex.props(styles.empty)}>
            {error
              ? "search is unavailable right now"
              : !search
                ? "type to search the docs"
                : isLoading || !data
                  ? "searching…"
                  : "no results"}
          </p>
        )}
      </div>
    </>
  );
}

function ResultIcon({ type }: { type: SearchResultRecord["type"] }) {
  const Icon = type === "page" ? FileText : type === "heading" ? Hash : TextAlignStart;
  return <Icon size={14} {...stylex.props(styles.resultIcon)} />;
}

type HastNode =
  | SearchResultRecord["hastContent"]
  | SearchResultRecord["hastContent"]["children"][number];

function textOf(node: HastNode): string {
  if ("value" in node) return node.value;
  if ("children" in node) return node.children.map((child) => textOf(child)).join("");
  return "";
}

const styles = stylex.create({
  trigger: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
    width: { default: 220, [media.tablet]: "auto" },
    height: 32,
    paddingInline: { default: 10, [media.phone]: 8 },
    borderRadius: 6,
    backgroundColor: { default: colors.surface, ":hover": colors.surfaceMuted },
    color: colors.inkMuted,
    boxShadow: `inset 0 0 0 1px ${colors.line}`,
    fontSize: 13.5,
    cursor: "pointer",
  },
  triggerLabel: {
    display: { default: "inline", [media.phone]: "none" },
    flexGrow: 1,
    textAlign: "left",
  },
  kbd: {
    display: { default: "inline-flex", [media.phone]: "none" },
    alignItems: "center",
    height: 20,
    paddingInline: 6,
    borderRadius: 4,
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.inkFaint,
    boxShadow: `inset 0 0 0 1px ${colors.line}`,
  },
  esc: {
    display: "inline-flex",
    flexShrink: 0,
    cursor: "pointer",
    color: { default: colors.inkFaint, ":hover": colors.inkMuted },
  },
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 60,
    backgroundColor: "rgba(8, 8, 12, 0.55)",
  },
  popup: {
    position: "fixed",
    zIndex: 61,
    top: { default: "12vh", [media.phone]: 12 },
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    width: "min(640px, calc(100vw - 24px))",
    maxHeight: { default: "min(560px, 76vh)", [media.phone]: "calc(100vh - 24px)" },
    overflow: "hidden",
    borderRadius: 12,
    backgroundColor: colors.page,
    color: colors.ink,
    fontFamily: fonts.sans,
    boxShadow: `0 0 0 1px ${colors.line}, 0 24px 60px -20px rgba(0,0,0,0.45)`,
    outline: "none",
  },
  srOnly: {
    position: "absolute",
    width: 1,
    height: 1,
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
  },
  field: {
    display: "flex",
    flexShrink: 0,
    alignItems: "center",
    gap: 10,
    height: 52,
    paddingInline: 16,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: colors.line,
  },
  fieldIcon: { flexShrink: 0, color: colors.inkFaint },
  input: {
    flexGrow: 1,
    minWidth: 0,
    height: "100%",
    fontSize: 15,
    outline: "none",
    "::placeholder": { color: colors.inkFaint },
  },
  results: { overflowY: "auto", padding: 6 },
  list: { display: "flex", flexDirection: "column", gap: 1 },
  result: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    paddingBlock: 9,
    paddingInline: 10,
    borderRadius: 7,
    color: colors.ink,
    textDecoration: "none",
  },
  nested: { paddingLeft: 26 },
  resultActive: { backgroundColor: colors.surfaceMuted },
  resultIcon: { flexShrink: 0, marginTop: 3, color: colors.inkFaint },
  resultText: { display: "flex", flexDirection: "column", gap: 2, minWidth: 0 },
  breadcrumbs: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: "0.04em",
    color: colors.inkFaint,
  },
  content: {
    fontSize: 14,
    lineHeight: 1.45,
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
    overflow: "hidden",
  },
  contentMuted: { color: colors.inkMuted, fontSize: 13.5 },
  empty: {
    paddingBlock: 28,
    textAlign: "center",
    fontSize: 14,
    color: colors.inkFaint,
  },
});
