"use client";

import React, { useState } from "react";
import {
  X,
  Shield,
  FileText,
  AlertTriangle,
  PhoneCall,
  ExternalLink,
  CheckCircle2,
  Heart,
} from "lucide-react";
import { CVV_PHONE, CVV_URL } from "@/lib/config";

export type LegalTab = "terms" | "privacy" | "disclaimer";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

export function LegalModal({
  isOpen,
  onClose,
  initialTab = "disclaimer",
}: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-sanctuary-900 border border-sacred-500/30 shadow-2xl overflow-hidden text-left">
        {/* Header do Modal */}
        <div className="p-5 sm:p-6 border-b border-sanctuary-750 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sacred-500/10 text-sacred-400 border border-sacred-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-slate-100">
                Transparência & Conformidade
              </h3>
              <p className="text-xs text-slate-400">
                Compromisso com o sigilo, a ética e a sua segurança
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-sanctuary-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas */}
        <div className="flex border-b border-sanctuary-750 bg-sanctuary-950/60 px-4 sm:px-6 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("disclaimer")}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "disclaimer"
                ? "border-amber-400 text-amber-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Apoio Emocional (CVV 188)</span>
          </button>

          <button
            onClick={() => setActiveTab("privacy")}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "privacy"
                ? "border-sacred-400 text-sacred-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Shield className="w-4 h-4 text-sacred-400" />
            <span>Privacidade & LGPD</span>
          </button>

          <button
            onClick={() => setActiveTab("terms")}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "terms"
                ? "border-sacred-400 text-sacred-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-4 h-4 text-sacred-400" />
            <span>Termos de Uso</span>
          </button>
        </div>

        {/* Conteúdo com rolagem */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-h-[60vh]">
          {activeTab === "disclaimer" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Alerta Destacado CVV */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm sm:text-base">
                  <Heart className="w-5 h-5 text-amber-400 fill-amber-400/30" />
                  <span>Você não está sozinho. Há ajuda imediata e gratuita!</span>
                </div>
                <p className="text-slate-200 leading-relaxed">
                  Se você ou alguém que você conhece está passando por uma crise emocional profunda, pensamentos de desesperança ou sofrimento agudo, por favor, busque apoio profissional agora mesmo.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a
                    href={`tel:${CVV_PHONE}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm bg-amber-500 hover:bg-amber-400 text-sanctuary-950 transition-all active:scale-95 shadow-md"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Ligue 188 (CVV - Gratuito 24h)</span>
                  </a>
                  <a
                    href={CVV_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-sanctuary-800 hover:bg-sanctuary-750 text-slate-200 border border-sanctuary-700 transition-colors"
                  >
                    <span>Acessar Chat cvv.org.br</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-slate-100 text-sm">
                  1. Natureza Estritamente Devocional e Religiosa
                </h4>
                <p>
                  O <strong>Palavra Viva</strong> é um projeto sem fins lucrativos de evangelização digital e apoio devocional cristão. As reflexões e orações são recursos espirituais de fé baseados nas Sagradas Escrituras (Bíblia Sagrada).
                </p>
                <p>
                  <strong>Isenção Médica e Psicológica:</strong> Este serviço <strong>não constitui, não substitui e não deve ser utilizado</strong> como diagnóstico médico, psicoterapia, atendimento psiquiátrico ou acompanhamento profissional de saúde mental. Sempre consulte profissionais de saúde qualificados para suas necessidades clínicas.
                </p>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed">
                  <strong>Sigilo dos seus Sentimentos:</strong> Seus desabafos e buscas são confidenciais. Nunca vendemos, compartilhamos ou repassamos seus textos para anunciantes ou terceiros.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-slate-100 text-sm">
                  1. Conformidade com a LGPD (Lei nº 13.709/2018)
                </h4>
                <p>
                  O Palavra Viva adota o princípio de <em>Privacy by Design</em> e minimização de dados. Nós não solicitamos seu nome completo, telefone, CPF, endereço ou qualquer dado pessoal sensível para a leitura das Escrituras.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-slate-100 text-sm">
                  2. Dados de Sessão e Preferências Locais
                </h4>
                <p>
                  Armazenamos apenas no seu próprio navegador (via <code>localStorage</code>) a sua preferência de tradução bíblica (NVI ou Almeida Atualizada). Esse dado nunca sai do seu dispositivo.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-slate-100 text-sm">
                  3. Transparência na Inteligência Pastoral
                </h4>
                <p>
                  As consultas realizadas passam por motores canônicos de correspondência bíblica local e, quando aplicável, pelo modelo Gemini para enriquecimento pastoral estritamente bíblico, sem retenção de identificadores pessoais.
                </p>
              </div>
            </div>
          )}

          {activeTab === "terms" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-100 text-sm">
                  1. Aceitação dos Termos
                </h4>
                <p>
                  Ao acessar e utilizar o site <strong>palavra-vivallm.com.br</strong>, você declara estar de acordo com estes termos de uso e com os princípios devocionais e éticos aqui expostos.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-slate-100 text-sm">
                  2. Uso Adequado e Respeitoso
                </h4>
                <p>
                  A ferramenta é disponibilizada gratuitamente para consolo pessoal, oração, estudo bíblico e evangelização. É vedado o uso da plataforma para fins ilícitos, discursos de ódio, tentativas de invasão ou qualquer finalidade contrária à moral cristã.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-slate-100 text-sm">
                  3. Textos Bíblicos e Propriedade Intelectual
                </h4>
                <p>
                  As citações das Escrituras Sagradas são utilizadas com reverência em domínio público e/ou fair use devocional. Os códigos, marcas e elementos gráficos do Palavra Viva pertencem aos mantenedores do projeto.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-slate-100 text-sm">
                  4. Doações Voluntárias
                </h4>
                <p>
                  Todas as contribuições via Pix são ofertas espontâneas destinadas exclusivamente à manutenção de servidores, domínios e ampliação da mensagem do Evangelho, sem constituir relação contratual de prestação de serviços.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer do Modal */}
        <div className="p-4 sm:p-5 border-t border-sanctuary-750 bg-sanctuary-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Atualizado em 2026 • Palavra Viva
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm bg-sanctuary-800 hover:bg-sanctuary-750 text-slate-200 border border-sanctuary-700 transition-colors"
          >
            Entendido e Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
