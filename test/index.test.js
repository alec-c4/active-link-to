import { test } from "node:test";
import assert from "node:assert/strict";
import { isActiveLink } from "../src/index.js";

test("inclusive matching activates the target and its descendants at path boundaries", () => {
  assert.equal(isActiveLink("/users", "/users"), true);
  assert.equal(isActiveLink("/users/42/edit", "/users"), true);
  assert.equal(isActiveLink("/users-other", "/users"), false);
  assert.equal(isActiveLink("/projects", "/users"), false);
});

test("exclusive matching ignores query and fragment but rejects descendants", () => {
  assert.equal(isActiveLink("/admin?locale=ru#top", "/admin/", "exclusive"), true);
  assert.equal(isActiveLink("/admin/users", "/admin", "exclusive"), false);
  assert.equal(isActiveLink("/", "/", "exclusive"), true);
  assert.equal(isActiveLink("/users", "/", "exclusive"), false);
});

test("exact matching includes query order, trailing slash and fragment", () => {
  assert.equal(isActiveLink("/users?role=admin#top", "/users?role=admin#top", "exact"), true);
  assert.equal(isActiveLink("/users?role=judge", "/users?role=admin", "exact"), false);
  assert.equal(isActiveLink("/users?a=1&b=2", "/users?b=2&a=1", "exact"), false);
  assert.equal(isActiveLink("/users/", "/users", "exact"), false);
  assert.equal(isActiveLink("/users#bottom", "/users#top", "exact"), false);
});

test("only same-origin HTTP and HTTPS links can be active", () => {
  for (const mode of ["inclusive", "exclusive", "exact"]) {
    assert.equal(isActiveLink("https://app.example/users", "https://other.example/users", mode), false);
    assert.equal(isActiveLink("https://app.example/users", "/users", mode), true);
    assert.equal(isActiveLink("https://app.example/users", "//other.example/users", mode), false);
    assert.equal(isActiveLink("file:///users", "file:///users", mode), false);
  }
  assert.equal(isActiveLink("https://app.example:443/users", "https://app.example/users"), true);
  assert.equal(isActiveLink("/users", "mailto:user@example.com"), false);
});

test("empty, malformed and non-URL inputs are inactive", () => {
  for (const value of ["", "  ", "https://[", null, undefined, 42, {}, []]) {
    assert.equal(isActiveLink(value, "/users"), false);
    assert.equal(isActiveLink("/users", value), false);
  }
});

test("unknown matching modes report a stable error code", () => {
  assert.throws(() => isActiveLink("/users", "/users", "unknown"), {
    name: "RangeError", code: "ERR_ACTIVE_LINK_MODE"
  });
});

test("inclusive mode ignores filters and normalizes trailing slashes", () => {
  assert.equal(isActiveLink("/users/?q=alex#profile", "/users/"), true);
  assert.equal(isActiveLink("/users/42", "/users?role=admin"), true);
  assert.equal(isActiveLink("/admin/users", "/"), true);
});

test("URL objects and relative targets follow standard URL resolution", () => {
  assert.equal(isActiveLink(new URL("https://app.example/users/42"), new URL("https://app.example/users")), true);
  assert.equal(isActiveLink("https://app.example/admin/users", "./users", "exclusive"), true);
  assert.equal(isActiveLink("/users/../admin", "/admin", "exclusive"), true);
});

test("encoded slashes stay inside path segments and paths remain case-sensitive", () => {
  assert.equal(isActiveLink("/users%2Fother", "/users"), false);
  assert.equal(isActiveLink("/Users", "/users"), false);
  assert.equal(isActiveLink("/caf%C3%A9/42", "/café"), true);
});
