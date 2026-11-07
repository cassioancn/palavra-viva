"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Download,
  Copy,
  Check,
  Loader2,
  ExternalLink,
  MessageCircle,
  Share2,
  Heart,
  Sparkles,
} from "lucide-react";
import { generateVerseStoryImage } from "@/lib/storyImage";

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  reference: string;
  version: string;
  text: string;
  themeTitle?: string;
  reflectionText?: string;
}

export function WhatsAppShareModal({
  isOpen,
  onClose,
  reference,
  version,
  text,
  themeTitle,
  reflectionText,
}: WhatsAppShareModalProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [includeReflection, setIncludeReflection] = useState(true);
  const [canShareFiles, setCanShareFiles] = useState(false);

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

        if (typeof navigator !== "undefined" && navigator.canShare) {
          const testFile = new File([blob], "versiculo.png", { type: "image/png" });
          if (navigator.canShare({ files: [testFile] })) {
            setCanShareFiles(true);
          }
        }
      })
      .catch((err) => {
        console.error("Erro ao gerar card para WhatsApp:", err);
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

  const buildMessage = () => {
    let msg = `✝️ *PALAVRA VIVA*\n\n"${text}"\n\n📖 *${reference} (${version.toUpperCase()})*`;
    if (themeTitle) {
      msg += `\n✨ _${themeTitle}_`;
    }
    if (includeReflection && reflectionText) {
      const cleanReflection =
        reflectionText.length > 300
          ? reflectionText.substring(0, 290) + "..."
          : reflectionText;
      msg += `\n\n💬 *Mensagem para o seu coração:*\n${cleanReflection}`;
    }
    msg += `\n\n🙏 _Que esta palavra de Deus encha a sua vida de paz, fé e consolo hoje!_`;
    return msg;
  };

  const handleShareMobileWithImage = async () => {
    if (!imageBlob) return;
    try {
      const file = new File(
        [imageBlob],
        `palavra-viva-${reference.toLowerCase().replace(/\s+/g, "-")}.png`,
        { type: "image/png" }
      );

      const msg = buildMessage();

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Palavra Viva — ${reference}`,
          text: msg,
        });
      } else {
        handleSendTextWhatsApp();
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error("Erro ao compartilhar no WhatsApp:", err);
        handleSendTextWhatsApp();
      }
    }
  };

  const handleSendTextWhatsApp = () => {
    const msg = buildMessage();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `palavra-viva-${reference.toLowerCase().replace(/\s+/g, "-")}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(buildMessage());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Falha ao copiar:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col md:flex-row gap-5 rounded-3xl bg-sanctuary-900 border border-emerald-500/30 shadow-2xl p-5 sm:p-6 overflow-y-auto">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-sanctuary-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lado Esquerdo: Preview da Arte (9:16) */}
        <div className="flex flex-col items-center justify-center shrink-0 w-full md:w-56 mx-auto">
          <div className="relative aspect-[9/16] w-48 sm:w-52 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-glow bg-sanctuary-950 flex items-center justify-center">
            {isGenerating || !imageUrl ? (
              <div className="flex flex-col items-center gap-2 text-emerald-300">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-xs">Criando Arte...</span>
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
            Arte para WhatsApp & Status
          </span>
        </div>

        {/* Lado Direito: Ações & Mensagem */}
        <div className="flex-1 flex flex-col justify-between space-y-4 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#25D366]/20 text-emerald-300 border border-[#25D366]/30 mb-2">
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp • Mensagem & Arte</span>
            </div>
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-slate-100">
              Abençoe Alguém no WhatsApp
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
              Compartilhe a imagem sagrada ilustrada junto de uma palavra de consolo e reflexão para amigos, família ou grupos.
            </p>
          </div>

          {/* Opção de incluir Reflexão Pastoral */}
          {reflectionText && (
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-sanctuary-950/80 border border-sanctuary-750 text-xs text-slate-300 cursor-pointer select-none hover:border-emerald-500/40 transition-colors">
              <input
                type="checkbox"
                checked={includeReflection}
                onChange={(e) => setIncludeReflection(e.target.checked)}
                className="rounded accent-emerald-500 w-4 h-4 cursor-pointer"
              />
              <span>Incluir reflexão pastoral e palavra de consolo na mensagem</span>
            </label>
          )}

          <div className="space-y-2.5">
            {/* Ação Principal: Compartilhar com Imagem (Mobile) */}
            {canShareFiles ? (
              <button
                onClick={handleShareMobileWithImage}
                disabled={isGenerating || !imageUrl}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-[#25D366] hover:bg-[#20bd5a] text-sanctuary-950 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
              >
                <Share2 className="w-4 h-4" />
                <span>Enviar Imagem + Mensagem no WhatsApp</span>
              </button>
            ) : (
              <button
                onClick={handleSendTextWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-[#25D366] hover:bg-[#20bd5a] text-sanctuary-950 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Abrir WhatsApp com Mensagem Completa</span>
              </button>
            )}

            {/* Ação Secundária: Baixar Imagem (ideal para PC / WhatsApp Web ou salvar) */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownload}
                disabled={isGenerating || !imageUrl}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold bg-sanctuary-800 hover:bg-sanctuary-750 text-slate-200 border border-sanctuary-700 transition-colors active:scale-95 disabled:opacity-50"
                title="Baixar imagem para arrastar no WhatsApp Web"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Baixar Arte</span>
              </button>

              <button
                onClick={handleCopyMessage}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold bg-sanctuary-800 hover:bg-sanctuary-750 text-slate-200 border border-sanctuary-700 transition-colors active:scale-95"
                title="Copiar texto completo"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copiar Texto</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-sanctuary-950/70 border border-sanctuary-800 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-emerald-300">💡 Como enviar no WhatsApp:</p>
            <p>• <strong>No celular:</strong> O botão acima abre o WhatsApp com a imagem e a mensagem prontas para envio.</p>
            <p>• <strong>No computador:</strong> Clique em "Baixar Arte" para enviar a foto e use o botão de mensagem para o texto.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

