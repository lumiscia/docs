export const docsOrigin = "https://docs.lumiscia.com";

export function isExternalHref(href: string) {
  return href.startsWith("//") || /^[a-z][a-z\d+.-]*:/i.test(href);
}

// Resolves a relative link authored in a page against that page's source directory.
export function resolveDocsHref(path: string, href: string) {
  if (href.startsWith("/") || href.startsWith("#") || isExternalHref(href)) {
    return href;
  }

  const sourceDir = path.replace(/\/?[^/]+\.(md|mdx)$/, "");
  const url = new URL(href, `https://docs.local/${sourceDir ? `${sourceDir}/` : ""}`);
  const pathname = url.pathname.replace(/\/index$/, "");

  return `${pathname}${url.search}${url.hash}`;
}

// The root page is served at `/index.md`; every other page appends `.md` to its URL.
export function markdownUrl(url: string) {
  return `${url === "/" ? "/index" : url.replace(/\/+$/, "")}.md`;
}

// Points a link authored in a page at the Markdown version of the target page.
export function resolveMarkdownHref(path: string, href: string) {
  if (href.startsWith("#") || isExternalHref(href)) return href;

  const { pathname, search, hash } = new URL(resolveDocsHref(path, href), docsOrigin);
  if (/\.[a-z\d]+$/i.test(pathname)) return `${docsOrigin}${pathname}${search}${hash}`;

  return `${docsOrigin}${markdownUrl(pathname)}${search}${hash}`;
}
