// crypto.randomUUID() requires a secure context and is only available in
// fairly modern browsers (Safari 15.4+, Chrome 92+, Firefox 95+). Every
// call site in this app used it directly with no fallback, so anyone on
// an older browser - or any context where `crypto` isn't fully available
// - would hit a hard crash generating a drawing, a stroke, or a share
// link. These IDs are just local identifiers, not security tokens, so a
// non-cryptographic fallback is perfectly fine quality-wise.
export function generateId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    try {
      return crypto.randomUUID();
    } catch {
      // fall through to the next strategy
    }
  }

  if (
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function"
  ) {
    try {
      const bytes = crypto.getRandomValues(new Uint8Array(16));
      bytes[6] = (bytes[6]! & 0x0f) | 0x40; // version 4
      bytes[8] = (bytes[8]! & 0x3f) | 0x80; // variant 10
      const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
      return [
        hex.slice(0, 4).join(""),
        hex.slice(4, 6).join(""),
        hex.slice(6, 8).join(""),
        hex.slice(8, 10).join(""),
        hex.slice(10, 16).join(""),
      ].join("-");
    } catch {
      // fall through to the last-resort strategy
    }
  }

  // Last resort: Math.random-based. Not cryptographically strong, but
  // more than sufficient for a locally-scoped drawing/stroke ID.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
