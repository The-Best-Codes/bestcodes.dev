import { z } from "zod";

const remSchema = z
  .string()
  .transform((val) => parseFloat(val))
  .refine((val) => !isNaN(val) && val >= 0 && val <= 1000, {
    message: "Value must be a positive number between 0 and 1000 REM",
  });

export function sanitizeInput(input: string): string {
  return input.replace(/[^0-9.-]/g, "");
}

export function validateRemValue(value: string | number): boolean {
  try {
    const stringValue = String(value);
    remSchema.parse(stringValue);
    return true;
  } catch {
    return false;
  }
}

export function convertRemToPx(rem: number, baseFontSize: number = 16): number {
  if (!validateRemValue(rem)) {
    throw new Error("Invalid REM value");
  }
  return Math.round(rem * baseFontSize * 100) / 100;
}

export function generateSlug(value: number): string {
  return value.toString().replace(/[^0-9.]/g, "");
}
