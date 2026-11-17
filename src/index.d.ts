export type ActiveLinkMode = "inclusive" | "exclusive" | "exact";

/** Compare URLs without reading browser globals. Invalid URLs are inactive. */
export declare function isActiveLink(
  currentUrl: string | URL,
  targetUrl: string | URL,
  mode?: ActiveLinkMode,
): boolean;
