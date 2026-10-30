import { useRouterState } from "@tanstack/react-router";

export function usePathname() {
  return useRouterState({ select: (state) => state.location.pathname });
}

function normalize(path: string) {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

export function isActiveUrl(url: string, pathname: string) {
  return normalize(url) === normalize(pathname);
}
