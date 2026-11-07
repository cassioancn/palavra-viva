"use client";

import React from "react";
import { Heart, ShieldCheck, Mail, FileText, LifeBuoy } from "lucide-react";
import { SITE_DOMAIN, CONTACT_EMAIL, CVV_PHONE } from "@/lib/config";
import type { LegalTab } from "./LegalModal";

interface FooterProps {
  onOpenLegal: (tab: LegalTab) => void;
  onOpenContact: () => void;
  onOpenPix: () => void;
}

export function Footer({ onOpenLegal, onOpenContact, onOpenPix }: FooterProps) {
  return (
    <footer className="w-full border-t border-sanctuary-800 bg-sanctuary-950/90 py-10 text-center text-xs text-slate-500 mt-auto pb-20 md:pb-10">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-6">
        {/* Navigation Links */}
        <nav
          aria-label="Links Institucionais e Legais"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs text-slate-400 font-medium"
        >
          <button
            onClick={() => onOpenLegal("disclaimer")}
            className="hover:text-amber-300 transition-colors flex items-center gap-1 text-amber-400/90"
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Apoio Emocional (CVV {CVV_PHONE})</span>
          </button>

          <span className="text-sanctuary-750 hidden sm:inline">•</span>

          <button
            onClick={() => onOpenLegal("privacy")}
            className="hover:text-sacred-300 transition-colors flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacidade & LGPD</span>
          </button>

          <span className="text-sanctuary-750 hidden sm:inline">•</span>

          <button
            onClick={() => onOpenLegal("terms")}
            className="hover:text-sacred-300 transition-colors flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Termos de Uso</span>
          </button>

          <span className="text-sanctuary-750 hidden sm:inline">•</span>

          <button
            onClick={onOpenContact}
            className="hover:text-sacred-300 transition-colors flex items-center gap-1"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Fale Conosco</span>
          </button>

          <span className="text-sanctuary-750 hidden sm:inline">•</span>

          <button
            onClick={onOpenPix}
            className="hover:text-sacred-300 transition-colors flex items-center gap-1 text-sacred-400 font-semibold"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Apoiar Projeto</span>
          </button>
        </nav>

        {/* Disclaimer Highlight */}
        <div className="max-w-2xl px-4 py-2.5 rounded-xl bg-sanctuary-900/60 border border-sanctuary-800 text-[11px] text-slate-400 leading-relaxed">
          <strong className="text-slate-300">Nota de Cuidado:</strong> Este aplicativo oferece reflexões pastorais e consolo bíblico por meio de inteligência artificial e não substitui acompanhamento psicológico, psiquiátrico ou médico. Em momentos de crise severa, ligue gratuitamente para o <strong>CVV pelo telefone {CVV_PHONE}</strong> (24 horas, gratuito).
        </div>

        {/* Copyright and Canonical Info */}
        <div className="flex flex-col items-center gap-1.5 text-slate-500">
          <p className="flex items-center gap-1 text-slate-400">
            <span>{SITE_DOMAIN} — Desenvolvido com</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>para levar consolo e esperança</span>
          </p>
          <p className="text-[11px] text-slate-600">
            Textos bíblicos em domínio público e uso devocional. Todos os direitos reservados © {new Date().getFullYear()}.
          </p>
        </div>
      </div>
    </footer>
  );
}
