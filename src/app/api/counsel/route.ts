import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  getPassage,
  matchThemeByText,
  buildThematicResponse,
  parsePassageReference,
  getThemeById,
  stripAccents,
} from "@/lib/bible";
import {
  matchBiblicalStory,
  searchBibleFullText,
  buildStoryResponse,
  buildFullTextSearchResponse,
  getDiverseComfortFallback,
  getMorePassagesForContext,
  ResolvedBibleResponse,
} from "@/lib/bibleSearchEngine";

interface RequestBody {
  feeling: string;
  version?: "nvi" | "aa";
  mode?: "counsel" | "search";
  excludeReferences?: string[];
  themeId?: string;
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

    const excludeRefs = body.excludeReferences || [];
    const normExcluded = new Set(
      excludeRefs.map((r) => stripAccents(r).replace(/\s+/g, ""))
    );
    const isExcluded = (ref: string) => {
      if (!ref) return false;
      const clean = stripAccents(ref).replace(/\s+/g, "");
      return normExcluded.has(clean);
    };

    // -------------------------------------------------------------
    // ETAPA 1: PARSER DE REFERÊNCIA DIRETA ("João 3:16", "Sl 23", "1 Co 13:4", etc.)
    // -------------------------------------------------------------
    const directParsed = parsePassageReference(query, version);
    if (directParsed && !isExcluded(directParsed.reference)) {
      const alts = getMorePassagesForContext({
        context: directParsed.book,
        excludeReferences: [directParsed.reference, ...excludeRefs],
        version,
        limit: 3,
      });
      return NextResponse.json({
        success: true,
        isAiGenerated: false,
        themeTitle: directParsed.reference,
        passage: directParsed,
        pastoralReflection: `A passagem de ${directParsed.reference} é uma das colunas preciosas das Sagradas Escrituras. Ao meditar neste texto divino, permita que a verdade de Deus ilumine sua mente, renove suas forças e guie os seus passos em retidão e paz.`,
        historicalContext: `Texto das Sagradas Escrituras traduzido com fidelidade na versão ${version.toUpperCase()}.`,
        guidedPrayer: `Senhor Deus, abro o meu coração para a Tua Palavra em ${directParsed.reference}. Que ela seja lâmpada para os meus pés e luz para o meu caminho. Em nome de Jesus, amém.`,
        practicalStep: `Leia novamente este trecho com calma e guarde no coração o ensinamento principal que Deus falou com você.`,
        alternativePassages: alts,
      });
    }

    // -------------------------------------------------------------
    // ETAPA 2: RESOLUÇÃO BÍBLICA DETERMINÍSTICA LOCAL (Garantia de 100% de relevância)
    // -------------------------------------------------------------
    let candidateResponse: ResolvedBibleResponse | null = null;

    // 2.A: Resolução Temática (Prioritária para botões de sentimento e temas pastorais)
    let theme = body.themeId ? getThemeById(body.themeId) : null;
    if (!theme && mode === "counsel") {
      theme = matchThemeByText(query);
    }

    if (theme) {
      const thematicResp = buildThematicResponse(theme, version, excludeRefs) as ResolvedBibleResponse;
      if (thematicResp && !isExcluded(thematicResp.passage.reference)) {
        candidateResponse = thematicResp;
      }
    }

    // 2.B: Busca em Narrativas, Parábolas e Eventos Marcantes da Bíblia
    if (!candidateResponse) {
      const matchedStory = matchBiblicalStory(query);
      if (matchedStory) {
        const storyResp = buildStoryResponse(matchedStory, version);
        if (storyResp && !isExcluded(storyResp.passage.reference)) {
          candidateResponse = storyResp;
        }
      }
    }

    // 2.C: Catálogo Estendido por Contexto / Tema (Garante passagem inédita mesmo após muitas trocas)
    if (!candidateResponse && (theme || mode === "counsel")) {
      const morePassages = getMorePassagesForContext({
        context: query,
        themeId: theme?.id || body.themeId,
        excludeReferences: excludeRefs,
        version,
        limit: 1,
      });

      if (morePassages.length > 0) {
        const m = morePassages[0];
        const p = getPassage(m.book, m.chapter, m.startVerse, m.endVerse, version);
        if (p && !isExcluded(p.reference)) {
          const activeThemeId = theme?.id || body.themeId;
          const isPositiveTheme = [
            "gratidao_louvor",
            "alegria_felicidade",
            "vitoria_conquista",
            "paz_serenidade",
            "amor_familia",
          ].includes(activeThemeId || "");

          candidateResponse = {
            success: true,
            isAiGenerated: false,
            themeId: activeThemeId,
            themeTitle: m.note || theme?.title || `Passagem em ${m.book}`,
            passage: p,
            pastoralReflection: isPositiveTheme
              ? `Ao nos voltarmos para ${p.reference}, celebramos a bondade e a fidelidade do Senhor. Toda boa dádiva vem do alto, e render graças a Deus fortalece a alegria e a paz em nossa caminhada.`
              : `Ao nos voltarmos para ${p.reference}, encontramos o amparo fiel das Sagradas Escrituras. A graça de Deus é suficiente para cada estação da vida e Suas promessas de paz permanecem firmes para o seu coração hoje.`,
            historicalContext: `Texto canônico das Sagradas Escrituras registrado no livro de ${m.book}, capítulo ${m.chapter}, transmitindo ensinamentos eternos de fé.`,
            guidedPrayer: isPositiveTheme
              ? `Senhor Deus, meu coração transborda em gratidão e louvor diante de ${p.reference}. Obrigado por Tua bondade, fidelidade e bênçãos derramadas sobre mim e minha família. Em nome de Jesus, amém.`
              : `Senhor Deus, achego-me a Ti amparado em ${p.reference}. Sei que o Senhor conhece as minhas aflições e sonda o meu íntimo. Derrama a Tua paz e a Tua direção sobre a minha vida. Em nome de Jesus, amém.`,
            practicalStep: isPositiveTheme
              ? `Compartilhe hoje uma palavra de gratidão ou bênção com alguém especial e agradeça a Deus por cada detalhe desta conquista.`
              : `Medite neste versículo ao longo do dia e declare a provisão e a paz de Deus sobre a sua casa.`,
            alternativePassages: [],
          };
        }
      }
    }

    // 2.D: Busca Textual Completa com Stemmer, Stopwords e Sinônimos (~31.000 versículos)
    if (!candidateResponse) {
      const textMatches = searchBibleFullText(query, version, 25);
      for (const tm of textMatches) {
        const fullResp = buildFullTextSearchResponse(tm, version);
        if (fullResp && !isExcluded(fullResp.passage.reference)) {
          candidateResponse = fullResp;
          break;
        }
      }
    }

    // 2.E: Busca na Versão Alternativa se ainda não encontrou em modo busca
    if (!candidateResponse && mode === "search") {
      const altVersion = version === "nvi" ? "aa" : "nvi";
      const altMatches = searchBibleFullText(query, altVersion, 25);
      for (const m of altMatches) {
        const p = getPassage(m.book, m.chapter, m.verse, m.verse, version);
        if (p && !isExcluded(p.reference)) {
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
          break;
        }
      }
    }

    // 2.F: Fallback Diverso (Garantia de que NUNCA repete uma passagem já vista)
    if (!candidateResponse) {
      candidateResponse = getDiverseComfortFallback(version, excludeRefs);
    }

    // Garante que o retorno sempre tenha passagens alternativas enriquecidas e sem repetição
    if (!candidateResponse.alternativePassages || candidateResponse.alternativePassages.length === 0) {
      candidateResponse.alternativePassages = getMorePassagesForContext({
        context: query,
        themeId: (candidateResponse as any).themeId || theme?.id,
        excludeReferences: [candidateResponse.passage.reference, ...excludeRefs],
        version,
        limit: 3,
      });
    }

    // Se NÃO houver chave do Gemini configurada no servidor, entrega a resposta determinística enriquecida
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
