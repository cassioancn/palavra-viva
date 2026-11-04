"use client";

import React, { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { SentimentChips } from "@/components/SentimentChips";
import { VerseCard } from "@/components/VerseCard";
import { DevotionalTabs } from "@/components/DevotionalTabs";
import { ChapterModal } from "@/components/ChapterModal";
import { SettingsModal } from "@/components/SettingsModal";
import { Footer } from "@/components/Footer";
import { Sparkles, Send, Loader2, RotateCcw, AlertCircle } from "lucide-react";

export default function HomePage() {
  const [feeling, setFeeling] = useState("");
  const [version, setVersion] = useState<"nvi" | "aa">("nvi");
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [chapterModal, setChapterModal] = useState<{
    isOpen: boolean;
    book: string;
    chapter: number;
    start: number;
    end: number;
  }>({
    isOpen: false,
    book: "",
    chapter: 1,
    start: 1,
    end: 1,
  });

  const resultRef = useRef<HTMLDivElement>(null);

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedVersion = localStorage.getItem("palavra_viva_version");
      if (savedVersion === "aa" || savedVersion === "nvi") {
        setVersion(savedVersion);
      }
      const savedKey = localStorage.getItem("palavra_viva_gemini_key");
      if (savedKey) {
        setApiKey(savedKey);
      }
    }
  }, []);

  const handleSaveSettings = (newKey: string, newVersion: "nvi" | "aa") => {
    setApiKey(newKey);
    setVersion(newVersion);
    if (typeof window !== "undefined") {
      localStorage.setItem("palavra_viva_gemini_key", newKey);
      localStorage.setItem("palavra_viva_version", newVersion);
    }
  };

  const executeSearch = async (textToSearch: string) => {
    const query = textToSearch.trim();
    if (!query) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/counsel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feeling: query,
          version,
          apiKey: apiKey || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erro ao consultar as Escrituras.");
      }

      setResult(data);

      // Smooth scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err: any) {
      setErrorMsg(err.message || "Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipSelect = (query: string) => {
    setFeeling(query);
    executeSearch(query);
  };

  const handleOpenChapter = (book: string, chapter: number) => {
    setChapterModal({
      isOpen: true,
      book,
      chapter,
      start: result?.passage?.startVerse || 1,
      end: result?.passage?.endVerse || 1,
    });
  };

  return (
    <>
      <Header
        version={version}
        hasCustomKey={Boolean(apiKey)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8">
        {/* Hero Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sacred-500/10 text-sacred-300 border border-sacred-500/20">
            <Sparkles className="w-3.5 h-3.5 text-sacred-400" />
            Consolo Autêntico • 100% Livre de Alucinações
          </div>

          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sacred-200 via-sacred-400 to-sacred-200">
            A Palavra que o seu Coração Precisa
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Diga como você se sente ou o que aflige sua alma. O Palavra Viva busca
            a passagem canônica exata das Escrituras e traz uma oração e reflexão de paz.
          </p>
        </div>

        {/* Sentiment Chips */}
        <SentimentChips onSelectSentiment={handleChipSelect} isLoading={isLoading} />

        {/* Input Card */}
        <div className="w-full rounded-2xl bg-sanctuary-900 border border-sanctuary-700/80 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="relative">
            <textarea
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              placeholder="Ou abra o seu coração livremente com suas próprias palavras... (Ex: Estou com muito medo de falhar no trabalho e não consigo dormir...)"
              rows={4}
              disabled={isLoading}
              className="w-full resize-none rounded-xl bg-sanctuary-950/80 border border-sanctuary-700 focus:border-sacred-400 focus:ring-1 focus:ring-sacred-400 p-4 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 outline-none transition-all leading-relaxed"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs sm:text-sm text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                setFeeling("");
                setResult(null);
                setErrorMsg(null);
              }}
              disabled={isLoading || !feeling}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-sanctuary-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>

            <button
              type="button"
              onClick={() => executeSearch(feeling)}
              disabled={isLoading || !feeling.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm sm:text-base bg-gradient-to-r from-sacred-500 to-sacred-600 hover:from-sacred-400 hover:to-sacred-500 text-sanctuary-950 shadow-glow hover:shadow-glow-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Buscando na Palavra...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Buscar Palavra no Altar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result Area */}
        <div ref={resultRef}>
          {result && result.passage && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <VerseCard
                reference={result.passage.reference}
                version={result.passage.version}
                fullText={result.passage.fullText}
                themeTitle={result.themeTitle}
                book={result.passage.book}
                chapter={result.passage.chapter}
                isAiGenerated={result.isAiGenerated}
                onOpenChapter={handleOpenChapter}
              />

              <DevotionalTabs
                pastoralReflection={result.pastoralReflection}
                historicalContext={result.historicalContext}
                guidedPrayer={result.guidedPrayer}
                practicalStep={result.practicalStep}
                alternativePassages={result.alternativePassages}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Modals */}
      <ChapterModal
        isOpen={chapterModal.isOpen}
        book={chapterModal.book}
        chapter={chapterModal.chapter}
        highlightStart={chapterModal.start}
        highlightEnd={chapterModal.end}
        version={version}
        onClose={() => setChapterModal((prev) => ({ ...prev, isOpen: false }))}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        apiKey={apiKey}
        version={version}
        onSave={handleSaveSettings}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
