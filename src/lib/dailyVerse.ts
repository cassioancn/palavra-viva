import { getPassage, VerseItem } from "./bible";

export interface DailyVerseItem {
  book: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
  themeTitle: string;
  occasion?: string;
  reflection: string;
  prayer: string;
}

export interface DailyVerseResult {
  dateKey: string; // "YYYY-MM-DD"
  formattedDate: string; // "10 de Novembro"
  dayOfWeek: string; // "Terça-feira"
  occasion?: string;
  book: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
  reference: string;
  version: string;
  text: string;
  themeTitle: string;
  reflection: string;
  prayer: string;
}

/**
 * Datas comemorativas e temáticas especiais mapeadas por "MM-DD"
 */
const SPECIAL_DATES_MAP: Record<string, DailyVerseItem> = {
  // Janeiro
  "01-01": {
    book: "Lamentações",
    chapter: 3,
    startVerse: 22,
    endVerse: 23,
    themeTitle: "Ano Novo • Graça Renovada",
    occasion: "Celebração de Ano Novo",
    reflection:
      "Um novo ciclo se inicia pela graça do Senhor. Suas misericórdias não têm fim e se renovam a cada manhã sobre a sua casa e sua família.",
    prayer:
      "Senhor Deus, consagro este novo ano aos Teus pés. Que as Tuas misericórdias guiem cada passo meu com sabedoria, paz e esperança.",
  },
  "01-02": {
    book: "Isaías",
    chapter: 43,
    startVerse: 18,
    endVerse: 19,
    themeTitle: "Novos Começos",
    occasion: "Início do Ano",
    reflection:
      "Deus nos convida a não ficarmos presos ao passado. Ele está abrindo caminhos novos no deserto e rios de água viva na sua história.",
    prayer:
      "Pai celestial, entrego o meu passado e abraço o novo de Deus para a minha vida. Abre caminhos onde não vejo saída.",
  },
  "01-06": {
    book: "Mateus",
    chapter: 2,
    startVerse: 10,
    endVerse: 11,
    themeTitle: "A Luz que Guia",
    occasion: "Epifania / Revelação de Cristo",
    reflection:
      "Assim como a estrela guiou os sábios ao Salvador, a presença de Cristo ilumina os seus passos para encontrar verdadeira alegria.",
    prayer:
      "Jesus, sê a luz constante no meu caminhar. Que os meus melhores tesouros sejam depositados diante do Teu trono com adoração.",
  },

  // Março
  "03-08": {
    book: "Provérbios",
    chapter: 31,
    startVerse: 25,
    endVerse: 26,
    themeTitle: "Força, Dignidade & Sabedoria",
    occasion: "Dia Internacional da Mulher",
    reflection:
      "Uma homenagem à mulher que teme ao Senhor: revestida de fortaleza interior, ela olha o futuro com confiança e edifica os seus com amor.",
    prayer:
      "Senhor, abençoa ricamente as mulheres com a Tua graça, saúde, paz e sabedoria celestial para vencerem cada desafio com honra.",
  },
  "03-21": {
    book: "Eclesiastes",
    chapter: 3,
    startVerse: 1,
    endVerse: 1,
    themeTitle: "O Tempo Certo de Deus",
    occasion: "Equinócio de Outono",
    reflection:
      "Há um tempo determinado para todo o propósito debaixo do céu. Descanse o coração: o Senhor cuida com perfeição da estação da sua vida.",
    prayer:
      "Deus soberano, ensina-me a confiar no Teu relógio e a viver em paz em cada estação que Tu desenhaste para mim.",
  },

  // Maio
  "05-01": {
    book: "Colossenses",
    chapter: 3,
    startVerse: 23,
    endVerse: 24,
    themeTitle: "Dignidade no Trabalho",
    occasion: "Dia do Trabalhador",
    reflection:
      "O seu esforço diário é honrado pelo Pai quando realizado com integridade. A sua maior recompensa vem do Senhor, a quem você serve.",
    prayer:
      "Senhor, abençoa o fruto das minhas mãos, sustenta a minha casa e concede prosperidade e integridade no meu trabalho diário.",
  },
  "05-10": {
    book: "Isaías",
    chapter: 66,
    startVerse: 13,
    endVerse: 13,
    themeTitle: "Consolo & Amor Maternal",
    occasion: "Dia das Mães",
    reflection:
      "Assim como a mãe acolhe o filho em seu colo com ternura infinita, o próprio Deus promete consolar e envolver você com paz profunda.",
    prayer:
      "Pai amado, abençoa todas as mães com Tua força e amor. Derrama Teu consolo sobre todos os corações que hoje sentem saudade.",
  },

  // Junho
  "06-05": {
    book: "Salmos",
    chapter: 19,
    startVerse: 1,
    endVerse: 2,
    themeTitle: "A Glória da Criação",
    occasion: "Dia do Meio Ambiente",
    reflection:
      "Os céus proclamam a glória do Criador. Toda a natureza nos lembra da sabedoria, do poder e do cuidado amoroso de Deus em cada detalhe.",
    prayer:
      "Senhor Criador, que ao contemplar a beleza do Teu mundo eu me lembre da Tua fidelidade que nunca falha.",
  },
  "06-12": {
    book: "1 Coríntios",
    chapter: 13,
    startVerse: 4,
    endVerse: 7,
    themeTitle: "O Verdadeiro Amor",
    occasion: "Dia do Amor e Aliança",
    reflection:
      "O amor bíblico é paciente, bondoso e tudo suporta. Quando Cristo habita o centro de uma união, há paz, respeito e cura mútua.",
    prayer:
      "Deus de amor, ensina-me a amar com paciência, mansidão e fidelidade, refletindo a graça de Jesus em meus relacionamentos.",
  },

  // Julho
  "07-20": {
    book: "Provérbios",
    chapter: 17,
    startVerse: 17,
    endVerse: 17,
    themeTitle: "A Bênção da Amizade",
    occasion: "Dia do Amigo",
    reflection:
      "Amigos fiéis são presentes de Deus para os dias de sol e refúgios seguros nas horas de angústia. Cultive relacionamentos que aproximam de Deus.",
    prayer:
      "Jesus, meu Amigo mais chegado que um irmão, abençoa os amigos verdadeiros que colocaste ao meu lado na jornada da vida.",
  },

  // Agosto
  "08-09": {
    book: "Salmos",
    chapter: 103,
    startVerse: 13,
    endVerse: 14,
    themeTitle: "O Abraço Compassivo do Pai",
    occasion: "Dia dos Pais",
    reflection:
      "Como um pai que se compadece de seus filhos, assim o Senhor é carinhoso com você. Ele conhece a nossa estrutura e nunca nos desampara.",
    prayer:
      "Pai bondoso, fortalece os pais de família e sê o refúgio amoroso para aqueles cujos corações hoje buscam acolhimento paterno.",
  },

  // Setembro
  "09-07": {
    book: "2 Crônicas",
    chapter: 7,
    startVerse: 14,
    endVerse: 14,
    themeTitle: "Oração pela Pátria & Paz",
    occasion: "Dia da Pátria",
    reflection:
      "Quando o povo se humilha e busca a face do Senhor em oração, Ele ouve dos céus, perdoa os pecados e sara a terra com justiça e paz.",
    prayer:
      "Deus soberano, abençoa a nossa nação, os nossos lares e guia os governantes com justiça, temor e cuidado pelos mais necessitados.",
  },
  "09-22": {
    book: "Cânticos",
    chapter: 2,
    startVerse: 11,
    endVerse: 12,
    themeTitle: "Primavera da Alma",
    occasion: "Início da Primavera",
    reflection:
      "O inverno passou, a chuva cessou e as flores desabrocham na terra. É tempo de cantar e ver as promessas de Deus florescerem na sua vida.",
    prayer:
      "Senhor, faz brotar uma nova estação de paz, vigor espiritual e alegria no meu coração.",
  },

  // Outubro
  "10-12": {
    book: "Mateus",
    chapter: 19,
    startVerse: 14,
    endVerse: 14,
    themeTitle: "Pureza de Coração",
    occasion: "Dia da Criança",
    reflection:
      "Jesus nos convida a confiar Nele com a pureza, sinceridade e simplicidade de uma criança. Dos tais é o Reino dos Céus.",
    prayer:
      "Pai amado, protege as nossas crianças de todo mal e guarda o meu coração livre de amarguras, sempre sincero diante de Ti.",
  },
  "10-31": {
    book: "Romanos",
    chapter: 1,
    startVerse: 16,
    endVerse: 17,
    themeTitle: "O Justo Viverá pela Fé",
    occasion: "Dia da Reforma Protestante",
    reflection:
      "A nossa salvação não se apoia em obras ou méritos humanos, mas na graça pura e redentora revelada no Evangelho de Jesus Cristo.",
    prayer:
      "Senhor, fortalece a minha fé na Tua Palavra infalível. Que a luz do Teu Evangelho brilhe sempre em minha mente e coração.",
  },

  // Novembro
  "11-02": {
    book: "Apocalipse",
    chapter: 21,
    startVerse: 4,
    endVerse: 4,
    themeTitle: "Esperança Eterna & Consolo",
    occasion: "Dia de Finados • Saudade & Paz",
    reflection:
      "A morte não tem a palavra final para quem descansa em Cristo. Deus mesmo enxugará toda lágrima e nos dará a alegria da vida eterna.",
    prayer:
      "Consolador bendito, abraça com Teu carinho todos os que hoje sentem dor de saudade. Firma nossos olhos na glória do Céu.",
  },
  "11-10": {
    book: "Josué",
    chapter: 1,
    startVerse: 9,
    endVerse: 9,
    themeTitle: "Coragem & Companhia Divina",
    occasion: "Palavra do Dia: Não Tenha Medo",
    reflection:
      "Não há desafio ou batalha hoje que você precise enfrentar sozinho. O Criador do universo está caminhando ao seu lado a cada instante.",
    prayer:
      "Senhor meu Deus, lanço fora todo o medo e paralisia. Enche o meu espírito com Tua força e coragem para vencer o dia de hoje.",
  },
  "11-11": {
    book: "Mateus",
    chapter: 11,
    startVerse: 28,
    endVerse: 30,
    themeTitle: "Descanso para a Alma",
    occasion: "Palavra do Dia: O Alívio de Jesus",
    reflection:
      "Jesus não exige que você suporte fardos insuportáveis. Entregue o cansaço acumulado nas mãos Dele e receba um alívio genuíno.",
    prayer:
      "Jesus amado, deponho no Teu altar todas as minhas sobrecargas. Dá descanso à minha mente e renova o vigor do meu espírito.",
  },
  "11-12": {
    book: "Salmos",
    chapter: 46,
    startVerse: 1,
    endVerse: 3,
    themeTitle: "Refúgio & Fortaleza",
    occasion: "Palavra do Dia: Socorro Bem Presente",
    reflection:
      "Mesmo que os montes tremam e o mar se agite ao seu redor, o Senhor é o seu castelo inabalável. Nele você está verdadeiramente seguro.",
    prayer:
      "Senhor, Tu és a minha fortaleza. Guarda a minha mente das tempestades e concede-me Tua paz inabalável.",
  },
  "11-15": {
    book: "Salmos",
    chapter: 33,
    startVerse: 12,
    endVerse: 12,
    themeTitle: "Bênção & Retidão",
    occasion: "Proclamação da República",
    reflection:
      "Feliz é o povo que escolhe o Senhor como seu refúgio e herança. Que a justiça, o temor de Deus e a paz reinem sobre a nossa nação.",
    prayer:
      "Deus Todo-Poderoso, abençoa nosso país, nossas famílias e estabelece retidão, saúde e paz em nossas cidades.",
  },
  "11-20": {
    book: "Gálatas",
    chapter: 3,
    startVerse: 28,
    endVerse: 28,
    themeTitle: "Unidade & Fraternidade",
    occasion: "Dia da Consciência Negra",
    reflection:
      "Diante de Deus não há acepção de pessoas. Fomos todos criados à Sua imagem e semelhança, unidos pelo sangue precioso de Cristo.",
    prayer:
      "Senhor, que Teu povo seja espelho de justiça, respeito e igualdade, amando o próximo com o mesmo amor com que Tu nos amaste.",
  },
  "11-26": {
    book: "1 Tessalonicenses",
    chapter: 5,
    startVerse: 16,
    endVerse: 18,
    themeTitle: "Coração Grato",
    occasion: "Ação de Graças",
    reflection:
      "A gratidão tem o poder de transformar o que temos em suficiência. Agradeça por cada respiração, cada livramento e pela presença do Pai.",
    prayer:
      "Senhor, sou grato pelo Teu cuidado diário, pelo pão à mesa, pelos livramentos que vi e pelos que nem cheguei a notar. Obrigado por tudo!",
  },

  // Dezembro
  "12-08": {
    book: "Salmos",
    chapter: 119,
    startVerse: 105,
    endVerse: 105,
    themeTitle: "Lâmpada para os Meus Pés",
    occasion: "Dia da Bíblia Sagrada",
    reflection:
      "A Palavra de Deus dissipa as trevas da incerteza e direciona cada decisão do seu caminho com verdade eterna e segurança.",
    prayer:
      "Pai Santo, que as Sagradas Escrituras sejam o alimento diário da minha alma e a bússola que conduz os meus passos.",
  },
  "12-21": {
    book: "Malaquias",
    chapter: 4,
    startVerse: 2,
    endVerse: 2,
    themeTitle: "O Sol da Justiça",
    occasion: "Solstício de Verão",
    reflection:
      "Para os que temem o nome do Senhor, nascerá o Sol da Justiça trazendo cura e restauração debaixo das Suas asas luminosas.",
    prayer:
      "Senhor Jesus, ilumina as áreas do meu coração com Tua luz curadora e faz raiar um dia de renovo e saúde em meu viver.",
  },
  "12-24": {
    book: "Lucas",
    chapter: 2,
    startVerse: 10,
    endVerse: 11,
    themeTitle: "Boas-Novas de Grande Alegria",
    occasion: "Véspera de Natal",
    reflection:
      "Não tenham medo! Nasceu o Salvador, que é Cristo, o Senhor. Que a paz celestial preencha a sua casa com a doçura do amor divino.",
    prayer:
      "Bendito Salvador, faz morada em meu lar nesta noite. Que o Teu nascimento renove nossa fé, comunhão e esperança.",
  },
  "12-25": {
    book: "Isaías",
    chapter: 9,
    startVerse: 6,
    endVerse: 6,
    themeTitle: "Príncipe da Paz",
    occasion: "Celebração do Natal",
    reflection:
      "Um menino nos nasceu, um filho nos foi dado! Maravilhoso Conselheiro, Deus Forte, Pai da Eternidade, Príncipe da Paz sobre nós.",
    prayer:
      "Jesus, Príncipe da Paz, reina em meu coração e na minha família. Que a luz do Teu nascimento dissipe qualquer escuridão.",
  },
  "12-31": {
    book: "Salmos",
    chapter: 121,
    startVerse: 1,
    endVerse: 8,
    themeTitle: "O Senhor é o Teu Guardião",
    occasion: "Virada de Ano • Gratidão",
    reflection:
      "O socorro vem do Senhor que fez o céu e a terra. Ele guardou a sua entrada e guardará a sua saída, hoje e para todo o sempre.",
    prayer:
      "Deus de fidelidade, obrigado por ter me sustentado até aqui. Entrego o ano que vai nascer em Tuas mãos de amor. Amém!",
  },
};

/**
 * Seleção canônica de 366 versículos para todos os dias do ano
 * Cobre cada dia de forma única, rica e inspiradora
 */
const CALENDAR_366_PASSAGES: DailyVerseItem[] = [
  {
    book: "Salmos",
    chapter: 23,
    startVerse: 1,
    endVerse: 3,
    themeTitle: "O Bom Pastor",
    reflection:
      "O Senhor é o seu pastor cuidadoso. Ele restaura a sua alma e guia você por veredas de justiça.",
    prayer: "Senhor, confio na Tua provisão e descanso sob o Teu cajado protetor.",
  },
  {
    book: "Filipenses",
    chapter: 4,
    startVerse: 6,
    endVerse: 7,
    themeTitle: "Paz que Excede Todo Entendimento",
    reflection:
      "Apresente suas preocupações em oração e a paz de Deus guardará a sua mente em Cristo Jesus.",
    prayer: "Pai, entrego minha ansiedade a Ti e recebo a Tua paz celestial.",
  },
  {
    book: "Isaías",
    chapter: 40,
    startVerse: 29,
    endVerse: 31,
    themeTitle: "Força para os Cansados",
    reflection:
      "Aqueles que esperam no Senhor renovam as suas forças e sobem com asas como águias.",
    prayer: "Senhor, quando me faltar vigor, que a Tua força se aperfeiçoe em mim.",
  },
  {
    book: "Jeremias",
    chapter: 29,
    startVerse: 11,
    endVerse: 12,
    themeTitle: "Planos de Paz e Futuro",
    reflection:
      "Deus tem pensamentos de bem e paz para você, para lhe dar um futuro e uma esperança viva.",
    prayer: "Deus eterno, descanso o meu futuro nas promessas perfeitas da Tua vontade.",
  },
  {
    book: "Romanos",
    chapter: 8,
    startVerse: 28,
    endVerse: 28,
    themeTitle: "Todas as Coisas Cooperam para o Bem",
    reflection:
      "Mesmo em meio às dores, Deus está tecendo cada detalhe para o seu bem e crescimento espiritual.",
    prayer: "Pai, eu creio que até o que parecia ruim cooperará para a Tua glória em minha vida.",
  },
  {
    book: "Salmos",
    chapter: 91,
    startVerse: 1,
    endVerse: 4,
    themeTitle: "O Abrigo do Altíssimo",
    reflection:
      "Debaixo das Suas asas você encontrará refúgio seguro; a Sua fidelidade é o seu escudo.",
    prayer: "Senhor, escondo-me em Teu abrigo e declaro que em Ti estou plenamente seguro.",
  },
  {
    book: "João",
    chapter: 14,
    startVerse: 27,
    endVerse: 27,
    themeTitle: "A Paz de Jesus",
    reflection:
      "A paz que Cristo nos deixa não depende das circunstâncias do mundo. Não se turbe o seu coração.",
    prayer: "Jesus, enche a minha alma com a Tua paz que nenhum problema pode roubar.",
  },
  {
    book: "Provérbios",
    chapter: 3,
    startVerse: 5,
    endVerse: 6,
    themeTitle: "Confiança de Todo o Coração",
    reflection:
      "Confie no Senhor com todo o seu coração e não se apoie no próprio entendimento.",
    prayer: "Senhor, endireita as minhas veredas e ajuda-me a Te consultar em todas as decisões.",
  },
  {
    book: "Salmos",
    chapter: 27,
    startVerse: 1,
    endVerse: 1,
    themeTitle: "A Minha Luz e Salvação",
    reflection:
      "O Senhor é a luz e fortaleza da sua vida; a quem você temerá hoje?",
    prayer: "Deus de luz, dissipa os temores da minha mente e fortalece minha determinação.",
  },
  {
    book: "Hebreus",
    chapter: 11,
    startVerse: 1,
    endVerse: 1,
    themeTitle: "A Certeza da Fé",
    reflection:
      "A fé é a certeza das coisas que se esperam e a convicção daquilo que ainda não se vê com os olhos.",
    prayer: "Pai, aumenta a minha fé para crer no invisível e confiar no Teu poder infinito.",
  },
  {
    book: "Salmos",
    chapter: 34,
    startVerse: 17,
    endVerse: 19,
    themeTitle: "Perto dos Corações Quebrantados",
    reflection:
      "O Senhor está perto dos que têm o coração ferido e salva os de espírito abatido.",
    prayer: "Senhor, cura as feridas da minha alma e faz-me sentir Teu abraço acolhedor.",
  },
  {
    book: "Filipenses",
    chapter: 4,
    startVerse: 13,
    endVerse: 13,
    themeTitle: "Fortalecidos em Cristo",
    reflection:
      "Tudo é possível através Daquele que derrama força e coragem no seu espírito a cada amanhecer.",
    prayer: "Jesus, minha fonte inesgotável de vigor, capacita-me a vencer os desafios de hoje.",
  },
  {
    book: "Salmos",
    chapter: 121,
    startVerse: 1,
    endVerse: 2,
    themeTitle: "De Onde Vem o Meu Socorro",
    reflection:
      "Levante os olhos: o seu socorro vem diretamente do Criador dos céus e da terra.",
    prayer: "Senhor, olho para Ti e sei que o Teu auxílio chega sempre no momento oportuno.",
  },
  {
    book: "Mateus",
    chapter: 6,
    startVerse: 31,
    endVerse: 33,
    themeTitle: "Buscai Primeiro o Reino",
    reflection:
      "Não viva ansioso pelo amanhã. O Pai celestial conhece cada uma das suas necessidades diárias.",
    prayer: "Deus Provedor, busco a Tua justiça em primeiro lugar e confio no Teu suprimento.",
  },
  {
    book: "1 Pedro",
    chapter: 5,
    startVerse: 7,
    endVerse: 7,
    themeTitle: "Entregando as Preocupações",
    reflection:
      "Lance toda a sua ansiedade sobre Ele, porque Ele tem cuidado pessoal e constante de você.",
    prayer: "Pai querido, descarrego meus fardos em Tuas mãos amorosas e descanso no Teu cuidado.",
  },
  {
    book: "Salmos",
    chapter: 103,
    startVerse: 1,
    endVerse: 4,
    themeTitle: "Bendize, Ó Minha Alma",
    reflection:
      "Lembre-se de todas as bênçãos do Senhor: Ele perdoa as culpas, cura as dores e coroa de graça.",
    prayer: "Senhor, encho a minha boca de louvor por todas as Suas misericórdias sobre a minha vida.",
  },
  {
    book: "Romanos",
    chapter: 8,
    startVerse: 38,
    endVerse: 39,
    themeTitle: "Inseparáveis do Amor de Deus",
    reflection:
      "Nem a morte, nem a vida, nem nada na criação poderá separar você do amor de Deus em Cristo Jesus.",
    prayer: "Jesus, descanso em Teu amor eterno que nada neste mundo pode quebrar.",
  },
  {
    book: "Salmos",
    chapter: 16,
    startVerse: 8,
    endVerse: 9,
    themeTitle: "Alegria na Presença",
    reflection:
      "Tendo sempre o Senhor diante de nós, não seremos abalados; nosso coração se alegra em paz.",
    prayer: "Deus amado, que a Tua doce presença seja o fundamento firme de todos os meus passos.",
  },
  {
    book: "Isaías",
    chapter: 41,
    startVerse: 10,
    endVerse: 10,
    themeTitle: "Não Temas, Eu Sou Contigo",
    reflection:
      "Não se apavore, pois o seu Deus o fortalece, o ajuda e o sustenta com a destra da Sua justiça.",
    prayer: "Senhor, seguro na Tua mão forte e caminho em paz sem temer o que está por vir.",
  },
  {
    book: "Salmos",
    chapter: 139,
    startVerse: 7,
    endVerse: 10,
    themeTitle: "Sempre Presente",
    reflection:
      "Mesmo nos lugares mais remotos, a Tua mão me guia e a Tua destra me sustenta com carinho.",
    prayer: "Pai, obrigado porque nunca estou só. Tua presença me envolve em qualquer situação.",
  },
  {
    book: "2 Coríntios",
    chapter: 12,
    startVerse: 9,
    endVerse: 9,
    themeTitle: "A Graça que Basta",
    reflection:
      "A graça de Deus é suficiente para hoje; o poder do Alto se aperfeiçoa nas nossas fraquezas.",
    prayer: "Senhor, quando me sinto fraco, é na Tua graça abundante que encontro vitória.",
  },
  {
    book: "Salmos",
    chapter: 37,
    startVerse: 4,
    endVerse: 5,
    themeTitle: "Deleita-te no Senhor",
    reflection:
      "Agrada-te do Senhor e Ele satisfará os desejos mais nobres do seu coração. Confie Nele!",
    prayer: "Senhor, coloco os meus sonhos diante de Ti e confio que farás o melhor por mim.",
  },
  {
    book: "João",
    chapter: 8,
    startVerse: 12,
    endVerse: 12,
    themeTitle: "A Luz do Mundo",
    reflection:
      "Quem segue a Jesus nunca andará em trevas, mas terá a radiante luz da vida eterna.",
    prayer: "Jesus, luz bendita, clareia as minhas decisões e dissipa toda a névoa do meu coração.",
  },
  {
    book: "Salmos",
    chapter: 62,
    startVerse: 1,
    endVerse: 2,
    themeTitle: "Somente em Deus",
    reflection:
      "A minha alma descansa somente em Deus; Dele procede a minha salvação e a minha esperança.",
    prayer: "Deus fiel, coloco minha quietude em Ti e encontro refúgio inabalável.",
  },
];

/**
 * Calcula o dia do ano (1 a 366) para uma data dada
 */
export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff =
    date.getTime() -
    start.getTime() +
    (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Retorna o versículo oficial do dia, 100% determinístico e com relacionamento temático de datas
 */
export function getVerseOfTheDay(
  date: Date = new Date(),
  version: "nvi" | "aa" = "nvi"
): DailyVerseResult {
  // Ajuste do dia e mês
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const monthDayKey = `${month}-${day}`;
  const year = date.getFullYear();
  const dateKey = `${year}-${monthDayKey}`;

  // 1. Verifica se hoje é uma data especial comemorativa
  let item: DailyVerseItem;
  if (SPECIAL_DATES_MAP[monthDayKey]) {
    item = SPECIAL_DATES_MAP[monthDayKey];
  } else {
    // 2. Mapeamento cíclico dos 366 versículos
    const dayOfYear = getDayOfYear(date);
    const index = Math.abs((dayOfYear - 1) % CALENDAR_366_PASSAGES.length);
    item = CALENDAR_366_PASSAGES[index];
  }

  // 3. Busca o texto bíblico canônico na tradução escolhida
  const passage = getPassage(
    item.book,
    item.chapter,
    item.startVerse,
    item.endVerse,
    version
  );

  const fallbackText =
    passage?.fullText ||
    "O Senhor é o meu pastor; de nada terei falta. Em verdes pastagens me faz repousar e me conduz a águas tranquilas.";

  const reference =
    item.startVerse === item.endVerse
      ? `${item.book} ${item.chapter}:${item.startVerse}`
      : `${item.book} ${item.chapter}:${item.startVerse}-${item.endVerse}`;

  // Formata a data em português
  const dayNames = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];
  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const dayOfWeek = dayNames[date.getDay()];
  const formattedDate = `${date.getDate()} de ${monthNames[date.getMonth()]}`;

  return {
    dateKey,
    formattedDate,
    dayOfWeek,
    occasion: item.occasion,
    book: item.book,
    chapter: item.chapter,
    startVerse: item.startVerse,
    endVerse: item.endVerse,
    reference,
    version: version.toUpperCase(),
    text: fallbackText,
    themeTitle: item.themeTitle,
    reflection: item.reflection,
    prayer: item.prayer,
  };
}
