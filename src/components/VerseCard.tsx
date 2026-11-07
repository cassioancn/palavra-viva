"use client";

import React, { useState, useEffect } from "react";
import {
  Volume2,
  VolumeX,
  Share2,
  Copy,
  Check,
  BookOpen,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Instagram,
  MessageCircle,
} from "lucide-react";
import { InstagramStoryModal } from "./InstagramStoryModal";
import { WhatsAppShareModal } from "./WhatsAppShareModal";

interface VerseCardProps {
  reference: string;
  version: string;
  fullText: string;
  themeTitle: string;
  book: string;
  chapter: number;
  isAiGenerated: boolean;
  onOpenChapter: (book: string, chapter: number) => void;
  onFetchNextPassage?: () => void;
  isLoadingNext?: boolean;
  reflectionText?: string;
}

export function VerseCard({
  reference,
  version,
  fullText,
  themeTitle,
  book,
  chapter,
  isAiGenerated,
  onOpenChapter,
  onFetchNextPassage,
  isLoadingNext = false,
  reflectionText,
}: VerseCardProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isInstagramOpen, setIsInstagramOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSpeechSupported(true);
    }
  }, []);

  // Web Speech API Voice synthesis
  const handleToggleAudio = () => {
    if (!speechSupported) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean brackets like [6] [7] for smooth reading
    const cleanText = fullText.replace(/\[\d+\]/g, "").trim();
    const utterance = new SpeechSynthesisUtterance(
      `${reference}. ${cleanText}`
    );
    utterance.lang = "pt-BR";
    utterance.rate = 0.95; // slightly slower, peaceful cadence
    utterance.pitch = 1.0;

    // Pick a Portuguese voice if available
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(
      (v) => v.lang.startsWith("pt") || v.lang.includes("BR")
    );
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleCopy = async () => {
    try {
      const textToCopy = `"${fullText}"\n\n— ${reference} (${version})\nPalavra Viva ✝️`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Falha ao copiar:", err);
    }
  };

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-sanctuary-800 to-sanctuary-900 border border-sacred-500/30 p-6 sm:p-8 shadow-glow-lg transition-all duration-300">
      {/* Top Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="font-cinzel inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-sacred-500/15 text-sacred-300 border border-sacred-500/30">
            📖 {reference} • {version}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Verificado
          </span>
        </div>

        {themeTitle && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400 bg-sanctuary-700/50 px-2.5 py-1 rounded-md border border-sanctuary-600/50">
              Tema: <strong className="text-slate-200">{themeTitle}</strong>
            </span>
            {onFetchNextPassage && (
              <button
                onClick={onFetchNextPassage}
                disabled={isLoadingNext}
                className="inline-flex sm:hidden items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold text-sacred-300 bg-sacred-500/10 border border-sacred-500/30 hover:bg-sacred-500/20 active:scale-95 disabled:opacity-50"
                title="Buscar outra passagem para este tema"
              >
                <RotateCcw className={`w-3 h-3 ${isLoadingNext ? "animate-spin text-sacred-400" : ""}`} />
                <span>Outra</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Scripture Text */}
      <div className="relative my-4">
        <span className="absolute -top-8 -left-3 font-cinzel text-6xl text-sacred-500/15 select-none pointer-events-none">
          “
        </span>
        <blockquote className="font-merriweather text-lg sm:text-2xl leading-relaxed sm:leading-loose text-slate-100 italic pl-3 sm:pl-4 border-l-2 border-sacred-500/40">
          {fullText}
        </blockquote>
      </div>

      {/* Reference Footer */}
      <div className="text-right font-cinzel text-sm sm:text-base font-semibold text-sacred-400 mt-4 mb-6">
        — {reference} ({version})
      </div>

      <div className="border-t border-sanctuary-700/60 pt-4 flex flex-wrap items-center justify-between gap-3">
        {/* Audio Player, Chapter & Next Passage Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {speechSupported && (
            <button
              onClick={handleToggleAudio}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isPlayingAudio
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
                  : "bg-sanctuary-700/80 hover:bg-sanctuary-700 text-slate-200 hover:text-sacred-300 border border-sanctuary-600"
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4 text-amber-400" />
                  <span>Pausar Voz</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-sacred-400" />
                  <span>Ouvir Passagem</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => onOpenChapter(book, chapter)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-sanctuary-700/60 hover:bg-sanctuary-700 text-slate-300 hover:text-white border border-sanctuary-600 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span>Capítulo Completo</span>
          </button>

          {/* Botão de Buscar Outra Passagem no Card Principal */}
          {onFetchNextPassage && (
            <button
              type="button"
              onClick={onFetchNextPassage}
              disabled={isLoadingNext}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-sacred-500/15 hover:bg-sacred-500/25 text-sacred-300 hover:text-sacred-200 border border-sacred-500/40 shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              title="Buscar outro versículo bíblico principal para esta mesma situação"
            >
              <RotateCcw className={`w-4 h-4 text-sacred-400 ${isLoadingNext ? "animate-spin" : ""}`} />
              <span>{isLoadingNext ? "Buscando..." : "Buscar outra passagem"}</span>
            </button>
          )}
        </div>

        {/* Share & Copy Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-sanctuary-700/60 hover:bg-sanctuary-700 text-slate-300 hover:text-white border border-sanctuary-600 transition-colors"
            title="Copiar versículo"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copiar</span>
              </>
            )}
          </button>

          {/* Botão WhatsApp com Modal de Compartilhamento Dedicado */}
          <button
            onClick={() => setIsWhatsAppOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#25D366]/90 hover:bg-[#25D366] text-sanctuary-950 shadow-sm transition-all hover:scale-105 active:scale-95"
            title="Compartilhar Imagem e Mensagem no WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={() => setIsInstagramOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white shadow-sm transition-all hover:scale-105 active:scale-95"
            title="Compartilhar no Instagram & Stories"
          >
            <Instagram className="w-4 h-4" />
            <span>Instagram</span>
          </button>
        </div>
      </div>

      {/* WhatsApp Share Modal */}
      <WhatsAppShareModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        reference={reference}
        version={version}
        text={fullText}
        themeTitle={themeTitle}
        reflectionText={reflectionText}
      />

      {/* Instagram Story Modal */}
      <InstagramStoryModal
        isOpen={isInstagramOpen}
        onClose={() => setIsInstagramOpen(false)}
        reference={reference}
        version={version}
        text={fullText}
        themeTitle={themeTitle}
      />
    </div>
  );
}
