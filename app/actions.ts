"use server";
import { cookies } from "next/headers";
import crypto from "crypto";

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_SECRET = process.env.CSRF_SECRET;

if (!CSRF_SECRET) {
  throw new Error("CSRF_SECRET environment variable is not set.");
}

function createSignedToken(value: string): string {
  const hmac = crypto.createHmac("sha256", CSRF_SECRET!);
  hmac.update(value);
  return hmac.digest("hex");
}

export async function generateAndSetCSRFToken(): Promise<string> {
  const tokenValue = crypto.randomBytes(32).toString("hex");

  const signedToken = createSignedToken(tokenValue);

  const cookieData = await cookies();
  cookieData.set(CSRF_COOKIE_NAME, signedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "strict", // Strictly limit cookie sharing
    path: "/", // Cookie available site-wide
    // maxAge: 60 * 60 * 24, // Optional: Cookie expiry (e.g., 1 day)
  });

  return tokenValue;
}
