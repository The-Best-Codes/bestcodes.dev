import crypto from "crypto";
import { cookies } from "next/headers";

const UNPUBLISHED_AUTH_COOKIE = "unpublished_blog_auth";
const SIGNING_KEY =
  process.env.UNPUBLISHED_BLOG_SIGNING_KEY || "default-signing-key";
const FALLBACK_AUTH_CODE =
  process.env.UNPUBLISHED_BLOG_AUTH_CODE || "default-secret-code";

export function isUnpublishedPost(slug: string): boolean {
  return slug.startsWith("unpublished/");
}

export async function isAuthorizedForUnpublished(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(UNPUBLISHED_AUTH_COOKIE);

  if (!authCookie) {
    return false;
  }

  return verifyAuthCode(authCookie.value);
}

export function verifyAuthCode(code: string): boolean {
  if (verifySignedKey(code)) {
    return true;
  }

  return code === FALLBACK_AUTH_CODE;
}

export function verifySignedKey(signedKey: string): boolean {
  try {
    const [key, signature] = signedKey.split(".");
    if (!key || !signature) {
      return false;
    }

    const expectedSignature = crypto
      .createHmac("sha256", SIGNING_KEY)
      .update(key)
      .digest("hex")
      .substring(0, 16);

    return signature === expectedSignature;
  } catch (error) {
    return false;
  }
}

export function generateSignedKey(customKey?: string): string {
  const key = customKey || crypto.randomBytes(6).toString("hex");

  const signature = crypto
    .createHmac("sha256", SIGNING_KEY)
    .update(key)
    .digest("hex")
    .substring(0, 16);

  return `${key}.${signature}`;
}
