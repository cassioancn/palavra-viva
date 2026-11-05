import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  getPassage,
  matchThemeByText,
  buildThematicResponse,
  getRandomComfortVerse,
  parsePassageReference,
  matchBiblicalStory,
  buildStoryResponse,
  searchBibleText,
} from "@/lib/bible";

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
    const apiKey = process.env.GEMINI_API_KEY || "";

    if (!query) {
      return NextResponse.json(
        { error: "Por favor, digite o que você procura ou como se sente." },
        { status: 400 }
      );
    }

    // -------------------------------------------------------------
    // PRÉ-VERIFICAÇÃO LOCAL DIRETA (Referência Direta ou História Curada)
    // -------------------------------------------------------------
    // 1. Verifica se o usuário digitou uma referência direta (ex: "João 3:16", "Sl 23", "1 Co 13:4-7")
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

    // Se nenhuma chave de IA foi configurada no servidor, utiliza os motores locais completos
    if (!apiKey) {
      // 2. Busca no catálogo de histórias bíblicas
      const story = matchBiblicalStory(query);
      if (story) {
        return NextResponse.json(buildStoryResponse(story, version));
      }

      // 3. Busca no catálogo de temas emocionais
      const theme = matchThemeByText(query);
      if (theme) {
        return NextResponse.json(buildThematicResponse(theme, version));
      }

      // 4. Busca textual literal na Bíblia completa
      const textMatches = searchBibleText(query, version, 1);
      if (textMatches.length > 0) {
        const m = textMatches[0];
        const p = getPassage(m.book, m.chapter, m.verse, m.verse, version);
        if (p) {
          return NextResponse.json({
            success: true,
            isAiGenerated: false,
            themeTitle: p.reference,
            passage: p,
            pastoralReflection: `Encontramos a passagem bíblica que corresponde à sua busca em ${p.reference}. Que esta Palavra viva gere esperança e direção para a sua vida.`,
            historicalContext: `Trecho bíblico verificado no livro de ${m.book}.`,
            guidedPrayer: `Senhor, agradeço pela Tua Palavra fiel que nos instrui em todo tempo. Que esta verdade se cumpra em minha vida. Amém.`,
            practicalStep: `Abra o capítulo completo de ${m.book} ${m.chapter} para aprofundar seu entendimento.`,
            alternativePassages: [],
          });
        }
      }

      // 5. Fallback geral de consolo
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
      });
    }

    // -------------------------------------------------------------
    // ETAPA 1 COM INTELIGÊNCIA ARTIFICIAL: Identificação Precisa
    // Diferencia: (A) Busca de história/passagem específica vs (B) Consolo pastoral
    // -------------------------------------------------------------
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const stage1Prompt = `
Você é um teólogo bíblico especialista em todas as Escrituras Sagradas (66 livros canônicos protestantes).
O usuário enviou a seguinte busca ou mensagem:
"${query}"

Sua missão é identificar a natureza exata da busca e apontar a passagem bíblica canônica correspondente:

TIPO 1: BUSCA DE PASSAGEM ESPECÍFICA / HISTÓRIA / PERSONAGEM / NARRATIVA BÍBLICA / TEMA:
Exemplos: "Davi e Golias", "a criação do mundo", "Jesus acalmando a tempestade", "a arca de Noé", "onde fala sobre amor", "a multiplicação dos pães e peixes", "parábola do filho pródigo", "onde fala da armadura de Deus", "Sansão e Dalila", "ressurreição de Lázaro", "mulher do fluxo de sangue", "travessia do mar vermelho", "dez mandamentos", "1 Coríntios 13".
-> Identifique com precisão o Livro Canônico, Capítulo e Versículos onde essa narrativa ou ensinamento ocorre.

TIPO 2: CONSOLO / SENTIMENTO / MOMENTO PESSOAL:
Exemplos: "estou ansioso", "perdi meu pai", "muito medo de falhar", "coração partido", "solidão", "preciso de esperança".
-> Escolha a passagem bíblica que mais genuinamente traz consolo, paz e direção espiritual para a alma da pessoa.

REGRAS ESTRITAS:
1. Indique UMA passagem bíblica REAL e existente nos 66 livros da Bíblia protestante. NUNCA invente versículos ou livros.
2. Limite a um bloco coeso de 1 a 6 versículos contíguos que contem o ponto central da história ou consolo.
3. Responda ESTRITAMENTE em formato JSON:
{
  "is_specific_story": true ou false,
  "book": "Nome do Livro em Português (ex: 1 Samuel, Gênesis, Mateus, Salmos, Êxodo, Lucas)",
  "chapter": 1,
  "start_verse": 1,
  "end_verse": 5,
  "theme_title": "Título acolhedor e claro da passagem ou tema"
}
`;

    let stage1Data = {
      is_specific_story: false,
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
      const story = matchBiblicalStory(query);
      if (story) return NextResponse.json(buildStoryResponse(story, version));
      const fallbackTheme = matchThemeByText(query);
      if (fallbackTheme) return NextResponse.json(buildThematicResponse(fallbackTheme, version));
    }

    // -------------------------------------------------------------
    // ETAPA DE AUDITORIA CANÔNICA (Zero Alucinações)
    // Busca obrigatória no banco de versículos reais indexados
    // -------------------------------------------------------------
    let verifiedPassage = getPassage(
      stage1Data.book,
      Number(stage1Data.chapter),
      Number(stage1Data.start_verse),
      Number(stage1Data.end_verse),
      version
    );

    let finalThemeTitle = stage1Data.theme_title || "Uma Palavra para o Seu Coração";

    // Se o modelo indicou versículo inexistente, resgata via catálogo curado
    if (!verifiedPassage) {
      const story = matchBiblicalStory(query);
      if (story) {
        verifiedPassage = getPassage(story.book, story.chapter, story.startVerse, story.endVerse, version);
        finalThemeTitle = story.title;
      }
      if (!verifiedPassage) {
        const fallbackTheme = matchThemeByText(query);
        if (fallbackTheme) {
          const prim = fallbackTheme.primary_passage;
          verifiedPassage = getPassage(prim.book, prim.chapter, prim.start_verse, prim.end_verse, version);
          finalThemeTitle = prim.theme_title || fallbackTheme.title;
        }
      }
      if (!verifiedPassage) {
        verifiedPassage = getPassage("Salmos", 23, 1, 3, version)!;
        finalThemeTitle = "O Senhor é o Meu Pastor";
      }
    }

    // -------------------------------------------------------------
    // ETAPA 2: Geração da Reflexão (Explicativa para histórias / Pastoral para consolo)
    // -------------------------------------------------------------
    const isStory = !!stage1Data.is_specific_story;

    const stage2Prompt = `
Você é um teólogo bíblico e pastor acolhedor.
O usuário buscou por: "${query}"
Tipo de busca detectado: ${isStory ? "História / Passagem Específica da Bíblia" : "Consolo para Momento Pessoal"}

A passagem bíblica REAL e VERIFICADA selecionada das Escrituras é:
Referência: ${verifiedPassage.reference} (${verifiedPassage.version})
Texto Sagrado Literal: "${verifiedPassage.fullText}"

${
  isStory
    ? `Sua missão é iluminar e explicar esta passagem bíblica:
1. "pastoral_reflection": 2 a 3 parágrafos envolventes explicando a narrativa ou ensino deste texto, quem estava presente, o significado profundo daquele acontecimento e como aplicar esse princípio em nossa vida cristã hoje.
2. "historical_context": 1 a 2 frases esclarecedoras sobre o contexto histórico, época, autor ou cenário bíblico onde esta passagem ocorreu.
3. "guided_prayer": Uma oração sincera inspirada nos ensinamentos desta passagem para quem está lendo.
4. "practical_step": Uma atitude prática de fé para o dia de hoje baseada nesta lição bíblica.`
    : `Sua missão é escrever uma reflexão pastoral acolhedora e calorosa:
1. "pastoral_reflection": 2 a 3 parágrafos calorosos e empáticos conectando o versículo ao coração da pessoa com consolo e paz.
2. "historical_context": 1 ou 2 frases sobre o contexto bíblico original.
3. "guided_prayer": Uma oração sincera em primeira pessoa ('Senhor meu Deus...').
4. "practical_step": Uma atitude de fé simples e reconfortante para o dia de hoje.`
}

Responda ESTRITAMENTE em formato JSON:
{
  "pastoral_reflection": "texto aqui",
  "historical_context": "texto aqui",
  "guided_prayer": "texto aqui",
  "practical_step": "texto aqui"
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
        guidedPrayer: s2Data.guided_prayer || "Senhor, coloco minha vida e meus caminhos em Tuas mãos. Amém.",
        practicalStep: s2Data.practical_step || "Medite neste ensinamento bíblico ao longo do seu dia.",
        alternativePassages: [],
      });
    } catch (stage2Err) {
      console.warn("Falha no Estágio 2 do Gemini:", stage2Err);
      const story = matchBiblicalStory(query);
      if (story) return NextResponse.json(buildStoryResponse(story, version));
      const fallbackTheme = matchThemeByText(query);
      if (fallbackTheme) return NextResponse.json(buildThematicResponse(fallbackTheme, version));

      return NextResponse.json({
        success: true,
        isAiGenerated: false,
        themeTitle: finalThemeTitle,
        passage: verifiedPassage,
        pastoralReflection:
          "As Escrituras Sagradas são vivas e eficazes. Que esta passagem penetre no seu íntimo e renove o seu entendimento e fé hoje.",
        historicalContext: "Escritura sagrada canônica.",
        guidedPrayer:
          "Pai amado, que a verdade desta passagem reine em minha mente e em meu coração. Amém.",
        practicalStep: "Guarde este trecho da Bíblia na memória e pratique a sua mensagem hoje.",
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

