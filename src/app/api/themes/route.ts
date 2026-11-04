import { NextResponse } from "next/server";
import { listAllThemes } from "@/lib/bible";

export async function GET() {
  const themes = listAllThemes();
  return NextResponse.json({ themes });
}
