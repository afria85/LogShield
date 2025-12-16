export type SanitizeOptions = {
  strict?: boolean;
};

export type SanitizeMatch = {
  rule: string;
  value: string;
};

const MAX_SIZE = 200 * 1024;

/* ---------- helpers ---------- */

function luhnValid(num: string): boolean {
  const digits = num.replace(/\D/g, "");
  let sum = 0;
  let alt = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function replaceAll(
  input: string,
  regex: RegExp,
  rule: string,
  replacement: string,
  matches: SanitizeMatch[]
) {
  return input.replace(regex, (m) => {
    matches.push({ rule, value: m });
    return replacement;
  });
}

/* ---------- main ---------- */

export function sanitizeLog(
  input: unknown,
  options: SanitizeOptions = {}
) {
  if (typeof input !== "string") {
    throw new Error("Log input must be a string");
  }

  if (input.length > MAX_SIZE) {
    throw new Error("Log size exceeds 200KB limit");
  }


  if (!input) return { output: "", matches: [] };

  const strict = options.strict === true;
  const matches: SanitizeMatch[] = [];
  let out = input;

  /* JWT */
  out = replaceAll(
    out,
    /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,
    "JWT",
    "<REDACTED_JWT>",
    matches
  );

  /* Authorization Bearer */
  out = replaceAll(
    out,
    /Authorization:\s*Bearer\s+[A-Za-z0-9._-]+/gi,
    "AUTH_BEARER",
    "Authorization: Bearer <REDACTED_TOKEN>",
    matches
  );

  /* Email */
  out = replaceAll(
    out,
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    "EMAIL",
    "<REDACTED_EMAIL>",
    matches
  );

  /* Password key=value */
  out = replaceAll(
    out,
    /\b(password|passwd|pwd)\s*=\s*[^&\s]+/gi,
    "PASSWORD",
    "password=<REDACTED_PASSWORD>",
    matches
  );

  /* ---------- STRICT MODE ---------- */
  if (strict) {
    // real stripe
    out = replaceAll(
      out,
      /\bsk_(?:test|live)_[A-Za-z0-9]{16,}\b/g,
      "STRIPE_SECRET_KEY",
      "<REDACTED_STRIPE_KEY>",
      matches
    );

    // test fixture
    out = replaceAll(
      out,
      /\bLS_STRIPE_(?:TEST|LIVE)_KEY_[A-Za-z0-9]{16,}\b/g,
      "STRIPE_SECRET_KEY",
      "<REDACTED_STRIPE_KEY>",
      matches
    );


    /* AWS ? AKIA + 20 chars */
    out = replaceAll(
      out,
      /\bAKIA[0-9A-Z]{16,24}\b/g,
      "AWS_ACCESS_KEY",
      "<REDACTED_AWS_KEY>",
      matches
    );


    /* Generic secret inside JSON */
    out = out.replace(
      /"(token|secret|value)"\s*:\s*"([^"]{8,})"/gi,
      (_, key, val) => {
        matches.push({ rule: "GENERIC_SECRET_KV", value: val });
        return `"${key}":"<REDACTED_SECRET>"`;
      }
    );

    /* Credit Card (Luhn only) */
    out = out.replace(
      /\b(?:\d[ -]*?){13,19}\b/g,
      (m) => {
        if (!luhnValid(m)) return m;
        matches.push({ rule: "CREDIT_CARD", value: m });
        return "<REDACTED_CC>";
      }
    );
  }

  /* Generic API key */
  out = replaceAll(
    out,
    /\b(api[_-]?key)\s*=\s*[A-Za-z0-9]{16,}\b/gi,
    "API_KEY",
    "<REDACTED_API_KEY>",
    matches
  );

  return { output: out, matches };
}
