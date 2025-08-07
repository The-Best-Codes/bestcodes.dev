import { auth } from "@/lib/auth";
import { db } from "@/lib/database";
import { account } from "@/lib/schema";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

function noStore(res: NextResponse) {
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    const userId = session?.user?.id ?? null;

    if (!userId) {
      return noStore(NextResponse.json({ fingerprint: null }, { status: 200 }));
    }

    const rows = await db
      .select({
        providerId: account.providerId,
        accountId: account.accountId,
      })
      .from(account)
      .where(eq(account.userId, userId))
      .limit(1);

    if (!rows || rows.length === 0) {
      return noStore(NextResponse.json({ fingerprint: null }, { status: 200 }));
    }

    const { providerId, accountId } = rows[0];

    const secret = process.env.FINGERPRINT_SECRET;
    if (!secret || secret.length < 16) {
      return noStore(NextResponse.json({ fingerprint: null }, { status: 200 }));
    }

    const material = `${providerId}:${accountId}`;
    const hmac = crypto
      .createHmac("sha256", secret)
      .update(material)
      .digest("hex");

    return noStore(NextResponse.json({ fingerprint: hmac }, { status: 200 }));
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to compute fingerprint" },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
