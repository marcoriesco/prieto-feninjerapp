export type SectorId = 'ouro' | 'prata' | 'relogios' | 'gemas' | 'design';

export const SECTORS: { id: SectorId; label: string; color: string }[] = [
  { id: 'ouro', label: 'Ouro', color: '#C9973A' },
  { id: 'prata', label: 'Prata', color: '#7C8591' },
  { id: 'relogios', label: 'Relógios', color: '#2F4858' },
  { id: 'gemas', label: 'Gemas', color: '#2E7D6B' },
  { id: 'design', label: 'Design', color: '#B0533A' },
];

export const sectorLabel = (id: SectorId) => SECTORS.find((s) => s.id === id)?.label ?? id;
export const sectorColor = (id: SectorId) => SECTORS.find((s) => s.id === id)?.color ?? '#999';

export type Metal = 'gold' | 'silver' | 'rose' | 'black' | 'steel';
export type ArtSpec =
  | { kind: 'ring'; metal: Metal; gem?: string }
  | { kind: 'necklace'; metal: Metal; gem?: string; choker?: boolean }
  | { kind: 'earring'; metal: Metal; gem?: string; style?: 'hoop' | 'leaf' | 'geo' }
  | { kind: 'pendant'; metal: Metal; style: 'heart' | 'seed' }
  | { kind: 'bracelet'; metal: Metal; style?: 'links' | 'beads' | 'cuff' }
  | { kind: 'chain'; metal: Metal }
  | { kind: 'watch'; metal: Metal; strap: string; dial: string; smart?: boolean }
  | { kind: 'gem'; color: string; cut: 'oval' | 'emerald' | 'heart' | 'drop' | 'cabochon' };

export type Product = {
  id: string;
  storeId: string;
  name: string;
  ref: string;
  material: string;
  description: string;
  priceRef: number;
  unit: 'un' | 'ct' | 'kit';
  variants: string[];
  art: ArtSpec;
};

export type Store = {
  id: string;
  name: string;
  tagline: string;
  sector: SectorId;
  city: string;
  stand: string;
  color: string;
  initials: string;
  since: number;
  about: string;
  responseTime: string;
};

export const STORES: Store[] = [
  {
    id: 'aurum',
    name: 'Aurum Joias',
    tagline: 'Joias em ouro 18k para o varejo',
    sector: 'ouro',
    city: 'Limeira, SP',
    stand: 'D-14',
    color: '#B8862E',
    initials: 'AJ',
    since: 1987,
    about:
      'Fabricante de joias em ouro 18k com acabamento artesanal. Atende joalherias de todo o Brasil com coleções clássicas e reposição rápida.',
    responseTime: 'até 24h',
  },
  {
    id: 'prata-viva',
    name: 'Prata Viva',
    tagline: 'Prata 925 com design brasileiro',
    sector: 'prata',
    city: 'Guaporé, RS',
    stand: 'E-07',
    color: '#6F7A88',
    initials: 'PV',
    since: 2004,
    about:
      'Coleções em prata 925 com banho de ródio e cristais. Grade completa para vitrines e pedido mínimo acessível para lojas iniciantes.',
    responseTime: 'até 48h',
  },
  {
    id: 'tempo-certo',
    name: 'Tempo Certo',
    tagline: 'Relógios e smartwatches para revenda',
    sector: 'relogios',
    city: 'São Paulo, SP',
    stand: 'D-18',
    color: '#2F4858',
    initials: 'TC',
    since: 1998,
    about:
      'Distribuidora de relógios analógicos e smart com garantia nacional, assistência técnica própria e expositores para ponto de venda.',
    responseTime: 'até 24h',
  },
  {
    id: 'gema-bruta',
    name: 'Gema Bruta',
    tagline: 'Pedras brasileiras lapidadas e certificadas',
    sector: 'gemas',
    city: 'Teófilo Otoni, MG',
    stand: 'E-16',
    color: '#2E7D6B',
    initials: 'GB',
    since: 1979,
    about:
      'Lapidação própria de turmalinas, esmeraldas, topázios e quartzos. Todas as gemas acima de 1 ct acompanham certificado de laboratório.',
    responseTime: 'até 48h',
  },
  {
    id: 'atelier-linha',
    name: 'Atelier Linha',
    tagline: 'Joalheria autoral e peças conceito',
    sector: 'design',
    city: 'Belo Horizonte, MG',
    stand: 'D-03',
    color: '#B0533A',
    initials: 'AL',
    since: 2015,
    about:
      'Estúdio de joalheria contemporânea. Peças autorais em ouro e prata com tiragens limitadas, ideais para lojas conceito e galerias.',
    responseTime: 'até 72h',
  },
];

export const PRODUCTS: Product[] = [
  // Aurum Joias
  { id: 'au-1', storeId: 'aurum', name: 'Anel Solitário Clássico', ref: 'AU-1021', material: 'Ouro 18k · zircônia 5 mm', description: 'Solitário de 6 garras com aro meia-cana de 2 mm. Disponível da numeração 10 à 28.', priceRef: 1890, unit: 'un', variants: ['Ouro amarelo', 'Ouro branco', 'Ouro rosé'], art: { kind: 'ring', metal: 'gold', gem: '#E8F4FF' } },
  { id: 'au-2', storeId: 'aurum', name: 'Corrente Cartier 60 cm', ref: 'AU-2045', material: 'Ouro 18k · 4,2 g', description: 'Corrente elo cartier maciça com fecho lagosta reforçado.', priceRef: 2450, unit: 'un', variants: ['45 cm', '50 cm', '60 cm', '70 cm'], art: { kind: 'chain', metal: 'gold' } },
  { id: 'au-3', storeId: 'aurum', name: 'Brinco Argola Lisa', ref: 'AU-3310', material: 'Ouro 18k · tubo 3 mm', description: 'Argola lisa com fecho click, polimento espelhado.', priceRef: 980, unit: 'un', variants: ['15 mm', '20 mm', '30 mm'], art: { kind: 'earring', metal: 'gold', style: 'hoop' } },
  { id: 'au-4', storeId: 'aurum', name: 'Pingente Coração Vazado', ref: 'AU-4102', material: 'Ouro 18k · 1,1 g', description: 'Pingente coração vazado com argola fixa, combina com correntes até 1,5 mm.', priceRef: 640, unit: 'un', variants: ['Ouro amarelo', 'Ouro rosé'], art: { kind: 'pendant', metal: 'gold', style: 'heart' } },
  { id: 'au-5', storeId: 'aurum', name: 'Pulseira Elos Português', ref: 'AU-5008', material: 'Ouro 18k · 6,8 g', description: 'Pulseira elos português com fecho gaveta e trava dupla.', priceRef: 2980, unit: 'un', variants: ['18 cm', '19 cm', '20 cm'], art: { kind: 'bracelet', metal: 'gold', style: 'links' } },

  // Prata Viva
  { id: 'pv-1', storeId: 'prata-viva', name: 'Anel Aparador Trançado', ref: 'PV-0112', material: 'Prata 925 · ródio', description: 'Aparador trançado fino, ideal para composição com solitários.', priceRef: 89, unit: 'un', variants: ['Grade 12 a 22', 'Numeração avulsa'], art: { kind: 'ring', metal: 'silver' } },
  { id: 'pv-2', storeId: 'prata-viva', name: 'Colar Gota Cristal', ref: 'PV-0230', material: 'Prata 925 · cristal azul', description: 'Colar veneziana 45 cm com pingente gota em cristal lapidado.', priceRef: 159, unit: 'un', variants: ['Azul', 'Verde', 'Cristal'], art: { kind: 'necklace', metal: 'silver', gem: '#4AA3DF' } },
  { id: 'pv-3', storeId: 'prata-viva', name: 'Ear Cuff Folhas', ref: 'PV-0341', material: 'Prata 925 · ródio negro', description: 'Ear cuff sem furo com folhas texturizadas.', priceRef: 69, unit: 'un', variants: ['Ródio branco', 'Ródio negro'], art: { kind: 'earring', metal: 'silver', style: 'leaf' } },
  { id: 'pv-4', storeId: 'prata-viva', name: 'Pulseira Bolinhas', ref: 'PV-0418', material: 'Prata 925', description: 'Pulseira de bolinhas 4 mm com extensor de 3 cm.', priceRef: 119, unit: 'un', variants: ['4 mm', '6 mm'], art: { kind: 'bracelet', metal: 'silver', style: 'beads' } },
  { id: 'pv-5', storeId: 'prata-viva', name: 'Choker Riviera', ref: 'PV-0502', material: 'Prata 925 · zircônias', description: 'Choker riviera com zircônias de 3 mm cravadas em garra.', priceRef: 189, unit: 'un', variants: ['Branca', 'Rosa', 'Multicolor'], art: { kind: 'necklace', metal: 'silver', gem: '#F2F6FF', choker: true } },

  // Tempo Certo
  { id: 'tc-1', storeId: 'tempo-certo', name: 'Relógio Clássico Couro', ref: 'TC-1100', material: 'Aço · pulseira em couro', description: 'Caixa de 40 mm, vidro mineral, resistente a 5 ATM. Garantia de 1 ano.', priceRef: 349, unit: 'un', variants: ['Couro marrom', 'Couro preto'], art: { kind: 'watch', metal: 'gold', strap: '#7A4A2A', dial: '#FBF8F1' } },
  { id: 'tc-2', storeId: 'tempo-certo', name: 'Cronógrafo Aço', ref: 'TC-1240', material: 'Aço inox 316L', description: 'Cronógrafo 44 mm com taquímetro e calendário. 10 ATM.', priceRef: 589, unit: 'un', variants: ['Mostrador azul', 'Mostrador preto'], art: { kind: 'watch', metal: 'steel', strap: '#9AA3AD', dial: '#1F3A5F' } },
  { id: 'tc-3', storeId: 'tempo-certo', name: 'Smartwatch Fit+', ref: 'TC-2010', material: 'Alumínio · silicone', description: 'Tela AMOLED 1,8", monitor cardíaco e notificações. Compatível com Android e iOS.', priceRef: 429, unit: 'un', variants: ['Preto', 'Grafite', 'Rosa'], art: { kind: 'watch', metal: 'black', strap: '#2A2A2A', dial: '#0F0F0F', smart: true } },
  { id: 'tc-4', storeId: 'tempo-certo', name: 'Relógio Feminino Rosé', ref: 'TC-1310', material: 'Aço · banho rosé', description: 'Caixa de 32 mm com pulseira esteira milanesa.', priceRef: 399, unit: 'un', variants: ['Rosé', 'Dourado', 'Prateado'], art: { kind: 'watch', metal: 'rose', strap: '#D9917A', dial: '#FFF5F0' } },
  { id: 'tc-5', storeId: 'tempo-certo', name: 'Relógio Infantil Color', ref: 'TC-3005', material: 'Resina · silicone', description: 'Analógico didático com ponteiros coloridos. Resistente a respingos.', priceRef: 149, unit: 'un', variants: ['Azul', 'Amarelo', 'Lilás'], art: { kind: 'watch', metal: 'steel', strap: '#3B82C4', dial: '#FFF7D6' } },

  // Gema Bruta
  { id: 'gb-1', storeId: 'gema-bruta', name: 'Turmalina Paraíba Oval', ref: 'GB-T101', material: 'Turmalina · lapidação oval', description: 'Turmalina cuprífera de cor neon, de 0,5 a 2 ct. Acompanha certificado.', priceRef: 4200, unit: 'ct', variants: ['0,5–1 ct', '1–2 ct'], art: { kind: 'gem', color: '#19C7D2', cut: 'oval' } },
  { id: 'gb-2', storeId: 'gema-bruta', name: 'Esmeralda Retangular', ref: 'GB-E220', material: 'Esmeralda · lapidação esmeralda', description: 'Esmeralda brasileira com óleo leve, de 0,8 a 3 ct.', priceRef: 2800, unit: 'ct', variants: ['0,8–1,5 ct', '1,5–3 ct'], art: { kind: 'gem', color: '#1E9A5A', cut: 'emerald' } },
  { id: 'gb-3', storeId: 'gema-bruta', name: 'Ametista Coração', ref: 'GB-A305', material: 'Ametista · 10 mm', description: 'Ametista do Rio Grande do Sul com lapidação coração e cor uniforme.', priceRef: 85, unit: 'un', variants: ['8 mm', '10 mm', '12 mm'], art: { kind: 'gem', color: '#8A4FC4', cut: 'heart' } },
  { id: 'gb-4', storeId: 'gema-bruta', name: 'Topázio Imperial Gota', ref: 'GB-I410', material: 'Topázio imperial · Ouro Preto', description: 'Topázio imperial em lapidação gota, cor laranja-champanhe.', priceRef: 1450, unit: 'ct', variants: ['1–2 ct', '2–4 ct'], art: { kind: 'gem', color: '#E58A2E', cut: 'drop' } },
  { id: 'gb-5', storeId: 'gema-bruta', name: 'Kit Quartzo Rosa Cabochão', ref: 'GB-Q520', material: 'Quartzo rosa · 20 peças', description: 'Kit com 20 cabochões calibrados de 8×10 mm.', priceRef: 120, unit: 'kit', variants: ['8×10 mm', '10×14 mm'], art: { kind: 'gem', color: '#F2A7B8', cut: 'cabochon' } },

  // Atelier Linha
  { id: 'al-1', storeId: 'atelier-linha', name: 'Anel Orgânico Martelado', ref: 'AL-R01', material: 'Ouro 18k fosco', description: 'Aro largo com textura martelada à mão. Cada peça é única.', priceRef: 1290, unit: 'un', variants: ['Ouro amarelo', 'Prata 950'], art: { kind: 'ring', metal: 'rose' } },
  { id: 'al-2', storeId: 'atelier-linha', name: 'Brinco Geométrico', ref: 'AL-E04', material: 'Ouro 18k · ônix', description: 'Brinco assimétrico com geometria triangular e ônix facetado.', priceRef: 860, unit: 'un', variants: ['Ônix', 'Madrepérola'], art: { kind: 'earring', metal: 'gold', style: 'geo', gem: '#222' } },
  { id: 'al-3', storeId: 'atelier-linha', name: 'Colar Linha Contínua', ref: 'AL-N02', material: 'Ouro 18k · fio 1 mm', description: 'Colar escultural de traço único, peça-assinatura do ateliê.', priceRef: 1540, unit: 'un', variants: ['42 cm', '50 cm'], art: { kind: 'necklace', metal: 'gold', gem: '#B0533A' } },
  { id: 'al-4', storeId: 'atelier-linha', name: 'Bracelete Escultura', ref: 'AL-B07', material: 'Prata 950 · banho ouro', description: 'Bracelete rígido aberto com volume orgânico.', priceRef: 1980, unit: 'un', variants: ['P', 'M', 'G'], art: { kind: 'bracelet', metal: 'gold', style: 'cuff' } },
  { id: 'al-5', storeId: 'atelier-linha', name: 'Pingente Semente', ref: 'AL-P03', material: 'Ouro rosé 18k', description: 'Pingente inspirado em sementes do cerrado, com corrente de 45 cm.', priceRef: 720, unit: 'un', variants: ['Rosé', 'Amarelo'], art: { kind: 'pendant', metal: 'rose', style: 'seed' } },
];

export const getStore = (id: string) => STORES.find((s) => s.id === id);
export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
export const productsOf = (storeId: string) => PRODUCTS.filter((p) => p.storeId === storeId);

export const unitLabel = (u: Product['unit']) => (u === 'ct' ? 'ct' : u === 'kit' ? 'kit' : 'un');
