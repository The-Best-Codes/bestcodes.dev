import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    { error: "This redirect endpoint has been retired" },
    {
      status: 410,
      headers: {
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow, nosnippet",
      },
    },
  );
}
