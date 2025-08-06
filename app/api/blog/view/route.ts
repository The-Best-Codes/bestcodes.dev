"use server";

import { NextRequest, NextResponse } from "next/server";

// This route is a placeholder that delegates view tracking to /api/blog/metrics.
// It exists for backward compatibility or cleaner separation of concerns.
// Clients can POST here with { slug, fingerprint? } and it will forward the
// request to /api/blog/metrics with action: "view".

async function noStore(res: NextResponse) {
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export async function POST(req: NextRequest) {
  try {
    const { slug, fingerprint = null } = (await req.json()) ?? {};
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Missing or invalid slug" }, { status: 400 });
    }

    // Delegate to /api/blog/metrics
    const url = new URL("/api/blog/metrics", req.nextUrl.origin);
    const delegated = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      // We pass an action of "view" so the metrics endpoint handles the increment.
      body: JSON.stringify({
        action: "view",
        slug,
        fingerprint,
      }),
      // Ensure this dynamic request is not cached at any layer.
      cache: "no-store",
    });

    const data = await delegated.json();
    return noStore(
      NextResponse.json(
        delegated.ok ? data : { error: data?.error ?? "Failed to record view" },
        { status: delegated.status || (delegated.ok ? 200 : 500) },
      ),
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to record view" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message:
        "POST to this endpoint with { slug, fingerprint? } or use /api/blog/metrics with action: 'view'.",
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