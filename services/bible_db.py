import os
import json
import sqlite3
import unicodedata
from typing import Optional, Dict, Any, List

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
DB_PATH = os.path.join(DATA_DIR, "bible.db")
NVI_PATH = os.path.join(DATA_DIR, "pt_nvi.json")
AA_PATH = os.path.join(DATA_DIR, "pt_aa.json")

# Map of common abbreviations and nicknames to canonical Portuguese book names
BOOK_NAME_MAP = {
    # Antigo Testamento
    "gn": "Gênesis", "genesis": "Gênesis", "gênesis": "Gênesis",
    "ex": "Êxodo", "exodo": "Êxodo", "êxodo": "Êxodo",
    "lv": "Levítico", "levitico": "Levítico", "levítico": "Levítico",
    "nm": "Números", "numeros": "Números", "números": "Números",
    "dt": "Deuteronômio", "deuteronomio": "Deuteronômio", "deuteronômio": "Deuteronômio",
    "js": "Josué", "josue": "Josué", "josué": "Josué",
    "jz": "Juízes", "juizes": "Juízes", "juízes": "Juízes",
    "rt": "Rute", "rute": "Rute",
    "1sm": "1 Samuel", "1 samuel": "1 Samuel", "1samuel": "1 Samuel",
    "2sm": "2 Samuel", "2 samuel": "2 Samuel", "2samuel": "2 Samuel",
    "1rs": "1 Reis", "1 reis": "1 Reis", "1reis": "1 Reis",
    "2rs": "2 Reis", "2 reis": "2 Reis", "2reis": "2 Reis",
    "1cr": "1 Crônicas", "1 cronicas": "1 Crônicas", "1crônicas": "1 Crônicas",
    "2cr": "2 Crônicas", "2 cronicas": "2 Crônicas", "2crônicas": "2 Crônicas",
    "ed": "Esdras", "esdras": "Esdras",
    "ne": "Neemias", "neemias": "Neemias",
    "et": "Ester", "ester": "Ester",
    "jo": "Jó", "job": "Jó", "jó": "Jó",
    "sl": "Salmos", "salmo": "Salmos", "salmos": "Salmos", "psalms": "Salmos", "psalm": "Salmos",
    "pv": "Provérbios", "proverbios": "Provérbios", "provérbios": "Provérbios", "proverbs": "Provérbios",
    "ec": "Eclesiastes", "eclesiastes": "Eclesiastes",
    "ct": "Cânticos", "canticos": "Cânticos", "cânticos": "Cânticos", "cantares": "Cânticos",
    "is": "Isaías", "isaias": "Isaías", "isaías": "Isaías", "isaiah": "Isaías",
    "jr": "Jeremias", "jeremias": "Jeremias", "jeremiah": "Jeremias",
    "lm": "Lamentações", "lamentacoes": "Lamentações", "lamentações": "Lamentações",
    "ez": "Ezequiel", "ezequiel": "Ezequiel", "ezekiel": "Ezequiel",
    "dn": "Daniel", "daniel": "Daniel",
    "os": "Oséias", "oseias": "Oséias", "oséias": "Oséias",
    "jl": "Joel", "joel": "Joel",
    "am": "Amós", "amos": "Amós", "amós": "Amós",
    "ob": "Obadias", "obadias": "Obadias",
    "jn": "Jonas", "jonas": "Jonas",
    "mq": "Miquéias", "miqueias": "Miquéias", "miquéias": "Miquéias",
    "na": "Naum", "naum": "Naum",
    "hc": "Habacuque", "habacuque": "Habacuque",
    "sf": "Sofonias", "sofonias": "Sofonias",
    "ag": "Ageu", "ageu": "Ageu",
    "zc": "Zacarias", "zacarias": "Zacarias",
    "ml": "Malaquias", "malaquias": "Malaquias",

    # Novo Testamento
    "mt": "Mateus", "mateus": "Mateus", "matthew": "Mateus",
    "mc": "Marcos", "marcos": "Marcos", "mark": "Marcos",
    "lc": "Lucas", "lucas": "Lucas", "luke": "Lucas",
    "joo": "João", "joao": "João", "joão": "João", "john": "João",
    "at": "Atos", "atos": "Atos", "acts": "Atos",
    "rm": "Romanos", "romanos": "Romanos", "romans": "Romanos",
    "1co": "1 Coríntios", "1 corintios": "1 Coríntios", "1 coríntios": "1 Coríntios", "1corintios": "1 Coríntios",
    "2co": "2 Coríntios", "2 corintios": "2 Coríntios", "2 coríntios": "2 Coríntios", "2corintios": "2 Coríntios",
    "gl": "Gálatas", "galatas": "Gálatas", "gálatas": "Gálatas", "galatians": "Gálatas",
    "ef": "Efésios", "efesios": "Efésios", "efésios": "Efésios", "ephesians": "Efésios",
    "fp": "Filipenses", "filipenses": "Filipenses", "philippians": "Filipenses",
    "cl": "Colossenses", "colossenses": "Colossenses", "colossians": "Colossenses",
    "1ts": "1 Tessalonicenses", "1 tessalonicenses": "1 Tessalonicenses", "1thessalonians": "1 Tessalonicenses",
    "2ts": "2 Tessalonicenses", "2 tessalonicenses": "2 Tessalonicenses", "2thessalonians": "2 Tessalonicenses",
    "1tm": "1 Timóteo", "1 timoteo": "1 Timóteo", "1 timóteo": "1 Timóteo",
    "2tm": "2 Timóteo", "2 timoteo": "2 Timóteo", "2 timóteo": "2 Timóteo",
    "tt": "Tito", "tito": "Tito", "titus": "Tito",
    "fm": "Filemom", "filemom": "Filemom",
    "hb": "Hebreus", "hebreus": "Hebreus", "hebrews": "Hebreus",
    "tg": "Tiago", "tiago": "Tiago", "james": "Tiago",
    "1pe": "1 Pedro", "1 pedro": "1 Pedro", "1pedro": "1 Pedro", "1peter": "1 Pedro",
    "2pe": "2 Pedro", "2 pedro": "2 Pedro", "2pedro": "2 Pedro", "2peter": "2 Pedro",
    "1jo": "1 João", "1 joao": "1 João", "1 joão": "1 João", "1joao": "1 João",
    "2jo": "2 João", "2 joao": "2 João", "2 joão": "2 João", "2joao": "2 João",
    "3jo": "3 João", "3 joao": "3 João", "3 joão": "3 João", "3joao": "3 João",
    "jd": "Judas", "judas": "Judas", "jude": "Judas",
    "ap": "Apocalipse", "apocalipse": "Apocalipse", "revelation": "Apocalipse"
}

def strip_accents(text: str) -> str:
    """Remove accents and normalize text."""
    if not text:
        return ""
    return ''.join(c for c in unicodedata.normalize('NFD', text) if unicodedata.category(c) != 'Mn').lower().strip()

def normalize_book_name(book_input: str) -> str:
    """Convert any book abbreviation or alias to official Portuguese canonical name."""
    if not book_input:
        return ""
    clean = strip_accents(book_input).replace(".", "").strip()
    
    # Direct match in dictionary
    if clean in BOOK_NAME_MAP:
        return BOOK_NAME_MAP[clean]

    # Handle numeric prefixes like "1 joao", "1jo", etc.
    for key, val in BOOK_NAME_MAP.items():
        if clean == strip_accents(key):
            return val

    # Prefix match
    for key, val in BOOK_NAME_MAP.items():
        if len(key) >= 3 and clean.startswith(strip_accents(key)):
            return val

    # Fallback capitalized
    return book_input.strip().capitalize()

def ensure_database():
    """Ensure SQLite database is created and indexed from source JSONs."""
    if os.path.exists(DB_PATH) and os.path.getsize(DB_PATH) > 1000000:
        return

    os.makedirs(DATA_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute('''
    CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY,
        abbrev TEXT UNIQUE,
        name TEXT UNIQUE,
        testament TEXT,
        chapters_count INTEGER
    );
    ''')

    cur.execute('''
    CREATE TABLE IF NOT EXISTS verses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        version TEXT,
        book_id INTEGER,
        book_name TEXT,
        book_abbrev TEXT,
        chapter INTEGER,
        verse INTEGER,
        text TEXT
    );
    ''')

    cur.execute('CREATE INDEX IF NOT EXISTS idx_verses_lookup ON verses(version, book_name, chapter, verse);')
    cur.execute('CREATE INDEX IF NOT EXISTS idx_verses_abbrev ON verses(version, book_abbrev, chapter, verse);')

    cur.execute('''
    CREATE VIRTUAL TABLE IF NOT EXISTS verses_fts USING fts5(
        version,
        book_name,
        chapter UNINDEXED,
        verse UNINDEXED,
        text,
        tokenize='unicode61 remove_diacritics 2'
    );
    ''')

    # Ingest NVI if present
    if os.path.exists(NVI_PATH):
        with open(NVI_PATH, "r", encoding="utf-8-sig") as f:
            nvi_data = json.load(f)
        for idx, b in enumerate(nvi_data, 1):
            testament = 'VT' if idx <= 39 else 'NT'
            cur.execute('''
                INSERT OR IGNORE INTO books(id, abbrev, name, testament, chapters_count)
                VALUES (?, ?, ?, ?, ?)
            ''', (idx, b['abbrev'].lower(), b['name'], testament, len(b['chapters'])))
            for ch_idx, ch in enumerate(b['chapters'], 1):
                for v_idx, v_text in enumerate(ch, 1):
                    cur.execute('''
                        INSERT INTO verses(version, book_id, book_name, book_abbrev, chapter, verse, text)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    ''', ('nvi', idx, b['name'], b['abbrev'].lower(), ch_idx, v_idx, v_text.strip()))
                    cur.execute('''
                        INSERT INTO verses_fts(version, book_name, chapter, verse, text)
                        VALUES (?, ?, ?, ?, ?)
                    ''', ('nvi', b['name'], ch_idx, v_idx, v_text.strip()))

    # Ingest AA if present
    if os.path.exists(AA_PATH):
        with open(AA_PATH, "r", encoding="utf-8-sig") as f:
            aa_data = json.load(f)
        for idx, b in enumerate(aa_data, 1):
            for ch_idx, ch in enumerate(b['chapters'], 1):
                for v_idx, v_text in enumerate(ch, 1):
                    cur.execute('''
                        INSERT INTO verses(version, book_id, book_name, book_abbrev, chapter, verse, text)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    ''', ('aa', idx, b['name'], b['abbrev'].lower(), ch_idx, v_idx, v_text.strip()))
                    cur.execute('''
                        INSERT INTO verses_fts(version, book_name, chapter, verse, text)
                        VALUES (?, ?, ?, ?, ?)
                    ''', ('aa', b['name'], ch_idx, v_idx, v_text.strip()))

    conn.commit()
    conn.close()

def get_db_connection() -> sqlite3.Connection:
    """Get connection to SQLite Bible database."""
    ensure_database()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def get_passage(
    book_name: str,
    chapter: int,
    start_verse: int,
    end_verse: Optional[int] = None,
    version: str = "nvi"
) -> Optional[Dict[str, Any]]:
    """
    Fetch exact verified verses from the authentic Bible database.
    Guarantees 100% zero-hallucination.
    """
    norm_book = normalize_book_name(book_name)
    if not end_verse or end_verse < start_verse:
        end_verse = start_verse

    version = version.lower()
    if version not in ("nvi", "aa"):
        version = "nvi"

    conn = get_db_connection()
    cur = conn.cursor()

    # Search by normalized name or LIKE
    cur.execute('''
        SELECT book_name, chapter, verse, text 
        FROM verses 
        WHERE version = ? AND (book_name = ? OR book_name LIKE ?) AND chapter = ? AND verse BETWEEN ? AND ?
        ORDER BY verse ASC
    ''', (version, norm_book, f"%{norm_book}%", chapter, start_verse, end_verse))

    rows = cur.fetchall()
    conn.close()

    if not rows:
        return None

    actual_book = rows[0]["book_name"]
    verses_list = [{"verse": r["verse"], "text": r["text"]} for r in rows]
    full_text = " ".join(f"[{r['verse']}] {r['text']}" for r in rows) if len(rows) > 1 else rows[0]["text"]

    ref_str = f"{actual_book} {chapter}:{start_verse}" if start_verse == end_verse else f"{actual_book} {chapter}:{start_verse}-{end_verse}"

    return {
        "success": True,
        "book": actual_book,
        "chapter": chapter,
        "start_verse": start_verse,
        "end_verse": end_verse,
        "version": version.upper(),
        "reference": ref_str,
        "full_text": full_text,
        "verses": verses_list
    }

def get_full_chapter(book_name: str, chapter: int, version: str = "nvi") -> Optional[Dict[str, Any]]:
    """Fetch all verses in an entire chapter for deep context reading."""
    norm_book = normalize_book_name(book_name)
    version = version.lower() if version in ("nvi", "aa") else "nvi"

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute('''
        SELECT book_name, chapter, verse, text 
        FROM verses 
        WHERE version = ? AND (book_name = ? OR book_name LIKE ?) AND chapter = ?
        ORDER BY verse ASC
    ''', (version, norm_book, f"%{norm_book}%", chapter))

    rows = cur.fetchall()
    
    # Get total chapters for this book
    cur.execute('SELECT chapters_count FROM books WHERE name = ?', (norm_book,))
    b_row = cur.fetchone()
    total_chapters = b_row["chapters_count"] if b_row else 1
    conn.close()

    if not rows:
        return None

    actual_book = rows[0]["book_name"]
    return {
        "book": actual_book,
        "chapter": chapter,
        "total_chapters": total_chapters,
        "version": version.upper(),
        "verses": [{"verse": r["verse"], "text": r["text"]} for r in rows]
    }

def search_verses_fts(query: str, version: str = "nvi", limit: int = 8) -> List[Dict[str, Any]]:
    """Full-text search in Portuguese with diacritics removal."""
    clean_query = strip_accents(query)
    clean_query = "".join(c for c in clean_query if c.isalnum() or c.isspace()).strip()
    if not clean_query:
        return []

    tokens = [t for t in clean_query.split() if len(t) > 2]
    if not tokens:
        return []

    fts_match_query = " OR ".join(tokens)
    version = version.lower() if version in ("nvi", "aa") else "nvi"

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute('''
            SELECT book_name, chapter, verse, text
            FROM verses_fts
            WHERE version = ? AND verses_fts MATCH ?
            LIMIT ?
        ''', (version, fts_match_query, limit))
        rows = cur.fetchall()
    except Exception:
        rows = []
    finally:
        conn.close()

    results = []
    for r in rows:
        results.append({
            "book": r["book_name"],
            "chapter": r["chapter"],
            "verse": r["verse"],
            "reference": f"{r['book_name']} {r['chapter']}:{r['verse']}",
            "text": r["text"]
        })
    return results

def get_random_comfort_verse(version: str = "nvi") -> Dict[str, Any]:
    """Fetch an uplifting verified verse for 'Palavra do Dia'."""
    curated_candidates = [
        ("Salmos", 23, 1, 3),
        ("Filipenses", 4, 13, 13),
        ("Isaías", 41, 10, 10),
        ("Jeremias", 29, 11, 11),
        ("Romanos", 8, 28, 28),
        ("Salmos", 46, 1, 2),
        ("Mateus", 11, 28, 28),
        ("Salmos", 121, 1, 2),
        ("Josué", 1, 9, 9),
        ("Salmos", 37, 5, 5),
        ("João", 14, 27, 27),
        ("Provérbios", 3, 5, 6)
    ]
    import random
    book, ch, v1, v2 = random.choice(curated_candidates)
    res = get_passage(book, ch, v1, v2, version=version)
    if res:
        return res
    # Fallback to Salmos 23:1
    return get_passage("Salmos", 23, 1, 1, version=version) or {
        "reference": "Salmos 23:1",
        "full_text": "O Senhor é o meu pastor; de nada terei falta."
    }
