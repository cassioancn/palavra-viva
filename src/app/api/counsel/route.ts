import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  getPassage,
  matchThemeByText,
  buildThematicResponse,
  parsePassageReference,
} from "@/lib/bible";
import {
  matchBiblicalStory,
  searchBibleFullText,
  buildStoryResponse,
  buildFullTextSearchResponse,
  getDiverseComfortFallback,
  ResolvedBibleResponse,
} from "@/lib/bibleSearchEngine";

interface RequestBody {
  feeling: string;
  version?: "nvi" | "aa";
  mode?: "counsel" | "search";
}

function cleanJsonResponse(raw: string): string {
  if (!raw) return "";
  let clean = raw.trim();
  clean = clean.replace(/^```(?:json)?\s*/i, "");
  clean = clean.replace(/\s*```$/i, "");
  return clean.trim();
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const query = body.feeling?.trim() || "";
    const version = (body.version === "aa" ? "aa" : "nvi") as "nvi" | "aa";
    const mode = body.mode || "counsel";
    const apiKey = process.env.GEMINI_API_KEY || "";

    if (!query) {
      return NextResponse.json(
        { error: "Por favor, digite o que você procura ou como se sente." },
        { status: 400 }
      );
    }

    // -------------------------------------------------------------
    // ETAPA 1: PARSER DE REFERÊNCIA DIRETA ("João 3:16", "Sl 23", "1 Co 13:4", etc.)
    // -------------------------------------------------------------
    const directParsed = parsePassageReference(query, version);
    if (directParsed) {
      return NextResponse.json({
        success: true,
        isAiGenerated: false,
        themeTitle: directParsed.reference,
        passage: directParsed,
        pastoralReflection: `A passagem de ${directParsed.reference} é uma das colunas preciosas das Sagradas Escrituras. Ao meditar neste texto divino, permita que a verdade de Deus ilumine sua mente, renove suas forças e guie os seus passos em retidão e paz.`,
        historicalContext: `Texto das Sagradas Escrituras traduzido com fidelidade na versão ${version.toUpperCase()}.`,
        guidedPrayer: `Senhor Deus, abro o meu coração para a Tua Palavra em ${directParsed.reference}. Que ela seja lâmpada para os meus pés e luz para o meu caminho. Em nome de Jesus, amém.`,
        practicalStep: `Leia novamente este trecho com calma e guarde no coração o ensinamento principal que Deus falou com você.`,
        alternativePassages: [],
      });
    }

    // -------------------------------------------------------------
    // ETAPA 2: RESOLUÇÃO BÍBLICA DETERMINÍSTICA LOCAL (Garantia de 100% de relevância)
    // -------------------------------------------------------------
    let candidateResponse: ResolvedBibleResponse | null = null;

    // 2.A: Busca em Narrativas, Parábolas e Eventos Marcantes da Bíblia
    const matchedStory = matchBiblicalStory(query);
    if (matchedStory) {
      candidateResponse = buildStoryResponse(matchedStory, version);
    }

    // 2.B: Se em modo "counsel", prioriza catálogo temático pastoral de emoções
    if (!candidateResponse && mode === "counsel") {
      const theme = matchThemeByText(query);
      if (theme) {
        candidateResponse = buildThematicResponse(theme, version) as ResolvedBibleResponse;
      }
    }

    // 2.C: Busca Textual Completa com Stemmer, Stopwords e Sinônimos (~31.000 versículos)
    if (!candidateResponse) {
      const textMatches = searchBibleFullText(query, version, 1);
      if (textMatches.length > 0) {
        const fullTextResp = buildFullTextSearchResponse(textMatches[0], version);
        if (fullTextResp) {
          candidateResponse = fullTextResp;
        }
      }
    }

    // 2.D: Se ainda não encontrou e está em modo busca específica, busca na versão alternativa
    if (!candidateResponse && mode === "search") {
      const altVersion = version === "nvi" ? "aa" : "nvi";
      const altMatches = searchBibleFullText(query, altVersion, 1);
      if (altMatches.length > 0) {
        const m = altMatches[0];
        const p = getPassage(m.book, m.chapter, m.verse, m.verse, version);
        if (p) {
          candidateResponse = {
            success: true,
            isAiGenerated: false,
            themeTitle: `Passagem Encontrada: ${p.reference}`,
            passage: p,
            pastoralReflection: `Encontramos a passagem bíblica que corresponde à sua busca em ${p.reference}. Que esta Palavra viva gere fé e direção para a sua vida.`,
            historicalContext: `Trecho bíblico verificado no livro de ${m.book}.`,
            guidedPrayer: `Senhor, agradeço pela Tua Palavra fiel que ilumina o nosso caminho. Que a Tua verdade reine em meu coração. Amém.`,
            practicalStep: `Abra o capítulo completo de ${m.book} ${m.chapter} para aprofundar seu entendimento.`,
            alternativePassages: [],
          };
        }
      }
    }

    // 2.E: Segunda chance temática
    if (!candidateResponse) {
      const theme = matchThemeByText(query);
      if (theme) {
        candidateResponse = buildThematicResponse(theme, version) as ResolvedBibleResponse;
      }
    }

    // 2.F: Fallback diverso (NUNCA fica em loop no Salmo 23)
    if (!candidateResponse) {
      candidateResponse = getDiverseComfortFallback(version);
    }

    // Se NÃO houver chave do Gemini configurada no servidor, entrega a resposta imediata
    if (!apiKey) {
      return NextResponse.json(candidateResponse);
    }

    // -------------------------------------------------------------
    // ETAPA 3: ENRIQUECIMENTO PASTORAL COM GEMINI (Se apiKey existir)
    // -------------------------------------------------------------
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
Você é um conselheiro cristão acolhedor e teólogo bíblico.
O usuário digitou: "${query}"
Modo da busca: ${mode === "search" ? "Busca de Passagem / História Bíblica Específica" : "Consolo e Oração para o Coração"}

A passagem bíblica verificada e selecionada das Escrituras Sagradas é:
Referência: ${candidateResponse.passage.reference} (${candidateResponse.passage.version})
Texto Sagrado Literal: "${candidateResponse.passage.fullText}"

Escreva uma resposta pastoral profunda, bíblica e acolhedora em formato JSON estrito:
{
  "theme_title": "${candidateResponse.themeTitle}",
  "pastoral_reflection": "Reflexão profunda de 2 a 3 parágrafos aplicando o texto bíblico com empatia à necessidade do usuário",
  "historical_context": "Breve contexto histórico-cultural de 1 parágrafo sobre a passagem",
  "guided_prayer": "Oração calorosa, sincera e bíblica em 1ª pessoa",
  "practical_step": "Uma ação prática e consoladora para o dia de hoje"
}
`;
      const aiResult = await model.generateContent(prompt);
      const aiText = cleanJsonResponse(aiResult.response.text());
      const aiData = JSON.parse(aiText);

      return NextResponse.json({
        success: true,
        isAiGenerated: true,
        themeTitle: aiData.theme_title || candidateResponse.themeTitle,
        passage: candidateResponse.passage,
        pastoralReflection: aiData.pastoral_reflection || candidateResponse.pastoralReflection,
        historicalContext: aiData.historical_context || candidateResponse.historicalContext,
        guidedPrayer: aiData.guided_prayer || candidateResponse.guidedPrayer,
        practicalStep: aiData.practical_step || candidateResponse.practicalStep,
        alternativePassages: candidateResponse.alternativePassages || [],
      });
    } catch (aiErr) {
      console.warn("Gemini falhou ou deu timeout. Retornando resposta determinística com segurança:", aiErr);
      return NextResponse.json(candidateResponse);
    }
  } catch (error: any) {
    console.error("Erro no endpoint /api/counsel:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro ao consultar as Escrituras. Tente novamente." },
      { status: 500 }
    );
  }
}
