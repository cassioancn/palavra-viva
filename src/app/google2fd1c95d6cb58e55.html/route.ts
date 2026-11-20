import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("google-site-verification: google2fd1c95d6cb58e55.html", {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
