import { randomUUID } from "crypto";
import { sign, verify } from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.BCAPTCHA_SECRET;
const BCAPTCHA_COOKIE_NAME = "bcaptcha_token";

export async function generateAndSetBCaptcha() {
  if (!SECRET_KEY) {
    throw new Error("Secret bcaptcha token is not set");
  }
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
  if (!token || !SECRET_KEY) {
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
