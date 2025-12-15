# LogShield Core Specification v1.0

## 1. Purpose

LogShield Core Specification defines a **deterministic, language-agnostic standard** for detecting and handling sensitive secrets in arbitrary text. This specification establishes **behavioral correctness**, not performance characteristics.

The specification is designed to:
- Serve as a **normative contract** for all implementations
- Enable **multiple engine implementations** (Python, Go, Rust, WASM, etc.)
- Guarantee **auditability, determinism, and compliance safety**

This document is authoritative. Any implementation claiming compatibility **MUST conform** to this specification.

---

## 2. Scope

### 2.1 In Scope
- Plain-text scanning
- Deterministic pattern matching
- Secret classification
- Redaction and warning semantics
- Structured output

### 2.2 Out of Scope
- Streaming or chunked processing
- Binary or encoded input (base64, gzip, etc.)
- Secret validation against external services
- Machine learning or probabilistic detection
- Performance guarantees
- Authentication, authorization, or transport security

---

## 3. Definitions

- **Engine**: A software component implementing this specification
- **Rule**: A deterministic detector for a secret pattern
- **Finding**: A single detected secret instance
- **Action**: Prescribed handling of a detected secret
- **Redaction**: Replacement of sensitive text

---

## 4. Input Contract

### 4.1 Input Format

The engine **MUST** accept input in the following logical form:

```
InputText := UTF-8 encoded string
```

### 4.2 Input Constraints

- Input is treated as immutable
- Input is processed as a single logical unit
- Line boundaries are not semantically relevant unless defined by a rule

---

## 5. Rule Model

Each rule **MUST** define the following properties:

| Field | Type | Required | Description |
|-----|-----|--------|-------------|
| id | string | YES | Stable identifier |
| description | string | YES | Human-readable explanation |
| pattern | matcher | YES | Deterministic matching logic |
| action | enum | YES | REDACT or WARN_ONLY |
| severity | enum | YES | LOW / MEDIUM / HIGH / CRITICAL |

### 5.1 Pattern Semantics

- Patterns **MUST be deterministic**
- Patterns **MUST NOT depend on external state**
- Regex engines **MUST behave equivalently** across implementations

If a pattern matches a substring, a Finding **MUST** be emitted.

### 5.2 Rule Ordering

- Rules are evaluated sequentially
- Rule ordering **MUST NOT affect detection results**
- Overlapping matches **MUST be preserved as independent findings**

---

## 6. Actions

### 6.1 REDACT

When a rule action is REDACT:
- The matched substring **MUST** be replaced
- Replacement token **MUST** be exactly `[REDACTED]`
- Replacement **MUST preserve non-matched text**

### 6.2 WARN_ONLY

When a rule action is WARN_ONLY:
- The matched substring **MUST NOT be modified**
- A Finding **MUST still be emitted**

WARN_ONLY **DOES NOT** imply reduced severity.

---

## 7. Finding Model

Each Finding **MUST** contain:

```json
{
  "rule_id": "string",
  "match": "string",
  "start": number,
  "end": number,
  "action": "REDACT | WARN_ONLY",
  "severity": "LOW | MEDIUM | HIGH | CRITICAL"
}
```

### 7.1 Positional Semantics

- `start` is zero-based index (inclusive)
- `end` is zero-based index (exclusive)
- Indices refer to the **original input text**

---

## 8. Output Contract

The engine **MUST** produce:

```json
{
  "findings": [Finding],
  "redacted_text": "string"
}
```

### 8.1 Determinism Guarantee

Given identical input and identical rules:
- Findings **MUST be identical**
- Redacted output **MUST be identical**

---

## 9. Error Handling

- Invalid input **MUST NOT crash the engine**
- Pattern compilation errors **MUST fail fast at initialization**
- Runtime scan errors **MUST return structured error output**

Silent failure is **FORBIDDEN**.

---

## 10. Compliance Requirements

An implementation claiming **LogShield Core v1 compliance**:

MUST:
- Pass all official test vectors
- Preserve rule semantics exactly
- Emit all findings
- Apply actions exactly as defined

MUST NOT:
- Suppress findings
- Alter action semantics
- Introduce probabilistic behavior

---

## 11. Test Vectors

Official test vectors are normative.

- Every vector **MUST** produce identical findings
- Partial compliance is **NOT ALLOWED**

Test vectors define behavioral truth.

---

## 12. Extensibility

Implementations MAY add:
- Performance optimizations
- Streaming wrappers
- Contextual validation layers
- Additional metadata

Extensions **MUST NOT modify core behavior**.

---

## 13. Versioning

- This document defines **LogShield Core v1.0**
- Breaking changes require **major version increment**
- Patch releases **MUST NOT change behavior**

---

## 14. Intellectual Property Positioning

This specification represents **core intellectual property**.

- Implementations may be open or closed source
- The specification itself defines the protected behavior
- Compatibility claims require strict adherence

---

## 15. Summary

LogShield Core is a **deterministic secret-detection standard**.

It prioritizes:
- Correctness over speed
- Auditability over heuristics
- Stability over experimentation

Performance, scalability, and intelligence are **layers above this core**.

This specification is final.

