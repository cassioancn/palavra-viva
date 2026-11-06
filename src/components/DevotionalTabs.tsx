"use client";

import React, { useState } from "react";
import {
  HeartHandshake,
  Sparkles,
  BookMarked,
  Compass,
  MessageCircleHeart,
  RefreshCw,
  ArrowRight,
  BookOpen,
} from "lucide-react";

export interface AlternativePassage {
  reference: string;
  note: string;
  fullText: string;
  book: string;
  chapter: number;
  startVerse?: number;
  endVerse?: number;
}

interface DevotionalTabsProps {
  pastoralReflection: string;
  historicalContext: string;
  guidedPrayer: string;
  practicalStep: string;
  alternativePassages?: AlternativePassage[];
  onSelectAlternative?: (alt: AlternativePassage) => void;
  onFetchMorePassages?: () => void;
  isLoadingMore?: boolean;
}

export function DevotionalTabs({
  pastoralReflection,
  historicalContext,
  guidedPrayer,
  practicalStep,
  alternativePassages = [],
  onSelectAlternative,
  onFetchMorePassages,
  isLoadingMore = false,
}: DevotionalTabsProps) {
  const [activeTab, setActiveTab] = useState<"reflection" | "prayer" | "context" | "action">("reflection");

  const tabs = [
    { id: "reflection", label: "Reflexão Pastoral", icon: MessageCircleHeart },
    { id: "prayer", label: "Oração para Você", icon: HeartHandshake },
    { id: "context", label: "Contexto Bíblico", icon: BookMarked },
    { id: "action", label: "Passo Prático", icon: Compass },
  ] as const;

  return (
    <div className="w-full rounded-2xl bg-sanctuary-900/80 border border-sanctuary-700/80 overflow-hidden shadow-md mt-6">
      {/* Tab Navigation */}
      <div className="flex border-b border-sanctuary-700/80 bg-sanctuary-950/40 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3.5 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
                isActive
                  ? "border-sacred-400 text-sacred-300 bg-sanctuary-800/40"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-sanctuary-800/20"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-sacred-400" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Body */}
      <div className="p-6 sm:p-8 min-h-[180px]">
        {activeTab === "reflection" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-sacred-400 font-cinzel text-base font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Uma Palavra Direto ao Seu Coração</span>
            </div>
            <p className="text-slate-200 text-base sm:text-lg leading-relaxed whitespace-pre-line font-sans">
              {pastoralReflection}
            </p>
          </div>
        )}

        {activeTab === "prayer" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-sky-400 font-cinzel text-base font-bold">
              <HeartHandshake className="w-4 h-4" />
              <span>Oração para Falar com Deus Agora</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Se as palavras lhe faltam hoje, faça esta oração sincera em seu íntimo:
            </p>
            <div className="p-5 rounded-xl bg-gradient-to-r from-sky-950/30 to-sanctuary-850 border-l-4 border-sky-400 text-slate-100 italic text-base sm:text-lg leading-relaxed font-merriweather">
              "{guidedPrayer}"
            </div>
          </div>
        )}

        {activeTab === "context" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-amber-400 font-cinzel text-base font-bold">
              <BookMarked className="w-4 h-4" />
              <span>Contexto Original da Passagem</span>
            </div>
            <p className="text-slate-300 text-base leading-relaxed">
              {historicalContext}
            </p>
          </div>
        )}

        {activeTab === "action" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-emerald-400 font-cinzel text-base font-bold">
              <Compass className="w-4 h-4" />
              <span>Um Passo de Fé para o Seu Dia</span>
            </div>
            <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-slate-200 text-base leading-relaxed">
              {practicalStep}
            </div>
          </div>
        )}
      </div>

      {/* Alternative Passages Footer (if any) */}
      {alternativePassages.length > 0 && (
        <div className="border-t border-sanctuary-700/60 bg-sanctuary-950/60 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-sacred-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-sacred-400" />
                <span>Outras Passagens Bíblicas que Falam a Essa Situação:</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Clique em qualquer passagem para selecioná-la e ler a reflexão completa
              </p>
            </div>

            {onFetchMorePassages && (
              <button
                type="button"
                onClick={onFetchMorePassages}
                disabled={isLoadingMore}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-sacred-300 hover:text-white bg-sanctuary-800 hover:bg-sanctuary-700 border border-sanctuary-700 hover:border-sacred-500/40 transition-all disabled:opacity-50 active:scale-95 shadow-sm"
                title="Buscar outros versículos inéditos para este mesmo tema sem repetições"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMore ? "animate-spin text-sacred-400" : ""}`} />
                <span>{isLoadingMore ? "Buscando novas passagens..." : "Buscar outras passagens"}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {alternativePassages.map((alt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSelectAlternative?.(alt)}
                className="group w-full text-left p-4 rounded-xl bg-sanctuary-800/60 hover:bg-sanctuary-800/90 border border-sanctuary-700 hover:border-sacred-400/70 transition-all text-xs cursor-pointer shadow-sm hover:shadow-glow flex flex-col justify-between active:scale-[0.98]"
              >
                <div>
                  <div className="font-cinzel font-bold text-sacred-300 group-hover:text-sacred-200 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">📖 {alt.reference}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-sacred-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  {alt.note && (
                    <div className="text-slate-300 font-medium text-[11px] mb-2 line-clamp-2">
                      {alt.note}
                    </div>
                  )}
                  {alt.fullText && (
                    <div className="text-slate-400 italic line-clamp-2 text-[11px]">
                      "{alt.fullText.replace(/\[\d+\]/g, "").trim()}"
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-sanctuary-700/50 flex items-center justify-between text-[11px] text-sacred-400 group-hover:text-sacred-300 font-semibold">
                  <span>Selecionar & Meditar</span>
                  <span className="text-xs">➔</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
