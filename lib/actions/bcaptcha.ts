import { verify } from "jsonwebtoken";

const SECRET_KEY = process.env.BCAPTCHA_SECRET;

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
