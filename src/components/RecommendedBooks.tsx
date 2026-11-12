"use client";

import React from "react";
import { BookOpen, ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";
import { AMAZON_ASSOCIATE_TAG, AMAZON_DISCLOSURE } from "@/lib/config";

interface BookRecommendation {
  title: string;
  author: string;
  description: string;
  category: string;
  amazonQuery: string;
  coverEmoji: string;
}

const THEME_BOOK_MAP: Record<string, BookRecommendation[]> = {
  ansiedade_futuro: [
    {
      title: "Ansiedade: O Fim do Medo",
      author: "Max Lucado",
      description: "Descubra como trocar o desespero e a inquietação pela paz sobrenatural prometida por Deus.",
      category: "Cura Emocional",
      amazonQuery: "Ansiedade+Max+Lucado",
      coverEmoji: "🌿",
    },
    {
      title: "Bíblia de Estudo NVI (Capa Luxo)",
      author: "Editora Vida",
      description: "Uma das Bíblias de estudo mais consagradas do Brasil, com notas profundas e linguagem moderna.",
      category: "Bíblia de Estudo",
      amazonQuery: "Biblia+de+Estudo+NVI",
      coverEmoji: "📖",
    },
  ],
  luto_tristeza_perda: [
    {
      title: "A Anatomia de uma Dor",
      author: "C.S. Lewis",
      description: "O relato mais sincero e consolador de Lewis sobre a dor da perda e o abraço de Deus no luto.",
      category: "Consolo no Luto",
      amazonQuery: "A+Anatomia+de+uma+Dor+CS+Lewis",
      coverEmoji: "🕯️",
    },
    {
      title: "O Deus de Toda Consolação",
      author: "Dee Brestin",
      description: "Como encontrar refúgio nos braços do Pai nas estações mais difíceis e escuras da vida.",
      category: "Devocional",
      amazonQuery: "Deus+de+Toda+Consolacao",
      coverEmoji: "🤍",
    },
  ],
  cansaco_esgotamento: [
    {
      title: "A Eliminação Implacável da Pressa",
      author: "John Mark Comer",
      description: "Como permanecer emocionalmente saudável e espiritualmente vivo no caos do mundo moderno.",
      category: "Descanso na Alma",
      amazonQuery: "A+Eliminacao+Implacavel+da+Pressa",
      coverEmoji: "🕊️",
    },
    {
      title: "Aliviando a Bagagem",
      author: "Max Lucado",
      description: "Como descarregar os fardos que você nunca foi feito para carregar à luz do Salmo 23.",
      category: "Renovação",
      amazonQuery: "Aliviando+a+Bagagem+Max+Lucado",
      coverEmoji: "🎒",
    },
  ],
  solidao_abandono: [
    {
      title: "O Deus que Me Vê",
      author: "Kathie Lee Gifford",
      description: "Jornada bíblica reconfortante revelando que Deus nunca nos abandona no deserto.",
      category: "Acolhimento Divino",
      amazonQuery: "O+Deus+que+Me+Ve",
      coverEmoji: "🌅",
    },
    {
      title: "Bíblia Letra Grande com Harpa Cristã",
      author: "SBB / CPAD",
      description: "Edição devocional clássica ideal para momentos de recolhimento, meditação e oração a sós com Deus.",
      category: "Bíblia Devocional",
      amazonQuery: "Biblia+Sagrada+Letra+Grande+Harpa",
      coverEmoji: "📖",
    },
  ],
  gratidao_louvor: [
    {
      title: "Mil Presentes: Um Guia de Gratidão",
      author: "Ann Voskamp",
      description: "Uma celebração profunda sobre como a gratidão diária desperta nossos olhos para a graça de Deus.",
      category: "Gratidão & Fé",
      amazonQuery: "Mil+Presentes+Ann+Voskamp",
      coverEmoji: "✨",
    },
    {
      title: "Graça: Mais Que Merecemos, Maior Que Imaginamos",
      author: "Max Lucado",
      description: "Um mergulho tocante na generosidade incondicional do amor de Cristo por nossas vidas.",
      category: "Inspiração",
      amazonQuery: "Graca+Max+Lucado",
      coverEmoji: "🎁",
    },
  ],
  perdao_magoa: [
    {
      title: "Perdoar e Esquecer",
      author: "Lewis B. Smedes",
      description: "Cura para as feridas mais profundas do coração quando o perdão parece humanamente impossível.",
      category: "Cura do Coração",
      amazonQuery: "Perdoar+e+Esquecer+Lewis+Smedes",
      coverEmoji: "❤️‍🩹",
    },
    {
      title: "As 5 Linguagens do Perdão",
      author: "Gary Chapman",
      description: "Como restaurar relacionamentos partidos, pedir desculpas com sinceridade e libertar o passado.",
      category: "Relacionamentos",
      amazonQuery: "As+5+Linguagens+do+Perdao+Gary+Chapman",
      coverEmoji: "🤝",
    },
  ],
  culpa_arrependimento: [
    {
      title: "O Deus Pródigo",
      author: "Timothy Keller",
      description: "Recupere o coração da fé cristã através da parábola que revela a graça escandalosa de Deus.",
      category: "Graça & Redenção",
      amazonQuery: "O+Deus+Prodigo+Timothy+Keller",
      coverEmoji: "🌱",
    },
    {
      title: "Cristianismo Puro e Simples",
      author: "C.S. Lewis",
      description: "A defesa mais célebre e lúcida da fé e do perdão redentor de Cristo para toda a humanidade.",
      category: "Clássico Cristão",
      amazonQuery: "Cristianismo+Puro+e+Simples+CS+Lewis",
      coverEmoji: "✝️",
    },
  ],
  sabedoria_direcao: [
    {
      title: "Manhã e Noite (Devocional)",
      author: "Charles Spurgeon",
      description: "Meditações ricas para orientar seus passos nas primeiras horas da manhã e ao deitar.",
      category: "Sabedoria Diária",
      amazonQuery: "Devocional+Manha+e+Noite+Spurgeon",
      coverEmoji: "🧭",
    },
    {
      title: "Bíblia de Estudo NAA (Almeida)",
      author: "Sociedade Bíblica do Brasil",
      description: "A clássica tradução Almeida em edição especial de estudo com mapas, notas temáticas e concordância.",
      category: "Bíblia de Estudo",
      amazonQuery: "Biblia+de+Estudo+NAA",
      coverEmoji: "📖",
    },
  ],
  enfermidade_cura: [
    {
      title: "O Poder da Oração nos Momentos Difíceis",
      author: "Stormie Omartian",
      description: "Orações poderosas para clamar pela cura do corpo, descanso da mente e restauração espiritual.",
      category: "Oração e Saúde",
      amazonQuery: "O+Poder+da+Oracao+nos+Momentos+Dificeis+Stormie",
      coverEmoji: "🕊️",
    },
    {
      title: "Esperança para o Coração Aflito",
      author: "Billy Graham",
      description: "Palavras de força, conforto e confiança no poder soberano de Deus diante da dor e fragilidade física.",
      category: "Fortalecimento",
      amazonQuery: "Esperanca+para+o+Coracao+Aflito+Billy+Graham",
      coverEmoji: "🩹",
    },
  ],
  financeiro_provisao: [
    {
      title: "A Transformação Total do seu Dinheiro",
      author: "Dave Ramsey",
      description: "Princípios práticos e bíblicos para sair das dívidas, construir reserva e viver com generosidade.",
      category: "Mordomia Bíblica",
      amazonQuery: "A+Transformacao+Total+do+Seu+Dinheiro+Dave+Ramsey",
      coverEmoji: "📊",
    },
    {
      title: "Bíblia de Estudo NVI (Capa Luxo)",
      author: "Editora Vida",
      description: "Bíblia com comentários sobre provisão, fidelidade e sabedoria em todas as áreas da vida.",
      category: "Bíblia de Estudo",
      amazonQuery: "Biblia+de+Estudo+NVI",
      coverEmoji: "📖",
    },
  ],
  fe_esperanca_desanimo: [
    {
      title: "O Peso da Glória",
      author: "C.S. Lewis",
      description: "Sermões luminosos que renovam nossa visão da eternidade e o propósito celestial de nossas vidas.",
      category: "Esperança Cristã",
      amazonQuery: "O+Peso+da+Gloria+CS+Lewis",
      coverEmoji: "👑",
    },
    {
      title: "O Conhecimento do Santo",
      author: "A.W. Tozer",
      description: "Descubra a majestade de Deus e permita que Sua grandeza restaure sua confiança e vigor espiritual.",
      category: "Clássico da Fé",
      amazonQuery: "O+Conhecimento+do+Santo+AW+Tozer",
      coverEmoji: "🔥",
    },
  ],
  alegria_felicidade: [
    {
      title: "Surpreendido pela Alegria",
      author: "C.S. Lewis",
      description: "A clássica obra em que C.S. Lewis narra como a busca pelo verdadeiro júbilo o conduziu a Deus.",
      category: "Alegria Cristã",
      amazonQuery: "Surpreendido+pela+Alegria+CS+Lewis",
      coverEmoji: "☀️",
    },
    {
      title: "Desperte seu Coração com Gratidão",
      author: "Ann Voskamp",
      description: "Um convite poético e transformador para enxergar a graça e a beleza de Deus no cotidiano.",
      category: "Vida Devocional",
      amazonQuery: "Mil+Presentes+Ann+Voskamp",
      coverEmoji: "🌻",
    },
  ],
  vitoria_conquista: [
    {
      title: "Uma Vida com Propósitos",
      author: "Rick Warren",
      description: "Descubra como viver conquistas com significado eterno e alinhar seus passos ao plano de Deus.",
      category: "Propósito Cristão",
      amazonQuery: "Uma+Vida+com+Propositos+Rick+Warren",
      coverEmoji: "🏆",
    },
    {
      title: "O Peregrino",
      author: "John Bunyan",
      description: "A jornada inspiradora de perseverança e vitória pela fé rumo à Cidade Celestial.",
      category: "Clássico da Fé",
      amazonQuery: "O+Peregrino+John+Bunyan",
      coverEmoji: "⚔️",
    },
  ],
  paz_serenidade: [
    {
      title: "Tudo Vai Ficar Bem",
      author: "Max Lucado",
      description: "Reflexões serenas sobre descansar o coração nas promessas de paz que excedem todo entendimento.",
      category: "Paz Interior",
      amazonQuery: "Max+Lucado+paz",
      coverEmoji: "🕊️",
    },
    {
      title: "A Prática da Presença de Deus",
      author: "Irmão Lourenço",
      description: "Um tesouro espiritual sobre cultivar quietude, paz e comunhão constante com Deus no dia a dia.",
      category: "Espiritualidade Cristã",
      amazonQuery: "A+Pratica+da+Presenca+de+Deus+Irmao+Lourenco",
      coverEmoji: "✨",
    },
  ],
  amor_familia: [
    {
      title: "As Cinco Linguagens do Amor",
      author: "Gary Chapman",
      description: "Princípios práticos para fortalecer o amor, a escuta e a unidade no casamento e na família.",
      category: "Família & Relacionamentos",
      amazonQuery: "As+Cinco+Linguagens+do+Amor+Gary+Chapman",
      coverEmoji: "🏡",
    },
    {
      title: "O Amor que Não Se Acaba",
      author: "Timothy Keller & Kathy Keller",
      description: "Uma visão bíblica profunda sobre aliança, serviço mútuo e a beleza do lar edificado em Cristo.",
      category: "Casamento & Lar",
      amazonQuery: "O+Significado+do+Casamento+Timothy+Keller",
      coverEmoji: "❤️",
    },
  ],
  default: [
    {
      title: "Café com Deus Pai (Devocional Diário)",
      author: "Junior Rostirola",
      description: "O devocional cristão diário número 1 do Brasil para começar suas manhãs na presença de Deus.",
      category: "Devocional Diário",
      amazonQuery: "Cafe+com+Deus+Pai",
      coverEmoji: "☕",
    },
    {
      title: "Bíblia de Estudo NAA (Almeida)",
      author: "Sociedade Bíblica do Brasil",
      description: "A clássica tradução Almeida em edição especial de estudo com mapas, concordância e notas.",
      category: "Bíblia de Estudo",
      amazonQuery: "Biblia+de+Estudo+NAA",
      coverEmoji: "📖",
    },
  ],
};

interface RecommendedBooksProps {
  themeId?: string;
}

export function RecommendedBooks({ themeId }: RecommendedBooksProps) {
  const amazonTag = AMAZON_ASSOCIATE_TAG;
  const books = (themeId && THEME_BOOK_MAP[themeId]) || THEME_BOOK_MAP["default"];

  const buildAmazonUrl = (query: string) => {
    return `https://www.amazon.com.br/s?k=${query}&tag=${encodeURIComponent(amazonTag)}`;
  };

  return (
    <section
      aria-label="Livros e Bíblias Recomendadas"
      className="w-full rounded-2xl bg-sanctuary-900/70 border border-sanctuary-700/70 p-5 sm:p-7 space-y-4 mt-6 shadow-xl"
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-sacred-400" />
          <h4 className="font-cinzel text-sm sm:text-base font-bold text-sacred-300">
            Livros & Bíblias Recomendadas para Você
          </h4>
        </div>
        <span className="text-[10px] text-amber-400/90 uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
          Recomendações na Amazon
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {books.map((b, i) => (
          <div
            key={i}
            className="flex flex-col justify-between p-4 rounded-xl bg-sanctuary-850 border border-sanctuary-750 hover:border-sacred-500/40 transition-all group shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl p-2 rounded-lg bg-sanctuary-800 border border-sanctuary-700 select-none">
                  {b.coverEmoji}
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-sacred-500/10 text-sacred-300 font-medium border border-sacred-500/20">
                  {b.category}
                </span>
              </div>

              <div>
                <h5 className="font-cinzel font-bold text-sm text-slate-100 group-hover:text-sacred-300 transition-colors">
                  {b.title}
                </h5>
                <p className="text-[11px] text-slate-400 font-medium">por {b.author}</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {b.description}
              </p>
            </div>

            <div className="pt-4 mt-2 border-t border-sanctuary-800">
              <a
                href={buildAmazonUrl(b.amazonQuery)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-lg text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-sm transition-all active:scale-95"
              >
                <span>Ver na Amazon</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Aviso Obrigatório do Programa de Associados Amazon */}
      <div className="pt-3 border-t border-sanctuary-800/80 flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-400 leading-relaxed">
        <p className="flex items-center gap-1.5">
          <span className="text-amber-400 font-bold">Transparência:</span>
          <span>{AMAZON_DISCLOSURE}</span>
        </p>
        <span className="text-[10px] text-slate-500">
          Você não paga nada a mais ao adquirir por estes links.
        </span>
      </div>
    </section>
  );
}
