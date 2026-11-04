import { NextRequest, NextResponse } from "next/server";
import { getFullChapter } from "@/lib/bible";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const book = searchParams.get("book");
  const chapterStr = searchParams.get("chapter");
  const version = (searchParams.get("version") === "aa" ? "aa" : "nvi") as "nvi" | "aa";

  if (!book || !chapterStr) {
    return NextResponse.json(
      { error: "Parâmetros 'book' e 'chapter' são obrigatórios." },
      { status: 400 }
    );
  }

  const chapter = parseInt(chapterStr, 10);
  if (isNaN(chapter)) {
    return NextResponse.json({ error: "Capítulo inválido." }, { status: 400 });
  }

  const result = getFullChapter(book, chapter, version);
  if (!result) {
    return NextResponse.json(
      { error: "Capítulo não encontrado no livro especificado." },
      { status: 404 }
    );
  }

  return NextResponse.json(result);
}
