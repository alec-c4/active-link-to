import { isActiveLink, type ActiveLinkMode } from "active-link-to";

const mode: ActiveLinkMode = "exclusive";
const active: boolean = isActiveLink(new URL("https://example.com/users"), "/users", mode);
void active;
// @ts-expect-error Unknown matching modes are not part of the public API.
isActiveLink("/users", "/users", "unknown");
// @ts-expect-error Numeric URLs are not part of the public API.
isActiveLink(42, "/users");
