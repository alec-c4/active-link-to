/** @typedef {"inclusive" | "exclusive" | "exact"} ActiveLinkMode */

/**
 * @param {string | URL} currentUrl
 * @param {string | URL} targetUrl
 * @param {ActiveLinkMode} [mode]
 * @returns {boolean}
 */
export function isActiveLink(currentUrl, targetUrl, mode = "inclusive") {
  if (!["inclusive", "exclusive", "exact"].includes(mode)) {
    throw Object.assign(new RangeError("Unknown active link mode"), { code: "ERR_ACTIVE_LINK_MODE" });
  }
  if (![currentUrl, targetUrl].every(value =>
    value instanceof URL || (typeof value === "string" && value.trim().length > 0))) return false;
  let current;
  let target;
  try {
    current = new URL(currentUrl, "https://active-link.invalid");
    target = new URL(targetUrl, current);
  } catch {
    return false;
  }
  if (!["http:", "https:"].includes(current.protocol) || current.origin !== target.origin) return false;
  if (mode === "exact") return current.href === target.href;
  const pathname = current.pathname.replace(/\/+$/, "") || "/";
  const targetPath = target.pathname.replace(/\/+$/, "") || "/";
  if (mode === "exclusive") return pathname === targetPath;
  return targetPath === "/" || pathname === targetPath || pathname.startsWith(`${targetPath}/`);
}
