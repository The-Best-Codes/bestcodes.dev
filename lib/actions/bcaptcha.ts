import { cookies } from "next/headers";
import { sign, verify } from "jsonwebtoken";
import { randomUUID } from "crypto";

const SECRET_KEY = process.env.BCAPTCHA_SECRET || "unset";
const BCAPTCHA_COOKIE_NAME = "bcaptcha_token";

export async function generateAndSetBCaptcha() {
  const randomString = randomUUID();
  const expiration = Date.now() + 5 * 60 * 1000; // Expires in 5 minutes

  // Sign the challenge
  const token = sign({ randomString, expiration }, SECRET_KEY);

  const cookieData = await cookies();
  cookieData.set(BCAPTCHA_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(expiration),
  });

  return token;
}

export async function verifySignedBCaptchaToken(token: string) {
  if (!token) {
    return false;
  }

  try {
    const decoded = verify(token, SECRET_KEY) as {
      randomString: string;
      expiration: number;
    };

    if (Date.now() > decoded.expiration) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}
