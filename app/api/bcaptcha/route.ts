import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sign } from "jsonwebtoken";
import { randomUUID } from "crypto";

const SECRET_KEY = process.env.BCAPTCHA_SECRET || "unset";
const BCAPTCHA_COOKIE_NAME = "bcaptcha_token";

export async function GET(req: NextRequest) {
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

  const response = NextResponse.json({ success: true });

  return response;
}
