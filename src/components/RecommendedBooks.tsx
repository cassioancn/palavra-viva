"use client";

import React from "react";
import { BookOpen, ExternalLink, Sparkles } from "lucide-react";

interface BookRecommendation {
  title: string;
  author: string;
  description: string;
  category: string;
  amazonQuery: string;
  coverEmoji: string;
}

const THEME_BOOK_MAP: Record<string, BookRecommendation[]> = {
  ansiedade_futuro: [
    {
      title: "Ansiedade: O Fim do Medo",
      author: "Max Lucado",
      description: "Descubra como trocar o desespero e a inquietação pela paz sobrenatural prometida por Deus.",
      category: "Cura Emocional",
      amazonQuery: "Ansiedade+Max+Lucado",
      coverEmoji: "🕊️",
    },
    {
      title: "Bíblia de Estudo NVI (Capa Luxo)",
      author: "Editora Vida",
      description: "Uma das Bíblias de estudo mais consagradas do Brasil, com notas profundas e linguagem moderna.",
      category: "Bíblia de Estudo",
      amazonQuery: "Biblia+de+Estudo+NVI",
      coverEmoji: "📖",
    },
  ],
  luto_tristeza_perda: [
    {
      title: "A Anatomia de uma Dor",
      author: "C.S. Lewis",
      description: "O relato mais sincero e consolador de Lewis sobre a dor da perda e o abraço de Deus no luto.",
      category: "Consolo no Luto",
      amazonQuery: "A+Anatomia+de+uma+Dor+CS+Lewis",
      coverEmoji: "🕯️",
    },
    {
      title: "O Deus de Toda Consolação",
      author: "Dee Brestin",
      description: "Como encontrar refúgio nos braços do Pai nas estações mais difíceis e escuras da vida.",
      category: "Devocional",
      amazonQuery: "Deus+de+Toda+Consolacao",
      coverEmoji: "🤍",
    },
  ],
  default: [
    {
      title: "Café com Deus Pai (Devocional Diário)",
      author: "Junior Rostirola",
      description: "O devocional cristão diário número 1 do Brasil para começar suas manhãs na presença de Deus.",
      category: "Devocional Diário",
      amazonQuery: "Cafe+com+Deus+Pai",
      coverEmoji: "☕",
    },
    {
      title: "Bíblia de Estudo NAA (Almeida)",
      author: "Sociedade Bíblica do Brasil",
      description: "A clássica tradução Almeida em edição especial de estudo com mapas, concordância e notas.",
      category: "Bíblia de Estudo",
      amazonQuery: "Biblia+de+Estudo+NAA",
      coverEmoji: "📖",
    },
  ],
};

interface RecommendedBooksProps {
  themeId?: string;
}

export function RecommendedBooks({ themeId }: RecommendedBooksProps) {
  const amazonTag = process.env.NEXT_PUBLIC_AMAZON_TAG || "palavraviva-20";
  const books = (themeId && THEME_BOOK_MAP[themeId]) || THEME_BOOK_MAP["default"];

  const buildAmazonUrl = (query: string) => {
    return `https://www.amazon.com.br/s?k=${query}&tag=${encodeURIComponent(amazonTag)}`;
  };

  return (
    <div className="w-full rounded-2xl bg-sanctuary-900/60 border border-sanctuary-700/60 p-6 sm:p-7 space-y-4 mt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-sacred-400" />
          <h4 className="font-cinzel text-sm sm:text-base font-bold text-sacred-300">
            Livros & Bíblias Recomendadas para Você
          </h4>
        </div>
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
          Recomendações na Amazon
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {books.map((b, i) => (
          <div
            key={i}
            className="flex flex-col justify-between p-4 rounded-xl bg-sanctuary-850 border border-sanctuary-700/80 hover:border-sacred-500/30 transition-all group"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl p-2 rounded-lg bg-sanctuary-800 border border-sanctuary-700">
                  {b.coverEmoji}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sacred-500/10 text-sacred-300 font-medium">
                  {b.category}
                </span>
              </div>

              <div>
                <h5 className="font-cinzel font-bold text-sm text-slate-100 group-hover:text-sacred-300 transition-colors">
                  {b.title}
                </h5>
                <p className="text-[11px] text-slate-400 font-medium">por {b.author}</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {b.description}
              </p>
            </div>

            <div className="pt-4 mt-2 border-t border-sanctuary-800">
              <a
                href={buildAmazonUrl(b.amazonQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-sm transition-all active:scale-95"
              >
                <span>Ver na Amazon</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

