"use client";

import React, { useState, useEffect } from "react";
import { Heart, Search, ArrowUp } from "lucide-react";

interface MobileStickyBarProps {
  onOpenPix: () => void;
  onScrollToSearch: () => void;
  hasResult?: boolean;
}

export function MobileStickyBar({
  onOpenPix,
  onScrollToSearch,
  hasResult = false,
}: MobileStickyBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling down past the initial hero
      if (window.scrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Ações Rápidas Mobile"
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-sanctuary-950/95 backdrop-blur-lg border-t border-sanctuary-800/80 px-3 py-2.5 shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom"
    >
      <div className="max-w-md mx-auto flex items-center justify-between gap-2.5">
        <button
          onClick={onScrollToSearch}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-sanctuary-850 hover:bg-sanctuary-800 text-slate-200 border border-sanctuary-750 active:scale-95 transition-all shadow-sm"
        >
          {hasResult ? (
            <>
              <Search className="w-3.5 h-3.5 text-sacred-400" />
              <span>Nova Palavra</span>
            </>
          ) : (
            <>
              <ArrowUp className="w-3.5 h-3.5 text-sacred-400" />
              <span>Voltar ao Início</span>
            </>
          )}
        </button>

        <button
          onClick={onOpenPix}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-sacred-500 to-amber-500 hover:from-sacred-400 hover:to-amber-400 text-sanctuary-950 shadow-md shadow-sacred-500/20 active:scale-95 transition-all"
        >
          <Heart className="w-3.5 h-3.5 fill-current text-sanctuary-950" />
          <span>Apoiar via Pix</span>
        </button>
      </div>
    </aside>
  );
}
