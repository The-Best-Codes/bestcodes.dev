import {
  getMetricsForPost,
  incrementView,
  toggleLike,
} from "@/lib/actions/blogMetrics";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

async function methodNotAllowed() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

async function noStore(response: NextResponse) {
  response.headers.set("Cache-Control", "no-store");
  return response;
}

type PostBody =
  | { action: "view"; slug: string; fingerprint?: string | null }
  | {
      action: "like";
      slug: string;
      like: boolean;
      fingerprint?: string | null;
    };

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (!slug) return badRequest("Missing slug");

    const session = await auth.api.getSession({ headers: req.headers });
    const userId = session?.user?.id ?? null;

    const fp = searchParams.get("fp");
    const metrics = await getMetricsForPost({
      slug,
      userId,
      fingerprint: fp,
    });

    return noStore(NextResponse.json(metrics, { status: 200 }));
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to fetch metrics" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PostBody;
    if (!body || typeof body !== "object")
      return badRequest("Invalid JSON body");
    if (!("action" in body)) return badRequest("Missing action");

    switch (body.action) {
      case "view": {
        if (!body.slug) return badRequest("Missing slug");
        const updated = await incrementView({ slug: body.slug });
        return noStore(NextResponse.json(updated, { status: 200 }));
      }

      case "like": {
        const { slug, like, fingerprint = null } = body;
        if (!slug) return badRequest("Missing slug");
        if (typeof like !== "boolean")
          return badRequest("Missing like boolean");

        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id ?? null;

        if (!userId && !fingerprint) {
          return badRequest(
            "Missing user authentication or anonymous fingerprint",
          );
        }

        const result = await toggleLike({
          slug,
          action: like ? "like" : "unlike",
          userId,
          fingerprint,
        });

        return noStore(NextResponse.json(result, { status: 200 }));
      }

      default:
        return badRequest("Unsupported action");
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Failed to process request" },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
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

export async function PUT() {
  return methodNotAllowed();
}

export async function PATCH() {
  return methodNotAllowed();
}

export async function DELETE() {
  return methodNotAllowed();
}
