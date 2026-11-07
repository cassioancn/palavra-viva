import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { ArrowLeft, BookOpen, Heart, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sanctuary-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      {/* Background Glow */}
      <div className="pointer-events-none fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-sacred-500/10 blur-[140px]" />

      <div className="max-w-lg w-full rounded-3xl bg-sanctuary-900/90 border border-sacred-500/30 p-8 sm:p-10 shadow-2xl backdrop-blur-md space-y-6">
        {/* Brand Logo with Glow */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-sacred-400 via-sacred-500 to-sacred-600 flex items-center justify-center shadow-glow text-sanctuary-950">
          <BrandLogo className="w-9 h-9 text-sanctuary-950" />
        </div>

        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-sacred-400">
            Erro 404 • Página Não Encontrada
          </span>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-slate-100 mt-2">
            Um Caminho Desconhecido
          </h1>
        </div>

        {/* Versículo de Alento no 404 */}
        <div className="p-5 rounded-2xl bg-sanctuary-950/80 border border-sanctuary-800 text-left space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-sacred-300 font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Salmos 23:1-2</span>
          </div>
          <blockquote className="font-merriweather italic text-slate-200 text-sm leading-relaxed border-l-2 border-sacred-500/40 pl-3">
            "O Senhor é o meu pastor; de nada terei falta. Ele me faz repousar em pastos verdejantes e me guia suavemente a águas tranquilas."
          </blockquote>
        </div>

        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          O link que você tentou acessar não foi localizado, mas a graça de Deus nunca falha. Volte à página inicial para buscar uma passagem para o seu coração.
        </p>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-sacred-500 to-sacred-600 hover:from-sacred-400 hover:to-sacred-500 text-sanctuary-950 shadow-glow transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar à Página Inicial</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
