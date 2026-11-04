"use client";

import React, { useState } from "react";
import { X, Key, BookCheck, ShieldCheck, ExternalLink } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  apiKey: string;
  version: "nvi" | "aa";
  onSave: (newKey: string, newVersion: "nvi" | "aa") => void;
  onClose: () => void;
}

export function SettingsModal({
  isOpen,
  apiKey,
  version,
  onSave,
  onClose,
}: SettingsModalProps) {
  const [localKey, setLocalKey] = useState(apiKey);
  const [localVersion, setLocalVersion] = useState<"nvi" | "aa">(version);

  if (!isOpen) return null;

  const handleSaveAndClose = () => {
    onSave(localKey.trim(), localVersion);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-sanctuary-900 border border-sanctuary-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sanctuary-700 bg-sanctuary-950/60">
          <h3 className="font-cinzel text-lg font-bold text-sacred-300">
            Configurações do Palavra Viva
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-sanctuary-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-sm text-slate-300">
          {/* Tradução da Bíblia */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Tradução da Bíblia Sagrada
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLocalVersion("nvi")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  localVersion === "nvi"
                    ? "border-sacred-400 bg-sacred-500/10 text-sacred-200 shadow-sm"
                    : "border-sanctuary-700 bg-sanctuary-800/40 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="font-bold text-sm">NVI</div>
                <div className="text-xs text-slate-400 mt-0.5">Nova Versão Internacional (Moderna)</div>
              </button>

              <button
                type="button"
                onClick={() => setLocalVersion("aa")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  localVersion === "aa"
                    ? "border-sacred-400 bg-sacred-500/10 text-sacred-200 shadow-sm"
                    : "border-sanctuary-700 bg-sanctuary-800/40 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="font-bold text-sm">AA</div>
                <div className="text-xs text-slate-400 mt-0.5">Almeida Atualizada (Clássica)</div>
              </button>
            </div>
          </div>

          {/* Chave de API Google Gemini */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Chave da API Google Gemini (Opcional)
              </label>
              <a
                href="https://aistudio.google.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:underline"
              >
                Pegar Chave Grátis <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <input
              type="password"
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              placeholder="Cole sua chave AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-sanctuary-950 border border-sanctuary-700 focus:border-sacred-400 focus:ring-1 focus:ring-sacred-400 text-slate-100 placeholder:text-slate-600 text-sm outline-none transition-colors"
            />
            <p className="text-[11px] text-slate-400 mt-1.5">
              Fica salva apenas no seu navegador. O Google AI Studio oferece 15 requisições por minuto 100% gratuitas.
            </p>
          </div>

          {/* Garantia Anti-Alucinação */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex gap-3 text-xs leading-relaxed text-emerald-200">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-emerald-300 font-semibold mb-1">
                Garantia de Autenticidade Bíblica
              </strong>
              Nenhum versículo é inventado por inteligência artificial. Todos os textos sagrados são extraídos e validados diretamente da nossa base canônica local de 62.191 versículos.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-sanctuary-700 bg-sanctuary-950/80 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-sanctuary-800 hover:bg-sanctuary-700 text-slate-300 text-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveAndClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-sacred-500 to-sacred-600 hover:from-sacred-400 hover:to-sacred-500 text-sanctuary-950 font-bold text-sm shadow-glow transition-all active:scale-95"
          >
            Salvar Preferências
          </button>
        </div>
      </div>
    </div>
  );
}
