import os
import json
import unicodedata
from typing import Optional, Dict, Any, List
from services.bible_db import get_passage, strip_accents

THEMATIC_CATALOG_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "data",
    "thematic_catalog.json"
)

_THEMES_CACHE: List[Dict[str, Any]] = []

def load_thematic_catalog() -> List[Dict[str, Any]]:
    """Load curated themes from JSON."""
    global _THEMES_CACHE
    if _THEMES_CACHE:
        return _THEMES_CACHE

    if os.path.exists(THEMATIC_CATALOG_PATH):
        try:
            with open(THEMATIC_CATALOG_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                _THEMES_CACHE = data.get("themes", [])
        except Exception:
            _THEMES_CACHE = []
    return _THEMES_CACHE

def list_all_themes() -> List[Dict[str, Any]]:
    """Return all curated themes for mood pills and categories."""
    return load_thematic_catalog()

def get_theme_by_id(theme_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve theme by its slug id."""
    themes = load_thematic_catalog()
    for t in themes:
        if t.get("id") == theme_id:
            return t
    return None

def match_theme_by_text(user_input: str) -> Optional[Dict[str, Any]]:
    """
    Scoring algorithm to find the most fitting biblical theme based on user's words.
    Considers word boundaries, stems, and multi-word phrases.
    """
    if not user_input or len(user_input.strip()) < 2:
        return None

    clean_text = strip_accents(user_input)
    words = set(clean_text.split())
    themes = load_thematic_catalog()

    best_score = 0
    best_theme = None

    for t in themes:
        score = 0
        keywords = t.get("keywords", [])
        for kw in keywords:
            clean_kw = strip_accents(kw)
            # Exact phrase match in sentence
            if " " in clean_kw and clean_kw in clean_text:
                score += 5
            # Word match
            elif clean_kw in words:
                score += 3
            # Substring match (for Portuguese stems)
            elif any(clean_kw in w or (len(w) >= 5 and w in clean_kw) for w in words):
                score += 1

        if score > best_score:
            best_score = score
            best_theme = t

    # Require minimum score to prevent random misfires
    if best_score >= 2:
        return best_theme
    return None

def build_thematic_response(theme: Dict[str, Any], version: str = "nvi") -> Dict[str, Any]:
    """
    Build a complete response object using verified scripture from bible.db
    and curated reflection.
    """
    prim = theme.get("primary_passage", {})
    book = prim.get("book", "Salmos")
    chapter = prim.get("chapter", 23)
    start_v = prim.get("start_verse", 1)
    end_v = prim.get("end_verse", 1)

    # Fetch 100% verified authentic scripture from SQLite database
    passage_data = get_passage(book, chapter, start_v, end_v, version=version)
    if not passage_data:
        # Fallback to Salmos 23
        passage_data = get_passage("Salmos", 23, 1, 3, version=version)

    # Fetch alternative passages verified
    alt_list = []
    for alt in theme.get("alternative_passages", []):
        alt_res = get_passage(
            alt.get("book", "Salmos"),
            alt.get("chapter", 23),
            alt.get("start_verse", 1),
            alt.get("end_verse", 1),
            version=version
        )
        if alt_res:
            alt_list.append({
                "reference": alt_res["reference"],
                "note": alt.get("note", ""),
                "full_text": alt_res["full_text"],
                "book": alt_res["book"],
                "chapter": alt_res["chapter"]
            })

    return {
        "success": True,
        "is_ai_generated": False,
        "theme_id": theme.get("id"),
        "theme_title": prim.get("theme_title", theme.get("title")),
        "passage": passage_data,
        "pastoral_reflection": prim.get("reflection", ""),
        "historical_context": prim.get("context_summary", ""),
        "guided_prayer": prim.get("guided_prayer", ""),
        "practical_step": prim.get("practical_step", ""),
        "alternative_passages": alt_list
    }
