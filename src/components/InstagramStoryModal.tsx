"use client";

import React, { useState, useEffect } from "react";
import { X, Instagram, Download, Share2, Copy, Check, Sparkles, Loader2, ExternalLink } from "lucide-react";
import { generateVerseStoryImage } from "@/lib/storyImage";

interface InstagramStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  reference: string;
  version: string;
  text: string;
  themeTitle?: string;
}

export function InstagramStoryModal({
  isOpen,
  onClose,
  reference,
  version,
  text,
  themeTitle,
}: InstagramStoryModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [canShareFile, setCanShareFile] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    setIsGenerating(true);

    generateVerseStoryImage({
      reference,
      version,
      text,
      themeTitle,
    })
      .then((blob) => {
        if (!active) return;
        setImageBlob(blob);
        const url = URL.createObjectURL(blob);
        setImageUrl(url);

        // Check if Web Share API with files is supported
        if (typeof navigator !== "undefined" && navigator.canShare) {
          const testFile = new File([blob], "story.png", { type: "image/png" });
          if (navigator.canShare({ files: [testFile] })) {
            setCanShareFile(true);
          }
        }
      })
      .catch((err) => {
        console.error("Erro ao gerar card para Stories:", err);
      })
      .finally(() => {
        if (active) setIsGenerating(false);
      });

    return () => {
      active = false;
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [isOpen, reference, version, text, themeTitle]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `palavra-viva-${reference.toLowerCase().replace(/\s+/g, "-")}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShareMobile = async () => {
    if (!imageBlob) return;
    try {
      const file = new File([imageBlob], "palavra-viva-stories.png", {
        type: "image/png",
      });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Palavra Viva — ${reference}`,
          text: `"${text}" — ${reference} (${version})\n\nEncontre paz na Palavra de Deus:\nhttps://palavra-viva.cassio-contra.workers.dev`,
        });
      } else {
        handleDownload();
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Erro ao compartilhar:", err);
        handleDownload();
      }
    }
  };

  const handleCopyCaption = async () => {
    const caption = `✝️ "${text}"\n\n📖 ${reference} (${version})${
      themeTitle ? ` • ${themeTitle}` : ""
    }\n\nEncontre consolo e direção na Palavra de Deus:\n🔗 https://palavra-viva.cassio-contra.workers.dev\n\n#palavraviva #bibliasagrada #versiculododia #fe #deus #jesus #esperanca`;

    try {
      await navigator.clipboard.writeText(caption);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 3000);
    } catch (err) {
      console.error("Erro ao copiar legenda:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col md:flex-row gap-5 rounded-3xl bg-sanctuary-900 border border-sacred-500/30 shadow-2xl p-5 sm:p-6 overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-sanctuary-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Preview Card (9:16 Aspect Ratio) */}
        <div className="flex flex-col items-center justify-center shrink-0 w-full md:w-56 mx-auto">
          <div className="relative aspect-[9/16] w-48 sm:w-52 rounded-2xl overflow-hidden border-2 border-sacred-500/40 shadow-glow bg-sanctuary-950 flex items-center justify-center">
            {isGenerating || !imageUrl ? (
              <div className="flex flex-col items-center gap-2 text-sacred-300">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-xs">Criando Card...</span>
              </div>
            ) : (
              <img
                src={imageUrl}
                alt={`Card de ${reference}`}
                className="w-full h-full object-cover select-none"
              />
            )}
          </div>
          <span className="text-[11px] text-slate-400 mt-2 font-medium">
            Formato Stories (1080 × 1920)
          </span>
        </div>

        {/* Right Side: Actions & Instructions */}
        <div className="flex-1 flex flex-col justify-between space-y-4 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-500/20 text-pink-300 border border-pink-500/30 mb-2">
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram & Stories</span>
            </div>
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-sacred-200">
              Compartilhe esta Bênção
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
              Criamos uma arte exclusiva em alta resolução para você abençoar vidas através dos seus <strong>Stories</strong> ou <strong>Feed</strong>.
            </p>
          </div>

          <div className="space-y-2.5">
            {/* Primary Action Button */}
            {canShareFile ? (
              <button
                onClick={handleShareMobile}
                disabled={isGenerating || !imageUrl}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                <Instagram className="w-4 h-4" />
                <span>Postar no Instagram Stories</span>
              </button>
            ) : (
              <button
                onClick={handleDownload}
                disabled={isGenerating || !imageUrl}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Baixar Arte para Stories</span>
              </button>
            )}

            {/* Secondary Action: Copy Caption for Post */}
            <button
              onClick={handleCopyCaption}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-sanctuary-800 hover:bg-sanctuary-750 text-slate-200 border border-sanctuary-700 transition-colors active:scale-95"
            >
              {copiedCaption ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Legenda Copiada com Link!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-sacred-400" />
                  <span>Copiar Legenda Bíblica</span>
                </>
              )}
            </button>

            {/* Direct Link to Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-sanctuary-800/50 transition-colors"
            >
              <span>Abrir Instagram</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="p-3 rounded-xl bg-sanctuary-950/70 border border-sanctuary-800 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">💡 Como postar no Stories:</p>
            <p>1. No celular, clique no botão para enviar direto aos Stories ou baixe a foto.</p>
            <p>2. No Instagram, adicione o sticker de link apontando para o seu site!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

