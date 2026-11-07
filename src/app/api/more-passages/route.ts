import { NextRequest, NextResponse } from "next/server";
import { getMorePassagesForContext } from "@/lib/bibleSearchEngine";

interface MorePassagesRequest {
  context: string;
  themeId?: string;
  excludeReferences?: string[];
  version?: "nvi" | "aa";
  limit?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: MorePassagesRequest = await req.json();
    const context = body.context?.trim() || "";
    const themeId = body.themeId || "";
    const excludeReferences = Array.isArray(body.excludeReferences) ? body.excludeReferences : [];
    const version = (body.version === "aa" ? "aa" : "nvi") as "nvi" | "aa";
    const limit = typeof body.limit === "number" ? body.limit : 3;

    const passages = getMorePassagesForContext({
      context,
      themeId,
      excludeReferences,
      version,
      limit,
    });

    return NextResponse.json({
      success: true,
      passages,
    });
  } catch (err: any) {
    console.error("Erro em /api/more-passages:", err);
    return NextResponse.json(
      { error: "Erro ao buscar mais passagens bíblicas." },
      { status: 500 }
    );
  }
}

