import {
  loadBibleData,
  getPassage,
  normalizeBookName,
  stripAccents,
  PassageResult,
  BibleBook,
} from "./bible";

// -------------------------------------------------------------
// STOPWORDS EM PORTUGUÊS (Elimina ruído gramatical e meta-buscas)
// -------------------------------------------------------------
export const STOPWORDS = new Set([
  "a", "ao", "aos", "aquela", "aquelas", "aquele", "aqueles", "aquilo", "as", "ate",
  "com", "como", "da", "das", "de", "dela", "delas", "dele", "deles", "do", "dos",
  "e", "ela", "elas", "ele", "eles", "em", "entre", "era", "eram", "essa", "essas",
  "esse", "esses", "esta", "estas", "este", "estes", "estou", "eu", "foi", "foram",
  "ha", "isso", "isto", "ja", "lhe", "lhes", "mais", "mas", "me", "mesmo", "meu",
  "meus", "minha", "minhas", "muito", "na", "nao", "nas", "nem", "no", "nos", "nossa",
  "nossas", "nosso", "nossos", "num", "numa", "o", "os", "ou", "para", "pela", "pelas",
  "pelo", "pelos", "por", "qual", "quando", "que", "quem", "sao", "se", "seja", "sejam",
  "sem", "seu", "seus", "so", "sobre", "sua", "suas", "tambem", "te", "tem", "temos",
  "tinha", "tinham", "toda", "todas", "todo", "todos", "tu", "tua", "tuas", "tudo",
  "um", "uma", "umas", "uns", "voce", "voces", "vos",
  // Meta-termos de busca em português
  "quero", "fala", "falar", "falou", "passagem", "passagens", "versiculo", "versiculos",
  "biblia", "onde", "diz", "mostre", "encontrar", "buscar", "historia", "cenas",
  "texto", "pra", "pro", "alguem", "coisa", "algo", "ver", "ler", "livro", "capitulo",
  "gostaria", "favor", "procuro", "acha", "achar", "conte", "dizer"
]);

// -------------------------------------------------------------
// RADICALIZADOR (Stemmer simples e eficiente para Português)
// -------------------------------------------------------------
export function stem(word: string): string {
  if (!word || word.length <= 3) return word;
  return word
    .replace(/(ereis|arao|erao|irao|aram|eram|iram|avam|ando|endo|indo|asse|esse|isse)$/, "")
    .replace(/(aria|eria|iria|arei|erei|irei|ara|era|ira|ava|ou|am|em|eu|iu|ei)$/, "")
    .replace(/(mente|dade|eza|cao|coes|oso|osa|vel)$/, "")
    .replace(/(es|is|os|as|s)$/, "");
}

// -------------------------------------------------------------
// EXPANSÃO SEMÂNTICA & DICIONÁRIO DE SINÔNIMOS BÍBLICOS
// -------------------------------------------------------------
export const SYNONYMS: Record<string, string[]> = {
  ansiedade: ["ansiedade", "ansioso", "ansiosa", "inquieto", "aflicao", "preocupacao", "angustia", "descanso", "paz"],
  ansioso: ["ansiedade", "ansioso", "ansiosa", "inquieto", "aflicao", "preocupacao", "angustia", "descanso", "paz"],
  medo: ["medo", "temor", "assombro", "pavor", "espanto", "coragem", "fortaleza", "refugio", "seguranca"],
  tristeza: ["tristeza", "triste", "choro", "lagrimas", "luto", "lamento", "pranto", "abatido", "alegria", "consolo"],
  triste: ["tristeza", "triste", "choro", "lagrimas", "luto", "lamento", "pranto", "abatido", "alegria", "consolo"],
  luto: ["luto", "morte", "morreu", "perda", "saudade", "choro", "lagrimas", "consolo", "ressurreicao", "vida"],
  cura: ["cura", "curou", "sarar", "sarou", "enfermidade", "doenca", "chagas", "saude", "restaurar", "sanar", "medico"],
  curando: ["cura", "curou", "sarar", "sarou", "enfermidade", "doenca", "chagas", "saude", "restaurar", "sanar"],
  perdao: ["perdao", "perdoar", "perdoou", "misericordia", "remissao", "pecados", "ofensas", "reconciliar"],
  pecado: ["pecado", "pecados", "iniquidade", "transgressao", "perdao", "arrependimento", "purificacao"],
  dinheiro: ["riqueza", "ouro", "prata", "bens", "sustento", "dizimo", "necessidade", "provisao", "fartura"],
  divida: ["dividas", "devedor", "sustento", "necessidade", "provisao", "pobreza", "trabalho", "prosperidade"],
  dividas: ["dividas", "devedor", "sustento", "necessidade", "provisao", "pobreza", "trabalho", "prosperidade"],
  casamento: ["casamento", "matrimonio", "esposa", "marido", "mulher", "uniao", "familia", "lar", "fidelidade"],
  familia: ["familia", "filhos", "pais", "geracao", "casa", "lar", "heranca"],
  duvida: ["duvida", "direcao", "sabedoria", "caminho", "conselho", "discernimento", "guiar", "instruir"],
  cansaco: ["cansaco", "cansado", "fatigado", "exaustao", "fardo", "pesado", "descanso", "refrigero", "alivio"],
  cansado: ["cansaco", "cansado", "fatigado", "exaustao", "fardo", "pesado", "descanso", "refrigero", "alivio"],
  solidao: ["solidao", "sozinho", "abandonado", "amparo", "presenca", "desamparado", "socorro", "companhia"],
  fe: ["fe", "esperanca", "confianca", "crer", "fidelidade", "vitoria", "promessa", "inabalavel"],
  amor: ["amor", "amar", "amou", "bondade", "caridade", "misericordia", "graca", "paciente", "afeto"],
  paz: ["paz", "descanso", "quietude", "serenidade", "tranquilidade", "calmaria"],
  cego: ["cego", "cegos", "cegueira", "olhos", "vista", "visao", "enxergar", "curou", "bartimeu"],
  jerico: ["jerico", "bartimeu", "muralha", "muralhas", "zaqueu"],
  tempestade: ["tempestade", "mar", "ondas", "vento", "barco", "acalmou", "bonanca"],
  armadura: ["armadura", "capacete", "couraça", "escudo", "espada", "cinto", "calcado", "dardo", "soldado"],
  desanimo: ["desanimo", "desanimado", "fraqueza", "abater", "erguer", "renovacao", "forca", "vontade"],
};

export function tokenize(text: string): string[] {
  const clean = stripAccents(text).replace(/[^\w\s]/g, " ");
  return clean
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 2 && !STOPWORDS.has(w));
}

export function expandTerms(terms: string[]): string[] {
  const set = new Set(terms);
  for (const t of terms) {
    if (SYNONYMS[t]) {
      SYNONYMS[t].forEach((s) => set.add(s));
    }
  }
  return Array.from(set);
}

// -------------------------------------------------------------
// CATÁLOGO CANÔNICO DE HISTÓRIAS, MILAGRES E EVENTOS BÍBLICOS
// -------------------------------------------------------------
export interface BiblicalStoryItem {
  id: string;
  title: string;
  book: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
  keywords: string[];
  historicalContext: string;
  reflection: string;
  guidedPrayer: string;
  practicalStep: string;
}

export const BIBLICAL_STORIES: BiblicalStoryItem[] = [
  {
    id: "salmo-23",
    title: "O Senhor é o Meu Pastor (Salmo 23)",
    book: "Salmos",
    chapter: 23,
    startVerse: 1,
    endVerse: 6,
    keywords: [
      "o senhor e meu pastor",
      "nada me faltara",
      "de nada terei falta",
      "vale da sombra da morte",
      "calice transborda",
      "unges a minha cabeca",
      "salmo 23",
      "pastor de ovelhas",
      "aguas de repouso",
    ],
    historicalContext: "Salmo de Davi expressando a providência, fidelidade e paz inabalável sob a proteção do Bom Pastor.",
    reflection: "Davi conhecia a vida nos campos e sabia que a ovelha não precisa temer nada enquanto estiver próxima de seu pastor. Deus conhece cada necessidade sua e prepara uma mesa de honra mesmo na presença de desafios.",
    guidedPrayer: "Senhor, Tu és o meu Bom Pastor. Nada me faltará. Conduze-me pelas águas mansas e unge a minha cabeça com a Tua paz. Em nome de Jesus, amém.",
    practicalStep: "Pare por 2 minutos, respire fundo e declare em voz alta: 'O Senhor é o meu pastor, nada me faltará'.",
  },
  {
    id: "joao-3-16",
    title: "O Amor Redentor de Deus (João 3:16)",
    book: "João",
    chapter: 3,
    startVerse: 16,
    endVerse: 17,
    keywords: [
      "deus amou o mundo",
      "deus tanto amou o mundo",
      "deu o seu filho unigenito",
      "todo o que nele crer",
      "nao pereca mas tenha a vida eterna",
      "joao 3 16",
      "salvacao em cristo",
    ],
    historicalContext: "Palavras de Jesus a Nicodemos em Jerusalém, sintetizando o maior anúncio do evangelho e da graça divina.",
    reflection: "O amor de Deus não é abstrato; ele se provou no sacrifício de Jesus. Ele não enviou Seu Filho para condenar você, mas para que através Dele você encontre redenção e vida eterna abundante.",
    guidedPrayer: "Pai celeste, agradeço pelo Teu amor infinito que entregou Jesus por mim. Eu creio em Ti e recebo a Tua salvação em meu coração. Amém.",
    practicalStep: "Medite na grandeza do amor de Deus e compartilhe uma palavra de esperança com alguém hoje.",
  },
  {
    id: "salmo-91",
    title: "O Refúgio do Altíssimo (Salmo 91)",
    book: "Salmos",
    chapter: 91,
    startVerse: 1,
    endVerse: 7,
    keywords: [
      "aquele que habita no abrigo do altissimo",
      "esconderijo do altissimo",
      "mil cairao ao teu lado",
      "salmo 91",
      "sob suas asas estaras seguro",
      "nenhum mal te atingira",
      "praga alguma chegara a tua tenda",
    ],
    historicalContext: "Hino de confiança absoluta na guarda e na proteção de Deus perante perigos visíveis e invisíveis.",
    reflection: "Habitar no abrigo do Altíssimo é escolher fazer da presença de Deus a sua morada diária. Em tempos de incerteza, o Senhor é a fortaleza impenetrável onde sua alma encontra descanso seguro.",
    guidedPrayer: "Senhor Deus Todo-Poderoso, sob as Tuas asas eu me refugio. Livra-me do laço do passarinheiro e da peste perniciosa. Em Ti confio, amém.",
    practicalStep: "Leia o Salmo 91 na sua Bíblia antes de dormir, consagrando o seu lar à proteção divina.",
  },
  {
    id: "cego-de-jerico",
    title: "A Cura do Cego de Jericó (Bartimeu)",
    book: "Marcos",
    chapter: 10,
    startVerse: 46,
    endVerse: 52,
    keywords: [
      "cego de jerico",
      "bartimeu",
      "filho de davi tem misericordia",
      "cego mendigo em jerico",
      "curou o cego",
      "mestre eu quero ver",
    ],
    historicalContext: "Ocorrido em Jericó quando Jesus subia para Jerusalém; Bartimeu perseverou em clamar mesmo quando a multidão tentava calá-lo.",
    reflection: "Bartimeu não permitiu que o barulho da multidão sufocasse a sua fé. Quando Jesus perguntou 'O que você quer que eu faça?', ele foi claro: 'Mestre, eu quero ver!'. Não tenha medo de clamar a Deus com toda a sinceridade da sua alma.",
    guidedPrayer: "Senhor Jesus, Filho de Davi, tem misericórdia de mim! Abre os meus olhos espirituais e concede-me direção clara para seguir os Teus passos. Amém.",
    practicalStep: "Escreva em um papel o pedido mais urgente do seu coração e apresente-o em oração hoje.",
  },
  {
    id: "davi-e-golias",
    title: "A Vitória de Davi contra Golias",
    book: "1 Samuel",
    chapter: 17,
    startVerse: 45,
    endVerse: 49,
    keywords: [
      "davi e golias",
      "golias",
      "filisteu",
      "funda e pedra",
      "gigante",
      "davi venceu golias",
      "vale de elá",
      "davi contra o gigante",
    ],
    historicalContext: "Confronto no Vale de Elá, onde o jovem pastor Davi enfrentou o guerreiro filisteu confiando no Nome do Senhor dos Exércitos.",
    reflection: "Davi não olhou para o tamanho de Golias, mas para o tamanho de Deus. Os gigantes que se levantam diante de nós — medo, dívidas, provações — não resistem diante do poder dAquele que luta por nós.",
    guidedPrayer: "Senhor dos Exércitos, eu venho contra as minhas batalhas não com a força do meu braço, mas no Teu Santo Nome. Concede-me coragem inabalável. Amém.",
    practicalStep: "Identifique o maior 'gigante' do seu dia e entregue-o a Deus em oração antes de tentar resolvê-lo sozinho.",
  },
  {
    id: "mulher-fluxo-de-sangue",
    title: "A Cura da Mulher do Fluxo de Sangue",
    book: "Marcos",
    chapter: 5,
    startVerse: 25,
    endVerse: 34,
    keywords: [
      "mulher do fluxo de sangue",
      "hemorragia",
      "tocou nas vestes de jesus",
      "orla do manto",
      "filha a tua fe te salvou",
      "doze anos de hemorragia",
    ],
    historicalContext: "Milagre de cura ocorrido a caminho da casa de Jairo na Galileia, demonstrando a sensibilidade de Jesus perante o toque da fé.",
    reflection: "Após doze anos de sofrimento, esgotados todos os recursos humanos, aquela mulher tocou na orla das vestes de Jesus. Sua fé foi recompensada imediatamente: 'Filha, a sua fé a curou! Vá em paz e fique livre do seu sofrimento'.",
    guidedPrayer: "Senhor Jesus, estendo a minha mão pela fé para tocar em Ti. Restaura a minha saúde física e emocional, trazendo paz e cura ao meu coração. Amém.",
    practicalStep: "Diga a você mesmo: 'Nenhuma dor é definitiva quando Jesus entra no caminho'. Descanse Nele.",
  },
  {
    id: "pedro-anda-sobre-as-aguas",
    title: "Jesus e Pedro Andam sobre as Águas",
    book: "Mateus",
    chapter: 14,
    startVerse: 28,
    endVerse: 31,
    keywords: [
      "pedro andou sobre as aguas",
      "pedro anda sobre a agua",
      "jesus anda sobre as aguas",
      "homem de pequena fe por que duvidaste",
      "senhor salva me",
      "mar da galileia tempestade",
    ],
    historicalContext: "Na quarta vigília da noite no Mar da Galileia, Jesus foi ao encontro dos discípulos andando sobre as águas agitadas.",
    reflection: "Enquanto Pedro manteve os olhos fitos em Jesus, ele caminhou sobre o impossível. Quando olhou para o vento forte, começou a afundar, mas imediatamente Jesus estendeu a mão e o segurou. Ele nunca deixará você afundar.",
    guidedPrayer: "Senhor Jesus, ajuda-me a não olhar para os ventos contrários, mas a fixar o meu olhar em Ti. Segura na minha mão quando as forças fraquejarem. Amém.",
    practicalStep: "Em meio às distrações e pressões, tire um momento de silêncio para manter o foco na promessa divina.",
  },
  {
    id: "jesus-acalma-tempestade",
    title: "Jesus Acalma a Tempestade",
    book: "Marcos",
    chapter: 4,
    startVerse: 35,
    endVerse: 41,
    keywords: [
      "jesus acalma a tempestade",
      "tempestade no mar",
      "vento e o mar lhe obedecem",
      "acalmar tempestade",
      "barco ondas jesus dormia",
      "silencio aquieta te",
    ],
    historicalContext: "Travessia noturna do Mar da Galileia para a região dos gerasenos, quando uma violenta tempestade de vento ameaçou naufragar o barco.",
    reflection: "Mesmo que pareça que Jesus está em silêncio no barco da sua vida, Ele continua no controle de todas as coisas. Ao comando de Sua voz, até os ventos mais bravios e as ondas mais altas se calam.",
    guidedPrayer: "Mestre amado, fala à tempestade que se levantou em minha vida: 'Aquieta-te!'. Derrama a Tua bonança e renova a minha fé. Em nome de Jesus, amém.",
    practicalStep: "Lembre-se: ter Jesus no barco não impede que a tempestade surja, mas garante que o barco jamais afundará.",
  },
  {
    id: "filho-prodigo",
    title: "A Parábola do Filho Pródigo",
    book: "Lucas",
    chapter: 15,
    startVerse: 11,
    endVerse: 24,
    keywords: [
      "filho prodigo",
      "parabola do filho perdido",
      "pai misericordioso",
      "heranca gasta",
      "bezerro gordo",
      "filho perdi me voltei para o pai",
      "abraco do pai",
    ],
    historicalContext: "Parábola contada por Jesus para ilustrar o coração misericordioso do Pai celestial ao acolher pecadores e restaurá-los com honra.",
    reflection: "Não importa a que distância você tenha se sentido de Deus ou que erros tenha cometido. O Pai permanece de braços abertos esperando o seu retorno com festa, anel no dedo e vestes de alegria.",
    guidedPrayer: "Pai celeste, volto o meu coração para Ti. Perdoa os meus erros e acolhe-me em Tua presença com a Tua graça infinita. Em nome de Jesus, amém.",
    practicalStep: "Perdoe a si mesmo pelos erros do passado e viva a novidade de vida que Deus reservou para você.",
  },
  {
    id: "bom-samaritano",
    title: "A Parábola do Bom Samaritano",
    book: "Lucas",
    chapter: 10,
    startVerse: 30,
    endVerse: 37,
    keywords: [
      "bom samaritano",
      "quem e o meu proximo",
      "estrada de jerusalem para jerico",
      "ajudou o ferido",
      "oleo e vinho nas feridas",
      "ama o teu proximo como a ti mesmo",
    ],
    historicalContext: "Resposta de Jesus a um perito na lei sobre o verdadeiro significado de amar o próximo como a si mesmo.",
    reflection: "O amor ao próximo não é medido por discursos ou intenções, mas pela compaixão em ação. O samaritano parou, cuidou das feridas e investiu seus recursos para restaurar alguém que ele nem conhecia.",
    guidedPrayer: "Senhor, sensibiliza os meus olhos e o meu coração para enxergar as necessidades do meu irmão. Faz de mim um instrumento de alívio e consolo. Amém.",
    practicalStep: "Faça um ato voluntário de gentileza ou ajude alguém hoje sem esperar nada em troca.",
  },
  {
    id: "armadura-de-deus",
    title: "A Armadura de Deus",
    book: "Efésios",
    chapter: 6,
    startVerse: 10,
    endVerse: 18,
    keywords: [
      "armadura de deus",
      "capacete da salvacao",
      "escudo da fe",
      "espada do espirito",
      "couraça da justica",
      "batalha espiritual",
      "cinto da verdade",
      "fortalecei vos no senhor",
    ],
    historicalContext: "Epístola de Paulo escrita aos efésios da prisão em Roma, inspirando-se no armamento dos soldados para ensinar a firmeza espiritual.",
    reflection: "Nossa luta diária não é contra a carne e o sangue, mas espiritual. Revestir-se de toda a armadura de Deus garante que no dia mau você permaneça firme, sustentado pela verdade, justiça e fé inabalável.",
    guidedPrayer: "Senhor Deus, visto a Tua armadura neste dia: o escudo da fé, o capacete da salvação e a espada do Espírito. Permaneço inabalável em Ti. Amém.",
    practicalStep: "Comece o dia orando e declarando que a sua mente está guardada pela paz e pela verdade de Cristo.",
  },
  {
    id: "hino-ao-amor",
    title: "O Hino ao Amor (1 Coríntios 13)",
    book: "1 Coríntios",
    chapter: 13,
    startVerse: 4,
    endVerse: 8,
    keywords: [
      "o amor e paciente",
      "o amor e bondoso",
      "hino ao amor",
      "ainda que eu falasse a lingua dos homens",
      "1 corintios 13",
      "o amor nunca perece",
      "o amor nao arde em ciumes",
    ],
    historicalContext: "Capítulo escrito pelo apóstolo Paulo à igreja de Corinto para demonstrar que o amor é o dom supremo que transcende todas as coisas.",
    reflection: "O amor bíblico (ágape) não é apenas um sentimento, mas uma decisão paciente e bondosa. Ele não guarda rancor, não inveja e tudo suporta. Praticar esse amor nos aproxima do próprio caráter de Deus.",
    guidedPrayer: "Pai de amor, enche o meu coração com o Teu amor paciente e bondoso. Ensina-me a perdoar, a ter misericórdia e a edificar os outros. Amém.",
    practicalStep: "Pratique a paciência diante da primeira situação de atrito que surgir hoje.",
  },
  {
    id: "daniel-na-cova-dos-leoes",
    title: "Daniel na Cova dos Leões",
    book: "Daniel",
    chapter: 6,
    startVerse: 19,
    endVerse: 23,
    keywords: [
      "daniel na cova dos leoes",
      "cova dos leoes",
      "anjo fechou a boca dos leoes",
      "rei dario daniel",
      "fidelidade de daniel",
    ],
    historicalContext: "Ocorrido no império medo-persa na Babilônia sob o reinado de Dario, exaltando a fidelidade inegociável de Daniel a Deus.",
    reflection: "Daniel preferiu enfrentar os leões famintos a negociar sua comunhão diária com Deus. Na manhã seguinte, a boca dos leões estava fechada pelo anjo do Senhor. Sua fidelidade jamais passará despercebida no céu.",
    guidedPrayer: "Deus Todo-Poderoso, guarda a minha vida diante das ameaças e pressões do mundo. Que a minha fé e oração diária permaneçam firmes. Amém.",
    practicalStep: "Mantenha a sua rotina de oração diária mesmo nos dias mais agitados ou desafiadores.",
  },
  {
    id: "fornalha-ardente",
    title: "Os Três Jovens na Fornalha Ardente",
    book: "Daniel",
    chapter: 3,
    startVerse: 16,
    endVerse: 25,
    keywords: [
      "fornalha ardente",
      "sadraque mesaque abede nego",
      "quarto homem na fornalha",
      "estatua de ouro nabucodonosor",
      "o nosso deus pode nos livrar",
    ],
    historicalContext: "Planície de Dura sob o reinado de Nabucodonosor, onde três jovens hebreus se recusaram a se curvar à estátua de ouro.",
    reflection: "Sadraque, Mesaque e Abede-Nego declararam: 'O nosso Deus pode nos livrar, mas se Ele não o fizer, ainda assim não nos curvaremos'. Quando foram lançados ao fogo, o 'Quarto Homem' andou com eles. Deus caminha conosco no meio do fogo.",
    guidedPrayer: "Senhor, sê a minha companhia nas provações acaloradas da vida. Que a Tua presença gloriosa me guarde de qualquer dano. Em nome de Jesus, amém.",
    practicalStep: "Não tome decisões precipitadas sob pressão. Confie na fidelidade de Deus em qualquer circunstância.",
  },
  {
    id: "arca-de-noe",
    title: "Noé e a Arca do Dilúvio",
    book: "Gênesis",
    chapter: 7,
    startVerse: 1,
    endVerse: 5,
    keywords: [
      "arca de noe",
      "noe e o diluvio",
      "chuva quarenta dias",
      "animais de dois em dois",
      "arco iris alianca",
      "construcao da arca",
    ],
    historicalContext: "História das origens do povo de Deus, revelando a obediência e fidelidade de Noé em meio a uma geração corrompida.",
    reflection: "Noé obedeceu a Deus mesmo quando ninguém compreendia o que ele fazia. A arca foi o refúgio seguro durante o temporal. Quando você anda nos caminhos do Senhor, a sua família está guardada pela Sua aliança.",
    guidedPrayer: "Senhor, dá-me um coração obediente como o de Noé para cumprir a Tua vontade mesmo contra a correnteza. Guarda o meu lar e a minha família. Amém.",
    practicalStep: "Consagre o seu lar a Deus e ore pela harmonia e salvação de todos os seus familiares.",
  },
  {
    id: "zaqueu",
    title: "O Encontro de Jesus com Zaqueu",
    book: "Lucas",
    chapter: 19,
    startVerse: 1,
    endVerse: 10,
    keywords: [
      "zaqueu",
      "sicomoro",
      "zaqueu desce depressa",
      "publicano zaqueu",
      "hoje houve salvacao nesta casa",
      "jesus entrou na casa de zaqueu",
    ],
    historicalContext: "Visita de Jesus a Jericó, transformando a vida do chefe dos cobradores de impostos que subiu numa figueira brava para vê-Lo.",
    reflection: "Zaqueu queria apenas ver quem era Jesus, mas Jesus o chamou pelo nome e foi cear em sua casa. Não há coração distante demais que o olhar amoroso de Cristo não possa alcançar e transformar.",
    guidedPrayer: "Senhor Jesus, entra em minha casa e em meu coração. Transforma a minha história e traz a Tua salvação abundante para a minha vida. Amém.",
    practicalStep: "Abra espaço na sua rotina para uma conversa íntima com Deus, acolhendo a Sua presença em seu lar.",
  },
  {
    id: "ressurreicao-de-lazaro",
    title: "A Ressurreição de Lázaro",
    book: "João",
    chapter: 11,
    startVerse: 38,
    endVerse: 44,
    keywords: [
      "ressurreicao de lazaro",
      "lazaro vem para fora",
      "marta e maria lazaro",
      "jesus chorou",
      "eu sou a ressurreicao e a vida",
      "quatro dias sepultado",
    ],
    historicalContext: "Ocorrido em Betânia pouco antes da Páscoa, servindo como sinal supremo do poder de Cristo sobre a morte e a corrupção.",
    reflection: "Quando Marta pensava que já era tarde demais (quatro dias de sepulcro), Jesus declarou: 'Eu sou a ressurreição e a vida'. Para Deus, nenhuma causa está perdida. O que parecia morto aos olhos humanos ganha vida nova ao Seu chamado.",
    guidedPrayer: "Senhor da Vida, sopra Teu fôlego restaurador sobre as áreas da minha vida que parecem sem esperança. Eu creio no Teu poder ressurretor. Amém.",
    practicalStep: "Não desista de sonhos ou propósitos legítimos que parecem parados. Coloque-os nas mãos do Deus do Impossível.",
  },
  {
    id: "dez-mandamentos",
    title: "Os Dez Mandamentos",
    book: "Êxodo",
    chapter: 20,
    startVerse: 1,
    endVerse: 17,
    keywords: [
      "dez mandamentos",
      "tabuas da lei",
      "monte sinai",
      "moises mandamentos",
      "nao teras outros deuses",
      "honra teu pai e tua mae",
    ],
    historicalContext: "A promulgação da Lei de Deus a Moisés e ao povo de Israel no Monte Sinai após a saída do Egito.",
    reflection: "Os mandamentos não foram dados para nos aprisionar, mas para nos proteger e nos ensinar a viver em harmonia com Deus e com o próximo. Eles são balizas de amor e retidão que preservam a nossa alma.",
    guidedPrayer: "Senhor Deus, grava os Teus mandamentos na tábua do meu coração. Dá-me graça para amar a Tua Lei e andar em integridade todos os dias. Amém.",
    practicalStep: "Examine a sua conduta com os outros hoje à luz da justiça, verdade e amor ao próximo.",
  },
  {
    id: "oracao-do-pai-nosso",
    title: "A Oração do Pai Nosso",
    book: "Mateus",
    chapter: 6,
    startVerse: 9,
    endVerse: 13,
    keywords: [
      "pai nosso",
      "oracao do pai nosso",
      "venha o teu reino",
      "o pao nosso de cada dia",
      "perdoa as nossas dividas",
      "livra nos do mal",
    ],
    historicalContext: "Ensinamento de Jesus no Sermão da Montanha sobre o modelo ideal de comunhão e oração ao Pai celeste.",
    reflection: "O Pai Nosso nos ensina a priorizar a santidade de Deus e a expansão do Seu Reino antes de apresentar as nossas necessidades. Ele garante o pão de cada dia e nos desafia a perdoar assim como fomos perdoados.",
    guidedPrayer: "Pai nosso que estás nos céus, santificado seja o Teu nome. Venha o Teu reino e seja feita a Tua vontade. Livra-me de todo mal, hoje e sempre. Amém.",
    practicalStep: "Ore o Pai Nosso devagar, meditando em cada uma das suas frases com o coração aberto.",
  },
  {
    id: "criacao-do-mundo",
    title: "A Criação do Mundo",
    book: "Gênesis",
    chapter: 1,
    startVerse: 1,
    endVerse: 5,
    keywords: [
      "criacao do mundo",
      "no principio criou deus",
      "haja luz",
      "e houve luz",
      "espirito de deus pairava sobre as aguas",
      "genesis 1",
    ],
    historicalContext: "O relato inaugural de toda a Escritura Sagrada, revelando o poder da Palavra de Deus que traz ordem ao caos.",
    reflection: "No princípio, onde havia trevas e vazio, Deus declarou: 'Haja luz!'. A mesma voz poderosa que criou os céus e a terra tem autoridade para iluminar as áreas mais escuras da sua caminhada e criar novos começos.",
    guidedPrayer: "Criador dos céus e da terra, fala sobre o meu coração neste dia. Dissipa as trevas da dúvida e do desânimo com a Tua luz celestial. Amém.",
    practicalStep: "Observe o céu ou a natureza ao seu redor e admire a sabedoria e majestade do Criador.",
  },
  {
    id: "travessia-do-mar-vermelho",
    title: "A Travessia do Mar Vermelho",
    book: "Êxodo",
    chapter: 14,
    startVerse: 13,
    endVerse: 22,
    keywords: [
      "mar vermelho",
      "travessia do mar vermelho",
      "abertura do mar",
      "moises abriu o mar",
      "o senhor pelejara por vos",
      "aguas se dividiram",
    ],
    historicalContext: "Momento culminante do êxodo de Israel do Egito, quando o exército de Faraó cercou o povo diante do mar e Deus abriu um caminho seco.",
    reflection: "Com o exército egípcio atrás e o mar profundo à frente, o povo estava sem saída humana. Moisés disse: 'Não tenham medo. Fiquem firmes e vejam o livramento que o Senhor lhes trará hoje'. Deus abre caminho onde não há caminho.",
    guidedPrayer: "Senhor de poder, quando eu me vir cercado e sem saída, abre um caminho em meio às águas. Luta por mim e guarda os meus passos. Amém.",
    practicalStep: "Não se desespere diante de becos sem saída. Fique firme e confie na providência de Deus.",
  },
  {
    id: "muralhas-de-jerico",
    title: "A Queda das Muralhas de Jericó",
    book: "Josué",
    chapter: 6,
    startVerse: 15,
    endVerse: 20,
    keywords: [
      "muralhas de jerico",
      "queda de jerico",
      "josue e as muralhas",
      "trombetas de chifre de carneiro",
      "muro desabou",
      "grito de vitoria",
    ],
    historicalContext: "A primeira grande conquista de Israel na Terra Prometida sob a liderança de Josué, segundo as instruções estratégicas do Senhor.",
    reflection: "Jericó tinha muralhas intransponíveis, mas a vitória não veio por aríetes ou catapultas; veio pela obediência, louvor e toque de trombetas. Quando obedecemos a Deus, as muralhas que nos impedem de avançar caem por terra.",
    guidedPrayer: "Senhor, derruba pela raiz as muralhas de impedimento, desânimo e medo que cercam o meu caminho. Concede-me a Tua vitória. Amém.",
    practicalStep: "Louve a Deus antes mesmo de ver a vitória. A adoração rompe barreiras espirituais.",
  },
  {
    id: "parabola-dos-talentos",
    title: "A Parábola dos Talentos",
    book: "Mateus",
    chapter: 25,
    startVerse: 14,
    endVerse: 23,
    keywords: [
      "parabola dos talentos",
      "servo bom e fiel",
      "cinco talentos",
      "enterrar o talento",
      "sobre o pouco foste fiel sobre o muito te colocarei",
    ],
    historicalContext: "Discurso escatológico de Jesus sobre a mordomia, responsabilidade e diligência com os dons e recursos confiados por Deus.",
    reflection: "Deus concedeu talentos e oportunidades a cada um de nós de acordo com a nossa capacidade. Ele não nos compara com ninguém, mas espera fidelidade no que nos foi entregue. 'Muito bem, servo bom e fiel! Venha participar da alegria do seu senhor!'.",
    guidedPrayer: "Senhor, capacita-me a multiplicar com amor e integridade os dons e talentos que Tu colocaste em minhas mãos para abençoar o Teu Reino. Amém.",
    practicalStep: "Use uma habilidade ou dom pessoal hoje para abençoar a vida de alguém ao seu redor.",
  },
  {
    id: "fruto-do-espirito",
    title: "O Fruto do Espírito Santo",
    book: "Gálatas",
    chapter: 5,
    startVerse: 22,
    endVerse: 26,
    keywords: [
      "fruto do espirito",
      "amor alegria paz paciencia",
      "amabilidade bondade fidelidade mansidao dominio proprio",
      "galatas 5 22",
      "obras da carne",
    ],
    historicalContext: "Instrução de Paulo aos gálatas contrastando a vida guiada pelos impulsos humanos com a maturidade gerada pelo Espírito Santo.",
    reflection: "O fruto do Espírito não é produzido pelo nosso próprio esforço isolado, mas por vivermos conectados à videira verdadeira. Amor, paz, paciência, mansidão e domínio próprio florescem à medida que o Espírito governa o nosso interior.",
    guidedPrayer: "Espírito Santo, sopra sobre mim e gera em meu viver o Teu fruto: paciência, bondade, amor e domínio próprio. Amém.",
    practicalStep: "Pratique o domínio próprio: pense duas vezes antes de responder a qualquer provocação hoje.",
  },
  {
    id: "sermoes-da-montanha-bem-aventurados",
    title: "As Bem-Aventuranças (Sermão da Montanha)",
    book: "Mateus",
    chapter: 5,
    startVerse: 3,
    endVerse: 12,
    keywords: [
      "bem aventurados",
      "sermao da montanha",
      "pobres de espirito",
      "os que choram serao consolados",
      "mansos herdarao a terra",
      "pacificadores",
    ],
    historicalContext: "O manifesto inaugural do Reino dos Céus ensinado por Jesus aos discípulos nas colinas próximas a Cafarnaum.",
    reflection: "O Reino de Deus inverte a lógica do mundo: felizes não são os arrogantes, mas os mansos, os que choram com sincera compaixão e os que têm fome e sede de justiça, pois eles serão fartos e consolados pelo Pai.",
    guidedPrayer: "Senhor Jesus, ensina-me a viver a pureza das Tuas bem-aventuranças. Conforta o meu coração e faz de mim um promotor de paz. Amém.",
    practicalStep: "Seja um pacificador hoje em uma conversa ou ambiente familiar tenso.",
  },
  {
    id: "samaritana-no-poco",
    title: "A Mulher Samaritana no Poço",
    book: "João",
    chapter: 4,
    startVerse: 7,
    endVerse: 14,
    keywords: [
      "mulher samaritana",
      "poco de jaco",
      "agua viva",
      "quem beber desta agua nunca mais tera sede",
      "adoradores em espirito e em verdade",
    ],
    historicalContext: "Encontro junto à cidade de Sicar em Samaria, quebrando barreiras culturais, sociais e religiosas da época.",
    reflection: "Jesus ofereceu àquela mulher sedenta uma 'água viva' que salta para a vida eterna. Nenhum poço deste mundo — bens, fama, aprovação humana — pode saciar a sede profunda da alma; apenas Cristo satisfaz plenamente.",
    guidedPrayer: "Senhor Jesus, eu venho a Ti com sede. Enche o meu vaso com a Tua Água Viva para que eu nunca mais ande vazio pelo mundo. Amém.",
    practicalStep: "Substitua um momento de consumo superficial hoje por uma leitura atenta da Palavra de Deus.",
  },
  {
    id: "nascimento-de-jesus",
    title: "O Nascimento de Jesus em Belém",
    book: "Lucas",
    chapter: 2,
    startVerse: 6,
    endVerse: 14,
    keywords: [
      "nascimento de jesus",
      "menino jesus",
      "belem manjedoura",
      "gloria a deus nas alturas",
      "paz na terra aos homens",
      "anjos e pastores",
    ],
    historicalContext: "O cumprimento das profecias messiânicas na Judeia sob o recenseamento decretado por César Augusto.",
    reflection: "O Criador do universo não escolheu nascer em palácios suntuosos, mas na simplicidade de uma manjedoura em Belém. Deus se fez próximo, humano e acessível para que ninguém se sentisse desamparado de Sua presença.",
    guidedPrayer: "Senhor, agradeço pela Tua vinda ao mundo como luz e salvador. Faz renascer em meu coração a paz e a simplicidade de Belém. Amém.",
    practicalStep: "Valorize a simplicidade nas suas relações e celebre a presença de Cristo em sua vida.",
  },
  {
    id: "crucificacao-ressurreicao",
    title: "A Morte e Ressurreição Gloriosa de Cristo",
    book: "Lucas",
    chapter: 24,
    startVerse: 1,
    endVerse: 7,
    keywords: [
      "ressurreicao de jesus",
      "ele ressuscitou",
      "tumulo vazio",
      "por que buscais entre os mortos aquele que vive",
      "terceiro dia",
      "pascoa",
    ],
    historicalContext: "O acontecimento central do cristianismo: ao terceiro dia após a crucificação, o sepulcro foi encontrado vazio.",
    reflection: "A cruz não foi o fim; foi o início da maior vitória da história. O túmulo está vazio! Aquele que venceu a morte vive hoje para interceder por nós e nos garantir esperança inabalável para o amanhã.",
    guidedPrayer: "Cristo vivo, eu Te louvo porque venceste a morte e reinas para todo o sempre. A Tua vitória é a certeza do meu futuro. Amém.",
    practicalStep: "Declare com fé: 'Porque Ele vive, posso crer no amanhã'. Viva este dia com esperança renovada.",
  },
  {
    id: "filipenses-4-13",
    title: "A Força que Vem de Cristo (Filipenses 4:13)",
    book: "Filipenses",
    chapter: 4,
    startVerse: 11,
    endVerse: 13,
    keywords: [
      "tudo posso naquele que me fortalece",
      "filipenses 4 13",
      "posso todas as coisas",
      "aprendi a estar satisfeito",
      "tanto na fartura quanto na escassez",
    ],
    historicalContext: "Carta aos Filipenses redigida por Paulo da prisão, demonstrando o contentamento supremo fundamentado em Cristo.",
    reflection: "Esta passagem não é sobre poder ilimitado humano, mas sobre a força sobrenatural de Cristo que capacita a alma a vencer qualquer circunstância, na alegria ou na adversidade.",
    guidedPrayer: "Senhor, quando as minhas próprias forças se esgotarem, renova o meu íntimo. Em Ti eu posso todas as coisas, pois Tua graça me basta. Amém.",
    practicalStep: "Diante de uma tarefa difícil hoje, repita: 'Cristo me fortalece para cumprir o meu dever com retidão'.",
  },
  {
    id: "joao-8-32",
    title: "A Verdade que Liberta (João 8:31-32)",
    book: "João",
    chapter: 8,
    startVerse: 31,
    endVerse: 32,
    keywords: [
      "conhecereis a verdade",
      "conhecerao a verdade",
      "a verdade vos libertara",
      "a verdade os libertara",
      "joao 8 32",
      "permanecerdes na minha palavra",
    ],
    historicalContext: "Discurso de Jesus no templo de Jerusalém àqueles que criam Nele, ensinando a verdadeira liberdade espiritual.",
    reflection: "A liberdade autêntica não é a ausência de limites, mas o conhecimento da Verdade encarnada em Cristo. A Sua Palavra quebra as correntes da culpa, da mentira, da ansiedade e do engano.",
    guidedPrayer: "Senhor Jesus, liberta a minha mente de pensamentos enganosos e sentimentos de condenação. Que a Tua Verdade reine em mim. Amém.",
    practicalStep: "Substitua qualquer pensamento mentiroso de insuficiência pela verdade do amor de Deus por você.",
  },
  {
    id: "mateus-11-28",
    title: "O Descanso para os Cansados (Mateus 11:28-30)",
    book: "Mateus",
    chapter: 11,
    startVerse: 28,
    endVerse: 30,
    keywords: [
      "venham a mim todos que estao cansados",
      "cansados e sobrecarregados",
      "eu darei descanso",
      "tomem sobre voces o meu jugo",
      "meu fardo e leve",
      "mateus 11 28",
    ],
    historicalContext: "Convite de Jesus aos galileus sobrecarregados pelo peso das exigências religiosas e das durezas da vida cotidiana.",
    reflection: "Jesus não nos chama para colocar mais fardos em nossas costas, mas para trocar os nossos pesos pelo Seu jugo suave e leve. Nele, a alma cansada encontra repouso genuíno e refrigério permanente.",
    guidedPrayer: "Jesus querido, eu entrego aos Teus pés todo o meu cansaço, preocupações e ansiedades. Dá descanso e alívio à minha alma. Amém.",
    practicalStep: "Desconecte-se de redes e afazeres por 15 minutos e descanse em oração silenciosa na presença de Deus.",
  },
];

// -------------------------------------------------------------
// MOTOR 1: CASAMENTO INTELIGENTE DE HISTÓRIAS & PASSAGENS CHAVE
// -------------------------------------------------------------
export function matchBiblicalStory(rawQuery: string): BiblicalStoryItem | null {
  if (!rawQuery || rawQuery.trim().length < 2) return null;
  const clean = stripAccents(rawQuery);
  const words = tokenize(rawQuery);
  if (words.length === 0) return null;

  let best: BiblicalStoryItem | null = null;
  let bestScore = 0;

  for (const s of BIBLICAL_STORIES) {
    let score = 0;
    for (const kw of s.keywords) {
      const cleanKw = stripAccents(kw);
      if (clean.includes(cleanKw)) {
        score += 150;
      } else {
        const kwWords = tokenize(cleanKw);
        let matches = 0;
        for (const kwWord of kwWords) {
          if (words.includes(kwWord) || (kwWord.length >= 4 && clean.includes(kwWord))) {
            matches++;
          }
        }
        if (matches === kwWords.length && kwWords.length > 0) {
          score += 60;
        } else if (matches > 1) {
          score += matches * 20;
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      best = s;
    }
  }

  return bestScore >= 55 ? best : null;
}

// -------------------------------------------------------------
// MOTOR 2: BUSCA TEXTUAL LITERAL & STEMMED NA BÍBLIA COMPLETA (~31.000 versículos)
// -------------------------------------------------------------
export interface ScoredVerseMatch {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  score: number;
  reference: string;
}

export function searchBibleFullText(
  rawQuery: string,
  version: "nvi" | "aa" = "nvi",
  maxResults = 3
): ScoredVerseMatch[] {
  if (!rawQuery || rawQuery.trim().length < 2) return [];

  const cleanQ = stripAccents(rawQuery);
  const originalTerms = tokenize(rawQuery);
  if (originalTerms.length === 0) return [];

  const originalStems = originalTerms.map(stem);
  const expandedTerms = expandTerms(originalTerms);
  const expandedStems = expandedTerms.map(stem);

  const dataset = loadBibleData(version);
  const scored: ScoredVerseMatch[] = [];

  for (const b of dataset) {
    for (let c = 0; c < b.chapters.length; c++) {
      const ch = b.chapters[c];
      for (let v = 0; v < ch.length; v++) {
        const text = ch[v];
        const cleanV = stripAccents(text);
        const vWords = cleanV.split(/[^\w\s]+/).join(" ").split(/\s+/).filter((w) => w.length >= 2);
        const vStems = vWords.map(stem);

        let score = 0;

        // 1. Frase idêntica
        if (cleanV.includes(cleanQ)) {
          score += 250;
        }

        // 2. Acertos de termos originais (por palavra inteira ou por stem)
        let origHits = 0;
        for (let i = 0; i < originalTerms.length; i++) {
          const t = originalTerms[i];
          const st = originalStems[i];
          if (cleanV.includes(t)) {
            origHits++;
            score += 35;
          } else if (vStems.includes(st)) {
            origHits++;
            score += 25;
          }
        }

        // Bônus se todos ou quase todos os termos originais estiverem no versículo
        if (origHits === originalTerms.length && originalTerms.length > 1) {
          score += 80;
        } else if (originalTerms.length > 2 && origHits >= originalTerms.length - 1) {
          score += 40;
        }

        // 3. Casamento de sinônimos/termos expandidos
        for (let i = 0; i < expandedTerms.length; i++) {
          const st = expandedStems[i];
          if (vStems.includes(st)) {
            score += 10;
          }
        }

        if (score >= 35) {
          scored.push({
            book: b.name,
            chapter: c + 1,
            verse: v + 1,
            text: text.trim(),
            score,
            reference: `${b.name} ${c + 1}:${v + 1}`,
          });
        }
      }
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, maxResults);
}

// -------------------------------------------------------------
// MOTOR 3: RESOLVEDOR MESTRE MULTINÍVEL (Tier 1 a Tier 5)
// -------------------------------------------------------------
export interface ResolvedBibleResponse {
  success: boolean;
  isAiGenerated: boolean;
  themeTitle: string;
  passage: PassageResult;
  pastoralReflection: string;
  historicalContext: string;
  guidedPrayer: string;
  practicalStep: string;
  alternativePassages: any[];
}

export function buildStoryResponse(story: BiblicalStoryItem, version: "nvi" | "aa" = "nvi"): ResolvedBibleResponse {
  const passage =
    getPassage(story.book, story.chapter, story.startVerse, story.endVerse, version) ||
    getPassage("Salmos", 23, 1, 6, version)!;

  return {
    success: true,
    isAiGenerated: false,
    themeTitle: story.title,
    passage,
    pastoralReflection: story.reflection,
    historicalContext: story.historicalContext,
    guidedPrayer: story.guidedPrayer,
    practicalStep: story.practicalStep,
    alternativePassages: [],
  };
}

export function buildFullTextSearchResponse(
  m: ScoredVerseMatch,
  version: "nvi" | "aa" = "nvi"
): ResolvedBibleResponse | null {
  // Pega um pequeno contexto contíguo (até 2 versículos após, se houver) para melhor leitura
  const startV = m.verse;
  const endV = Math.min(startV + 1, m.verse + 1);
  const p = getPassage(m.book, m.chapter, startV, endV, version) || getPassage(m.book, m.chapter, startV, startV, version);
  if (!p) return null;

  return {
    success: true,
    isAiGenerated: false,
    themeTitle: `Passagem Encontrada: ${p.reference}`,
    passage: p,
    pastoralReflection: `A passagem de ${p.reference} responde com precisão à sua busca nas Sagradas Escrituras. Ao meditar neste texto divino, permita que a verdade de Deus ilumine sua mente, renove suas forças e guie os seus passos em paz e retidão.`,
    historicalContext: `Texto sagrado canônico das Escrituras, verificado no livro de ${m.book}, capítulo ${m.chapter}.`,
    guidedPrayer: `Senhor Deus, agradeço pela Tua Palavra viva que nos orienta em todo o tempo. Que esta verdade se cumpra e gere frutos em minha vida. Em nome de Jesus, amém.`,
    practicalStep: `Abra o capítulo completo de ${m.book} ${m.chapter} na sua Bíblia para meditar no contexto de toda a passagem.`,
    alternativePassages: [],
  };
}

// Lista diversificada de consolo com 15 versículos distintos (EVITA LOOP EM SALMO 23)
export const DIVERSE_COMFORT_VERSES = [
  { book: "Isaías", chapter: 41, start: 10, end: 10, title: "Não Temas, Eu Sou Contigo" },
  { book: "Filipenses", chapter: 4, start: 6, end: 7, title: "A Paz que Excede Todo Entendimento" },
  { book: "Mateus", chapter: 11, start: 28, end: 30, title: "Descanso para a Alma Cansada" },
  { book: "Romanos", chapter: 8, start: 28, end: 28, title: "Todas as Coisas Cooperam para o Bem" },
  { book: "Jeremias", chapter: 29, start: 11, end: 11, title: "Planos de Paz e Esperança" },
  { book: "Salmos", chapter: 46, start: 1, end: 2, title: "Deus é o Nosso Refúgio e Fortaleza" },
  { book: "Salmos", chapter: 121, start: 1, end: 2, title: "O Meu Socorro Vem do Senhor" },
  { book: "Josué", chapter: 1, start: 9, end: 9, title: "Sê Forte e Corajoso" },
  { book: "João", chapter: 14, start: 27, end: 27, title: "A Minha Paz vos Dou" },
  { book: "Salmos", chapter: 34, start: 18, end: 18, title: "Perto Está o Senhor dos Que Têm o Coração Quebrantado" },
  { book: "Provérbios", chapter: 3, start: 5, end: 6, title: "Confia no Senhor de Todo o Teu Coração" },
  { book: "1 Pedro", chapter: 5, start: 7, end: 7, title: "Lançando Sobre Ele Toda a Vossa Ansiedade" },
  { book: "Salmos", chapter: 23, start: 1, end: 6, title: "O Senhor é o Meu Pastor" },
];

export function getDiverseComfortFallback(version: "nvi" | "aa" = "nvi"): ResolvedBibleResponse {
  const pick = DIVERSE_COMFORT_VERSES[Math.floor(Math.random() * DIVERSE_COMFORT_VERSES.length)];
  const p = getPassage(pick.book, pick.chapter, pick.start, pick.end, version)!;

  return {
    success: true,
    isAiGenerated: false,
    themeTitle: pick.title,
    passage: p,
    pastoralReflection:
      "Mesmo nos dias em que o coração se sente pesado e as respostas parecem distantes, a Palavra de Deus permanece como âncora firme para a nossa alma. Ele conhece cada pensamento seu e cuida de você com ternura inabalável.",
    historicalContext:
      "As Escrituras Sagradas foram inspiradas pelo Espírito Santo para trazer luz, consolo e esperança em todas as estações da vida.",
    guidedPrayer:
      "Senhor Deus, derrama a Tua paz santa sobre o meu coração neste momento. Acalma as minhas tempestades interiores e ensina-me a descansar na certeza do Teu cuidado. Em nome de Jesus, amém.",
    practicalStep:
      "Feche os olhos por alguns instantes, respire fundo e repita este versículo em seu pensamento como uma oração de entrega.",
    alternativePassages: [],
  };
}

// -------------------------------------------------------------
// CATÁLOGO EXPANDIDO DE PASSAGENS POR TEMA (Para busca sem repetições e sem loop)
// -------------------------------------------------------------
export interface CuratedTopicPassage {
  book: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
  note: string;
}

export const TOPIC_PASSAGES: Record<string, CuratedTopicPassage[]> = {
  financeiro_provisao: [
    { book: "Filipenses", chapter: 4, startVerse: 19, endVerse: 19, note: "O meu Deus suprirá todas as vossas necessidades" },
    { book: "Mateus", chapter: 6, startVerse: 31, endVerse: 33, note: "Buscai primeiro o Reino de Deus e a sua justiça" },
    { book: "Salmos", chapter: 37, startVerse: 25, endVerse: 25, note: "Nunca vi desamparado o justo nem a sua descendência a mendigar" },
    { book: "Malaquias", chapter: 3, startVerse: 10, endVerse: 10, note: "Abrirei as janelas do céu e derramarei bênção sem medida" },
    { book: "2 Coríntios", chapter: 9, startVerse: 8, endVerse: 8, note: "Deus é poderoso para fazer abundar em vós toda a graça" },
    { book: "Hebreus", chapter: 13, startVerse: 5, endVerse: 5, note: "Seja a vossa vida sem avareza; contentai-vos com o que tendes" },
    { book: "Lucas", chapter: 12, startVerse: 29, endVerse: 31, note: "Não vos inquieteis com o que haveis de comer ou beber" },
    { book: "Salmos", chapter: 34, startVerse: 10, endVerse: 10, note: "Aos que buscam o Senhor bem nenhum lhes faltará" },
    { book: "Provérbios", chapter: 3, startVerse: 9, endVerse: 10, note: "Honra ao Senhor com os teus bens e com as primícias" },
    { book: "1 Timóteo", chapter: 6, startVerse: 6, endVerse: 8, note: "A piedade com contentamento é grande fonte de lucro" },
    { book: "Deuteronômio", chapter: 8, startVerse: 18, endVerse: 18, note: "Ele é o que te dá força para adquirires riquezas" },
    { book: "Salmos", chapter: 23, startVerse: 1, endVerse: 1, note: "O Senhor é o meu pastor; nada me faltará" }
  ],
  ansiedade_futuro: [
    { book: "Filipenses", chapter: 4, startVerse: 6, endVerse: 7, note: "Não andeis ansiosos por coisa alguma; antes, orai" },
    { book: "1 Pedro", chapter: 5, startVerse: 7, endVerse: 7, note: "Lançando sobre ele toda a vossa ansiedade" },
    { book: "Salmos", chapter: 94, startVerse: 19, endVerse: 19, note: "Quando a ansiedade me dominava, o teu consolo trouxe alívio" },
    { book: "Isaías", chapter: 41, startVerse: 10, endVerse: 10, note: "Não temas, porque eu sou contigo; não te assombres" },
    { book: "Salmos", chapter: 27, startVerse: 1, endVerse: 1, note: "O Senhor é a minha luz e a minha salvação; a quem temerei?" },
    { book: "Mateus", chapter: 6, startVerse: 25, endVerse: 27, note: "Não andeis ansiosos pela vossa vida, quanto ao alimento ou vestuário" },
    { book: "Salmos", chapter: 56, startVerse: 3, endVerse: 3, note: "Em me vindo o temor, hei de confiar em ti" },
    { book: "2 Timóteo", chapter: 1, startVerse: 7, endVerse: 7, note: "Deus não nos deu espírito de covardia, mas de poder e amor" },
    { book: "João", chapter: 14, startVerse: 27, endVerse: 27, note: "Deixo-vos a paz, a minha paz vos dou; não se turbe o vosso coração" },
    { book: "Salmos", chapter: 46, startVerse: 1, endVerse: 2, note: "Deus é o nosso refúgio e fortaleza, socorro bem presente" }
  ],
  luto_tristeza_perda: [
    { book: "Salmos", chapter: 34, startVerse: 18, endVerse: 18, note: "Perto está o Senhor dos que têm o coração quebrantado" },
    { book: "João", chapter: 11, startVerse: 25, endVerse: 26, note: "Eu sou a ressurreição e a vida; quem crê em mim viverá" },
    { book: "Apocalipse", chapter: 21, startVerse: 4, endVerse: 4, note: "Ele enxugará dos seus olhos toda lágrima e não haverá mais morte" },
    { book: "Mateus", chapter: 5, startVerse: 4, endVerse: 4, note: "Bem-aventurados os que choram, porque eles serão consolados" },
    { book: "Salmos", chapter: 23, startVerse: 4, endVerse: 4, note: "Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum" },
    { book: "2 Coríntios", chapter: 1, startVerse: 3, endVerse: 4, note: "O Pai das misericórdias e Deus de toda consolação nos conforta" },
    { book: "1 Tessalonicenses", chapter: 4, startVerse: 13, endVerse: 14, note: "Para que não vos entristeçais como os que não têm esperança" },
    { book: "Salmos", chapter: 147, startVerse: 3, endVerse: 3, note: "Ele sara os quebrantados de coração e cura-lhes as feridas" },
    { book: "Romanos", chapter: 8, startVerse: 38, endVerse: 39, note: "Nem a morte nem a vida poderá nos separar do amor de Deus" }
  ],
  cansaco_esgotamento: [
    { book: "Mateus", chapter: 11, startVerse: 28, endVerse: 30, note: "Venham a mim todos os cansados e sobrecarregados, e eu vos aliviarei" },
    { book: "Isaías", chapter: 40, startVerse: 29, endVerse: 31, note: "Dá força ao cansado e multiplica as forças ao que não tem vigor" },
    { book: "Êxodo", chapter: 33, startVerse: 14, endVerse: 14, note: "A minha presença irá contigo, e eu te darei descanso" },
    { book: "Salmos", chapter: 127, startVerse: 2, endVerse: 2, note: "Aos seus amados Deus dá o sono reparador" },
    { book: "Salmos", chapter: 62, startVerse: 1, endVerse: 2, note: "A minha alma descansa somente em Deus; dele vem minha salvação" },
    { book: "Gálatas", chapter: 6, startVerse: 9, endVerse: 9, note: "Não nos cansemos de fazer o bem, pois a seu tempo ceifaremos" },
    { book: "Salmos", chapter: 23, startVerse: 2, endVerse: 3, note: "Guia-me mansamente a águas mansas. Refrigera a minha alma" }
  ],
  solidao_abandono: [
    { book: "Isaías", chapter: 49, startVerse: 15, endVerse: 16, note: "Acaso pode uma mãe esquecer-se de seu filho? Eu não me esquecerei de ti" },
    { book: "Salmos", chapter: 27, startVerse: 10, endVerse: 10, note: "Ainda que meu pai e minha mãe me abandonem, o Senhor me acolherá" },
    { book: "Mateus", chapter: 28, startVerse: 20, endVerse: 20, note: "Eis que estou convosco todos os dias, até o fim dos tempos" },
    { book: "Josué", chapter: 1, startVerse: 5, endVerse: 5, note: "Como fui com Moisés, assim serei contigo; não te deixarei" },
    { book: "Salmos", chapter: 68, startVerse: 5, endVerse: 6, note: "Pai dos órfãos e juiz das viúvas é Deus em sua santa morada" },
    { book: "Salmos", chapter: 139, startVerse: 7, endVerse: 10, note: "Para onde me ausentarei do teu Espírito? Tua mão me susterá" }
  ],
  enfermidade_cura: [
    { book: "Jeremias", chapter: 17, startVerse: 14, endVerse: 14, note: "Cura-me, Senhor, e serei curado; salva-me, e serei salvo" },
    { book: "Tiago", chapter: 5, startVerse: 14, endVerse: 15, note: "A oração da fé salvará o enfermo, e o Senhor o levantará" },
    { book: "Salmos", chapter: 103, startVerse: 2, endVerse: 3, note: "Bendize ao Senhor, que sara todas as tuas enfermidades" },
    { book: "Isaías", chapter: 53, startVerse: 4, endVerse: 5, note: "Pelas suas pisaduras fomos sarados" },
    { book: "Êxodo", chapter: 15, startVerse: 26, endVerse: 26, note: "Eu sou o Senhor que te sara" },
    { book: "Salmos", chapter: 30, startVerse: 2, endVerse: 2, note: "Senhor meu Deus, clamei por socorro e tu me saraste" }
  ],
  perdao_magoa: [
    { book: "Efésios", chapter: 4, startVerse: 31, endVerse: 32, note: "Antes, sede benignos, perdoando-vos mutuamente como Deus vos perdoou" },
    { book: "Colossenses", chapter: 3, startVerse: 13, endVerse: 13, note: "Assim como o Senhor vos perdoou, perdoai vós também" },
    { book: "Mateus", chapter: 6, startVerse: 14, endVerse: 15, note: "Se perdoardes aos homens as suas ofensas, vosso Pai vos perdoará" },
    { book: "Mateus", chapter: 18, startVerse: 21, endVerse: 22, note: "Não até sete vezes, mas até setenta vezes sete" },
    { book: "Provérbios", chapter: 19, startVerse: 11, endVerse: 11, note: "A discrição do homem o torna paciente e sua glória é esquecer as ofensas" },
    { book: "Romanos", chapter: 12, startVerse: 19, endVerse: 21, note: "Não te deixes vencer do mal, mas vence o mal com o bem" }
  ],
  fe_esperanca_desanimo: [
    { book: "Isaías", chapter: 40, startVerse: 28, endVerse: 31, note: "Os que esperam no Senhor renovam as suas forças como águias" },
    { book: "Hebreus", chapter: 11, startVerse: 1, endVerse: 1, note: "A fé é a certeza das coisas que se esperam e a convicção do que não se vê" },
    { book: "Marcos", chapter: 9, startVerse: 24, endVerse: 24, note: "Eu creio! Ajuda-me na minha falta de fé!" },
    { book: "Romanos", chapter: 8, startVerse: 28, endVerse: 28, note: "Todas as coisas cooperam para o bem daqueles que amam a Deus" },
    { book: "Jeremias", chapter: 29, startVerse: 11, endVerse: 11, note: "Planos de paz e não de mal, para vos dar um futuro e uma esperança" },
    { book: "Salmos", chapter: 42, startVerse: 11, endVerse: 11, note: "Por que estás abatida, ó minha alma? Espera em Deus, pois ainda o louvarei" }
  ],
  sabedoria_direcao: [
    { book: "Provérbios", chapter: 3, startVerse: 5, endVerse: 6, note: "Confia no Senhor de todo o teu coração e Ele endireitará tuas veredas" },
    { book: "Salmos", chapter: 119, startVerse: 105, endVerse: 105, note: "Lâmpada para os meus pés é a tua palavra e luz para o meu caminho" },
    { book: "Tiago", chapter: 1, startVerse: 5, endVerse: 5, note: "Se alguém tem falta de sabedoria, peça-a a Deus, que a todos dá com generosidade" },
    { book: "Salmos", chapter: 32, startVerse: 8, endVerse: 8, note: "Instruir-te-ei e ensinar-te-ei o caminho que deves seguir" },
    { book: "Jeremias", chapter: 33, startVerse: 3, endVerse: 3, note: "Clama a mim e responder-te-ei, e anunciar-te-ei coisas grandes" }
  ],
  casamento_familia: [
    { book: "1 Coríntios", chapter: 13, startVerse: 4, endVerse: 7, note: "O amor é paciente, é benigno; não arde em ciúmes... tudo sofre, tudo crê" },
    { book: "Eclesiastes", chapter: 4, startVerse: 9, endVerse: 12, note: "Melhor é serem dois do que um... o cordão de três dobras não se rompe fácil" },
    { book: "Colossenses", chapter: 3, startVerse: 12, endVerse: 14, note: "Revesti-vos de amor, que é o vínculo da perfeição" },
    { book: "Efésios", chapter: 4, startVerse: 2, endVerse: 3, note: "Com toda humildade e mansidão, suportando-vos mutuamente em amor" },
    { book: "Provérbios", chapter: 14, startVerse: 1, endVerse: 1, note: "A mulher sábia edifica a sua casa" }
  ]
};

export interface AlternativePassageItem {
  reference: string;
  note: string;
  fullText: string;
  book: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
}

export function getMorePassagesForContext(params: {
  context: string;
  themeId?: string;
  excludeReferences: string[];
  version?: "nvi" | "aa";
  limit?: number;
}): AlternativePassageItem[] {
  const {
    context = "",
    themeId,
    excludeReferences = [],
    version = "nvi",
    limit = 3,
  } = params;

  // Normaliza o set de exclusões para comparação sem espaços e sem acentos
  const excludedSet = new Set(
    excludeReferences.map((r) => stripAccents(r).replace(/\s+/g, ""))
  );

  const results: AlternativePassageItem[] = [];
  const addedRefs = new Set<string>();

  const isExcluded = (ref: string) => {
    const norm = stripAccents(ref).replace(/\s+/g, "");
    return excludedSet.has(norm) || addedRefs.has(norm);
  };

  // 1. Prioridade A: Catálogo Curado por Tema
  let candidateCurated: CuratedTopicPassage[] = [];
  if (themeId && TOPIC_PASSAGES[themeId]) {
    candidateCurated = TOPIC_PASSAGES[themeId];
  } else {
    // Tenta encontrar um tema correspondente pelo contexto
    const cleanCtx = stripAccents(context);
    for (const [key, passages] of Object.entries(TOPIC_PASSAGES)) {
      if (cleanCtx.includes(key.replace(/_/g, " ")) || key.split("_").some((k) => cleanCtx.includes(k))) {
        candidateCurated = passages;
        break;
      }
    }
    // Se não casou por chave específica, reúne do acervo geral
    if (candidateCurated.length === 0) {
      candidateCurated = Object.values(TOPIC_PASSAGES).flat();
    }
  }

  for (const c of candidateCurated) {
    if (results.length >= limit) break;
    const p = getPassage(c.book, c.chapter, c.startVerse, c.endVerse, version);
    if (p && !isExcluded(p.reference)) {
      addedRefs.add(stripAccents(p.reference).replace(/\s+/g, ""));
      results.push({
        reference: p.reference,
        note: c.note,
        fullText: p.fullText,
        book: c.book,
        chapter: c.chapter,
        startVerse: c.startVerse,
        endVerse: c.endVerse,
      });
    }
  }

  // 2. Prioridade B: Busca Textual Geral se ainda precisar de mais alternativas
  if (results.length < limit && context.trim().length >= 3) {
    const textMatches = searchBibleFullText(context, version, 25);
    for (const m of textMatches) {
      if (results.length >= limit) break;
      const startV = m.verse;
      const endV = Math.min(startV + 1, m.verse + 1);
      const p = getPassage(m.book, m.chapter, startV, endV, version) || getPassage(m.book, m.chapter, startV, startV, version);
      if (p && !isExcluded(p.reference)) {
        addedRefs.add(stripAccents(p.reference).replace(/\s+/g, ""));
        results.push({
          reference: p.reference,
          note: `Passagem em ${m.book} que fala ao seu coração`,
          fullText: p.fullText,
          book: m.book,
          chapter: m.chapter,
          startVerse: p.startVerse,
          endVerse: p.endVerse,
        });
      }
    }
  }

  // 3. Prioridade C: Passagens Diversificadas de Consolo (Garantia de não repetição)
  if (results.length < limit) {
    for (const c of DIVERSE_COMFORT_VERSES) {
      if (results.length >= limit) break;
      const p = getPassage(c.book, c.chapter, c.start, c.end, version);
      if (p && !isExcluded(p.reference)) {
        addedRefs.add(stripAccents(p.reference).replace(/\s+/g, ""));
        results.push({
          reference: p.reference,
          note: c.title,
          fullText: p.fullText,
          book: c.book,
          chapter: c.chapter,
          startVerse: c.start,
          endVerse: c.end,
        });
      }
    }
  }

  return results;
}

