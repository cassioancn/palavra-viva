import { NextRequest, NextResponse } from "next/server";
import { getVerseOfTheDay, getVerseOfTheDayByParts } from "@/lib/dailyVerse";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const versionParam = searchParams.get("version");
    const version = versionParam === "aa" ? "aa" : "nvi";
    const dateParam = searchParams.get("date");

    let result;

    // Se o cliente enviou sua data local explícita (YYYY-MM-DD), usamos ela exata
    if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      const [yStr, mStr, dStr] = dateParam.split("-");
      const year = Number(yStr);
      const month = Number(mStr);
      const day = Number(dStr);

      if (year >= 2000 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        result = getVerseOfTheDayByParts(year, month, day, version);
      }
    }

    // Fallback seguro usando o fuso horário do Brasil (America/Sao_Paulo, UTC-3)
    if (!result) {
      result = getVerseOfTheDay(new Date(), version);
    }

    return NextResponse.json(
      {
        success: true,
        ...result,
      },
      {
        status: 200,
        headers: {
          // Cacheia apenas se a data estiver explícita na URL para não misturar dias na CDN
          "Cache-Control": dateParam
            ? "public, s-maxage=3600, stale-while-revalidate=7200"
            : "no-store, max-age=0",
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
