import React from "react";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-sanctuary-800 bg-sanctuary-950/80 py-8 text-center text-xs text-slate-500 mt-auto">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-2">
        <p className="flex items-center gap-1 text-slate-400">
          <span>Palavra Viva — Desenvolvido com</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>para levar consolo e paz a corações aflitos</span>
        </p>
        <p className="text-[11px] text-slate-600">
          Textos bíblicos em domínio público / uso justo devocional. Base de dados canônica protestante de 66 livros.
        </p>
      </div>
    </footer>
  );
}
