import os
import json
import re
from typing import Optional, Dict, Any
import google.generativeai as genai
from services.bible_db import get_passage, normalize_book_name, search_verses_fts
from services.thematic_engine import match_theme_by_text, build_thematic_response

def get_gemini_api_key(explicit_key: Optional[str] = None) -> Optional[str]:
    """Retrieve Gemini API key from explicit param, env var, or secrets."""
    if explicit_key and explicit_key.strip():
        return explicit_key.strip()
    return os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")

def clean_json_response(raw_text: str) -> str:
    """Extract JSON string from markdown code fences or raw text."""
    if not raw_text:
        return ""
    # Remove markdown code fences
    cleaned = re.sub(r"^```(?:json)?\s*", "", raw_text.strip(), flags=re.MULTILINE)
    cleaned = re.sub(r"\s*```$", "", cleaned, flags=re.MULTILINE)
    return cleaned.strip()

def consult_bible_with_llm(
    user_input: str,
    api_key: Optional[str] = None,
    version: str = "nvi",
    model_name: str = "gemini-1.5-flash"
) -> Dict[str, Any]:
    """
    Two-stage Zero-Hallucination Pipeline:
    1. LLM identifies the theological/emotional core and proposes a canonical reference.
    2. Backend strictly retrieves the verbatim text from local SQLite database (zero hallucination).
    3. LLM crafts empathetic pastoral reflection, historical context, prayer, and action step.
    Fallback: Curated thematic engine if API key is absent or fails.
    """
    key = get_gemini_api_key(api_key)

    # If no API key is provided, use the local curated thematic engine
    if not key:
        theme = match_theme_by_text(user_input)
        if theme:
            resp = build_thematic_response(theme, version=version)
            resp["notice"] = "Modo Conexão Bíblica Local (Adicione sua chave Gemini gratuita para respostas pastorais personalizadas por IA)."
            return resp
        # If no theme matched, pick closest FTS or comforting default
        fts_res = search_verses_fts(user_input, version=version, limit=1)
        if fts_res:
            top = fts_res[0]
            passage = get_passage(top["book"], top["chapter"], top["verse"], top["verse"], version=version)
            return {
                "success": True,
                "is_ai_generated": False,
                "theme_title": f"Palavra de Deus para o seu Coração: {passage['reference']}",
                "passage": passage,
                "pastoral_reflection": "Deus conhece o que vai no íntimo do seu ser. Cada palavra das Escrituras é um farol para nos guiar em meio às incertezas da vida.",
                "historical_context": "Este versículo faz parte do conselho inspirado de Deus para edificar, consolar e encorajar o Seu povo.",
                "guided_prayer": "Senhor meu Deus, obrigado por Tua Palavra que é viva e eficaz. Que este versículo traga luz aos meus pensamentos e paz à minha alma neste dia. Amém.",
                "practical_step": "Guarde este versículo no coração e repita-o ao longo do dia sempre que precisar de força.",
                "alternative_passages": []
            }
        # General comfort default
        theme_default = match_theme_by_text("ansiedade paz esperanca")
        resp = build_thematic_response(theme_default, version=version)
        resp["notice"] = "Nenhuma chave de IA detectada. Apresentando mensagem de conforto baseada no acervo bíblico."
        return resp

    # Stage 1: Identify Scripture Reference with LLM
    try:
        genai.configure(api_key=key)
        model = genai.GenerativeModel(model_name)

        stage1_prompt = f"""
Você é um teólogo bíblico e conselheiro pastoral cristão compassivo.
O usuário compartilhou o seguinte sentimento ou situação de vida:
"{user_input}"

Sua tarefa é identificar a passagem da Bíblia Sagrada (dos 66 livros canônicos protestantes) que mais genuinamente traz resposta, consolo, alento, exortação amorosa ou direção para o que ele está vivendo.

REGRAS OBRIGATÓRIAS:
1. Indique UMA passagem bíblica real e canônica existente. NÃO invente versículos ou referências.
2. Limite a passagem a no máximo 1 a 4 versículos contíguos (ex: Filipenses 4:6-7, Mateus 11:28-30, Salmos 23:1-4).
3. Responda ESTRITAMENTE em formato JSON puro, sem introduções ou explicações fora do JSON.

Formato esperado:
{{
  "book": "Nome do Livro em Português",
  "chapter": 1,
  "start_verse": 1,
  "end_verse": 2,
  "theme_title": "Título acolhedor do tema",
  "pastoral_intent": "Por que esta passagem se conecta diretamente com a dor/sentimento da pessoa"
}}
"""
        s1_resp = model.generate_content(stage1_prompt)
        s1_data = json.loads(clean_json_response(s1_resp.text))

        candidate_book = s1_data.get("book", "")
        candidate_chapter = int(s1_data.get("chapter", 1))
        candidate_start = int(s1_data.get("start_verse", 1))
        candidate_end = int(s1_data.get("end_verse", candidate_start))
        theme_title = s1_data.get("theme_title", "Uma Palavra para o Seu Coração")

        # Grounding & Verification Check against real SQLite Bible
        verified_passage = get_passage(
            book_name=candidate_book,
            chapter=candidate_chapter,
            start_verse=candidate_start,
            end_verse=candidate_end,
            version=version
        )

        # If LLM reference was not found (hallucination defense), fallback to thematic engine or FTS
        if not verified_passage:
            fallback_theme = match_theme_by_text(user_input)
            if fallback_theme:
                verified_passage = get_passage(
                    fallback_theme["primary_passage"]["book"],
                    fallback_theme["primary_passage"]["chapter"],
                    fallback_theme["primary_passage"]["start_verse"],
                    fallback_theme["primary_passage"]["end_verse"],
                    version=version
                )
                theme_title = fallback_theme["primary_passage"]["theme_title"]
            else:
                verified_passage = get_passage("Salmos", 23, 1, 3, version=version)
                theme_title = "O Senhor é o Meu Pastor"

        # Stage 2: Pastoral Reflection with VERIFIED scripture text
        stage2_prompt = f"""
Você é um pastor e conselheiro espiritual acolhedor, sábio e terno.
O usuário compartilhou como se sente:
"{user_input}"

A passagem bíblica REAL e VERIFICADA selecionada para ele é:
Referência: {verified_passage['reference']} ({verified_passage['version']})
Texto Sagrado Verificado: "{verified_passage['full_text']}"

Escreva uma mensagem pastoral profunda que ressoe com o coração da pessoa.
Responda ESTRITAMENTE em formato JSON com os seguintes campos:
{{
  "pastoral_reflection": "Texto de 2 a 3 parágrafos calorosos, empáticos e encorajadores, explicando como a verdade deste versículo fala diretamente à situação que a pessoa compartilhou, sem julgamentos e com muito amor cristão.",
  "historical_context": "1 ou 2 frases resumindo quem escreveu e o contexto bíblico original para enriquecer o entendimento da pessoa.",
  "guided_prayer": "Uma oração íntima, pessoal e tocante em primeira pessoa ('Senhor Deus, ...') que a pessoa possa fazer a Deus agora mesmo com base neste versículo.",
  "practical_step": "Uma ação prática, simples e consoladora para ela aplicar no seu dia de hoje."
}}
"""
        s2_resp = model.generate_content(stage2_prompt)
        s2_data = json.loads(clean_json_response(s2_resp.text))

        return {
            "success": True,
            "is_ai_generated": True,
            "theme_title": theme_title,
            "passage": verified_passage,
            "pastoral_reflection": s2_data.get("pastoral_reflection", ""),
            "historical_context": s2_data.get("historical_context", ""),
            "guided_prayer": s2_data.get("guided_prayer", ""),
            "practical_step": s2_data.get("practical_step", ""),
            "alternative_passages": []
        }

    except Exception as ex:
        # Fallback to local curated thematic engine if LLM API encounters an error
        fallback_theme = match_theme_by_text(user_input)
        if fallback_theme:
            resp = build_thematic_response(fallback_theme, version=version)
            resp["notice"] = f"Aviso de IA ({ex}). Resposta servida com segurança pelo acervo bíblico verificado."
            return resp
        
        default_passage = get_passage("Salmos", 23, 1, 4, version=version)
        return {
            "success": True,
            "is_ai_generated": False,
            "theme_title": "O Senhor é o Nosso Refúgio",
            "passage": default_passage,
            "pastoral_reflection": "Mesmo quando a tecnologia falha ou o mundo ao redor parece confuso, a Palavra de Deus permanece inabalável. O Senhor conhece cada suspiro do seu coração.",
            "historical_context": "Os Salmos de Davi expressam a mais genuína fé em tempos de incerteza e fragilidade humana.",
            "guided_prayer": "Senhor, coloco em Tuas mãos tudo o que sinto hoje. Que a Tua paz inunde a minha alma e me guie em segurança. Amém.",
            "practical_step": "Respire fundo e descanse na certeza de que Deus cuida de você.",
            "alternative_passages": []
        }
