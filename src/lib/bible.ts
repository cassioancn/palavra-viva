import nviRaw from "../../data/pt_nvi.json";
import aaRaw from "../../data/pt_aa.json";
import thematicRaw from "../../data/thematic_catalog.json";

export interface VerseItem {
  verse: number;
  text: string;
}

export interface PassageResult {
  success: boolean;
  book: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
  version: string;
  reference: string;
  fullText: string;
  verses: VerseItem[];
}

export interface ChapterResult {
  book: string;
  chapter: number;
  totalChapters: number;
  version: string;
  verses: VerseItem[];
}

export interface ThemePassage {
  book: string;
  chapter: number;
  start_verse: number;
  end_verse: number;
  theme_title?: string;
  context_summary?: string;
  reflection?: string;
  guided_prayer?: string;
  practical_step?: string;
  note?: string;
}

export interface ThemeItem {
  id: string;
  title: string;
  keywords: string[];
  primary_passage: ThemePassage;
  alternative_passages?: ThemePassage[];
}

interface BibleBook {
  abbrev: string;
  name: string;
  chapters: string[][];
}

const nviData: BibleBook[] = nviRaw as BibleBook[];
const aaData: BibleBook[] = aaRaw as BibleBook[];
const thematicCatalog: ThemeItem[] = (thematicRaw as any).themes || [];

const BOOK_ALIAS_MAP: Record<string, string> = {
  // Antigo Testamento
  gn: "Gênesis", genesis: "Gênesis",
  ex: "Êxodo", exodo: "Êxodo",
  lv: "Levítico", levitico: "Levítico",
  nm: "Números", numeros: "Números",
  dt: "Deuteronômio", deuteronomio: "Deuteronômio",
  js: "Josué", josue: "Josué",
  jz: "Juízes", juizes: "Juízes",
  rt: "Rute", rute: "Rute",
  "1sm": "1 Samuel", "1 samuel": "1 Samuel", "1samuel": "1 Samuel",
  "2sm": "2 Samuel", "2 samuel": "2 Samuel", "2samuel": "2 Samuel",
  "1rs": "1 Reis", "1 reis": "1 Reis", "1reis": "1 Reis",
  "2rs": "2 Reis", "2 reis": "2 Reis", "2reis": "2 Reis",
  "1cr": "1 Crônicas", "1 cronicas": "1 Crônicas", "1cronicas": "1 Crônicas",
  "2cr": "2 Crônicas", "2 cronicas": "2 Crônicas", "2cronicas": "2 Crônicas",
  ed: "Esdras", esdras: "Esdras",
  ne: "Neemias", neemias: "Neemias",
  et: "Ester", ester: "Ester",
  jo: "Jó", job: "Jó",
  sl: "Salmos", salmo: "Salmos", salmos: "Salmos", psalms: "Salmos", psalm: "Salmos",
  pv: "Provérbios", proverbios: "Provérbios", proverbs: "Provérbios",
  ec: "Eclesiastes", eclesiastes: "Eclesiastes",
  ct: "Cânticos", canticos: "Cânticos", cantares: "Cânticos",
  is: "Isaías", isaias: "Isaías", isaiah: "Isaías",
  jr: "Jeremias", jeremias: "Jeremias", jeremiah: "Jeremias",
  lm: "Lamentações", lamentacoes: "Lamentações",
  ez: "Ezequiel", ezequiel: "Ezequiel", ezekiel: "Ezequiel",
  dn: "Daniel", daniel: "Daniel",
  os: "Oséias", oseias: "Oséias",
  jl: "Joel", joel: "Joel",
  am: "Amós", amos: "Amós",
  ob: "Obadias", obadias: "Obadias",
  jn: "Jonas", jonas: "Jonas",
  mq: "Miquéias", miqueias: "Miquéias",
  na: "Naum", naum: "Naum",
  hc: "Habacuque", habacuque: "Habacuque",
  sf: "Sofonias", sofonias: "Sofonias",
  ag: "Ageu", ageu: "Ageu",
  zc: "Zacarias", zacarias: "Zacarias",
  ml: "Malaquias", malaquias: "Malaquias",

  // Novo Testamento
  mt: "Mateus", mateus: "Mateus", matthew: "Mateus",
  mc: "Marcos", marcos: "Marcos", mark: "Marcos",
  lc: "Lucas", lucas: "Lucas", luke: "Lucas",
  joo: "João", joao: "João", john: "João",
  at: "Atos", atos: "Atos", acts: "Atos",
  rm: "Romanos", romanos: "Romanos", romans: "Romanos",
  "1co": "1 Coríntios", "1 corintios": "1 Coríntios", "1corintios": "1 Coríntios",
  "2co": "2 Coríntios", "2 corintios": "2 Coríntios", "2corintios": "2 Coríntios",
  gl: "Gálatas", galatas: "Gálatas", galatians: "Gálatas",
  ef: "Efésios", efesios: "Efésios", ephesians: "Efésios",
  fp: "Filipenses", filipenses: "Filipenses", philippians: "Filipenses",
  cl: "Colossenses", colossenses: "Colossenses", colossians: "Colossenses",
  "1ts": "1 Tessalonicenses", "1 tessalonicenses": "1 Tessalonicenses", "1thessalonians": "1 Tessalonicenses",
  "2ts": "2 Tessalonicenses", "2 tessalonicenses": "2 Tessalonicenses", "2thessalonians": "2 Tessalonicenses",
  "1tm": "1 Timóteo", "1 timoteo": "1 Timóteo", "1timoteo": "1 Timóteo",
  "2tm": "2 Timóteo", "2 timoteo": "2 Timóteo", "2timoteo": "2 Timóteo",
  tt: "Tito", tito: "Tito", titus: "Tito",
  fm: "Filemom", filemom: "Filemom",
  hb: "Hebreus", hebreus: "Hebreus", hebrews: "Hebreus",
  tg: "Tiago", tiago: "Tiago", james: "Tiago",
  "1pe": "1 Pedro", "1 pedro": "1 Pedro", "1pedro": "1 Pedro",
  "2pe": "2 Pedro", "2 pedro": "2 Pedro", "2pedro": "2 Pedro",
  "1jo": "1 João", "1 joao": "1 João", "1joao": "1 João",
  "2jo": "2 João", "2 joao": "2 João", "2joao": "2 João",
  "3jo": "3 João", "3 joao": "3 João", "3joao": "3 João",
  jd: "Judas", judas: "Judas", jude: "Judas",
  ap: "Apocalipse", apocalipse: "Apocalipse", revelation: "Apocalipse"
};

export function stripAccents(str: string): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function normalizeBookName(raw: string): string {
  if (!raw) return "";
  const clean = stripAccents(raw).replace(/\./g, "").trim();
  if (BOOK_ALIAS_MAP[clean]) {
    return BOOK_ALIAS_MAP[clean];
  }
  for (const [key, val] of Object.entries(BOOK_ALIAS_MAP)) {
    if (clean === stripAccents(key) || (clean.length >= 3 && clean.startsWith(stripAccents(key)))) {
      return val;
    }
  }
  return raw.trim();
}

function loadBibleData(version: "nvi" | "aa"): BibleBook[] {
  return version === "aa" ? aaData : nviData;
}

export function loadThematicCatalog(): ThemeItem[] {
  return thematicCatalog;
}

export function listAllThemes(): ThemeItem[] {
  return thematicCatalog;
}

export function getThemeById(themeId: string): ThemeItem | undefined {
  return thematicCatalog.find((t) => t.id === themeId);
}

export function matchThemeByText(userInput: string): ThemeItem | null {
  if (!userInput || userInput.trim().length < 2) return null;

  const cleanText = stripAccents(userInput);
  const words = new Set(cleanText.split(/\s+/));
  const themes = thematicCatalog;

  let bestScore = 0;
  let bestTheme: ThemeItem | null = null;

  for (const t of themes) {
    let score = 0;
    for (const kw of t.keywords) {
      const cleanKw = stripAccents(kw);
      if (cleanKw.includes(" ") && cleanText.includes(cleanKw)) {
        score += 5;
      } else if (words.has(cleanKw)) {
        score += 3;
      } else {
        const wordsArr = Array.from(words);
        for (const w of wordsArr) {
          if ((w.length >= 4 && cleanKw.includes(w)) || (cleanKw.length >= 4 && w.includes(cleanKw))) {
            score += 1;
            break;
          }
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestTheme = t;
    }
  }

  return bestScore >= 2 ? bestTheme : null;
}

export function getPassage(
  bookName: string,
  chapter: number,
  startVerse: number,
  endVerse?: number,
  version: "nvi" | "aa" = "nvi"
): PassageResult | null {
  const normBook = normalizeBookName(bookName);
  const books = loadBibleData(version);
  const foundBook = books.find(
    (b) => stripAccents(b.name) === stripAccents(normBook) || stripAccents(b.abbrev) === stripAccents(normBook)
  );

  if (!foundBook) return null;

  const chIndex = chapter - 1;
  if (chIndex < 0 || chIndex >= foundBook.chapters.length) return null;

  const chVerses = foundBook.chapters[chIndex];
  const start = Math.max(1, startVerse);
  const end = Math.min(chVerses.length, endVerse && endVerse >= start ? endVerse : start);

  const versesList: VerseItem[] = [];
  for (let v = start; v <= end; v++) {
    const text = chVerses[v - 1];
    if (text) {
      versesList.push({ verse: v, text: text.trim() });
    }
  }

  if (versesList.length === 0) return null;

  const fullText =
    versesList.length > 1
      ? versesList.map((v) => `[${v.verse}] ${v.text}`).join(" ")
      : versesList[0].text;

  const reference =
    start === end
      ? `${foundBook.name} ${chapter}:${start}`
      : `${foundBook.name} ${chapter}:${start}-${end}`;

  return {
    success: true,
    book: foundBook.name,
    chapter,
    startVerse: start,
    endVerse: end,
    version: version.toUpperCase(),
    reference,
    fullText,
    verses: versesList,
  };
}

export function getFullChapter(
  bookName: string,
  chapter: number,
  version: "nvi" | "aa" = "nvi"
): ChapterResult | null {
  const normBook = normalizeBookName(bookName);
  const books = loadBibleData(version);
  const foundBook = books.find(
    (b) => stripAccents(b.name) === stripAccents(normBook) || stripAccents(b.abbrev) === stripAccents(normBook)
  );

  if (!foundBook) return null;
  const chIndex = chapter - 1;
  if (chIndex < 0 || chIndex >= foundBook.chapters.length) return null;

  const chVerses = foundBook.chapters[chIndex];
  const versesList: VerseItem[] = chVerses.map((text, idx) => ({
    verse: idx + 1,
    text: text.trim(),
  }));

  return {
    book: foundBook.name,
    chapter,
    totalChapters: foundBook.chapters.length,
    version: version.toUpperCase(),
    verses: versesList,
  };
}

export function getRandomComfortVerse(version: "nvi" | "aa" = "nvi"): PassageResult {
  const candidates = [
    { book: "Salmos", chapter: 23, start: 1, end: 3 },
    { book: "Filipenses", chapter: 4, start: 13, end: 13 },
    { book: "Isaías", chapter: 41, start: 10, end: 10 },
    { book: "Jeremias", chapter: 29, start: 11, end: 11 },
    { book: "Romanos", chapter: 8, start: 28, end: 28 },
    { book: "Salmos", chapter: 46, start: 1, end: 2 },
    { book: "Mateus", chapter: 11, start: 28, end: 28 },
    { book: "Salmos", chapter: 121, start: 1, end: 2 },
    { book: "Josué", chapter: 1, start: 9, end: 9 },
    { book: "Salmos", chapter: 37, start: 5, end: 5 },
    { book: "João", chapter: 14, start: 27, end: 27 },
    { book: "Provérbios", chapter: 3, start: 5, end: 6 },
  ];
  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  const res = getPassage(pick.book, pick.chapter, pick.start, pick.end, version);
  return (
    res || {
      success: true,
      book: "Salmos",
      chapter: 23,
      startVerse: 1,
      endVerse: 1,
      version: version.toUpperCase(),
      reference: "Salmos 23:1",
      fullText: "O Senhor é o meu pastor; de nada terei falta.",
      verses: [{ verse: 1, text: "O Senhor é o meu pastor; de nada terei falta." }],
    }
  );
}

export function buildThematicResponse(theme: ThemeItem, version: "nvi" | "aa" = "nvi") {
  const prim = theme.primary_passage;
  const passage =
    getPassage(prim.book, prim.chapter, prim.start_verse, prim.end_verse, version) ||
    getPassage("Salmos", 23, 1, 3, version)!;

  const alternativePassages = (theme.alternative_passages || []).map((alt) => {
    const res = getPassage(alt.book, alt.chapter, alt.start_verse, alt.end_verse, version);
    return {
      reference: res ? res.reference : `${alt.book} ${alt.chapter}:${alt.start_verse}`,
      note: alt.note || "",
      fullText: res ? res.fullText : "",
      book: alt.book,
      chapter: alt.chapter,
    };
  });

  return {
    success: true,
    isAiGenerated: false,
    themeId: theme.id,
    themeTitle: prim.theme_title || theme.title,
    passage,
    pastoralReflection: prim.reflection || "",
    historicalContext: prim.context_summary || "",
    guidedPrayer: prim.guided_prayer || "",
    practicalStep: prim.practical_step || "",
    alternativePassages,
  };
}

// -------------------------------------------------------------
// CATÁLOGO DE HISTÓRIAS, PERSONAGENS E NARRATIVAS BÍBLICAS
// -------------------------------------------------------------
export interface BiblicalStoryItem {
  id: string;
  title: string;
  keywords: string[];
  book: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
  reflection: string;
  historicalContext: string;
  guidedPrayer: string;
  practicalStep: string;
}

export const BIBLICAL_STORIES: BiblicalStoryItem[] = [
  {
    id: "davi-golias",
    title: "Davi Derrota o Gigante Golias",
    keywords: ["davi e golias", "golias", "davi", "gigante", "funda", "filisteu", "1 samuel 17", "batalha de davi"],
    book: "1 Samuel",
    chapter: 17,
    startVerse: 45,
    endVerse: 49,
    reflection:
      "Davi não olhou para o tamanho do gigante com os olhos da carne, mas com os olhos da fé no Deus Todo-Poderoso. Quando você enfrenta gigantes em sua vida — sejam problemas financeiros, emocionais ou espirituais —, lembre-se de que a batalha pertence ao Senhor. Com Deus ao seu lado, nenhuma ameaça é invencível.",
    historicalContext:
      "Durante o reinado de Saul no Vale de Elá, os exércitos de Israel e dos filisteus se enfrentavam. O jovem pastor Davi, ungido por Deus, aceitou o desafio que amedrontava soldados experientes.",
    guidedPrayer:
      "Senhor dos Exércitos, diante dos gigantes que tentam me intimidar, eu declaro a Tua soberania sobre a minha vida. Não confio na minha própria força, mas no Teu santo nome. Dá-me a coragem de Davi para vencer cada batalha. Em nome de Jesus, amém.",
    practicalStep:
      "Identifique o maior 'gigante' que tira a sua paz hoje e entregue-o a Deus em oração, recusando-se a temer.",
  },
  {
    id: "criacao-do-mundo",
    title: "A Criação dos Céus e da Terra",
    keywords: ["criacao", "criacao do mundo", "no principio", "haja luz", "adao e eva", "genesis 1", "comeco de tudo"],
    book: "Gênesis",
    chapter: 1,
    startVerse: 1,
    endVerse: 5,
    reflection:
      "Deus tem o poder de trazer ordem ao caos e luz à escuridão mais densa apenas com a Sua Palavra. Não importa quão desordenadas pareçam as circunstâncias da sua vida hoje, o Criador do universo continua soprando vida, propósito e recomeços.",
    historicalContext:
      "O livro de Gênesis abre a revelação bíblica mostrando Deus como único Criador do cosmos, refutando os mitos politeístas da antiguidade com majestade e sabedoria.",
    guidedPrayer:
      "Pai Celestial, Criador de todas as coisas, haja luz nas áreas escuras do meu coração e da minha vida. Que o Teu poder criador estabeleça paz e ordem em tudo o que faço. Amém.",
    practicalStep:
      "Pare por alguns minutos, contemple a natureza ao seu redor e agradeça ao Criador pelo dom da vida.",
  },
  {
    id: "arca-de-noe",
    title: "Noé e a Arca do Dilúvio",
    keywords: ["arca de noe", "noe", "diluvio", "animais na arca", "pomba e azeite", "arco iris da alianca", "genesis 7"],
    book: "Gênesis",
    chapter: 7,
    startVerse: 17,
    endVerse: 23,
    reflection:
      "Mesmo quando o mundo inteiro se desviava, Noé permaneceu fiel a Deus e encontrou graça aos Seus olhos. A arca é um símbolo de Cristo: o refúgio seguro em meio às tempestades e julgamentos do mundo. Quem se abriga no Senhor jamais naufraga.",
    historicalContext:
      "Diante da corrupção moral da humanidade antediluviana, Deus chamou Noé para construir a arca da salvação e selou uma nova aliança com a criação.",
    guidedPrayer:
      "Senhor Deus, sê o meu refúgio e a minha arca protetora contra as tempestades deste mundo. Guarda a minha família e conserva o meu coração reto diante de Ti. Amém.",
    practicalStep:
      "Agradeça a Deus pelo refúgio que você encontra na Sua presença mesmo em dias difíceis.",
  },
  {
    id: "mar-vermelho",
    title: "A Abertura do Mar Vermelho",
    keywords: ["mar vermelho", "moises abre o mar", "abertura do mar", "exodo", "passagem pelo mar seco", "farao"],
    book: "Êxodo",
    chapter: 14,
    startVerse: 21,
    endVerse: 26,
    reflection:
      "Quando Israel parecia encurralado entre o exército egípcio e o mar intransponível, Deus abriu um caminho onde não havia caminho. O Senhor não apenas livra o Seu povo, mas demonstra que nada na criação pode impedir os Seus propósitos de libertação.",
    historicalContext:
      "Após as dez pragas e a saída do Egito, os israelitas chegaram diante do Mar Vermelho sob a liderança de Moisés, sendo testemunhas do maior milagre de libertação do Antigo Testamento.",
    guidedPrayer:
      "Deus de milagres, quando me sinto sem saída e cercado de impossibilidades, eu creio que Tu podes abrir caminhos no deserto e rios na solidão. Caminho pela fé e confio no Teu livramento. Amém.",
    practicalStep:
      "Dê o próximo passo de obediência mesmo sem ver o mar aberto; Deus abre o caminho enquanto você avança na fé.",
  },
  {
    id: "dez-mandamentos",
    title: "Os Dez Mandamentos no Monte Sinai",
    keywords: ["dez mandamentos", "10 mandamentos", "monte sinai", "tabuas da lei", "leis de deus", "exodo 20"],
    book: "Êxodo",
    chapter: 20,
    startVerse: 1,
    endVerse: 17,
    reflection:
      "A Lei do Senhor não foi dada para nos prender, mas para nos proteger e nos ensinar a amar a Deus sobre todas as coisas e ao próximo como a nós mesmos. Os mandamentos revelam o caráter santo e justo do nosso Pai celestial.",
    historicalContext:
      "No terceiro mês após a saída do Egito, no Monte Sinai envolto em fumaça e trovões, o Senhor estabeleceu os termos da Sua aliança moral com o povo de Israel.",
    guidedPrayer:
      "Senhor, grava os Teus mandamentos na tábua do meu coração. Ensina-me a amar a Tua Palavra e a andar em retidão, honrando-Te em meus pensamentos, palavras e ações. Amém.",
    practicalStep:
      "Examine o seu dia à luz do amor a Deus e da honestidade com as pessoas com quem convive.",
  },
  {
    id: "muralhas-de-jerico",
    title: "A Queda das Muralhas de Jericó",
    keywords: ["muralhas de jerico", "jerico", "josue em jerico", "trombetas", "queda do muro", "josue 6"],
    book: "Josué",
    chapter: 6,
    startVerse: 15,
    endVerse: 20,
    reflection:
      "Muralhas humanas que pareciam indestrutíveis caíram não pela força das espadas, mas pela obediência silenciosa, pelo clamor do povo e pelo poder do Senhor. Quando obedecemos às instruções de Deus, as barreiras mais altas desmoronam diante da nossa fé.",
    historicalContext:
      "Jericó era uma das fortalezas mais antigas e fortificadas de Canaã. A estratégia divina de marcha e trombetas ensinou a Israel que a conquista da Terra Prometida era obra de Deus.",
    guidedPrayer:
      "Pai amado, derruba as muralhas de dúvida, medo e opressão que cercam a minha vida. Fortalece a minha perseverança para marchar em obediência até ver a Tua vitória. Amém.",
    practicalStep:
      "Louva a Deus com antecedência por uma resposta que você ainda está esperando pelas promessas dEle.",
  },
  {
    id: "sansao-e-dalila",
    title: "Sansão e o Segredo de sua Consagração",
    keywords: ["sansao e dalila", "sansao", "dalila", "cabelo de sansao", "forca de sansao", "juizes 16"],
    book: "Juízes",
    chapter: 16,
    startVerse: 16,
    endVerse: 20,
    reflection:
      "A história de Sansão nos alerta sobre o perigo de negociar a nossa consagração a Deus por prazeres passageiros ou concessões perigosas. Contudo, até no final de sua vida, o arrependimento sincero de Sansão foi acolhido pela misericórdia do Senhor.",
    historicalContext:
      "Sansão foi um juiz de Israel com voto nazireu de consagração desde o ventre. Sua fraqueza diante de Dalila resultou em sua captura pelos filisteus em Gaza.",
    guidedPrayer:
      "Senhor, guarda o meu coração contra as armadilhas e tentações que buscam enfraquecer a minha comunhão contigo. Renova a minha consagração e purifica os meus passos. Amém.",
    practicalStep:
      "Afaste-se hoje de qualquer hábito ou ambiente que você sabe que enfraquece a sua vida espiritual.",
  },
  {
    id: "daniel-leões",
    title: "Daniel na Cova dos Leões",
    keywords: ["daniel na cova dos leoes", "cova dos leoes", "daniel", "anjo fechou a boca dos leoes", "daniel 6"],
    book: "Daniel",
    chapter: 6,
    startVerse: 19,
    endVerse: 23,
    reflection:
      "A fidelidade inabalável de Daniel a Deus não o livrou de entrar na cova, mas garantiu a presença do anjo do Senhor com ele dentro dela. Deus é especialista em fechar a boca dos leões que rugem contra você.",
    historicalContext:
      "Na Babilônia sob o domínio persa de Dario, oficiais invejosos conspiraram contra Daniel por causa de sua integridade e de seu hábito diário de orar três vezes ao dia.",
    guidedPrayer:
      "Senhor Deus de Daniel, envia o Teu anjo para fechar a boca de todas as acusações, injustiças e perigos que me cercam. Permaneço firme na oração e na fidelidade a Ti. Amém.",
    practicalStep:
      "Não abra mão do seu momento diário de oração, mesmo nos dias de maior pressão no trabalho ou em casa.",
  },
  {
    id: "jonas-grande-peixe",
    title: "Jonas no Ventre do Grande Peixe",
    keywords: ["jonas e a baleia", "jonas", "grande peixe", "ninive", "barriga do peixe", "jonas 2"],
    book: "Jonas",
    chapter: 2,
    startVerse: 1,
    endVerse: 9,
    reflection:
      "Mesmo das profundezas do abismo, quando Jonas reconheceu o seu erro e clamou ao Senhor, Deus ouviu a sua voz. Não existe lugar tão profundo, pecado tão escuro ou desvio tão distante de onde a misericórdia de Deus não possa resgatar quem se arrepende.",
    historicalContext:
      "Jonas tentou fugir para Társis para evitar pregar a Nínive, capital do cruel império assírio, mas foi confrontado pelo amor soberano de Deus pelos povos.",
    guidedPrayer:
      "Senhor, das profundezas do meu coração eu clamo a Ti. Perdoa as minhas tentativas de fugir da Tua vontade. Ouve a minha voz e traz libertação à minha alma. Amém.",
    practicalStep:
      "Faça as pazes com a vontade de Deus em uma área que você vinha resistindo ou adiando.",
  },
  {
    id: "nascimento-jesus",
    title: "O Nascimento de Jesus em Belém",
    keywords: ["nascimento de jesus", "natal", "menino jesus", "belem", "manjedoura", "maria e jose", "estrela do oriente", "lucas 2"],
    book: "Lucas",
    chapter: 2,
    startVerse: 6,
    endVerse: 14,
    reflection:
      "O Rei da Glória escolheu nascer na simplicidade de uma manjedoura, aproximando-se dos mais humildes. O nascimento de Cristo é a prova definitiva de que Deus não está distante: Ele se fez carne e habitou entre nós, trazendo paz aos homens.",
    historicalContext:
      "Sob o decreto do imperador romano César Augusto, José e Maria viajaram de Nazaré a Belém de Judá, onde cumpriram as profecias messiânicas de Miquéias.",
    guidedPrayer:
      "Jesus amado, obrigado por ter vindo ao mundo por amor a mim. Habita no meu coração hoje como habitaste em Belém, enchendo a minha vida de paz, esperança e alegria. Amém.",
    practicalStep:
      "Leve uma palavra de carinho e esperança a alguém próximo que esteja passando por um momento de solidão.",
  },
  {
    id: "sermao-montanha",
    title: "O Sermão da Montanha e as Bem-Aventuranças",
    keywords: ["sermao da montanha", "bem-aventurados", "bem aventurancas", "bem aventurados os mansos", "sal da terra e luz do mundo", "mateus 5"],
    book: "Mateus",
    chapter: 5,
    startVerse: 3,
    endVerse: 12,
    reflection:
      "Jesus inverte a lógica do mundo: no Reino de Deus, os humildes, os pacificadores, os que choram e os que têm fome de justiça são declarados felizes e herdeiros de Deus. O Teu valor não depende dos aplausos humanos, mas do olhar do Pai.",
    historicalContext:
      "Nas colinas da Galileia com vista para o lago, Jesus reuniu Seus discípulos e as multidões para proclamar a constituição moral e espiritual do Reino dos Céus.",
    guidedPrayer:
      "Mestre Jesus, transforma o meu coração para viver conforme os valores do Teu Reino. Que eu seja manso de coração, pacificador e luz por onde passar. Amém.",
    practicalStep:
      "Pratique a pacificação hoje em uma conversa onde você poderia facilmente responder com irritação.",
  },
  {
    id: "pai-nosso",
    title: "A Oração do Pai Nosso",
    keywords: ["pai nosso", "oracao do pai nosso", "venha o teu reino", "o pao nosso de cada dia", "mateus 6"],
    book: "Mateus",
    chapter: 6,
    startVerse: 9,
    endVerse: 13,
    reflection:
      "Jesus nos ensina a nos achegar a Deus não como escravos diante de um juiz severo, mas como filhos diante de um Pai amoroso que cuida do nosso pão de cada dia, perdoa nossas faltas e nos livra do mal.",
    historicalContext:
      "No Sermão da Montanha, Jesus advertiu contra a hipocrisia e as repetições vazias das orações pagãs, ensinando a oração como comunhão filial e reverente.",
    guidedPrayer:
      "Pai nosso que estás nos céus, santificado seja o Teu nome. Venha a nós o Teu reino e seja feita a Tua vontade. O pão nosso de cada dia nos dá hoje e livra-nos do mal. Amém.",
    practicalStep:
      "Ore o Pai Nosso pausadamente agora, meditando com calma em cada uma das suas frases.",
  },
  {
    id: "jesus-acalma-tempestade",
    title: "Jesus Acalma a Tempestade no Mar",
    keywords: ["jesus acalma a tempestade", "tempestade no mar", "vento e o mar lhe obedecem", "homens de pequena fe", "marcos 4"],
    book: "Marcos",
    chapter: 4,
    startVerse: 37,
    endVerse: 41,
    reflection:
      "A tempestade podia ser violenta, mas Jesus estava no mesmo barco que os discípulos. Quando Ele se levanta, ventos e mares se aquietam. Não tema as ondas que se levantam contra a sua vida: quem governa o universo está no controle do seu barco.",
    historicalContext:
      "O Mar da Galileia é conhecido por tempestades repentinas e violentas provocadas por ventos frios que descem do Monte Hermom para o vale aquecido.",
    guidedPrayer:
      "Senhor Jesus, quando o vento da adversidade sopra e as ondas ameaçam me afundar, eu confio que estás no meu barco. Dá ordem de paz às minhas tempestades e acalma o meu coração. Amém.",
    practicalStep:
      "Ao sentir o coração acelerado de preocupação, respire e declare: 'Jesus está no meu barco, eu não vou afundar'.",
  },
  {
    id: "multiplicacao-paes",
    title: "A Multiplicação dos Pães e Peixes",
    keywords: ["multiplicacao dos paes", "cinco paes e dois peixes", "alimentacao dos 5 mil", "paes e peixes", "joao 6"],
    book: "João",
    chapter: 6,
    startVerse: 8,
    endVerse: 13,
    reflection:
      "Um menino entregou apenas cinco pães e dois peixinhos — o que parecia insignificante diante de uma multidão faminta. Mas nas mãos de Jesus, o pouco se torna mais que suficiente e ainda sobra em abundância. Nunca subestime o que Deus pode fazer com o que você coloca nas mãos dEle.",
    historicalContext:
      "Perto da Páscoa judaica, numa colina da Galileia, Jesus foi seguido por milhares sedentos por Sua palavra e curas, manifestando o milagre da provisão messiânica.",
    guidedPrayer:
      "Senhor, entrego nas Tuas mãos o pouco que tenho: minhas forças, meus dons e meus recursos. Multiplica a Tua bênção e sacia as necessidades da minha casa. Amém.",
    practicalStep:
      "Compartilhe algo hoje — uma ajuda financeira, um alimento ou o seu tempo — confiando na multiplicação de Deus.",
  },
  {
    id: "jesus-anda-aguas",
    title: "Jesus Anda sobre as Águas",
    keywords: ["jesus anda sobre as aguas", "pedro anda sobre as aguas", "coragem sou eu", "barco", "mateus 14"],
    book: "Mateus",
    chapter: 14,
    startVerse: 25,
    endVerse: 31,
    reflection:
      "Pedro conseguiu andar sobre as águas enquanto manteve os olhos fixos em Jesus; foi quando olhou para a força dos ventos que começou a afundar. Mesmo assim, ao clamar 'Senhor, salva-me!', a mão de Jesus se estendeu imediatamente para segurá-lo.",
    historicalContext:
      "Após a multiplicação dos pães, Jesus subiu ao monte para orar sozinho e foi ao encontro dos discípulos na quarta vigília da noite (entre 3h e 6h da manhã).",
    guidedPrayer:
      "Senhor Jesus, ensina-me a não olhar para as ondas e tempestades da vida, mas a fixar meus olhos apenas em Ti. Quando as minhas forças vacilarem, estende a Tua mão santa e sustenta-me. Amém.",
    practicalStep:
      "Desvie hoje a sua atenção de notícias ou conversas alarmistas e concentre-se nas promessas da Bíblia.",
  },
  {
    id: "bom-samaritano",
    title: "A Parábola do Bom Samaritano",
    keywords: ["bom samaritano", "parabola do bom samaritano", "quem e o meu proximo", "samaritano", "lucas 10"],
    book: "Lucas",
    chapter: 10,
    startVerse: 30,
    endVerse: 37,
    reflection:
      "O amor ao próximo não se resume a discursos ou religiosidade externa, mas a descer do cavalo, aproximar-se da dor alheia, curar feridas e agir com compaixão prática. Jesus nos chama a ser o próximo de quem precisa.",
    historicalContext:
      "A estrada de Jerusalém a Jericó era perigosa e cheia de salteadores. Samaritanos e judeus nutriam séculos de animosidade, o que tornou o samaritano compassivo uma lição revolucionária.",
    guidedPrayer:
      "Pai de amor, livra-me da indiferença. Coloca em mim o Teu olhar compassivo para enxergar e socorrer os que sofrem ao meu redor com amor prático e generoso. Amém.",
    practicalStep:
      "Faça um gesto concreto de bondade hoje por alguém que não pode te retribuir.",
  },
  {
    id: "filho-prodigo",
    title: "A Parábola do Filho Pródigo",
    keywords: ["filho prodigo", "parabola do filho prodigo", "filho perdido", "pai misericordioso", "regresso do filho", "lucas 15"],
    book: "Lucas",
    chapter: 15,
    startVerse: 18,
    endVerse: 24,
    reflection:
      "Não importa quão longe você tenha andado, quão fundo tenha caído ou quanto tenha desperdiçado: o Pai continua na porteira olhando para a estrada, pronto para correr ao seu encontro, abraçá-lo e restituir o seu lugar como filho amado.",
    historicalContext:
      "Diante da murmuração dos fariseus porque Jesus acolhia pecadores, Ele contou três parábolas de restauração: a ovelha, a moeda e os dois filhos.",
    guidedPrayer:
      "Pai celestial, se em algum momento me afastei de Ti, volto hoje aos Teus braços. Reconheço a minha fraqueza e agradeço porque o Teu amor me acolhe, me perdoa e me restaura. Amém.",
    practicalStep:
      "Receba o abraço do Pai hoje: livre-se de sentimentos de culpa e celebre a comunhão restaurada com Deus.",
  },
  {
    id: "mulher-fluxo-sangue",
    title: "A Cura da Mulher do Fluxo de Sangue",
    keywords: ["mulher do fluxo de sangue", "orla da veste", "tocar no manto", "tua fe te salvou", "marcos 5"],
    book: "Marcos",
    chapter: 5,
    startVerse: 25,
    endVerse: 34,
    reflection:
      "Doze anos de sofrimento, rejeição social e recursos esgotados não foram capazes de apagar a fé daquela mulher. Ela pensou: 'Se tão somente tocar no Seu manto, serei curada'. Jesus não apenas a curou fisicamente, mas a chamou de 'filha' e lhe deu paz.",
    historicalContext:
      "Pela lei cerimonial de Levítico, um fluxo contínuo de sangue tornava a mulher cerimonialmente impura e excluída da convivência pública, tornando seu ato de fé um exemplo supremo de coragem.",
    guidedPrayer:
      "Jesus bendito, pela fé eu me aproximo de Ti e toco nas orlas da Tua presença santa. Sara as minhas enfermidades físicas, emocionais e espirituais, e diz à minha alma: 'Vai em paz'. Amém.",
    practicalStep:
      "Apresente a Deus aquela dor que você carrega há anos e declare com fé que Ele tem poder para restaurar você.",
  },
  {
    id: "ressurreicao-lazaro",
    title: "A Ressurreição de Lázaro",
    keywords: ["ressurreicao de lazaro", "lazaro vem para fora", "eu sou a ressurreicao e a vida", "jesus chorou", "joao 11"],
    book: "João",
    chapter: 11,
    startVerse: 38,
    endVerse: 44,
    reflection:
      "Mesmo após quatro dias de sepultamento, quando para todos já cheirava mal e a esperança parecia morta, a voz de Jesus chamou a vida de volta. O que para os homens é um ponto final, para Deus é apenas o cenário do Seu maior milagre.",
    historicalContext:
      "Em Betânia, vila próxima a Jerusalém, as irmãs Marta e Maria choravam a morte do irmão Lázaro. Foi onde Jesus declarou: 'Eu sou a ressurreição e a vida'.",
    guidedPrayer:
      "Senhor Jesus, Autor da vida, clamo a Ti sobre os sonhos, projetos e esperanças que pareciam mortos. Tira a pedra da incredulidade e sopra a Tua vida abundante sobre a minha história. Amém.",
    practicalStep:
      "Não desista de orar por uma situação que parece perdida; para Deus não existe causa encerrada.",
  },
  {
    id: "hino-ao-amor",
    title: "O Hino ao Amor de 1 Coríntios 13",
    keywords: ["1 corintios 13", "amor e paciente", "o amor nao arde em ciumes", "ainda que eu falasse a lingua dos anjos", "o maior deles e o amor", "corintios 13"],
    book: "1 Coríntios",
    chapter: 13,
    startVerse: 4,
    endVerse: 8,
    reflection:
      "Dons, riquezas, inteligência e feitos extraordinários de nada valem sem o amor genuíno de Cristo. O amor é paciente, é benigno, não inveja, tudo sofre, tudo crê, tudo espera e tudo suporta. Esse é o reflexo do próprio caráter de Deus em nós.",
    historicalContext:
      "Paulo escreveu à igreja de Corinto, que disputava sobre dons espirituais com vaidade, ensinando que o amor ágape é o caminho sobremodo excelente.",
    guidedPrayer:
      "Pai celestial, derrama o Teu amor santo no meu coração pelo Espírito Santo. Ensina-me a ser paciente, generoso e a amar as pessoas com o mesmo amor incondicional com que Cristo me amou. Amém.",
    practicalStep:
      "Escolha ter paciência com alguém difícil hoje, lembrando de como Deus tem sido paciente com você.",
  },
  {
    id: "armadura-de-deus",
    title: "A Armadura de Deus para a Batalha Espiritual",
    keywords: ["armadura de deus", "capacete da salvacao", "escudo da fe", "espada do espirito", "couraça da justica", "efesios 6"],
    book: "Efésios",
    chapter: 6,
    startVerse: 10,
    endVerse: 18,
    reflection:
      "A nossa luta diária não é contra carne e sangue, mas contra forças espirituais do mal. Por isso, Deus nos veste com a Sua armadura: a verdade como cinto, a justiça como couraça, o evangelho da paz, a fé como escudo e a Palavra de Deus como espada.",
    historicalContext:
      "Preso em Roma e acorrentado a soldados pretorianos, o apóstolo Paulo usou as peças da armadura militar romana como metáfora para o equipamento espiritual do crente.",
    guidedPrayer:
      "Senhor Deus Todo-Poderoso, revisto-me hoje de toda a Tua armadura celestial. Protege a minha mente com o capacete da salvação, guarda o meu coração com a justiça de Cristo e empunho o escudo da fé contra todas as setas malignas. Amém.",
    practicalStep:
      "Comece o seu dia declarando a proteção da Palavra de Deus sobre a sua mente, suas decisões e sua família.",
  },
  {
    id: "fruto-do-espirito",
    title: "O Fruto do Espírito Santo",
    keywords: ["fruto do espirito", "amor alegria paz", "paciencia amabilidade bondade", "fidelidade mansidao dominio proprio", "galatas 5"],
    book: "Gálatas",
    chapter: 5,
    startVerse: 22,
    endVerse: 23,
    reflection:
      "O fruto do Espírito não é resultado de esforço próprio, mas do ramo que permanece conectado à Videira Verdadeira, que é Jesus. Quando permitimos que o Espírito governe nossa vida, amor, alegria e paz florescem naturalmente.",
    historicalContext:
      "Em Gálatas, Paulo contrasta as obras estéreis da carne com o fruto vivo gerado pela liberdade e graça do Espírito Santo na vida da comunidade cristã.",
    guidedPrayer:
      "Espírito Santo consolador, opera no meu íntimo. Produz em mim paciência, mansidão, fidelidade e domínio próprio. Que os que convivem comigo sintam o perfume de Cristo em minhas atitudes. Amém.",
    practicalStep:
      "Foque em exercitar o domínio próprio e a amabilidade na primeira situação estressante que surgir hoje.",
  },
  {
    id: "nova-jerusalem",
    title: "A Nova Jerusalém: Sem Morte, Choro ou Dor",
    keywords: ["nova jerusalem", "novos ceus e nova terra", "limpara dos olhos toda lagrima", "nao havera mais morte", "apocalipse 21"],
    book: "Apocalipse",
    chapter: 21,
    startVerse: 1,
    endVerse: 5,
    reflection:
      "As dores, as perdas e as lágrimas deste mundo presente não terão a última palavra. Deus tem preparado para os Seus filhos um novo céu e uma nova terra onde a morte não mais existirá, e o próprio Deus enxugará dos nossos olhos toda lágrima.",
    historicalContext:
      "Exilado na Ilha de Patmos por causa do evangelho, o apóstolo João teve as visões proféticas do triunfo final do Cordeiro e da eterna comunhão com Deus.",
    guidedPrayer:
      "Deus eterno, obrigado pela esperança viva que guarda o meu futuro. Quando o cansaço deste mundo pesar, lembra-me de que o Senhor faz novas todas as coisas. Amém.",
    practicalStep:
      "Descanse o seu coração sabendo que o seu futuro eterno está seguro nas mãos daquele que venceu a morte.",
  }
];

// -------------------------------------------------------------
// PARSER DE REFERÊNCIA DIRETA (Ex: "João 3:16", "Salmos 23:1-3", "1 Co 13:4")
// -------------------------------------------------------------
export function parsePassageReference(
  rawInput: string,
  version: "nvi" | "aa" = "nvi"
): PassageResult | null {
  if (!rawInput) return null;
  const clean = rawInput.trim();

  // Regex para capturar referências bíblicas em português
  const refPattern = /^((?:[1-3]\s+)?[a-zA-Z\u00C0-\u00FF]+(?:\s+[a-zA-Z\u00C0-\u00FF]+)?)\s+(\d+)(?:[:\s](\d+)(?:-(\d+))?)?$/;
  const match = clean.match(refPattern);
  if (!match) return null;

  const rawBook = match[1];
  const chapter = parseInt(match[2], 10);
  const startVerse = match[3] ? parseInt(match[3], 10) : 1;
  const endVerse = match[4] ? parseInt(match[4], 10) : (match[3] ? startVerse : undefined);

  if (isNaN(chapter) || isNaN(startVerse)) return null;

  return getPassage(rawBook, chapter, startVerse, endVerse, version);
}

// -------------------------------------------------------------
// BUSCADOR DE HISTÓRIAS BÍBLICAS CURADAS
// -------------------------------------------------------------
export function matchBiblicalStory(input: string): BiblicalStoryItem | null {
  if (!input || input.trim().length < 2) return null;
  const cleanInput = stripAccents(input);
  const inputWords = new Set(cleanInput.split(/\s+/));

  let bestStory: BiblicalStoryItem | null = null;
  let bestScore = 0;

  for (const story of BIBLICAL_STORIES) {
    let score = 0;
    for (const kw of story.keywords) {
      const cleanKw = stripAccents(kw);
      if (cleanInput.includes(cleanKw)) {
        score += 8;
      } else {
        const kwWords = cleanKw.split(/\s+/);
        let matched = 0;
        for (const w of kwWords) {
          if (inputWords.has(w) || (w.length >= 4 && cleanInput.includes(w))) {
            matched++;
          }
        }
        if (matched === kwWords.length && kwWords.length > 0) {
          score += 5;
        } else if (matched > 0) {
          score += matched * 2;
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestStory = story;
    }
  }

  return bestScore >= 4 ? bestStory : null;
}

// -------------------------------------------------------------
// BUSCADOR TEXTUAL DE VERSÍCULOS NA BÍBLIA COMPLETA (~31.000 versículos)
// -------------------------------------------------------------
export interface TextSearchResult {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
}

export function searchBibleText(
  query: string,
  version: "nvi" | "aa" = "nvi",
  maxResults = 3
): TextSearchResult[] {
  if (!query || query.trim().length < 3) return [];

  const cleanQuery = stripAccents(query);
  const queryTerms = cleanQuery.split(/\s+/).filter((t) => t.length > 2);
  if (queryTerms.length === 0) return [];

  const books = loadBibleData(version);
  const results: { item: TextSearchResult; score: number }[] = [];

  for (const b of books) {
    for (let cIdx = 0; cIdx < b.chapters.length; cIdx++) {
      const ch = b.chapters[cIdx];
      for (let vIdx = 0; vIdx < ch.length; vIdx++) {
        const vText = ch[vIdx];
        const cleanVText = stripAccents(vText);

        // Pontuação de correspondência
        let score = 0;
        if (cleanVText.includes(cleanQuery)) {
          score += 15;
        } else {
          let termMatches = 0;
          for (const term of queryTerms) {
            if (cleanVText.includes(term)) {
              termMatches++;
            }
          }
          if (termMatches === queryTerms.length) {
            score += 10;
          } else if (termMatches >= 2) {
            score += termMatches * 3;
          }
        }

        if (score >= 6) {
          results.push({
            score,
            item: {
              book: b.name,
              chapter: cIdx + 1,
              verse: vIdx + 1,
              text: vText.trim(),
              reference: `${b.name} ${cIdx + 1}:${vIdx + 1}`,
            },
          });
        }
      }
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, maxResults).map((r) => r.item);
}

// -------------------------------------------------------------
// CONSTRUTOR DE RESPOSTA PARA HISTÓRIAS BÍBLICAS
// -------------------------------------------------------------
export function buildStoryResponse(story: BiblicalStoryItem, version: "nvi" | "aa" = "nvi") {
  const passage =
    getPassage(story.book, story.chapter, story.startVerse, story.endVerse, version) ||
    getPassage("Salmos", 23, 1, 3, version)!;

  return {
    success: true,
    isAiGenerated: false,
    themeTitle: story.title,
    passage,
    pastoralReflection: story.reflection,
    historicalContext: story.historicalContext,
    guidedPrayer: story.guidedPrayer,
    practicalStep: story.practicalStep,
    alternativePassages: [],
  };
}
