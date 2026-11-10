"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  BookOpen,
  MessageCircle,
  Instagram,
  Check,
  Heart,
  Calendar,
  Share2,
} from "lucide-react";
import { DailyVerseResult } from "@/lib/dailyVerse";
import { WhatsAppShareModal } from "./WhatsAppShareModal";
import { InstagramStoryModal } from "./InstagramStoryModal";

interface DailyVerseModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DailyVerseResult | null;
  onOpenChapter: (book: string, chapter: number) => void;
  version: "nvi" | "aa";
}

export function DailyVerseModal({
  isOpen,
  onClose,
  data,
  onOpenChapter,
  version,
}: DailyVerseModalProps) {
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isInstagramOpen, setIsInstagramOpen] = useState(false);
  const [dontShowAgainToday, setDontShowAgainToday] = useState(false);

  if (!isOpen || !data) return null;

  const handleDismiss = () => {
    if (dontShowAgainToday && typeof window !== "undefined") {
      try {
        localStorage.setItem(`pv_votd_dismissed_${data.dateKey}`, "true");
      } catch (err) {
        console.error("Erro ao salvar preferência:", err);
      }
    }
    onClose();
  };

  const handleReadChapter = () => {
    handleDismiss();
    onOpenChapter(data.book, data.chapter);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
        <div className="relative w-full max-w-lg max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl transition-all">
          {/* Botão Fechar Flutuante */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-2 rounded-full bg-stone-900/60 hover:bg-stone-900 text-stone-200 hover:text-white transition-all z-20 shadow-md backdrop-blur-sm"
            aria-label="Fechar versículo do dia"
          >
            <X className="w-5 h-5" />
          </button>

          {/* CARD NO FORMATO SOCIAL MEDIA STORY (9:16 Visual) */}
          <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E3] to-[#EDE0C8] border-2 border-amber-800/40 p-6 sm:p-8 shadow-2xl text-stone-900 overflow-hidden">
            {/* Filete interno decorativo */}
            <div className="pointer-events-none absolute inset-3 rounded-2xl border border-amber-600/25 select-none" />

            {/* Ornamentos nos 4 Cantos (Rosetas / Losangos em Ouro Quente) */}
            <div className="pointer-events-none absolute top-4 left-4 w-2.5 h-2.5 rotate-45 bg-amber-700/80 select-none" />
            <div className="pointer-events-none absolute top-4 right-4 w-2.5 h-2.5 rotate-45 bg-amber-700/80 select-none" />
            <div className="pointer-events-none absolute bottom-4 left-4 w-2.5 h-2.5 rotate-45 bg-amber-700/80 select-none" />
            <div className="pointer-events-none absolute bottom-4 right-4 w-2.5 h-2.5 rotate-45 bg-amber-700/80 select-none" />

            {/* Aura Solar Suave Superior */}
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-amber-400/20 blur-3xl select-none" />

            {/* Cabeçalho do Card */}
            <div className="relative flex flex-col items-center text-center space-y-1.5 pt-2">
              <div className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-amber-900/10 border border-amber-800/20 text-amber-900 text-xs font-bold tracking-wider uppercase font-cinzel">
                <span>✝️ PALAVRA VIVA</span>
                <span className="text-amber-700">•</span>
                <span>{data.version}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800/90 pt-1">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                <span>
                  {data.dayOfWeek}, {data.formattedDate}
                </span>
              </div>

              {data.occasion && (
                <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-500/15 text-amber-950 font-medium text-[11px] border border-amber-600/30">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>{data.occasion}</span>
                </div>
              )}
            </div>

            {/* Corpo: Texto Sagrado */}
            <div className="relative my-6 px-2 sm:px-4 text-center">
              <span className="block font-cinzel text-5xl sm:text-6xl text-amber-700/20 -mb-4 select-none">
                “
              </span>
              <blockquote className="font-merriweather text-base sm:text-lg leading-relaxed sm:leading-loose text-stone-900 italic font-normal">
                {data.text}
              </blockquote>
            </div>

            {/* Divisória Sagrada e Referência */}
            <div className="relative flex flex-col items-center justify-center space-y-2 mb-5">
              <div className="flex items-center justify-center w-full max-w-[200px] gap-2">
                <div className="h-[1px] flex-1 bg-amber-800/30" />
                <div className="w-2 h-2 rotate-45 bg-amber-800/80" />
                <div className="h-[1px] flex-1 bg-amber-800/30" />
              </div>

              <div className="font-cinzel text-base sm:text-lg font-bold text-amber-900 tracking-wide">
                — {data.reference} ({data.version}) —
              </div>

              {data.themeTitle && (
                <span className="text-xs font-medium text-stone-600 bg-amber-900/5 px-2.5 py-0.5 rounded-md border border-amber-900/10">
                  Tema: <strong>{data.themeTitle}</strong>
                </span>
              )}
            </div>

            {/* Reflexão Pastoral para Hoje */}
            <div className="relative rounded-2xl bg-amber-950/5 border border-amber-900/15 p-4 sm:p-4.5 text-left space-y-2 mb-5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 font-cinzel">
                <Heart className="w-3.5 h-3.5 fill-amber-700 text-amber-700" />
                <span>Palavra para o seu Coração Hoje</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                {data.reflection}
              </p>
              {data.prayer && (
                <p className="text-[11px] text-amber-950/90 italic pt-1 border-t border-amber-900/10">
                  <strong>Oração:</strong> "{data.prayer}"
                </p>
              )}
            </div>

            {/* Ações de Compartilhamento & Aprofundamento */}
            <div className="relative space-y-2.5">
              {/* Botões de Rede Social */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsWhatsAppOpen(true)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-stone-950 bg-[#25D366] hover:bg-[#20bd5a] shadow-sm transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsInstagramOpen(true)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 shadow-sm transition-all active:scale-95"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </button>
              </div>

              {/* Botão de Ler Capítulo Completo */}
              <button
                type="button"
                onClick={handleReadChapter}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-amber-950 bg-amber-600/15 hover:bg-amber-600/25 border border-amber-800/30 transition-all active:scale-95"
              >
                <BookOpen className="w-4 h-4 text-amber-800" />
                <span>Ler Capítulo Completo ({data.book} {data.chapter})</span>
              </button>

              {/* Botão Principal: Amém / Entrar */}
              <button
                type="button"
                onClick={handleDismiss}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-stone-950 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 shadow-md shadow-amber-900/10 transition-all active:scale-95"
              >
                <span>Amém • Meditar na Palavra</span>
              </button>
            </div>

            {/* Checkbox Discreto: Não mostrar automaticamente hoje */}
            <div className="relative pt-4 mt-3 border-t border-amber-900/10 flex items-center justify-center">
              <label className="flex items-center gap-2 text-[11px] text-stone-500 hover:text-stone-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={dontShowAgainToday}
                  onChange={(e) => setDontShowAgainToday(e.target.checked)}
                  className="rounded accent-amber-700 w-3.5 h-3.5 cursor-pointer"
                />
                <span>Não abrir este aviso automaticamente hoje</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dedicado de Compartilhamento no WhatsApp */}
      <WhatsAppShareModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        reference={data.reference}
        version={data.version}
        text={data.text}
        themeTitle={data.themeTitle}
        reflectionText={data.reflection}
      />

      {/* Modal Dedicado de Compartilhamento no Instagram Stories */}
      <InstagramStoryModal
        isOpen={isInstagramOpen}
        onClose={() => setIsInstagramOpen(false)}
        reference={data.reference}
        version={data.version}
        text={data.text}
        themeTitle={data.themeTitle}
      />
    </>
  );
}
