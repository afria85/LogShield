import type { Rule } from "./types";

// Keep URLs intact for debugging value.
// Only redact:
// - embedded credentials (userinfo)
// - sensitive query/fragment parameters (token-like keys)
//
// This intentionally avoids using `new URL()` to prevent normalization
// (encoding/host casing/trailing slashes), preserving the original log surface.

const SENSITIVE_PARAM_KEYS = new Set(
  [
    "access_token",
    "token",
    "id_token",
    "refresh_token",
    "auth",
    "authorization",
    "api_key",
    "apikey",
    "api-key",
    "key",
    "secret",
    "password",
    "passwd",
    "signature",
    "sig",
    "session",
  ].map((k) => k.toLowerCase())
);

function redactQueryLike(segment: string): string {
  // segment is either "?..." or "#..." (including the prefix)
  if (segment.length < 2) return segment;

  const prefix = segment[0];
  const raw = segment.slice(1);
  if (!raw.includes("=")) return segment;

  const parts = raw.split("&");
  const redacted = parts.map((p) => {
    const eq = p.indexOf("=");
    if (eq === -1) return p;

    const key = p.slice(0, eq);
    const value = p.slice(eq + 1);

    // Preserve empty values and formatting; redact only if key is sensitive.
    const normalized = key.trim().toLowerCase();
    if (!SENSITIVE_PARAM_KEYS.has(normalized)) return p;
    if (value.length === 0) return `${key}=`;
    return `${key}=<REDACTED_URL_PARAM>`;
  });

  return `${prefix}${redacted.join("&")}`;
}

function redactUrl(match: string): string {
  // Split into: scheme:// authority + rest
  const schemeIdx = match.indexOf("://");
  if (schemeIdx === -1) return match;

  const scheme = match.slice(0, schemeIdx + 3);
  const rest = match.slice(schemeIdx + 3);

  // authority = up to first / ? #
  const authorityEnd = (() => {
    const slash = rest.indexOf("/");
    const q = rest.indexOf("?");
    const h = rest.indexOf("#");
    const candidates = [slash, q, h].filter((i) => i !== -1);
    return candidates.length === 0 ? rest.length : Math.min(...candidates);
  })();

  let authority = rest.slice(0, authorityEnd);
  let tail = rest.slice(authorityEnd);

  // Redact embedded credentials: user:pass@host
  const at = authority.lastIndexOf("@");
  if (at !== -1) {
    const userinfo = authority.slice(0, at);
    const host = authority.slice(at + 1);

    const colon = userinfo.indexOf(":");
    if (colon !== -1) {
      const user = userinfo.slice(0, colon);
      // Preserve username; redact password portion.
      authority = `${user}:<REDACTED_PASSWORD>@${host}`;
    } else {
      // No delimiter - treat entire userinfo as sensitive.
      authority = `<REDACTED_PASSWORD>@${host}`;
    }
  }

  // Redact sensitive query params and OAuth-style fragments.
  // Preserve ordering and non-sensitive params.
  const hashIdx = tail.indexOf("#");
  const queryIdx = tail.indexOf("?");

  // Redact query first (if present before hash).
  if (queryIdx !== -1 && (hashIdx === -1 || queryIdx < hashIdx)) {
    const before = tail.slice(0, queryIdx);
    const after = tail.slice(queryIdx);
    const hashInside = after.indexOf("#");

    if (hashInside === -1) {
      tail = `${before}${redactQueryLike(after)}`;
    } else {
      const qPart = after.slice(0, hashInside);
      const hPart = after.slice(hashInside);
      tail = `${before}${redactQueryLike(qPart)}${redactQueryLike(hPart)}`;
    }
  } else if (hashIdx !== -1) {
    // No query, but has hash.
    const before = tail.slice(0, hashIdx);
    const hPart = tail.slice(hashIdx);
    tail = `${before}${redactQueryLike(hPart)}`;
  }

  return `${scheme}${authority}${tail}`;
}

export const urlRules: Rule[] = [
  {
    name: "URL",
    // Match HTTP(S) URLs, stopping at whitespace.
    // (Conservative: avoids attempting to be a full RFC URL parser.)
    pattern: /\bhttps?:\/\/[^\s]+/gi,
    replace: (match: string) => redactUrl(match),
  },
];
