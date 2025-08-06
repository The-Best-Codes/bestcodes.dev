"use server";

import { NextRequest, NextResponse } from "next/server";

// This route is a placeholder that delegates like toggling to /api/blog/metrics.
// Clients can POST here with { slug: string, like: boolean, fingerprint?: string }
// and it will forward the request to /api/blog/metrics with action: "like".

function noStore(res: NextResponse) {
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, like, fingerprint = null } = body ?? {};

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Missing or invalid slug" }, { status: 400 });
    }
    if (typeof like !== "boolean") {
      return NextResponse.json({ error: "Missing or invalid like boolean" }, { status: 400 });
    }

    // Delegate to /api/blog/metrics
    const url = new URL("/api/blog/metrics", req.nextUrl.origin);
    const delegated = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        action: "like",
        slug,
        like,
        fingerprint,
      }),
      cache: "no-store",
    });

    const data = await delegated.json();
    return noStore(
      NextResponse.json(
        delegated.ok ? data : { error: data?.error ?? "Failed to process like action" },
        { status: delegated.status || (delegated.ok ? 200 : 500) },
      ),
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to process like action" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message:
        "POST to this endpoint with { slug: string, like: boolean, fingerprint?: string } or use /api/blog/metrics with action: 'like'.",
    },
    { status: 405 },
  );
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
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