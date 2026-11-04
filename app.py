import os
import urllib.parse
import streamlit as st
from services.bible_db import (
    ensure_database,
    get_passage,
    get_full_chapter,
    get_random_comfort_verse
)
from services.thematic_engine import list_all_themes, get_theme_by_id, build_thematic_response
from services.llm_service import consult_bible_with_llm, get_gemini_api_key
from services.audio_service import generate_verse_audio_bytes

# -------------------------------------------------------------
# CONFIGURAÇÃO GERAL DA PÁGINA
# -------------------------------------------------------------
st.set_page_config(
    page_title="Palavra Viva — Consolo & Direção na Bíblia Sagrada",
    page_icon="🕊️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Garante inicialização da base de dados local SQLite (62.000+ versículos NVI + AA)
ensure_database()

# -------------------------------------------------------------
# ESTILOS VISUAIS PERSONALIZADOS (TEMA SERENO & ESPIRITUAL)
# -------------------------------------------------------------
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    }

    /* Título com Serif Clássico Dourado */
    .title-banner {
        text-align: center;
        padding: 24px 16px 12px 16px;
        background: linear-gradient(180deg, rgba(212, 175, 55, 0.08) 0%, rgba(13, 17, 23, 0) 100%);
        border-radius: 16px;
        margin-bottom: 24px;
        border: 1px solid rgba(212, 175, 55, 0.2);
    }
    .title-banner h1 {
        font-family: 'Cinzel', serif;
        font-size: 2.3rem;
        color: #d4af37;
        margin-bottom: 8px;
        font-weight: 700;
        letter-spacing: 0.5px;
    }
    .title-banner p {
        font-size: 1.05rem;
        color: #94a3b8;
        max-width: 720px;
        margin: 0 auto;
        line-height: 1.6;
    }

    /* Cartão do Versículo em Destaque */
    .verse-card {
        background: linear-gradient(145deg, #161b22, #0f141c);
        border: 1px solid rgba(212, 175, 55, 0.35);
        box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 15px rgba(212, 175, 55, 0.08);
        border-radius: 16px;
        padding: 30px;
        margin: 20px 0;
        position: relative;
    }
    .verse-card::before {
        content: "“";
        font-family: 'Cinzel', serif;
        position: absolute;
        top: 10px;
        left: 20px;
        font-size: 70px;
        color: rgba(212, 175, 55, 0.15);
        line-height: 1;
        pointer-events: none;
    }
    .verse-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(212, 175, 55, 0.15);
        color: #fce7a1;
        border: 1px solid rgba(212, 175, 55, 0.4);
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
        margin-bottom: 16px;
    }
    .verse-verified-pill {
        display: inline-flex;
        align-items: center;
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.4);
        padding: 3px 10px;
        border-radius: 12px;
        font-size: 0.78rem;
        font-weight: 600;
        margin-left: 8px;
    }
    .verse-text {
        font-family: 'Merriweather', serif;
        font-size: 1.35rem;
        line-height: 1.85;
        color: #f8fafc;
        margin: 16px 0 20px 0;
        font-style: italic;
    }
    .verse-ref-footer {
        font-family: 'Cinzel', serif;
        text-align: right;
        font-size: 1.15rem;
        color: #d4af37;
        font-weight: 700;
        margin-top: 10px;
    }

    /* Cartão de Seção Pastoral / Oração */
    .section-card {
        background-color: #161b22;
        border: 1px solid #30363d;
        border-radius: 14px;
        padding: 22px;
        margin-bottom: 18px;
    }
    .section-card h4 {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 0;
        margin-bottom: 12px;
        color: #f1f5f9;
        font-size: 1.1rem;
    }
    .section-card p {
        color: #cbd5e1;
        line-height: 1.7;
        margin-bottom: 8px;
        font-size: 1rem;
    }

    /* Caixa de Oração Especial */
    .prayer-box {
        background: linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9));
        border-left: 4px solid #38bdf8;
        border-radius: 8px;
        padding: 18px 20px;
        margin: 14px 0;
        font-style: italic;
        color: #e2e8f0;
        line-height: 1.75;
    }

    /* Botão de WhatsApp */
    .whatsapp-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background-color: #25D366;
        color: #ffffff !important;
        padding: 10px 18px;
        border-radius: 8px;
        font-weight: 600;
        text-decoration: none;
        transition: 0.2s;
        margin-top: 10px;
    }
    .whatsapp-btn:hover {
        background-color: #1eb954;
        text-decoration: none;
    }
</style>
""", unsafe_allow_html=True)

# -------------------------------------------------------------
# GERENCIAMENTO DE ESTADO DA SESSÃO
# -------------------------------------------------------------
if "current_response" not in st.session_state:
    st.session_state["current_response"] = None
if "selected_theme_id" not in st.session_state:
    st.session_state["selected_theme_id"] = None
if "last_user_query" not in st.session_state:
    st.session_state["last_user_query"] = ""

def apply_theme_selection(theme_id: str):
    """Callback ao clicar em uma pílula de sentimento."""
    st.session_state["selected_theme_id"] = theme_id
    theme_obj = get_theme_by_id(theme_id)
    if theme_obj:
        st.session_state["last_user_query"] = theme_obj.get("title", "")
        # Limpa resposta anterior para recarregar
        st.session_state["current_response"] = None

# -------------------------------------------------------------
# BARRA LATERAL (SIDEBAR): CONFIGURAÇÃO & INFORMAÇÕES
# -------------------------------------------------------------
with st.sidebar:
    st.markdown("### 🕊️ Palavra Viva")
    st.caption("Bússola Espiritual e Consolo Bíblico sem Alucinações")

    st.markdown("---")
    st.subheader("⚙️ Conexão de Inteligência Artificial")
    
    # Recupera chave Gemini do ambiente, secrets ou input do usuário
    env_gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    secrets_gemini_key = st.secrets.get("GEMINI_API_KEY", "") if hasattr(st, "secrets") else ""
    initial_key = env_gemini_key or secrets_gemini_key or st.session_state.get("gemini_api_key", "")

    user_api_key = st.text_input(
        "Chave do Google Gemini (Opcional):",
        value=initial_key,
        type="password",
        placeholder="AIzaSy...",
        help="Insira sua chave gratuita da API do Gemini para reflexões pastorais personalizadas por IA."
    )
    if user_api_key != st.session_state.get("gemini_api_key"):
        st.session_state["gemini_api_key"] = user_api_key

    active_key = get_gemini_api_key(user_api_key)
    if active_key:
        st.success("🟢 IA Pastoral Ativa (Google Gemini)")
    else:
        st.info("🔵 Modo Bíblico Local Ativo\n\nTodas as respostas usam o acervo canônico curado.")

    with st.expander("💡 Como pegar chave grátis do Gemini (1 min)"):
        st.markdown("""
        1. Acesse o **[Google AI Studio](https://aistudio.google.com/)**
        2. Faça login com sua conta Google
        3. Clique no botão azul **'Get API key'**
        4. Copie e cole aqui! É **100% gratuito** (15 requisições por minuto sem custo).
        """)

    st.markdown("---")
    st.subheader("📖 Versão da Bíblia Sagrada")
    version_choice = st.radio(
        "Tradução:",
        options=["NVI", "AA"],
        format_func=lambda x: "NVI — Nova Versão Internacional (Moderna)" if x == "NVI" else "AA — Almeida Atualizada (Clássica)",
        index=0,
        horizontal=False
    )

    st.markdown("---")
    st.subheader("🌅 Palavra de Paz do Momento")
    rand_verse = get_random_comfort_verse(version=version_choice.lower())
    st.markdown(f"""
    <div style="background: rgba(212, 175, 55, 0.08); border-left: 3px solid #d4af37; padding: 12px; border-radius: 6px; font-size: 0.9rem;">
        <i>"{rand_verse.get('full_text', '')}"</i>
        <div style="text-align: right; color: #d4af37; font-weight: bold; margin-top: 6px;">{rand_verse.get('reference', '')}</div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("---")
    with st.expander("🛡️ Garantia de Zero Alucinações"):
        st.markdown("""
        **Como garantimos que os versículos são 100% reais?**
        
        Muitas IAs inventam capítulos ou misturam palavras bíblicas. No **Palavra Viva**:
        
        1. A IA analisa o seu sentimento e sugere uma referência canônica.
        2. O sistema faz a **busca exata** na nossa base de dados local SQLite de **62.000+ versículos reais** da Bíblia Sagrada (NVI / AA).
        3. Apenas o texto literal verificado é apresentado. **Nenhum versículo é inventado.**
        """)

# -------------------------------------------------------------
# CABEÇALHO PRINCIPAL
# -------------------------------------------------------------
st.markdown("""
<div class="title-banner">
    <h1>PALAVRA VIVA</h1>
    <p>Abra o seu coração e receba uma passagem real e verificada da Bíblia Sagrada que ressoa com o que você está vivendo hoje.</p>
</div>
""", unsafe_allow_html=True)

# -------------------------------------------------------------
# SELETOR RÁPIDO DE SENTIMENTOS / SITUAÇÕES (CHIPS)
# -------------------------------------------------------------
st.write("**🕊️ Como está o seu coração hoje? (Toque para escolher rapidamente):**")

all_themes = list_all_themes()
# Agrupa os temas em 2 linhas de colunas
col_rows = [all_themes[i:i + 4] for i in range(0, min(8, len(all_themes)), 4)]

for row in col_rows:
    cols = st.columns(len(row))
    for idx, t in enumerate(row):
        with cols[idx]:
            icon_map = {
                "ansiedade_futuro": "😰 Ansiedade & Medo",
                "luto_tristeza_perda": "💔 Luto & Saudade",
                "cansaco_esgotamento": "🔋 Cansaço & Esgotamento",
                "solidao_abandono": "🍂 Solidão & Abandono",
                "gratidao_louvor": "🙌 Gratidão & Alegria",
                "perdao_magoa": "🕊️ Preciso Perdoar",
                "culpa_arrependimento": "😔 Culpa & Perdão",
                "sabedoria_direcao": "🧭 Dúvida & Decisão",
                "enfermidade_cura": "🩹 Enfermidade & Dor",
                "financeiro_provisao": "🌾 Finanças & Provisão",
                "fe_esperanca_desanimo": "🔥 Crise de Fé & Esperança"
            }
            btn_label = icon_map.get(t["id"], t["title"][:22])
            if st.button(btn_label, key=f"chip_{t['id']}", use_container_width=True):
                apply_theme_selection(t["id"])
                st.rerun()

st.write("")

# -------------------------------------------------------------
# CAMPO DE TEXTO LIVRE PARA DESABAFO OU PEDIDO
# -------------------------------------------------------------
user_text_input = st.text_area(
    "Ou escreva com suas próprias palavras o que você está sentindo ou necessitando:",
    value=st.session_state.get("last_user_query", ""),
    placeholder="Exemplo: Estou muito preocupado com a saúde do meu pai e sinto que não tenho mais forças para lidar com tanta incerteza...",
    height=100,
    key="input_user_feeling"
)

col_act1, col_act2 = st.columns([3, 1])
with col_act1:
    btn_search = st.button("📖 Buscar Palavra no Altar", type="primary", use_container_width=True, key="btn_submit_prayer")
with col_act2:
    if st.button("🔄 Limpar", use_container_width=True, key="btn_clear_input"):
        st.session_state["last_user_query"] = ""
        st.session_state["current_response"] = None
        st.session_state["selected_theme_id"] = None
        st.rerun()

# -------------------------------------------------------------
# PROCESSAMENTO DA CONSULTA (LLM OU CATÁLOGO CURADO)
# -------------------------------------------------------------
if btn_search and user_text_input.strip():
    query = user_text_input.strip()
    st.session_state["last_user_query"] = query

    with st.spinner("Buscando a Palavra nas Escrituras Sagradas..."):
        # Se um tema específico foi clicado e o texto corresponde
        active_theme_id = st.session_state.get("selected_theme_id")
        active_theme = get_theme_by_id(active_theme_id) if active_theme_id else None

        active_key = get_gemini_api_key(st.session_state.get("gemini_api_key"))

        if active_key:
            # Consulta inteligente via LLM com verificação canônica estrita
            resp = consult_bible_with_llm(
                user_input=query,
                api_key=active_key,
                version=version_choice.lower()
            )
        else:
            # Consulta por correspondência no acervo canônico local
            if active_theme:
                resp = build_thematic_response(active_theme, version=version_choice.lower())
            else:
                resp = consult_bible_with_llm(
                    user_input=query,
                    api_key=None,
                    version=version_choice.lower()
                )

        st.session_state["current_response"] = resp

# -------------------------------------------------------------
# EXIBIÇÃO DO RESULTADO BÍBLICO
# -------------------------------------------------------------
resp = st.session_state.get("current_response")

if resp and resp.get("success"):
    passage = resp.get("passage", {})
    ref_title = passage.get("reference", "Bíblia Sagrada")
    version_badge = passage.get("version", version_choice)
    scripture_text = passage.get("full_text", "")
    theme_title = resp.get("theme_title", "Uma Palavra para o Seu Coração")
    
    st.markdown("---")
    
    if resp.get("notice"):
        st.info(f"ℹ️ {resp['notice']}")

    # 1. Cartão de Destaque da Passagem Sagrada
    st.markdown(f"""
    <div class="verse-card">
        <div>
            <span class="verse-badge">📖 {ref_title} • {version_badge}</span>
            <span class="verse-verified-pill">✓ 100% Verificado na Bíblia</span>
        </div>
        <div class="verse-text">
            {scripture_text}
        </div>
        <div class="verse-ref-footer">— {ref_title} ({version_badge})</div>
    </div>
    """, unsafe_allow_html=True)

    # 2. Barra de Recursos Imediatos (Áudio, WhatsApp, Copiar)
    col_aud, col_wa, col_cp = st.columns([1.5, 1.2, 1.3])
    
    with col_aud:
        # Geração de áudio em voz natural
        audio_bytes = generate_verse_audio_bytes(scripture_text)
        if audio_bytes:
            st.audio(audio_bytes, format="audio/mp3")

    with col_wa:
        # Link de compartilhamento direto no WhatsApp
        msg_share = (
            f"🕊️ *Palavra Viva para o seu coração*\n\n"
            f"_{scripture_text}_\n\n"
            f"📖 *{ref_title} ({version_badge})*\n"
            f"Reflexão: {resp.get('theme_title', '')}\n\n"
            f"Enviado pelo app Palavra Viva ✨"
        )
        encoded_wa = urllib.parse.quote(msg_share)
        wa_url = f"https://api.whatsapp.com/send?text={encoded_wa}"
        st.markdown(f'<a href="{wa_url}" target="_blank" class="whatsapp-btn">📱 Enviar no WhatsApp</a>', unsafe_allow_html=True)

    with col_cp:
        st.write("")
        st.caption(f"Tema: **{theme_title}**")

    st.write("")

    # 3. Seções Devocionais (Reflexão, Contexto, Oração, Ação Prática)
    tab_refl, tab_orac, tab_cont, tab_cap = st.tabs([
        "🕊️ Reflexão Pastoral",
        "🙏 Oração para Você",
        "📜 Contexto Bíblico",
        "📖 Ler o Capítulo Completo"
    ])

    with tab_refl:
        st.markdown(f"""
        <div class="section-card">
            <h4>🕊️ Uma Palavra para o Seu Coração</h4>
            <p>{resp.get('pastoral_reflection', 'Deus cuida de cada detalhe da sua vida.')}</p>
        </div>
        """, unsafe_allow_html=True)

        if resp.get("practical_step"):
            st.markdown(f"""
            <div class="section-card" style="border-left: 4px solid #d4af37;">
                <h4>💡 Passo de Fé para o Seu Dia</h4>
                <p>{resp.get('practical_step')}</p>
            </div>
            """, unsafe_allow_html=True)

    with tab_orac:
        st.markdown(f"""
        <div class="section-card">
            <h4>🙏 Oração Guiada para Fazer Agora</h4>
            <p>Se as palavras lhe faltam hoje, faça esta oração sincera a Deus em seu coração:</p>
            <div class="prayer-box">
                "{resp.get('guided_prayer', 'Senhor, ouve o meu clamor e guarda a minha alma em Tua paz. Amém.')}"
            </div>
        </div>
        """, unsafe_allow_html=True)

    with tab_cont:
        st.markdown(f"""
        <div class="section-card">
            <h4>📜 Contexto Bíblico Original</h4>
            <p>{resp.get('historical_context', 'Esta passagem foi inspirada por Deus para consolar e fortalecer o Seu povo ao longo das gerações.')}</p>
        </div>
        """, unsafe_allow_html=True)

    with tab_cap:
        book_name = passage.get("book")
        ch_num = passage.get("chapter")
        if book_name and ch_num:
            full_ch = get_full_chapter(book_name, ch_num, version=version_badge.lower())
            if full_ch:
                st.markdown(f"### 📖 {book_name} — Capítulo {ch_num} ({version_badge})")
                st.caption(f"Total de {len(full_ch['verses'])} versículos neste capítulo.")
                
                verses_html = []
                for v in full_ch["verses"]:
                    is_highlighted = (passage.get("start_verse") <= v["verse"] <= passage.get("end_verse"))
                    hl_style = "background: rgba(212, 175, 55, 0.15); border-left: 3px solid #d4af37; padding: 4px 8px; border-radius: 4px;" if is_highlighted else "padding: 4px 0;"
                    verses_html.append(f'<div style="{hl_style}"><b>{v["verse"]}.</b> {v["text"]}</div>')
                
                st.markdown(f"""
                <div style="background-color: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 20px; font-family: 'Merriweather', serif; font-size: 0.98rem; line-height: 1.8; max-height: 480px; overflow-y: auto;">
                    {"".join(verses_html)}
                </div>
                """, unsafe_allow_html=True)

    # 4. Outras Passagens Relacionadas (se houver no catálogo)
    alts = resp.get("alternative_passages", [])
    if alts:
        st.markdown("#### 📚 Outras Passagens Bíblicas que Falam ao Seu Coração:")
        alt_cols = st.columns(min(len(alts), 3))
        for idx, alt in enumerate(alts[:3]):
            with alt_cols[idx]:
                st.markdown(f"""
                <div style="background-color: #161b22; border: 1px solid #30363d; border-radius: 10px; padding: 14px; margin-bottom: 10px;">
                    <span style="color: #d4af37; font-weight: 700; font-size: 0.95rem;">📖 {alt['reference']}</span>
                    <p style="color: #94a3b8; font-size: 0.82rem; margin: 4px 0 8px 0;">{alt.get('note', '')}</p>
                    <p style="color: #e2e8f0; font-size: 0.88rem; font-style: italic;">"{alt['full_text'][:120]}..."</p>
                </div>
                """, unsafe_allow_html=True)

elif not resp:
    # Boas-vindas iniciais
    st.markdown("""
    <div style="text-align: center; padding: 40px 20px; color: #64748b;">
        <span style="font-size: 48px;">🕊️</span>
        <h3 style="color: #94a3b8; margin-top: 10px;">Escolha um sentimento acima ou digite o que está no seu coração.</h3>
        <p style="max-width: 500px; margin: 0 auto; font-size: 0.95rem;">O Palavra Viva selecionará a passagem mais apropriada e profunda da Bíblia Sagrada para acolher você agora.</p>
    </div>
    """, unsafe_allow_html=True)
