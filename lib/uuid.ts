export function generateUUIDv4(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function"
  ) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10
    const toHex = (n: number) => n.toString(16).padStart(2, "0");
    const b = Array.from(bytes, toHex).join("");
    return (
      b.slice(0, 8) +
      "-" +
      b.slice(8, 12) +
      "-" +
      b.slice(12, 16) +
      "-" +
      b.slice(16, 20) +
      "-" +
      b.slice(20)
    );
  }

  // Non-cryptographic fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
