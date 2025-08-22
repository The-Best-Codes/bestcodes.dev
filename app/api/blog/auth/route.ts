import { verifyAuthCode } from "@/lib/blog/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Authorization code is required" },
        { status: 400 },
      );
    }

    const isValid = verifyAuthCode(code);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid authorization code" },
        { status: 401 },
      );
    }

    // Set secure cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set("unpublished_blog_auth", code, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
