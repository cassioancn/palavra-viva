"use client";

import React, { useState } from "react";
import { X, ShieldCheck, BookOpen } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  version: "nvi" | "aa";
  onSave: (newVersion: "nvi" | "aa") => void;
  onClose: () => void;
}

export function SettingsModal({
  isOpen,
  version,
  onSave,
  onClose,
}: SettingsModalProps) {
  const [localVersion, setLocalVersion] = useState<"nvi" | "aa">(version);

  if (!isOpen) return null;

  const handleSaveAndClose = () => {
    onSave(localVersion);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-sanctuary-900 border border-sanctuary-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sanctuary-700 bg-sanctuary-950/60">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sacred-400" />
            <h3 className="font-cinzel text-lg font-bold text-sacred-300">
              Tradução da Bíblia
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-sanctuary-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-sm text-slate-300">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              Escolha a Versão das Escrituras
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={() => setLocalVersion("nvi")}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  localVersion === "nvi"
                    ? "border-sacred-400 bg-sacred-500/10 text-sacred-200 shadow-sm"
                    : "border-sanctuary-700 bg-sanctuary-800/40 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-slate-100">NVI — Nova Versão Internacional</div>
                  <div className="text-xs text-slate-400 mt-0.5">Linguagem fluida, contemporânea e clara</div>
                </div>
                {localVersion === "nvi" && (
                  <span className="w-2.5 h-2.5 rounded-full bg-sacred-400" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setLocalVersion("aa")}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  localVersion === "aa"
                    ? "border-sacred-400 bg-sacred-500/10 text-sacred-200 shadow-sm"
                    : "border-sanctuary-700 bg-sanctuary-800/40 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-slate-100">AA — Almeida Atualizada</div>
                  <div className="text-xs text-slate-400 mt-0.5">Linguagem clássica, solene e tradicional</div>
                </div>
                {localVersion === "aa" && (
                  <span className="w-2.5 h-2.5 rounded-full bg-sacred-400" />
                )}
              </button>
            </div>
          </div>

          {/* Garantia Anti-Alucinação */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex gap-3 text-xs leading-relaxed text-emerald-200">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-emerald-300 font-semibold mb-1">
                Garantia Canônica de Autenticidade
              </strong>
              Todos os versículos são verificados e extraídos diretamente da base canônica sagrada de 62.191 versículos.
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
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
