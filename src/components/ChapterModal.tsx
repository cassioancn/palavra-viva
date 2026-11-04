"use client";

import React, { useEffect, useState } from "react";
import { X, BookOpen, Loader2 } from "lucide-react";
import { ChapterResult } from "@/lib/bible";

interface ChapterModalProps {
  isOpen: boolean;
  book: string;
  chapter: number;
  highlightStart?: number;
  highlightEnd?: number;
  version: "nvi" | "aa";
  onClose: () => void;
}

export function ChapterModal({
  isOpen,
  book,
  chapter,
  highlightStart = 1,
  highlightEnd = 1,
  version,
  onClose,
}: ChapterModalProps) {
  const [data, setData] = useState<ChapterResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !book || !chapter) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch(`/api/chapter?book=${encodeURIComponent(book)}&chapter=${chapter}&version=${version}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar capítulo");
        return res.json();
      })
      .then((resData: ChapterResult) => {
        if (isMounted) setData(resData);
      })
      .catch((err) => {
        if (isMounted) setError("Não foi possível carregar o capítulo.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, book, chapter, version]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl bg-sanctuary-900 border border-sanctuary-700 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sanctuary-700 bg-sanctuary-950/60">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-sacred-400" />
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-sacred-300">
              {book} — Capítulo {chapter} ({version.toUpperCase()})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-sanctuary-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 font-merriweather text-base sm:text-lg leading-loose text-slate-200">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
              <Loader2 className="w-7 h-7 animate-spin text-sacred-400" />
              <p className="text-sm font-sans">Carregando capítulo completo...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12 text-rose-400 text-sm font-sans">
              {error}
            </div>
          )}

          {!loading && data && (
            <div className="space-y-3">
              {data.verses.map((v) => {
                const isTarget = v.verse >= highlightStart && v.verse <= highlightEnd;
                return (
                  <p
                    key={v.verse}
                    className={`transition-colors rounded-lg px-3 py-1.5 ${
                      isTarget
                        ? "bg-sacred-500/15 border-l-4 border-sacred-400 text-sacred-100 font-semibold shadow-sm"
                        : "hover:bg-sanctuary-800/40"
                    }`}
                  >
                    <sup className="text-xs font-cinzel font-bold text-sacred-400 mr-2 select-none">
                      {v.verse}
                    </sup>
                    <span>{v.text}</span>
                  </p>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-sanctuary-700 bg-sanctuary-950/80 text-xs text-slate-400 flex items-center justify-between">
          <span>Versículos destacados em dourado fazem parte da passagem selecionada.</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-sanctuary-800 hover:bg-sanctuary-700 text-slate-200 font-sans text-xs transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
