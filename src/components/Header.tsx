"use client";

import React from "react";
import { Sparkles, SlidersHorizontal, BookOpen } from "lucide-react";

interface HeaderProps {
  version: "nvi" | "aa";
  onOpenSettings: () => void;
  hasCustomKey: boolean;
}

export function Header({ version, onOpenSettings, hasCustomKey }: HeaderProps) {
  return (
    <header className="w-full border-b border-sanctuary-700/60 bg-sanctuary-900/60 backdrop-blur-md sticky top-0 z-30 transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sacred-400 to-sacred-600 flex items-center justify-center shadow-glow text-sanctuary-950 font-bold text-lg select-none">
            🕊️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-sacred-400">
                PALAVRA VIVA
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-sacred-500/10 text-sacred-300 border border-sacred-500/20">
                {version.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Consolo & Direção na Bíblia Sagrada
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {hasCustomKey ? (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              IA Gemini Ativa
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-full">
              <BookOpen className="w-3 h-3" />
              Acervo Local
            </div>
          )}

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-sacred-300 bg-sanctuary-800 hover:bg-sanctuary-700/80 border border-sanctuary-600 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
            title="Configurações & Tradução"
          >
            <SlidersHorizontal className="w-4 h-4 text-sacred-400" />
            <span className="hidden sm:inline">Configurações</span>
          </button>
        </div>
      </div>
    </header>
  );
}
