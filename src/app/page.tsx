"use client";

import React, { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { SentimentChips } from "@/components/SentimentChips";
import { VerseCard } from "@/components/VerseCard";
import { DevotionalTabs } from "@/components/DevotionalTabs";
import { ChapterModal } from "@/components/ChapterModal";
import { SettingsModal } from "@/components/SettingsModal";
import { PixDonationModal } from "@/components/PixDonationModal";
import { RecommendedBooks } from "@/components/RecommendedBooks";
import { HotmartFeaturedSection } from "@/components/HotmartFeaturedSection";
import { AdBanner } from "@/components/AdBanner";
import { Footer } from "@/components/Footer";
import { LegalModal, type LegalTab } from "@/components/LegalModal";
import { ContactModal } from "@/components/ContactModal";
import { MobileStickyBar } from "@/components/MobileStickyBar";
import { DailyVerseModal } from "@/components/DailyVerseModal";
import type { DailyVerseResult } from "@/lib/dailyVerse";
import {
  Sparkles,
  Send,
  Loader2,
  RotateCcw,
  AlertCircle,
  Heart,
  BookOpen,
  Search,
  RefreshCw,
} from "lucide-react";

export default function HomePage() {
  const [feeling, setFeeling] = useState("");
  const [searchMode, setSearchMode] = useState<"counsel" | "search">("counsel");
  const [version, setVersion] = useState<"nvi" | "aa">("nvi");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [currentThemeId, setCurrentThemeId] = useState<string | null>(null);
  const [seenReferences, setSeenReferences] = useState<string[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadingNextMain, setIsLoadingNextMain] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPixOpen, setIsPixOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isDailyVerseOpen, setIsDailyVerseOpen] = useState(false);
  const [dailyVerse, setDailyVerse] = useState<DailyVerseResult | null>(null);
  const [legalModal, setLegalModal] = useState<{
    isOpen: boolean;
    tab: LegalTab;
  }>({
    isOpen: false,
    tab: "disclaimer",
  });
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
  const searchInputRef = useRef<HTMLTextAreaElement>(null);

  const handleScrollToSearch = () => {
    searchInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    searchInputRef.current?.focus();
  };

  // Load version preference from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedVersion = localStorage.getItem("palavra_viva_version");
      if (savedVersion === "aa" || savedVersion === "nvi") {
        setVersion(savedVersion);
      }
    }
  }, []);

  // Busca a Passagem do Dia e abre o pop-up elegante na primeira visita do dia
  useEffect(() => {
    let isMounted = true;
    let timer: NodeJS.Timeout | null = null;

    const loadDailyVerse = async () => {
      try {
        const res = await fetch(`/api/daily-verse?version=${version}`);
        const data = await res.json();
        if (data && data.success && isMounted) {
          setDailyVerse(data);

          // Verifica se o usuário optou por não ver mais hoje
          const isDismissed =
            typeof window !== "undefined" &&
            localStorage.getItem(`pv_votd_dismissed_${data.dateKey}`);

          if (!isDismissed) {
            timer = setTimeout(() => {
              if (isMounted) {
                setIsDailyVerseOpen(true);
              }
            }, 800);
          }
        }
      } catch (err) {
        console.error("Erro ao carregar versículo do dia:", err);
      }
    };

    loadDailyVerse();

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [version]);

  const handleSaveSettings = (newVersion: "nvi" | "aa") => {
    setVersion(newVersion);
    if (typeof window !== "undefined") {
      localStorage.setItem("palavra_viva_version", newVersion);
    }
  };

  const executeSearch = async (textToSearch: string, themeIdOverride?: string) => {
    const query = textToSearch.trim();
    if (!query) return;

    setIsLoading(true);
    setErrorMsg(null);

    const activeTheme = themeIdOverride !== undefined ? themeIdOverride : currentThemeId;

    try {
      const res = await fetch("/api/counsel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feeling: query,
          themeId: activeTheme,
          version,
          mode: searchMode,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erro ao consultar as Escrituras.");
      }

      setResult(data);
      if (data.themeId) {
        setCurrentThemeId(data.themeId);
      }

      // Registra referências já vistas para evitar loops
      const currentRef = data.passage?.reference;
      const alts = (data.alternativePassages || []).map((a: any) => a.reference);
      setSeenReferences(Array.from(new Set([currentRef, ...alts].filter(Boolean))));

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

  const handleSelectAlternative = async (alt: any) => {
    if (!alt || !alt.reference) return;

    const previousPassage = result?.passage;
    const previousThemeTitle = result?.themeTitle;

    setSeenReferences((prev) => Array.from(new Set([...prev, alt.reference])));
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/counsel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feeling: alt.reference,
          version,
          mode: "search",
          excludeReferences: seenReferences,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Erro ao carregar a passagem selecionada.");
      }

      // Faz o swap inteligente: a passagem anterior vai para a lista de alternativas
      let newAlternatives = (result?.alternativePassages || []).filter(
        (a: any) => a.reference !== alt.reference
      );

      if (
        previousPassage &&
        !newAlternatives.some((a: any) => a.reference === previousPassage.reference)
      ) {
        newAlternatives = [
          {
            reference: previousPassage.reference,
            note: previousThemeTitle || "Passagem anterior",
            fullText: previousPassage.fullText,
            book: previousPassage.book,
            chapter: previousPassage.chapter,
            startVerse: previousPassage.startVerse,
            endVerse: previousPassage.endVerse,
          },
          ...newAlternatives,
        ];
      }

      setResult({
        ...data,
        themeId: result?.themeId,
        alternativePassages: newAlternatives.slice(0, 3),
      });

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao carregar versículo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchMorePassages = async () => {
    if (!result) return;
    setIsLoadingMore(true);

    try {
      const currentAlts = (result.alternativePassages || []).map((a: any) => a.reference);
      const allExcluded = Array.from(
        new Set([
          ...seenReferences,
          result.passage?.reference,
          ...currentAlts,
        ].filter(Boolean))
      );

      const res = await fetch("/api/more-passages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: feeling || result.themeTitle || result.passage?.reference,
          themeId: result.themeId,
          excludeReferences: allExcluded,
          version,
          limit: 3,
        }),
      });

      const data = await res.json();
      if (data.success && data.passages && data.passages.length > 0) {
        setResult((prev: any) => ({
          ...prev,
          alternativePassages: data.passages,
        }));
        const newRefs = data.passages.map((p: any) => p.reference);
        setSeenReferences((prev) => Array.from(new Set([...prev, ...newRefs])));
      }
    } catch (err) {
      console.error("Erro ao buscar mais passagens:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleFetchNextMainPassage = async () => {
    if (!result || isLoadingNextMain) return;
    setIsLoadingNextMain(true);
    setErrorMsg(null);

    try {
      const currentMainRef = result.passage?.reference;
      const currentAlts = (result.alternativePassages || []).map((a: any) => a.reference);
      const allExcluded = Array.from(
        new Set([
          ...seenReferences,
          currentMainRef,
          ...currentAlts,
        ].filter(Boolean))
      );

      const activeThemeId = result.themeId || currentThemeId;

      const res = await fetch("/api/counsel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feeling: feeling || result.themeTitle || currentMainRef,
          themeId: activeThemeId,
          version,
          mode: searchMode,
          excludeReferences: allExcluded,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Não encontramos outra passagem inédita para este contexto.");
      }

      // Passagem principal anterior vai para as alternativas para preservar o histórico
      let newAlternatives = (data.alternativePassages || []).filter(
        (a: any) => a.reference !== data.passage?.reference
      );

      if (
        result.passage &&
        !newAlternatives.some((a: any) => a.reference === currentMainRef)
      ) {
        newAlternatives = [
          {
            reference: result.passage.reference,
            note: result.themeTitle || "Passagem anterior",
            fullText: result.passage.fullText,
            book: result.passage.book,
            chapter: result.passage.chapter,
            startVerse: result.passage.startVerse,
            endVerse: result.passage.endVerse,
          },
          ...newAlternatives,
        ];
      }

      setResult({
        ...data,
        themeId: result.themeId || data.themeId,
        alternativePassages: newAlternatives.slice(0, 3),
      });

      if (data.themeId) {
        setCurrentThemeId(data.themeId);
      }

      const newMainRef = data.passage?.reference;
      const newAltRefs = newAlternatives.map((a: any) => a.reference);
      setSeenReferences((prev) =>
        Array.from(new Set([...prev, currentMainRef, newMainRef, ...newAltRefs].filter(Boolean)))
      );

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao buscar outra passagem.");
    } finally {
      setIsLoadingNextMain(false);
    }
  };

  const handleChipSelect = (query: string, themeId?: string) => {
    setFeeling(query);
    if (themeId) setCurrentThemeId(themeId);
    executeSearch(query, themeId);
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
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenPix={() => setIsPixOpen(true)}
        onOpenDailyVerse={() => setIsDailyVerseOpen(true)}
      />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8">
        {/* Mode Switcher Tabs */}
        <div className="flex items-center justify-center">
          <div className="inline-flex p-1 rounded-2xl bg-sanctuary-900 border border-sanctuary-700/80 shadow-inner">
            <button
              onClick={() => {
                setSearchMode("counsel");
                setErrorMsg(null);
              }}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                searchMode === "counsel"
                  ? "bg-gradient-to-r from-sacred-500 to-sacred-600 text-sanctuary-950 shadow-glow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Consolo & Oração</span>
            </button>

            <button
              onClick={() => {
                setSearchMode("search");
                setErrorMsg(null);
              }}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                searchMode === "search"
                  ? "bg-gradient-to-r from-sacred-500 to-sacred-600 text-sanctuary-950 shadow-glow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Encontrar Passagem na Bíblia</span>
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sacred-500/10 text-sacred-300 border border-sacred-500/20">
              <Sparkles className="w-3.5 h-3.5 text-sacred-400" />
              {searchMode === "search"
                ? "Localizador de Narrativas e Versículos Bíblicos"
                : "Consolo Autêntico • 100% Livre de Alucinações"}
            </div>

            {dailyVerse && (
              <button
                type="button"
                onClick={() => setIsDailyVerseOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/35 transition-all hover:scale-105 active:scale-95 shadow-sm"
                title="Abrir o Versículo do Dia"
              >
                <span>✨ Palavra de Hoje:</span>
                <strong className="text-amber-200 underline decoration-amber-400/50">
                  {dailyVerse.reference}
                </strong>
              </button>
            )}
          </div>

          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sacred-200 via-sacred-400 to-sacred-200">
            {searchMode === "search"
              ? "Encontre Qualquer Passagem na Bíblia"
              : "A Palavra que o seu Coração Precisa"}
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            {searchMode === "search"
              ? "Descreva uma história, cena, personagem, milagre, parábola ou tema que você procura e receba a passagem canônica exata das Escrituras com explicação rica."
              : "Diga como você se sente ou o que aflige sua alma. O Palavra Viva busca a passagem canônica exata das Escrituras e traz uma oração e reflexão de paz."}
          </p>
        </div>

        {/* Sentiment or Story Chips */}
        <SentimentChips
          mode={searchMode}
          onSelectSentiment={handleChipSelect}
          isLoading={isLoading}
        />

        {/* Input Card */}
        <div className="w-full rounded-2xl bg-sanctuary-900 border border-sanctuary-700/80 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="relative">
            <textarea
              ref={searchInputRef}
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              placeholder={
                searchMode === "search"
                  ? "Descreva o que você procura na Bíblia... (Ex: Davi e Golias, A multiplicação dos pães e peixes, Parábola do Filho Pródigo, A criação do mundo, Onde fala sobre a armadura de Deus, João 3:16...)"
                  : "Ou abra o seu coração livremente com suas próprias palavras... (Ex: Estou com muito medo de falhar no trabalho e não consigo dormir...)"
              }
              rows={4}
              disabled={isLoading}
              className="w-full resize-none rounded-xl bg-sanctuary-950/80 border border-sanctuary-700 focus:border-sacred-400 focus:ring-1 focus:ring-sacred-400 p-4 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 outline-none transition-all leading-relaxed"
            />
          </div>

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-sanctuary-950 to-sanctuary-900 border border-amber-500/35 shadow-lg space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-left">
                  <h4 className="text-sm font-cinzel font-bold text-amber-300">
                    Mensagem de Cuidado & Fé
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {errorMsg}
                  </p>
                  <p className="text-[11px] text-slate-400 italic">
                    "O Senhor é o meu pastor; de nada terei falta." — Salmos 23:1
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-sanctuary-800">
                <button
                  type="button"
                  onClick={() => executeSearch(feeling || "Salmos 23")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sacred-500/20 hover:bg-sacred-500/30 text-sacred-300 border border-sacred-500/30 transition-all active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Tentar Novamente</span>
                </button>
                <button
                  type="button"
                  onClick={() => executeSearch("Salmos 23")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sanctuary-800 hover:bg-sanctuary-750 text-slate-300 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-sacred-400" />
                  <span>Ler Salmo 23</span>
                </button>
              </div>
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
                  <span>
                    {searchMode === "search"
                      ? "Localizando nas Escrituras..."
                      : "Buscando na Palavra..."}
                  </span>
                </>
              ) : (
                <>
                  {searchMode === "search" ? (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Localizar Passagem Bíblica</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Buscar Palavra no Altar</span>
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        </div>

        {/* AdSense Top Slot (se configurado) */}
        <AdBanner slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP} />

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
                onFetchNextPassage={handleFetchNextMainPassage}
                isLoadingNext={isLoadingNextMain}
                reflectionText={result.pastoralReflection}
              />

              <DevotionalTabs
                pastoralReflection={result.pastoralReflection}
                historicalContext={result.historicalContext}
                guidedPrayer={result.guidedPrayer}
                practicalStep={result.practicalStep}
                alternativePassages={result.alternativePassages}
                onSelectAlternative={handleSelectAlternative}
                onFetchMorePassages={handleFetchMorePassages}
                isLoadingMore={isLoadingMore}
              />

              {/* Bloco de Destaque Hotmart: E-books Cristãos Recomendados */}
              <HotmartFeaturedSection />

              {/* Bloco de Monetização 1: Recomendações de Bíblias & Livros na Amazon */}
              <RecommendedBooks themeId={result.themeId} />

              {/* Bloco de Apoio Missionário via Pix */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-sacred-500/10 via-sanctuary-900 to-sanctuary-900 border border-sacred-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-cinzel font-bold text-sacred-300 text-sm sm:text-base flex items-center justify-center sm:justify-start gap-1.5">
                    <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
                    <span>Esta palavra abençoou o seu dia?</span>
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                    Ajude-nos a manter este projeto no ar com qualquer contribuição voluntária via Pix.
                  </p>
                </div>
                <button
                  onClick={() => setIsPixOpen(true)}
                  className="shrink-0 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-sacred-500 to-sacred-600 hover:from-sacred-400 hover:to-sacred-500 text-sanctuary-950 shadow-glow transition-all active:scale-95"
                >
                  Apoiar com Pix ❤️
                </button>
              </div>

              {/* AdSense Bottom Slot (se configurado) */}
              <AdBanner slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM} />
            </div>
          )}
        </div>
      </main>

      <Footer
        onOpenLegal={(tab) => setLegalModal({ isOpen: true, tab })}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenPix={() => setIsPixOpen(true)}
      />

      {/* Sticky CTA Mobile para Apoio Pix ou Nova Busca */}
      <MobileStickyBar
        onOpenPix={() => setIsPixOpen(true)}
        onScrollToSearch={handleScrollToSearch}
        hasResult={Boolean(result?.passage)}
      />

      {/* Modals */}
      <LegalModal
        isOpen={legalModal.isOpen}
        initialTab={legalModal.tab}
        onClose={() => setLegalModal((prev) => ({ ...prev, isOpen: false }))}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

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
        version={version}
        onSave={handleSaveSettings}
        onClose={() => setIsSettingsOpen(false)}
      />

      <PixDonationModal
        isOpen={isPixOpen}
        onClose={() => setIsPixOpen(false)}
      />

      {/* Pop-up Elegante da Passagem do Dia (Formato Social Story) */}
      <DailyVerseModal
        isOpen={isDailyVerseOpen}
        onClose={() => setIsDailyVerseOpen(false)}
        data={dailyVerse}
        onOpenChapter={handleOpenChapter}
        version={version}
      />
    </>
  );
}
