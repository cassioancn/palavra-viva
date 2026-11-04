import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  getPassage,
  matchThemeByText,
  buildThematicResponse,
  getRandomComfortVerse,
} from "@/lib/bible";

interface RequestBody {
  feeling: string;
  version?: "nvi" | "aa";
  apiKey?: string;
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
    const feeling = body.feeling?.trim() || "";
    const version = (body.version === "aa" ? "aa" : "nvi") as "nvi" | "aa";
    const apiKey = body.apiKey?.trim() || process.env.GEMINI_API_KEY || "";

    if (!feeling) {
      return NextResponse.json(
        { error: "Por favor, compartilhe como você se sente." },
        { status: 400 }
      );
    }

    // Se nenhuma chave de IA foi fornecida, utiliza o catálogo canônico curado
    if (!apiKey) {
      const theme = matchThemeByText(feeling);
      if (theme) {
        const resp = buildThematicResponse(theme, version);
        return NextResponse.json({
          ...resp,
          notice: "Modo Bíblico Local (Adicione sua chave Gemini gratuita para reflexões geradas por IA em tempo real).",
        });
      }

      // Se nenhum tema der pontuação suficiente, retorna um versículo de paz
      const defaultPassage = getRandomComfortVerse(version);
      return NextResponse.json({
        success: true,
        isAiGenerated: false,
        themeTitle: "O Senhor é o Seu Refúgio",
        passage: defaultPassage,
        pastoralReflection:
          "Mesmo nos dias em que o coração se sente pesado e as respostas parecem distantes, a Palavra de Deus permanece como âncora firme para a nossa alma. Ele conhece cada pensamento seu e cuida de você com ternura inabalável.",
        historicalContext:
          "As Escrituras Sagradas foram inspiradas pelo Espírito Santo para trazer luz, consolo e esperança em todas as estações da vida.",
        guidedPrayer:
          "Senhor Deus, derrama a Tua paz santa sobre o meu coração neste momento. Acalma as minhas tempestades interiores e ensina-me a descansar na certeza do Teu cuidado. Em nome de Jesus, amém.",
        practicalStep:
          "Feche os olhos por alguns instantes, respire fundo e repita este versículo em seu pensamento como uma oração de entrega.",
        alternativePassages: [],
        notice: "Modo Bíblico Local (chave de IA opcional não detectada).",
      });
    }

    // -------------------------------------------------------------
    // ETAPA 1: Identificação Teológica & Escolha da Passagem Canônica (LLM)
    // -------------------------------------------------------------
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const stage1Prompt = `
Você é um teólogo bíblico e conselheiro pastoral cristão sábio e compassivo.
O usuário compartilhou o seguinte sentimento ou momento de vida:
"${feeling}"

Sua missão é identificar a passagem da Bíblia Sagrada (dos 66 livros canônicos protestantes) que mais genuinamente traz consolo, resposta, alento ou direção espiritual para esta situação.

REGRAS ESTRITAS ANTI-ALUCINAÇÃO:
1. Indique UMA passagem bíblica real e canônica existente. NUNCA invente versículos ou livros.
2. Limite a passagem a um bloco coeso de 1 a 4 versículos contíguos (ex: Filipenses 4:6-7, Mateus 11:28-30, Salmos 34:18-19, Isaías 41:10).
3. Responda ESTRITAMENTE em formato JSON puro, sem introduções ou markdown fora do bloco JSON.

Formato esperado:
{
  "book": "Nome do Livro em Português (ex: Salmos, Filipenses, Mateus, Isaías)",
  "chapter": 1,
  "start_verse": 1,
  "end_verse": 2,
  "theme_title": "Título acolhedor do tema em poucas palavras"
}
`;

    let stage1Data = {
      book: "Salmos",
      chapter: 23,
      start_verse: 1,
      end_verse: 3,
      theme_title: "O Senhor é o Meu Pastor",
    };

    try {
      const s1Result = await model.generateContent(stage1Prompt);
      const s1Text = cleanJsonResponse(s1Result.response.text());
      stage1Data = JSON.parse(s1Text);
    } catch (llmErr) {
      console.warn("Falha no Estágio 1 do Gemini, acionando fallback local:", llmErr);
      const fallbackTheme = matchThemeByText(feeling);
      if (fallbackTheme) {
        return NextResponse.json(buildThematicResponse(fallbackTheme, version));
      }
    }

    // -------------------------------------------------------------
    // ETAPA DE AUDITORIA CANÔNICA (Zero Alucinações)
    // Busca e validação obrigatória no banco de versículos reais
    // -------------------------------------------------------------
    let verifiedPassage = getPassage(
      stage1Data.book,
      Number(stage1Data.chapter),
      Number(stage1Data.start_verse),
      Number(stage1Data.end_verse),
      version
    );

    let finalThemeTitle = stage1Data.theme_title || "Uma Palavra para o Seu Coração";

    // Se o modelo alucinou ou indicou versículo inexistente, resgata via catálogo curado
    if (!verifiedPassage) {
      const fallbackTheme = matchThemeByText(feeling);
      if (fallbackTheme) {
        const prim = fallbackTheme.primary_passage;
        verifiedPassage = getPassage(prim.book, prim.chapter, prim.start_verse, prim.end_verse, version);
        finalThemeTitle = prim.theme_title || fallbackTheme.title;
      }
      if (!verifiedPassage) {
        verifiedPassage = getPassage("Salmos", 23, 1, 3, version)!;
        finalThemeTitle = "O Senhor é o Meu Pastor";
      }
    }

    // -------------------------------------------------------------
    // ETAPA 2: Geração Devocional Pastoral sobre o Texto Verificado
    // -------------------------------------------------------------
    const stage2Prompt = `
Você é um conselheiro espiritual e pastor amoroso, sábio e acolhedor.
O usuário desabafou como se sente:
"${feeling}"

A passagem bíblica REAL e VERIFICADA selecionada das Escrituras para ele é:
Referência: ${verifiedPassage.reference} (${verifiedPassage.version})
Texto Sagrado Literal: "${verifiedPassage.fullText}"

Sua missão é escrever uma reflexão pastoral profunda, calorosa e consoladora que conecte a verdade deste versículo real ao coração da pessoa.
Responda ESTRITAMENTE em formato JSON:
{
  "pastoral_reflection": "2 a 3 parágrafos calorosos e empáticos, sem jargões frios ou tom acusatório, mostrando como Deus acolhe a dor/situação da pessoa e como este versículo específico traz alento e paz.",
  "historical_context": "1 ou 2 frases breves e esclarecedoras sobre o contexto bíblico original para que a pessoa compreenda a passagem com fidelidade.",
  "guided_prayer": "Uma oração sincera e tocante em primeira pessoa ('Senhor meu Deus, ...') que a pessoa possa fazer agora mesmo com base neste versículo.",
  "practical_step": "Uma atitude de fé simples, delicada e prática para a pessoa aplicar no seu dia de hoje."
}
`;

    try {
      const s2Result = await model.generateContent(stage2Prompt);
      const s2Text = cleanJsonResponse(s2Result.response.text());
      const s2Data = JSON.parse(s2Text);

      return NextResponse.json({
        success: true,
        isAiGenerated: true,
        themeTitle: finalThemeTitle,
        passage: verifiedPassage,
        pastoralReflection: s2Data.pastoral_reflection || "Deus cuida de cada detalhe da sua caminhada.",
        historicalContext: s2Data.historical_context || "Palavra inspirada de Deus para edificar o Seu povo.",
        guidedPrayer: s2Data.guided_prayer || "Senhor, coloco minha vida e meus sentimentos em Tuas mãos. Amém.",
        practicalStep: s2Data.practical_step || "Descanse hoje na certeza da presença de Deus.",
        alternativePassages: [],
      });
    } catch (stage2Err) {
      console.warn("Falha no Estágio 2 do Gemini:", stage2Err);
      const fallbackTheme = matchThemeByText(feeling);
      if (fallbackTheme) {
        return NextResponse.json(buildThematicResponse(fallbackTheme, version));
      }
      return NextResponse.json({
        success: true,
        isAiGenerated: false,
        themeTitle: finalThemeTitle,
        passage: verifiedPassage,
        pastoralReflection:
          "Deus não rejeita o coração contrito nem ignora as suas lágrimas. Que esta Palavra santa penetre no seu íntimo e renove as suas esperanças hoje.",
        historicalContext: "Escritura inspirada para consolo e esperança.",
        guidedPrayer:
          "Pai amado, trago diante de Ti o que estou vivendo. Que a Tua paz que excede todo entendimento guarde o meu coração. Amém.",
        practicalStep: "Guarde este versículo na memória e medite nele durante as horas de aflição.",
        alternativePassages: [],
      });
    }
  } catch (error: any) {
    console.error("Erro no endpoint /api/counsel:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro ao consultar as Escrituras. Tente novamente." },
      { status: 500 }
    );
  }
}
