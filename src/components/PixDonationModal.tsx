"use client";

import React, { useState, useEffect } from "react";
import { X, Heart, Copy, Check, QrCode, Loader2, Sparkles } from "lucide-react";
import { generatePixPayload, generatePixQrCode } from "@/lib/pix";
import { PIX_KEY, PIX_RECIPIENT } from "@/lib/config";

interface PixDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PixDonationModal({ isOpen, onClose }: PixDonationModalProps) {
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [pixPayload, setPixPayload] = useState<string>("");
  const [isLoadingQr, setIsLoadingQr] = useState<boolean>(true);

  const pixKey = process.env.NEXT_PUBLIC_PIX_KEY || PIX_KEY;
  const pixRecipient = process.env.NEXT_PUBLIC_PIX_NAME || PIX_RECIPIENT;

  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    setIsLoadingQr(true);

    try {
      const payload = generatePixPayload(pixKey, "Palavra Viva", "BRASIL");
      setPixPayload(payload);

      generatePixQrCode(payload)
        .then((url) => {
          if (active) {
            setQrCodeUrl(url);
            setIsLoadingQr(false);
          }
        })
        .catch((err) => {
          console.error("Erro ao gerar QR Code Pix:", err);
          if (active) setIsLoadingQr(false);
        });
    } catch (err) {
      console.error("Erro ao montar payload Pix:", err);
      setIsLoadingQr(false);
    }

    return () => {
      active = false;
    };
  }, [isOpen, pixKey]);

  if (!isOpen) return null;

  const handleCopyPayload = async () => {
    if (!pixPayload) return;
    try {
      await navigator.clipboard.writeText(pixPayload);
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 3000);
    } catch (err) {
      console.error("Erro ao copiar Pix Copia e Cola:", err);
    }
  };

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 3000);
    } catch (err) {
      console.error("Erro ao copiar Chave Pix:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl bg-sanctuary-900 border border-sacred-500/30 shadow-2xl p-5 sm:p-6 text-center space-y-4">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-sanctuary-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ícone e Título */}
        <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-sacred-400 to-sacred-600 flex items-center justify-center shadow-glow text-sanctuary-950 font-bold text-2xl select-none">
          ❤️
        </div>

        <div>
          <h3 className="font-cinzel text-lg sm:text-xl font-bold text-sacred-200">
            Apoie esta Missão Digital
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
            O <strong>Palavra Viva</strong> é mantido com amor para levar a Palavra de Deus a quem precisa. Ajude-nos a mantê-lo online com qualquer oferta voluntária!
          </p>
        </div>

        {/* QR Code Pix */}
        <div className="flex flex-col items-center justify-center pt-1">
          <div className="relative p-3 rounded-2xl bg-white shadow-xl border-2 border-sacred-500/40 flex items-center justify-center w-52 h-52">
            {isLoadingQr || !qrCodeUrl ? (
              <div className="flex flex-col items-center gap-2 text-sanctuary-800">
                <Loader2 className="w-8 h-8 animate-spin text-sacred-600" />
                <span className="text-xs font-semibold text-slate-600">Gerando QR Code...</span>
              </div>
            ) : (
              <img
                src={qrCodeUrl}
                alt="QR Code Pix - Palavra Viva"
                className="w-full h-full object-contain select-none"
              />
            )}
          </div>
          <span className="text-[11px] text-sacred-300 font-semibold mt-2 flex items-center gap-1.5">
            <QrCode className="w-3.5 h-3.5 text-sacred-400" />
            <span>Aponte a câmera no app do seu banco</span>
          </span>
        </div>

        {/* Botão Copiar Pix Copia e Cola (Padrão Banco Central) */}
        <button
          onClick={handleCopyPayload}
          disabled={!pixPayload}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-sacred-500 to-sacred-600 hover:from-sacred-400 hover:to-sacred-500 text-sanctuary-950 shadow-glow transition-all active:scale-95 disabled:opacity-50"
        >
          {copiedPayload ? (
            <>
              <Check className="w-4 h-4 text-sanctuary-950" />
              <span>Código Pix Copiado! Deus o abençoe!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copiar Pix Copia e Cola</span>
            </>
          )}
        </button>

        {/* Bloco Chave Aleatória Direta */}
        <div className="p-3 rounded-xl bg-sanctuary-950/80 border border-sanctuary-800 text-left space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Ou copie a Chave Aleatória:</span>
            <span className="text-emerald-400 font-semibold">{pixRecipient}</span>
          </div>

          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-sanctuary-900 border border-sanctuary-750 text-xs font-mono text-slate-300 select-all">
            <span className="truncate">{pixKey}</span>
            <button
              onClick={handleCopyKey}
              className="shrink-0 p-1.5 rounded-md bg-sacred-500/15 hover:bg-sacred-500/25 text-sacred-300 transition-colors"
              title="Copiar Chave Aleatória"
            >
              {copiedKey ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 leading-tight">
          Toda oferta voluntária é destinada exclusivamente aos custos de servidores, hospedagem e expansão da palavra.
        </p>
      </div>
    </div>
  );
}
