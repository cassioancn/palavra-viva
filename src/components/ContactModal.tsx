"use client";

import React, { useState } from "react";
import { X, Mail, Copy, Check, MessageSquareHeart, Send, Heart } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/config";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Erro ao copiar e-mail:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-sanctuary-900 border border-sacred-500/30 shadow-2xl p-6 text-center space-y-5">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-sanctuary-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ícone */}
        <div className="mx-auto w-12 h-12 rounded-2xl bg-sacred-500/15 border border-sacred-500/30 flex items-center justify-center text-sacred-400">
          <MessageSquareHeart className="w-6 h-6" />
        </div>

        <div>
          <h3 className="font-cinzel text-lg sm:text-xl font-bold text-slate-100">
            Fale com a Nossa Equipe
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
            Seja para compartilhar um testemunho de como Deus falou ao seu coração, sugerir melhorias ou relatar qualquer dúvida técnica, ficaremos felizes em ouvir você.
          </p>
        </div>

        {/* Caixa de E-mail */}
        <div className="p-4 rounded-2xl bg-sanctuary-950 border border-sanctuary-750 text-left space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Canal Oficial de Atendimento:</span>
            <span className="text-emerald-400 font-semibold">Suporte Digital</span>
          </div>

          <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-sanctuary-900 border border-sanctuary-800 text-xs sm:text-sm font-mono text-slate-200 select-all">
            <span className="truncate">{CONTACT_EMAIL}</span>
            <button
              onClick={handleCopyEmail}
              className="shrink-0 p-1.5 rounded-lg bg-sacred-500/15 hover:bg-sacred-500/25 text-sacred-300 transition-colors"
              title="Copiar E-mail"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Ações */}
        <div className="space-y-2">
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Contato%20-%20Palavra%20Viva`}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-sacred-500 to-sacred-600 hover:from-sacred-400 hover:to-sacred-500 text-sanctuary-950 shadow-glow transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Enviar E-mail Agora</span>
          </a>

          <button
            onClick={handleCopyEmail}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold bg-sanctuary-800 hover:bg-sanctuary-750 text-slate-300 border border-sanctuary-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">E-mail Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copiar Endereço de E-mail</span>
              </>
            )}
          </button>
        </div>

        <p className="text-[11px] text-slate-500">
          Respondemos com carinho a todas as mensagens com a máxima brevidade.
        </p>
      </div>
    </div>
  );
}
