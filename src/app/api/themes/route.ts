import { NextResponse } from "next/server";
import { listAllThemes } from "@/lib/bible";

export const runtime = "edge";

export async function GET() {
  const themes = listAllThemes();
  return NextResponse.json({ themes });
}

