"use client";

import React, { useState } from "react";

export interface SentimentOption {
  id: string;
  emoji: string;
  label: string;
  tone?: "positive" | "comfort";
  query: string;
  queries: string[];
}

export const POPULAR_SENTIMENTS: SentimentOption[] = [
  // Sentimentos Positivos: Agradecer, Celebrar & Sentir-se Feliz
  {
    id: "gratidao_louvor",
    emoji: "🙌",
    label: "Gratidão & Louvor",
    tone: "positive",
    query: "Quero agradecer a Deus por tantas bênçãos, vitórias e pelo Seu amor fiel na minha vida.",
    queries: [
      "Quero agradecer a Deus por tantas bênçãos, vitórias e pelo Seu amor fiel na minha vida.",
      "Meu coração transborda de gratidão pelas portas que o Senhor abriu para mim.",
      "Hoje eu só quero louvar e bendizer o nome do Senhor por Sua infinita bondade.",
      "Celebro os livramentos e a fidelidade de Deus em cada detalhe da minha jornada.",
    ],
  },
  {
    id: "alegria_felicidade",
    emoji: "😊",
    label: "Alegria & Felicidade",
    tone: "positive",
    query: "Estou me sentindo muito feliz hoje e quero celebrar essa alegria na presença de Deus.",
    queries: [
      "Estou me sentindo muito feliz hoje e quero celebrar essa alegria na presença de Deus.",
      "Meu coração está radiante e cheio de júbilo pelas boas notícias que recebi.",
      "Quero meditar em versículos bíblicos de alegria e regozijo pelo dia maravilhoso que estou vivendo.",
      "Estou muito contente e quero manter a verdadeira alegria do Senhor transbordando em mim.",
    ],
  },
  {
    id: "vitoria_conquista",
    emoji: "🏆",
    label: "Vitória & Conquista",
    tone: "positive",
    query: "Conquistei uma vitória importante e quero dedicar esse triunfo e honra a Deus.",
    queries: [
      "Conquistei uma vitória importante e quero dedicar esse triunfo e honra a Deus.",
      "Deus abriu uma grande porta na minha vida e quero celebrar essa conquista com a Palavra.",
      "Venci uma etapa difícil e reconheço que foi a mão poderosa do Senhor que me deu vitória.",
      "Estou realizado com uma bênção alcançada e quero agradecer ao Deus dos Exércitos.",
    ],
  },
  {
    id: "paz_serenidade",
    emoji: "🕊️",
    label: "Paz & Serenidade",
    tone: "positive",
    query: "Sinto uma paz maravilhosa no coração hoje e quero meditar na tranquilidade de Deus.",
    queries: [
      "Sinto uma paz maravilhosa no coração hoje e quero meditar na tranquilidade de Deus.",
      "Meu espírito está sereno, leve e descansado nos braços do Senhor.",
      "Quero ler passagens bíblicas sobre paz interior, calma e harmonia em Cristo.",
      "Estou vivendo um momento de serenidade e quero nutrir essa calmaria santa na alma.",
    ],
  },
  {
    id: "amor_familia",
    emoji: "❤️",
    label: "Amor & Família",
    tone: "positive",
    query: "Quero abençoar minha família, meu casamento e celebrar o amor que Deus nos deu.",
    queries: [
      "Quero abençoar minha família, meu casamento e celebrar o amor que Deus nos deu.",
      "Sinto o coração cheio de amor pelas pessoas queridas ao meu redor e quero orar pelo meu lar.",
      "Quero versículos sobre o amor verdadeiro, união familiar e bênçãos sobre a nossa casa.",
      "Sou muito grato pela minha família e peço a Deus que continue fortalecendo nossos laços.",
    ],
  },

  // Sentimentos de Consolo, Busca & Direção
  {
    id: "ansiedade_futuro",
    emoji: "😰",
    label: "Ansiedade & Medo",
    tone: "comfort",
    query: "Estou me sentindo muito ansioso, com medo do futuro e com o peito apertado.",
    queries: [
      "Estou me sentindo muito ansioso, com medo do futuro e com o peito apertado.",
      "Minha mente não para de se preocupar com o amanhã e preciso da paz de Deus.",
      "Sinto uma angústia profunda e incertezas sobre o que vai acontecer na minha vida.",
      "Preciso de consolo bíblico para acalmar os pensamentos acelerados e o pânico no coração.",
    ],
  },
  {
    id: "luto_tristeza_perda",
    emoji: "💔",
    label: "Luto & Saudade",
    tone: "comfort",
    query: "Perdi alguém muito importante e sinto uma dor imensa de saudade e tristeza.",
    queries: [
      "Perdi alguém muito importante e sinto uma dor imensa de saudade e tristeza.",
      "O luto está pesado na minha alma e preciso sentir o abraço consolador de Deus.",
      "Estou chorando muito pela partida de quem amo e meu coração está em pedaços.",
      "Como encontrar forças nas Escrituras para superar a dor de uma perda irreparável?",
    ],
  },
  {
    id: "cansaco_esgotamento",
    emoji: "🔋",
    label: "Cansaço & Exaustão",
    tone: "comfort",
    query: "Estou esgotado e sobrecarregado, sinto que não tenho mais forças para continuar.",
    queries: [
      "Estou esgotado e sobrecarregado, sinto que não tenho mais forças para continuar.",
      "Minha mente e meu corpo estão no limite, preciso do descanso que só Jesus dá.",
      "Carrego fardos pesados demais e me sinto fraco e sem ânimo para o dia a dia.",
      "Peço a Deus refrigério e renovação espiritual para prosseguir na caminhada.",
    ],
  },
  {
    id: "solidao_abandono",
    emoji: "🍂",
    label: "Solidão & Abandono",
    tone: "comfort",
    query: "Estou me sentindo sozinho, abandonado e incompreendido pelas pessoas ao meu redor.",
    queries: [
      "Estou me sentindo sozinho, abandonado e incompreendido pelas pessoas ao meu redor.",
      "Sinto um vazio doloroso e a sensação de que ninguém se importa comigo.",
      "Preciso me lembrar de que Deus nunca me abandona mesmo quando me sinto isolado.",
      "Onde encontrar o acolhimento e a presença de Deus no silêncio da solidão?",
    ],
  },
  {
    id: "perdao_magoa",
    emoji: "🌿",
    label: "Preciso Perdoar",
    tone: "comfort",
    query: "Fui magoado e traído profundamente, preciso de força para liberar o perdão e ter paz.",
    queries: [
      "Fui magoado e traído profundamente, preciso de força para liberar o perdão e ter paz.",
      "Quero arrancar a raiz de amargura e ressentimento que está ferindo minha alma.",
      "Preciso da graça de Deus para conseguir perdoar quem me ofendeu injustamente.",
      "Como ser livre da mágoa e restaurar a paz no coração através da Palavra?",
    ],
  },
  {
    id: "culpa_arrependimento",
    emoji: "😔",
    label: "Culpa & Perdão",
    tone: "comfort",
    query: "Errei e me sinto indigno e com vergonha. Preciso do perdão e da misericórdia de Deus.",
    queries: [
      "Errei e me sinto indigno e com vergonha. Preciso do perdão e da misericórdia de Deus.",
      "Reconheço meus pecados e busco a purificação e a segunda chance do Senhor.",
      "O peso da culpa está me esmagando e clamo pela graça restauradora de Cristo.",
      "Quero recomeçar em comunhão com Deus, livre da condenação e do remorso.",
    ],
  },
  {
    id: "sabedoria_direcao",
    emoji: "🧭",
    label: "Dúvida & Decisão",
    tone: "comfort",
    query: "Estou diante de uma encruzilhada e preciso de sabedoria divina para tomar a decisão certa.",
    queries: [
      "Estou diante de uma encruzilhada e preciso de sabedoria divina para tomar a decisão certa.",
      "Não sei qual caminho escolher e peço a direção do Espírito Santo para minha vida.",
      "Estou confuso com o rumo a tomar e busco o discernimento das Escrituras.",
      "Senhor, aplaina minhas veredas e mostra com clareza o passo que devo dar.",
    ],
  },
  {
    id: "enfermidade_cura",
    emoji: "🩹",
    label: "Enfermidade & Dor",
    tone: "comfort",
    query: "Estou enfrentando uma doença e peço a Deus cura, renovação de forças e alívio para o meu corpo.",
    queries: [
      "Estou enfrentando uma doença e peço a Deus cura, renovação de forças e alívio para o meu corpo.",
      "O diagnóstico me assustou, mas creio no poder do Médico dos médicos para restaurar minha saúde.",
      "Sinto dores e fraqueza física; clamo pelo toque restaurador do Senhor sobre minha vida.",
      "Peço paciência, fé inabalável e a manifestação da cura divina sobre a minha enfermidade.",
    ],
  },
  {
    id: "financeiro_provisao",
    emoji: "🌾",
    label: "Finanças & Provisão",
    tone: "comfort",
    query: "As contas estão apertadas e estou preocupado com o sustento da minha família.",
    queries: [
      "As contas estão apertadas e estou preocupado com o sustento da minha família.",
      "Estou enfrentando dívidas e aperto financeiro; preciso da provisão e das janelas abertas de Deus.",
      "Estou desempregado ou sem renda suficiente e busco novas portas abertas pelo Senhor.",
      "Como encontrar paz e confiar no Deus Provedor em tempos de crise e escassez?",
    ],
  },
  {
    id: "fe_esperanca_desanimo",
    emoji: "🔥",
    label: "Crise de Fé & Esperança",
    tone: "comfort",
    query: "Minha fé está fraca e sinto vontade de desistir. Preciso que Deus renove a minha esperança.",
    queries: [
      "Minha fé está fraca e sinto vontade de desistir. Preciso que Deus renove a minha esperança.",
      "Sinto um desânimo espiritual profundo e preciso de um renovo no meu coração.",
      "Minhas forças acabaram e clamo para que Deus reacenda a chama da minha fé.",
      "Ajuda-me na minha incredulidade e faz-me crer novamente nas Tuas promessas.",
    ],
  },
];

export const POPULAR_STORIES: SentimentOption[] = [
  {
    id: "davi_golias",
    emoji: "⚔️",
    label: "Davi e Golias",
    query: "Davi e Golias no Vale de Elá derrotando o gigante",
    queries: [
      "Davi e Golias no Vale de Elá derrotando o gigante",
      "Como Davi venceu o gigante Golias com fé e uma funda",
    ],
  },
  {
    id: "filho_prodigo",
    emoji: "🏃",
    label: "O Filho Pródigo",
    query: "A parábola do Filho Pródigo que voltou arrependido ao pai",
    queries: [
      "A parábola do Filho Pródigo que voltou arrependido ao pai",
      "O amor do pai acolhendo o filho perdido em Lucas 15",
    ],
  },
  {
    id: "armadura_deus",
    emoji: "🛡️",
    label: "Armadura de Deus",
    query: "A armadura de Deus para a batalha espiritual em Efésios 6",
    queries: [
      "A armadura de Deus para a batalha espiritual em Efésios 6",
      "O escudo da fé, o capacete da salvação e a espada do Espírito",
    ],
  },
  {
    id: "criacao_mundo",
    emoji: "🌍",
    label: "A Criação do Mundo",
    query: "A criação dos céus e da terra e o princípio de tudo em Gênesis",
    queries: [
      "A criação dos céus e da terra e o princípio de tudo em Gênesis",
      "No princípio Deus criou os céus e a terra em Gênesis 1",
    ],
  },
  {
    id: "mar_vermelho",
    emoji: "🌊",
    label: "Mar Vermelho",
    query: "Moisés abrindo o Mar Vermelho pelo poder de Deus no Êxodo",
    queries: [
      "Moisés abrindo o Mar Vermelho pelo poder de Deus no Êxodo",
      "O povo de Israel atravessando o mar a pé enxuto",
    ],
  },
  {
    id: "bom_samaritano",
    emoji: "🩹",
    label: "O Bom Samaritano",
    query: "A parábola do Bom Samaritano que cuidou do homem ferido",
    queries: [
      "A parábola do Bom Samaritano que cuidou do homem ferido",
      "Quem é o meu próximo na parábola de Jesus em Lucas 10",
    ],
  },
];

interface SentimentChipsProps {
  onSelectSentiment: (query: string, themeId?: string) => void;
  isLoading: boolean;
  mode?: "counsel" | "search";
}

export function SentimentChips({
  onSelectSentiment,
  isLoading,
  mode = "counsel",
}: SentimentChipsProps) {
  const [clickCounts, setClickCounts] = useState<Record<string, number>>({});
  const isSearchMode = mode === "search";

  const handleClick = (item: SentimentOption) => {
    const count = clickCounts[item.id] || 0;
    const queries = item.queries && item.queries.length > 0 ? item.queries : [item.query];
    const chosenQuery = queries[count % queries.length];
    setClickCounts((prev) => ({ ...prev, [item.id]: count + 1 }));
    onSelectSentiment(chosenQuery, item.id);
  };

  if (isSearchMode) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Histórias e Passagens Bíblicas Populares (Toque para ver):
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {POPULAR_STORIES.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              disabled={isLoading}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-sanctuary-800/90 hover:bg-sanctuary-700/80 text-slate-300 hover:text-sacred-300 border border-sanctuary-600/70 hover:border-sacred-500/40 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              <span className="text-sm transition-transform group-hover:scale-110">
                {item.emoji}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const positiveSentiments = POPULAR_SENTIMENTS.filter((s) => s.tone === "positive");
  const comfortSentiments = POPULAR_SENTIMENTS.filter((s) => s.tone !== "positive");

  return (
    <div className="w-full space-y-3.5">
      {/* Sentimentos Positivos: Celebrar, Agradecer & Regozijar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300/90 flex items-center gap-1">
            <span>✨ Para Agradecer, Celebrar & Alegrar o Coração:</span>
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {positiveSentiments.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              disabled={isLoading}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 hover:text-amber-100 border border-amber-500/30 hover:border-amber-400/60 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-sm"
            >
              <span className="text-sm transition-transform group-hover:scale-110">
                {item.emoji}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sentimentos de Consolo, Força & Direção */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            🌿 Para Buscar Consolo, Força & Direção:
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {comfortSentiments.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              disabled={isLoading}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-sanctuary-800/90 hover:bg-sanctuary-700/80 text-slate-300 hover:text-sacred-300 border border-sanctuary-600/70 hover:border-sacred-500/40 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              <span className="text-sm transition-transform group-hover:scale-110">
                {item.emoji}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
