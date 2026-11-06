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

export interface BibleBook {
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
  const noSpaces = clean.replace(/\s+/g, "");
  if (BOOK_ALIAS_MAP[noSpaces]) {
    return BOOK_ALIAS_MAP[noSpaces];
  }
  for (const [key, val] of Object.entries(BOOK_ALIAS_MAP)) {
    const keyClean = stripAccents(key);
    if (clean === keyClean || noSpaces === keyClean.replace(/\s+/g, "") || (clean.length >= 3 && clean.startsWith(keyClean))) {
      return val;
    }
  }
  return raw.trim();
}

export function loadBibleData(version: "nvi" | "aa"): BibleBook[] {
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
// RE-EXPORTS DE HISTÓRIAS E BUSCADOR TEXTUAL (bibleSearchEngine)
// -------------------------------------------------------------
export {
  BIBLICAL_STORIES,
  matchBiblicalStory,
  searchBibleFullText,
  buildStoryResponse,
  buildFullTextSearchResponse,
  getDiverseComfortFallback,
} from "./bibleSearchEngine";
export type { BiblicalStoryItem, ScoredVerseMatch } from "./bibleSearchEngine";

// Wrapper compatível
export function searchBibleText(query: string, version: "nvi" | "aa" = "nvi", maxResults = 3) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { searchBibleFullText } = require("./bibleSearchEngine");
  return searchBibleFullText(query, version, maxResults);
}
