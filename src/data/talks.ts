// FENINJER Talks — temas inspirados na série do site oficial; palestrantes e conteúdos são fictícios (demo).

export type TalkTheme = 'tendencias' | 'digital' | 'gestao' | 'vendas' | 'lideranca' | 'design';

export const TALK_THEMES: { id: TalkTheme; label: string; color: string }[] = [
  { id: 'tendencias', label: 'Tendências', color: '#FF5100' },
  { id: 'vendas', label: 'Vendas', color: '#C43E00' },
  { id: 'gestao', label: 'Gestão', color: '#2F4858' },
  { id: 'lideranca', label: 'Liderança', color: '#8A4FC4' },
  { id: 'digital', label: 'Digital', color: '#1F7A9C' },
  { id: 'design', label: 'Design', color: '#B0533A' },
];

export const themeOf = (id: TalkTheme) => TALK_THEMES.find((t) => t.id === id)!;

export type Speaker = { name: string; role: string };

export type Talk = {
  id: string;
  title: string;
  theme: TalkTheme;
  format: 'Bate-papo' | 'Entrevista' | 'Palestra';
  minutes: number;
  speakers: Speaker[];
  summary: string;
  takeaways: string[];
  /** evento da agenda em que o tema é apresentado ao vivo na 84ª edição */
  eventId?: string;
  isNew?: boolean;
};

export const TALKS: Talk[] = [
  {
    id: 't1',
    title: 'As cores das próximas estações',
    theme: 'tendencias',
    format: 'Bate-papo',
    minutes: 42,
    speakers: [
      { name: 'Renata Alves', role: 'Diretora de tendências' },
      { name: 'Paulo Teixeira', role: 'Designer de joias' },
    ],
    summary:
      'Quais cores e materiais vão aparecer nas vitrines na próxima temporada, e como o lojista pode planejar o estoque com antecedência sem apostar no escuro.',
    takeaways: ['Paleta de cores da próxima estação', 'Como ler tendências para o seu público', 'Planejamento de compras por coleção'],
    eventId: 'e2',
    isNew: true,
  },
  {
    id: 't2',
    title: 'Transformação digital no comércio de joias',
    theme: 'digital',
    format: 'Bate-papo',
    minutes: 38,
    speakers: [
      { name: 'Júlia Fontes', role: 'Fotógrafa de joias com celular' },
      { name: 'Marcos Lima', role: 'Empresário do varejo joalheiro' },
    ],
    summary:
      'A importância e os desafios da transformação digital no setor: da foto de produto feita no celular ao atendimento que vende pelo WhatsApp.',
    takeaways: ['Foto de produto sem estúdio', 'Catálogo digital e atendimento remoto', 'Primeiros passos para vender online'],
    eventId: 'e9',
    isNew: true,
  },
  {
    id: 't3',
    title: 'Como o propósito pode transformar as empresas',
    theme: 'gestao',
    format: 'Palestra',
    minutes: 35,
    speakers: [{ name: 'Beatriz Moura', role: 'Mentora de negócios' }],
    summary:
      'Paixão e motivação por trás dos negócios: por que as empresas mais lucrativas compartilham um propósito que vai além da qualidade do produto.',
    takeaways: ['Propósito como diferencial competitivo', 'Como engajar a equipe', 'Comunicar valores ao cliente'],
  },
  {
    id: 't4',
    title: 'Comunicação, vendas e a arte da oratória',
    theme: 'vendas',
    format: 'Entrevista',
    minutes: 40,
    speakers: [
      { name: 'Luciana Prado', role: 'Especialista em oratória' },
      { name: 'Eduardo Reis', role: 'Professor de comunicação' },
    ],
    summary: 'Como comunicar ideias de forma clara e persuasiva, no balcão, na vitrine e nas redes sociais da joalheria.',
    takeaways: ['Estrutura de uma boa apresentação', 'Linguagem corporal no atendimento', 'Como lidar com objeções'],
  },
  {
    id: 't5',
    title: 'Mulheres no poder: a liderança feminina na joalheria',
    theme: 'lideranca',
    format: 'Bate-papo',
    minutes: 45,
    speakers: [
      { name: 'Helena Duarte', role: 'Diretora de joalheria' },
      { name: 'Sônia Ribeiro', role: 'Psicóloga organizacional' },
    ],
    summary: 'As características da liderança feminina em um setor em que muitas empresas são comandadas por mulheres.',
    takeaways: ['Estilos de liderança', 'Equilíbrio entre gestão e família', 'Formação de novas líderes'],
  },
  {
    id: 't6',
    title: 'Motivação vendedora',
    theme: 'vendas',
    format: 'Palestra',
    minutes: 32,
    speakers: [{ name: 'Ricardo Nunes', role: 'Treinador de equipes de vendas' }],
    summary: 'A arte de vender e de manter a equipe motivada, inclusive em períodos difíceis para o varejo.',
    takeaways: ['Metas que motivam', 'Rotina de feedback', 'Celebrar pequenas vitórias'],
  },
  {
    id: 't7',
    title: 'Os pilares da empresa familiar no cenário 4.0',
    theme: 'gestao',
    format: 'Bate-papo',
    minutes: 44,
    speakers: [
      { name: 'Lívia Bertoldi', role: 'Coach de empresas familiares' },
      { name: 'Tiago Ferreira', role: 'Diretor de fábrica de joias' },
    ],
    summary: 'Os desafios das empresas familiares na era digital e como atualizar processos sem perder a essência do negócio.',
    takeaways: ['Sucessão planejada', 'Profissionalizar sem perder a identidade', 'Tecnologia na fábrica e na loja'],
  },
  {
    id: 't8',
    title: 'Estratégias para atravessar a crise',
    theme: 'gestao',
    format: 'Entrevista',
    minutes: 36,
    speakers: [{ name: 'Simone Rocha', role: 'Empresária e escritora' }],
    summary: 'Como uma joalheria reinventou o próprio negócio em um momento de crise e construiu uma trajetória de crescimento.',
    takeaways: ['Caixa e prioridades', 'Reinvenção de canais de venda', 'Relação com fornecedores'],
    eventId: 'e14',
  },
  {
    id: 't9',
    title: 'Normas técnicas e design estratégico',
    theme: 'design',
    format: 'Bate-papo',
    minutes: 39,
    speakers: [
      { name: 'Clara Menezes', role: 'Diretora de design' },
      { name: 'Otávio Lins', role: 'Engenheiro de produto' },
    ],
    summary: 'O papel do desenho técnico na produção de joias e o caminho do setor rumo à profissionalização.',
    takeaways: ['Do croqui à ficha técnica', 'Normas que evitam retrabalho', 'Design como estratégia comercial'],
  },
  {
    id: 't10',
    title: 'Histórias que vendem',
    theme: 'vendas',
    format: 'Entrevista',
    minutes: 34,
    speakers: [{ name: 'Silvana Rocha', role: 'Mentora de storytelling' }],
    summary: 'Como o storytelling ajuda a joalheria a vender mais, já que o cliente muitas vezes compra a história por trás da peça.',
    takeaways: ['A história de cada coleção', 'Roteiro de atendimento', 'Storytelling nas redes'],
  },
];

export const getTalk = (id: string) => TALKS.find((t) => t.id === id);
export const talkForEvent = (eventId: string) => TALKS.find((t) => t.eventId === eventId);
export const initials = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');
