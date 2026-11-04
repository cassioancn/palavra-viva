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

interface SentimentChipsProps {
  onSelectSentiment: (query: string) => void;
  isLoading: boolean;
}

export function SentimentChips({ onSelectSentiment, isLoading }: SentimentChipsProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Como está o seu coração hoje? (Escolha rápida)
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {POPULAR_SENTIMENTS.map((item) => (
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

