export const FAIR = {
  edition: '84ª',
  name: 'FENINJER+',
  slogan: 'A maior feira de joias da América Latina',
  start: new Date('2027-02-15T10:00:00-03:00'),
  datesLabel: '15 a 18 de fevereiro de 2027',
  venue: 'Transamérica Expo Center',
  halls: 'Halls D e E',
  address: 'Av. Dr. Mário Villas Boas Rodrigues, 387 · Santo Amaro · São Paulo, SP',
  hours: [
    { days: 'Segunda a quarta', time: '10h às 20h' },
    { days: 'Quinta', time: '10h às 18h' },
  ],
  stats: [
    { value: '+300', label: 'expositores' },
    { value: '7', label: 'setores' },
    { value: '4', label: 'dias de negócios' },
  ],
};

export type EventCat = 'palestra' | 'design' | 'negocios' | 'lancamento' | 'networking';

export const EVENT_CATS: { id: EventCat; label: string; color: string }[] = [
  { id: 'palestra', label: 'Palestras', color: '#FF5100' },
  { id: 'design', label: 'Talks Design', color: '#B0533A' },
  { id: 'negocios', label: 'Negócios', color: '#2F4858' },
  { id: 'lancamento', label: 'Lançamentos', color: '#2E7D6B' },
  { id: 'networking', label: 'Networking', color: '#8A4FC4' },
];

export type PlaceId = 'auditorio' | 'espaco-design' | 'arena' | 'praca' | 'lounge' | 'credenciamento';

export type FairEvent = {
  id: string;
  day: 15 | 16 | 17 | 18;
  start: string;
  end: string;
  title: string;
  speaker?: string;
  place: PlaceId;
  cat: EventCat;
  description: string;
};

export const DAYS: { day: FairEvent['day']; weekday: string; short: string }[] = [
  { day: 15, weekday: 'Segunda', short: 'Seg' },
  { day: 16, weekday: 'Terça', short: 'Ter' },
  { day: 17, weekday: 'Quarta', short: 'Qua' },
  { day: 18, weekday: 'Quinta', short: 'Qui' },
];

export const EVENTS: FairEvent[] = [
  { id: 'e1', day: 15, start: '10:00', end: '11:00', title: 'Abertura oficial da 84ª FENINJER+', speaker: 'Organização da feira e convidados', place: 'auditorio', cat: 'networking', description: 'Cerimônia de abertura com autoridades do setor, apresentação dos números da edição e corte da fita.' },
  { id: 'e2', day: 15, start: '11:30', end: '12:30', title: 'Tendências de joalheria 2027', speaker: 'Renata Alves e Paulo Teixeira', place: 'auditorio', cat: 'palestra', description: 'Cores, formas e materiais que vão dominar as vitrines no próximo ano, com foco no consumidor brasileiro.' },
  { id: 'e3', day: 15, start: '14:00', end: '14:40', title: 'Talk: o traço autoral na joia brasileira', speaker: 'Coletivo de designers do Espaço Design', place: 'espaco-design', cat: 'design', description: 'Bate-papo com designers sobre processo criativo, identidade e como levar peças autorais ao varejo.' },
  { id: 'e4', day: 15, start: '16:00', end: '18:00', title: 'Rodada de negócios · Varejo Sul e Sudeste', place: 'arena', cat: 'negocios', description: 'Encontros agendados de 20 minutos entre lojistas e fabricantes. Inscrição no credenciamento.' },
  { id: 'e5', day: 15, start: '18:30', end: '20:00', title: 'Happy hour de boas-vindas', place: 'lounge', cat: 'networking', description: 'Encontro informal entre expositores e visitantes, com música ao vivo.' },

  { id: 'e6', day: 16, start: '10:30', end: '11:30', title: 'Gestão de estoque para joalherias', speaker: 'Ricardo Lemos · especialista em varejo', place: 'auditorio', cat: 'palestra', description: 'Como dimensionar o estoque, girar coleções e reduzir capital parado no cofre.' },
  { id: 'e7', day: 16, start: '13:00', end: '13:40', title: 'Talk: sustentabilidade e ouro rastreável', speaker: 'Instituto do setor', place: 'espaco-design', cat: 'design', description: 'Rastreabilidade, certificações e como comunicar origem responsável ao cliente final.' },
  { id: 'e8', day: 16, start: '15:00', end: '16:00', title: 'Lançamento do livro “Gemas do Brasil”', speaker: 'Helena Prado · gemóloga', place: 'lounge', cat: 'lancamento', description: 'Sessão de autógrafos e bate-papo sobre a diversidade mineral brasileira.' },
  { id: 'e9', day: 16, start: '16:30', end: '17:30', title: 'Transformação digital no comércio de joias', speaker: 'Júlia Fontes e Marcos Lima', place: 'auditorio', cat: 'palestra', description: 'Fotografia de produto com celular, conteúdo de bastidores e atendimento que converte.' },

  { id: 'e10', day: 17, start: '10:30', end: '11:30', title: 'Certificação de gemas: o que o lojista precisa saber', speaker: 'Laboratório gemológico parceiro', place: 'auditorio', cat: 'palestra', description: 'Leitura de certificados, tratamentos comuns e como orientar o cliente.' },
  { id: 'e11', day: 17, start: '14:00', end: '14:40', title: 'Talk: relógios como acessório de moda', speaker: 'Convidados do setor relojoeiro', place: 'espaco-design', cat: 'design', description: 'O relógio além da função: curadoria, mix de vitrine e público jovem.' },
  { id: 'e12', day: 17, start: '15:00', end: '17:00', title: 'Rodada de negócios · Norte, Nordeste e Centro-Oeste', place: 'arena', cat: 'negocios', description: 'Encontros agendados entre lojistas e fabricantes de todo o país.' },
  { id: 'e13', day: 17, start: '18:00', end: '19:00', title: 'Desfile de joias · Coleções 2027', place: 'lounge', cat: 'lancamento', description: 'Passarela com as principais coleções apresentadas pelos expositores nesta edição.' },

  { id: 'e14', day: 18, start: '10:30', end: '11:30', title: 'Estratégias para atravessar a crise', speaker: 'Simone Rocha · empresária e escritora', place: 'auditorio', cat: 'palestra', description: 'Caixa, prioridades e reinvenção de canais de venda em momentos difíceis para o varejo.' },
  { id: 'e15', day: 18, start: '13:00', end: '13:40', title: 'Talk: prêmio de design · finalistas', place: 'espaco-design', cat: 'design', description: 'Apresentação das peças finalistas e anúncio do vencedor do prêmio da edição.' },
  { id: 'e16', day: 18, start: '16:30', end: '17:30', title: 'Encerramento e rumo à 85ª edição', place: 'auditorio', cat: 'networking', description: 'Balanço da edição e anúncio das datas da próxima FENINJER+.' },
];

export const PLACES: Record<PlaceId, { name: string; hall: string; description: string }> = {
  auditorio: { name: 'Auditório', hall: 'Hall D', description: 'Palestras e cerimônias. 280 lugares, com tradução simultânea em libras.' },
  'espaco-design': { name: 'Espaço Design', hall: 'Hall D', description: 'Talks rápidos, exposição de peças autorais e o prêmio de design da edição.' },
  arena: { name: 'Arena de Negócios', hall: 'Hall E', description: 'Rodadas de negócios com encontros agendados entre lojistas e fabricantes.' },
  praca: { name: 'Praça de alimentação', hall: 'Hall E', description: 'Restaurantes, cafés e área de descanso. Aberta durante todo o evento.' },
  lounge: { name: 'Lounge FENINJER+', hall: 'Entre halls', description: 'Lançamentos, desfiles, happy hour e espaço de convivência.' },
  credenciamento: { name: 'Entrada e credenciamento', hall: 'Térreo', description: 'Retirada de crachá, guarda-volumes e informações. Apresente o QR code do seu cadastro.' },
};

export type Hotel = {
  id: string;
  name: string;
  stars: number;
  rating: number;
  distance: string;
  walk?: string;
  shuttle: boolean;
  price: number;
  oldPrice: number;
  perks: string[];
  hue: number;
  neighborhood: string;
};

export const HOTEL_CODE = 'FENINJER84';

export const HOTELS: Hotel[] = [
  { id: 'h1', name: 'Expo Garden Hotel', stars: 4, rating: 9.1, distance: '350 m', walk: '5 min a pé', shuttle: false, price: 489, oldPrice: 579, perks: ['Café da manhã', 'Acesso coberto à feira', 'Wi-Fi'], hue: 22, neighborhood: 'Santo Amaro' },
  { id: 'h2', name: 'Marginal Suites', stars: 4, rating: 8.7, distance: '1,8 km', shuttle: true, price: 369, oldPrice: 449, perks: ['Traslado gratuito', 'Café da manhã', 'Academia'], hue: 205, neighborhood: 'Chácara Santo Antônio' },
  { id: 'h3', name: 'Brooklin Executive', stars: 3, rating: 8.4, distance: '4,2 km', shuttle: true, price: 289, oldPrice: 339, perks: ['Traslado gratuito', 'Wi-Fi', 'Estacionamento'], hue: 160, neighborhood: 'Brooklin' },
  { id: 'h4', name: 'Vila Joia Flat', stars: 3, rating: 8.9, distance: '900 m', walk: '12 min a pé', shuttle: false, price: 319, oldPrice: 379, perks: ['Cozinha no quarto', 'Lavanderia', 'Wi-Fi'], hue: 280, neighborhood: 'Santo Amaro' },
  { id: 'h5', name: 'Grand Paulista Business', stars: 5, rating: 9.4, distance: '6,5 km', shuttle: true, price: 729, oldPrice: 890, perks: ['Traslado gratuito', 'Spa', 'Business center'], hue: 40, neighborhood: 'Itaim Bibi' },
];
