"use client";

import React, { useState } from "react";
import { X, Heart, Copy, Check, QrCode, Sparkles } from "lucide-react";

interface PixDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PixDonationModal({ isOpen, onClose }: PixDonationModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const pixKey =
    process.env.NEXT_PUBLIC_PIX_KEY || "seu-pix-aqui@exemplo.com";
  const pixRecipient =
    process.env.NEXT_PUBLIC_PIX_NAME || "Projeto Palavra Viva";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Erro ao copiar Pix:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-sanctuary-900 border border-sacred-500/30 shadow-2xl overflow-hidden p-6 text-center space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-sanctuary-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-sacred-400 to-sacred-600 flex items-center justify-center shadow-glow text-sanctuary-950 font-bold text-2xl">
          ❤️
        </div>

        <div>
          <h3 className="font-cinzel text-xl font-bold text-sacred-300">
            Apoie esta Missão Digital
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
            O <strong>Palavra Viva</strong> é mantido com amor para levar alento bíblico diário a milhares de pessoas. Se este site tocou seu coração, ajude-nos a mantê-lo online com qualquer valor via Pix!
          </p>
        </div>

        {/* Pix Box */}
        <div className="p-4 rounded-xl bg-sanctuary-950 border border-sanctuary-700 text-left space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Chave Pix:</span>
            <span className="text-emerald-400 font-semibold">{pixRecipient}</span>
          </div>

          <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-sanctuary-900 border border-sanctuary-800 text-xs sm:text-sm font-mono text-slate-200 break-all select-all">
            <span>{pixKey}</span>
            <button
              onClick={handleCopy}
              className="shrink-0 p-1.5 rounded-md bg-sacred-500/20 hover:bg-sacred-500/30 text-sacred-300 transition-colors"
              title="Copiar Chave"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-sacred-500 to-sacred-600 hover:from-sacred-400 hover:to-sacred-500 text-sanctuary-950 shadow-glow transition-all active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Chave Pix Copiada! Que Deus o abençoe!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copiar Chave Pix</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-slate-500">
          Toda oferta voluntária é destinada exclusivamente aos custos de hospedagem, servidores e expansão do projeto.
        </p>
      </div>
    </div>
  );
}

