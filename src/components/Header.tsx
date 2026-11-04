"use client";

import React from "react";
import { SlidersHorizontal, Heart } from "lucide-react";

interface HeaderProps {
  version: "nvi" | "aa";
  onOpenSettings: () => void;
  onOpenPix: () => void;
}

export function Header({ version, onOpenSettings, onOpenPix }: HeaderProps) {
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
          {/* Botão de Apoio via Pix */}
          <button
            onClick={onOpenPix}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-3 py-1.5 rounded-lg transition-all"
            title="Apoiar este projeto com Pix"
          >
            <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
            <span className="hidden sm:inline">Apoiar Projeto</span>
          </button>

          {/* Seletor de Versão */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-sacred-300 bg-sanctuary-800 hover:bg-sanctuary-700/80 border border-sanctuary-600 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
            title="Alterar Tradução da Bíblia"
          >
            <SlidersHorizontal className="w-4 h-4 text-sacred-400" />
            <span>Versão: <strong className="text-sacred-300">{version.toUpperCase()}</strong></span>
          </button>
        </div>
      </div>
    </header>
  );
}
