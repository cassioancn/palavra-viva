"use client";

import React from "react";

export interface SentimentOption {
  id: string;
  emoji: string;
  label: string;
  query: string;
}

export const POPULAR_SENTIMENTS: SentimentOption[] = [
  {
    id: "ansiedade_futuro",
    emoji: "😰",
    label: "Ansiedade & Medo",
    query: "Estou me sentindo muito ansioso, com medo do futuro e com o peito apertado.",
  },
  {
    id: "luto_tristeza_perda",
    emoji: "💔",
    label: "Luto & Saudade",
    query: "Perdi alguém muito importante e sinto uma dor imensa de saudade e tristeza.",
  },
  {
    id: "cansaco_esgotamento",
    emoji: "🔋",
    label: "Cansaço & Exaustão",
    query: "Estou esgotado e sobrecarregado, sinto que não tenho mais forças para continuar.",
  },
  {
    id: "solidao_abandono",
    emoji: "🍂",
    label: "Solidão & Abandono",
    query: "Estou me sentindo sozinho, abandonado e incompreendido pelas pessoas ao meu redor.",
  },
  {
    id: "gratidao_louvor",
    emoji: "🙌",
    label: "Gratidão & Louvor",
    query: "Quero agradecer a Deus por tantas bênçãos, vitórias e pelo Seu amor fiel na minha vida.",
  },
  {
    id: "perdao_magoa",
    emoji: "🕊️",
    label: "Preciso Perdoar",
    query: "Fui magoado e traído profundamente, preciso de força para liberar o perdão e ter paz.",
  },
  {
    id: "culpa_arrependimento",
    emoji: "😔",
    label: "Culpa & Perdão",
    query: "Errei e me sinto indigno e com vergonha. Preciso do perdão e da misericórdia de Deus.",
  },
  {
    id: "sabedoria_direcao",
    emoji: "🧭",
    label: "Dúvida & Decisão",
    query: "Estou diante de uma encruzilhada e preciso de sabedoria divina para tomar a decisão certa.",
  },
  {
    id: "enfermidade_cura",
    emoji: "🩹",
    label: "Enfermidade & Dor",
    query: "Estou enfrentando uma doença e peço a Deus cura, renovação de forças e alívio para o meu corpo.",
  },
  {
    id: "financeiro_provisao",
    emoji: "🌾",
    label: "Finanças & Provisão",
    query: "As contas estão apertadas e estou preocupado com o sustento da minha família.",
  },
  {
    id: "fe_esperanca_desanimo",
    emoji: "🔥",
    label: "Crise de Fé & Esperança",
    query: "Minha fé está fraca e sinto vontade de desistir. Preciso que Deus renove a minha esperança.",
  },
];

export const POPULAR_STORIES: SentimentOption[] = [
  {
    id: "davi_golias",
    emoji: "⚔️",
    label: "Davi e Golias",
    query: "Davi e Golias no Vale de Elá derrotando o gigante",
  },
  {
    id: "filho_prodigo",
    emoji: "🏃",
    label: "O Filho Pródigo",
    query: "A parábola do Filho Pródigo que voltou arrependido ao pai",
  },
  {
    id: "armadura_deus",
    emoji: "🛡️",
    label: "Armadura de Deus",
    query: "A armadura de Deus para a batalha espiritual em Efésios 6",
  },
  {
    id: "criacao_mundo",
    emoji: "🌍",
    label: "A Criação do Mundo",
    query: "A criação dos céus e da terra e o princípio de tudo em Gênesis",
  },
  {
    id: "mar_vermelho",
    emoji: "🌊",
    label: "Mar Vermelho",
    query: "Moisés abrindo o Mar Vermelho pelo poder de Deus no Êxodo",
  },
  {
    id: "paes_peixes",
    emoji: "🍞",
    label: "Multiplicação dos Pães",
    query: "Jesus multiplicando cinco pães e dois peixes para a multidão",
  },
  {
    id: "bom_samaritano",
    emoji: "🤝",
    label: "O Bom Samaritano",
    query: "A parábola do Bom Samaritano que cuidou do homem ferido",
  },
  {
    id: "tempestade_mar",
    emoji: "⛵",
    label: "Jesus Acalma o Mar",
    query: "Jesus acalmando o vento e a tempestade no Mar da Galileia",
  },
  {
    id: "daniel_leoes",
    emoji: "🦁",
    label: "Daniel na Cova",
    query: "Daniel na cova dos leões salvo pelo anjo de Deus",
  },
  {
    id: "hino_amor",
    emoji: "❤️",
    label: "1 Coríntios 13 (Amor)",
    query: "1 Coríntios 13 onde fala que o amor é paciente e benigno",
  },
  {
    id: "dez_mandamentos",
    emoji: "📜",
    label: "Dez Mandamentos",
    query: "Os Dez Mandamentos entregues por Deus a Moisés no Monte Sinai",
  },
  {
    id: "salmo_23",
    emoji: "🐑",
    label: "Salmos 23",
    query: "Salmos 23: O Senhor é o meu pastor e nada me faltará",
  },
];

interface SentimentChipsProps {
  onSelectSentiment: (query: string) => void;
  isLoading: boolean;
  mode?: "counsel" | "search";
}

export function SentimentChips({
  onSelectSentiment,
  isLoading,
  mode = "counsel",
}: SentimentChipsProps) {
  const isSearchMode = mode === "search";
  const items = isSearchMode ? POPULAR_STORIES : POPULAR_SENTIMENTS;
  const label = isSearchMode
    ? "Histórias e Passagens Bíblicas Populares (Toque para ver):"
    : "Como está o seu coração hoje? (Escolha rápida):";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectSentiment(item.query)}
            disabled={isLoading}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-sanctuary-800/90 hover:bg-sanctuary-700/80 text-slate-300 hover:text-sacred-300 border border-sanctuary-600/70 hover:border-sacred-500/40 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            <span className="text-sm transition-transform group-hover:scale-110">
              {item.emoji}
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

