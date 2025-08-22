import { cookies } from "next/headers";

const UNPUBLISHED_AUTH_COOKIE = "unpublished_blog_auth";
const CORRECT_AUTH_CODE =
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

  return authCookie.value === CORRECT_AUTH_CODE;
}

export function verifyAuthCode(code: string): boolean {
  return code === CORRECT_AUTH_CODE;
}
