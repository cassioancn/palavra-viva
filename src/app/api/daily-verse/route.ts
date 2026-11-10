import { NextRequest, NextResponse } from "next/server";
import { getVerseOfTheDay } from "@/lib/dailyVerse";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const versionParam = searchParams.get("version");
    const version = versionParam === "aa" ? "aa" : "nvi";

    // Data atual
    const now = new Date();
    const result = getVerseOfTheDay(now, version);

    return NextResponse.json(
      {
        success: true,
        ...result,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        },
      }
    );
  } catch (error: any) {
    console.error("Erro na rota /api/daily-verse:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Não foi possível carregar o versículo do dia.",
      },
      { status: 500 }
    );
  }
}
