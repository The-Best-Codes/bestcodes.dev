import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (url) {
    try {
      // Construct the full URL
      const redirectURL = url;

      // Redirect to the URL
      return NextResponse.redirect(redirectURL, 302);
    } catch (error) {
      console.error("Redirection error:", error);
      return NextResponse.json(
        {
          error: `Redirection failed. Try manually visiting ${url} in your browser.`,
        },
        { status: 500 },
      );
    }
  } else {
    return NextResponse.json({ error: "No link provided" }, { status: 400 });
  }
}
