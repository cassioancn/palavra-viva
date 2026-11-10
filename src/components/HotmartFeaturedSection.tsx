"use client";

import React from "react";
import { Sparkles, ExternalLink, ShieldCheck, BookOpen, Smartphone } from "lucide-react";
import { HOTMART_PARTNERS } from "@/lib/config";

export function HotmartFeaturedSection() {
  return (
    <section
      aria-label="Leituras Digitais Recomendadas"
      className="w-full rounded-2xl bg-gradient-to-b from-sanctuary-900/90 via-sanctuary-900/60 to-sanctuary-950/80 border border-amber-500/30 p-5 sm:p-7 space-y-5 shadow-xl transition-all"
    >
      {/* Cabeçalho da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sanctuary-750 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Leituras Digitais Recomendadas</span>
          </div>
          <h3 className="font-cinzel text-base sm:text-lg font-bold text-slate-100">
            Obras Especiais para Fortalecer a sua Fé & Oração
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Acesso Imediato no Celular</span>
        </div>
      </div>

      {/* Grade com os 2 E-books Parceiros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {HOTMART_PARTNERS.map((book) => (
          <div
            key={book.id}
            className="flex flex-col justify-between p-5 rounded-2xl bg-sanctuary-850/90 border border-sanctuary-750 hover:border-amber-500/40 transition-all group shadow-sm hover:shadow-glow/10"
          >
            <div className="space-y-3">
              {/* Topo do Card */}
              <div className="flex items-start justify-between gap-3">
                <span className="text-2xl p-2.5 rounded-xl bg-sanctuary-800 border border-sanctuary-700 select-none shadow-inner">
                  {book.coverEmoji}
                </span>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {book.highlight}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {book.category}
                  </span>
                </div>
              </div>

              {/* Título & Autor */}
              <div>
                <h4 className="font-cinzel font-bold text-base text-slate-100 group-hover:text-amber-300 transition-colors">
                  {book.title}
                </h4>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  por <strong className="text-slate-300">{book.author}</strong>
                </p>
              </div>

              {/* Descrição Acolhedora */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {book.description}
              </p>
            </div>

            {/* Ação: Botão Hotmart */}
            <div className="pt-4 mt-3 border-t border-sanctuary-800 space-y-2">
              <a
                href={book.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-sanctuary-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 shadow-md shadow-amber-500/10 transition-all active:scale-95 group/btn"
              >
                <BookOpen className="w-4 h-4 text-sanctuary-950" />
                <span>Conhecer E-book na Hotmart</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-75 group-hover/btn:translate-x-0.5 transition-transform" />
              </a>

              <p className="text-[10px] text-center text-slate-400">
                Entrega digital instantânea • Garantia de 7 dias
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Rodapé de Segurança e Transparência */}
      <div className="pt-3 border-t border-sanctuary-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 text-center sm:text-left">
        <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Plataforma Oficial Hotmart • Compra segura e protegida</span>
        </div>
        <span className="text-[10px] text-slate-500">
          Você apoia o projeto Palavra Viva ao adquirir por estes links oficiais
        </span>
      </div>
    </section>
  );
}
