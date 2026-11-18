import { useId } from 'react';
import type { ArtSpec, Metal } from '../data/stores';

const METALS: Record<Metal, [string, string, string]> = {
  gold: ['#F7E2A0', '#D4A445', '#8E6420'],
  silver: ['#FFFFFF', '#C3C9D1', '#7C8591'],
  rose: ['#F8D3C4', '#D9917A', '#9E5A47'],
  black: ['#6B6B6B', '#2E2E2E', '#111111'],
  steel: ['#F1F3F5', '#A9B1BA', '#5F6872'],
};

const BG: Record<string, string> = {
  gold: '#FBF3E3',
  silver: '#EEF1F5',
  rose: '#FBEDE7',
  black: '#ECECEC',
  steel: '#EDF0F3',
};

/** Ilustrações vetoriais das peças — evitam dependência de fotos externas na demo. */
export function ProductArt({ art, className }: { art: ArtSpec; className?: string }) {
  const uid = useId().replace(/:/g, '');
  const m = `m${uid}`;
  const g = `g${uid}`;
  const metal = art.kind === 'gem' ? 'silver' : art.metal;
  const [l, mid, d] = METALS[metal];
  const bg = art.kind === 'gem' ? tint(art.color) : BG[metal];
  const gemColor = art.kind === 'gem' ? art.color : 'gem' in art && art.gem ? art.gem : '#ffffff';

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-hidden="true">
      <defs>
        <linearGradient id={m} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={l} />
          <stop offset=".5" stopColor={mid} />
          <stop offset="1" stopColor={d} />
        </linearGradient>
        <radialGradient id={g} cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#fff" stopOpacity=".95" />
          <stop offset=".35" stopColor={gemColor} stopOpacity=".9" />
          <stop offset="1" stopColor={gemColor} />
        </radialGradient>
        <radialGradient id={`bg${uid}`} cx=".5" cy=".4" r=".75">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor={bg} />
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#bg${uid})`} />
      <ellipse cx="100" cy="170" rx="58" ry="7" fill="#000" opacity=".06" />
      {draw(art, `url(#${m})`, `url(#${g})`, d)}
    </svg>
  );
}

function draw(art: ArtSpec, metal: string, gem: string, dark: string) {
  switch (art.kind) {
    case 'ring':
      return (
        <g>
          <circle cx="100" cy="112" r="44" fill="none" stroke={metal} strokeWidth="12" />
          <circle cx="100" cy="112" r="38" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="1.5" />
          {art.gem ? (
            <g>
              <path d="M92 70 L94 58 M108 70 L106 58" stroke={dark} strokeWidth="3" strokeLinecap="round" />
              <path d="M82 58 L90 46 H110 L118 58 L100 78 Z" fill={gem} stroke={dark} strokeWidth="1.2" />
              <path d="M82 58 H118 M90 46 L96 58 L100 78 M110 46 L104 58 L100 78" stroke={dark} strokeOpacity=".35" fill="none" />
            </g>
          ) : (
            <path d="M60 104 Q100 92 140 104" stroke="#fff" strokeOpacity=".5" strokeWidth="2" fill="none" strokeDasharray="4 5" />
          )}
        </g>
      );
    case 'necklace':
      return art.choker ? (
        <g>
          <path d="M38 62 Q100 140 162 62" fill="none" stroke={metal} strokeWidth="3" />
          {Array.from({ length: 11 }).map((_, i) => {
            const t = 0.12 + i * 0.076;
            const x = (1 - t) ** 2 * 38 + 2 * (1 - t) * t * 100 + t * t * 162;
            const y = (1 - t) ** 2 * 62 + 2 * (1 - t) * t * 140 + t * t * 62;
            return <circle key={i} cx={x} cy={y} r="5.5" fill={gem} stroke={dark} strokeWidth="1" />;
          })}
        </g>
      ) : (
        <g>
          <path d="M40 36 Q100 156 160 36" fill="none" stroke={metal} strokeWidth="2.5" />
          <circle cx="100" cy="99" r="5" fill="none" stroke={metal} strokeWidth="3" />
          <path d="M100 106 C84 126 86 150 100 154 C114 150 116 126 100 106 Z" fill={gem} stroke={dark} strokeWidth="1.2" />
          <path d="M94 128 Q96 120 100 116" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".7" fill="none" />
        </g>
      );
    case 'earring':
      if (art.style === 'leaf')
        return (
          <g>
            {[70, 130].map((x, i) => (
              <g key={x} transform={`translate(${x} 100) scale(${i ? -1 : 1} 1)`}>
                <path d="M0 -44 C-26 -30 -26 10 0 44" fill="none" stroke={metal} strokeWidth="7" strokeLinecap="round" />
                {[-28, -8, 12].map((y) => (
                  <path key={y} d={`M-12 ${y} q-16 -6 -20 8 q12 6 20 -8z`} fill={metal} stroke={dark} strokeWidth=".8" />
                ))}
              </g>
            ))}
          </g>
        );
      if (art.style === 'geo')
        return (
          <g>
            <path d="M64 50 L64 62" stroke={metal} strokeWidth="3" />
            <path d="M64 64 L40 140 L88 140 Z" fill="none" stroke={metal} strokeWidth="5" strokeLinejoin="round" />
            <path d="M64 92 L52 128 H76 Z" fill={gem} />
            <path d="M136 50 L136 62" stroke={metal} strokeWidth="3" />
            <path d="M136 64 L116 112 L156 112 Z" fill="none" stroke={metal} strokeWidth="5" strokeLinejoin="round" />
            <circle cx="136" cy="98" r="7" fill={gem} />
          </g>
        );
      return (
        <g>
          {[66, 134].map((x) => (
            <g key={x}>
              <circle cx={x} cy="104" r="30" fill="none" stroke={metal} strokeWidth="8" />
              <path d={`M${x - 22} 92 A24 24 0 0 1 ${x + 4} 78`} stroke="#fff" strokeOpacity=".55" strokeWidth="2" fill="none" />
            </g>
          ))}
        </g>
      );
    case 'pendant':
      return (
        <g>
          <path d="M52 22 L100 82 L148 22" fill="none" stroke={metal} strokeWidth="2" />
          <circle cx="100" cy="88" r="6" fill="none" stroke={metal} strokeWidth="3" />
          {art.style === 'heart' ? (
            <path
              d="M100 152 C64 128 58 104 72 94 C84 86 96 92 100 102 C104 92 116 86 128 94 C142 104 136 128 100 152 Z"
              fill="none"
              stroke={metal}
              strokeWidth="9"
              strokeLinejoin="round"
            />
          ) : (
            <g>
              <path d="M100 96 C76 112 76 144 100 156 C124 144 124 112 100 96 Z" fill={metal} stroke={dark} strokeWidth="1" />
              <path d="M100 100 V150" stroke={dark} strokeOpacity=".5" strokeWidth="1.5" />
              <path d="M90 116 Q86 128 92 140" stroke="#fff" strokeOpacity=".6" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          )}
        </g>
      );
    case 'bracelet':
      if (art.style === 'cuff')
        return (
          <g>
            <path d="M44 120 C44 70 156 70 156 120" fill="none" stroke={dark} strokeWidth="26" strokeLinecap="round" opacity=".35" />
            <path d="M40 112 C40 58 160 58 160 112 C160 140 130 150 118 146" fill="none" stroke={metal} strokeWidth="22" strokeLinecap="round" />
            <path d="M60 86 C80 66 120 66 140 86" stroke="#fff" strokeOpacity=".5" strokeWidth="3" fill="none" />
          </g>
        );
      if (art.style === 'beads')
        return (
          <g>
            {Array.from({ length: 22 }).map((_, i) => {
              const a = (i / 22) * Math.PI * 2;
              return <circle key={i} cx={100 + Math.cos(a) * 62} cy={110 + Math.sin(a) * 36} r="8" fill={metal} stroke={dark} strokeWidth=".8" />;
            })}
          </g>
        );
      return (
        <g>
          <ellipse cx="100" cy="110" rx="64" ry="38" fill="none" stroke={metal} strokeWidth="13" />
          <ellipse cx="100" cy="110" rx="64" ry="38" fill="none" stroke={dark} strokeOpacity=".4" strokeWidth="13" strokeDasharray="7 9" />
        </g>
      );
    case 'chain':
      return (
        <g>
          {Array.from({ length: 16 }).map((_, i) => {
            const t = i / 15;
            const x = (1 - t) ** 2 * 34 + 2 * (1 - t) * t * 100 + t * t * 166;
            const y = (1 - t) ** 2 * 40 + 2 * (1 - t) * t * 190 + t * t * 40;
            // tangente da curva de Bézier quadrática: alinha cada elo ao caminho
            const ang = Math.atan2(300 * (1 - 2 * t), 132) * (180 / Math.PI);
            const long = i % 4 === 0;
            return (
              <ellipse
                key={i}
                cx={x}
                cy={y}
                rx={long ? 9 : 6}
                ry="4.5"
                transform={`rotate(${ang} ${x} ${y})`}
                fill="none"
                stroke={metal}
                strokeWidth="3.2"
              />
            );
          })}
        </g>
      );
    case 'watch': {
      const ticks = Array.from({ length: 12 });
      return (
        <g>
          <rect x="76" y="14" width="48" height="172" rx="12" fill={art.strap} />
          <rect x="76" y="14" width="48" height="172" rx="12" fill="#000" opacity=".12" />
          <rect x="146" y="92" width="10" height="16" rx="3" fill={metal} />
          {art.smart ? (
            <g>
              <rect x="56" y="54" width="88" height="96" rx="24" fill={metal} />
              <rect x="64" y="62" width="72" height="80" rx="18" fill={art.dial} />
              <text x="100" y="104" textAnchor="middle" fontSize="22" fontWeight="700" fill="#fff" fontFamily="Open Sans, sans-serif">10:24</text>
              <circle cx="100" cy="122" r="7" fill="none" stroke="#FF5100" strokeWidth="3" strokeDasharray="30 14" />
            </g>
          ) : (
            <g>
              <circle cx="100" cy="100" r="46" fill={metal} />
              <circle cx="100" cy="100" r="38" fill={art.dial} />
              {ticks.map((_, i) => {
                const a = (i / 12) * Math.PI * 2;
                const r1 = i % 3 === 0 ? 28 : 31;
                return (
                  <line key={i} x1={100 + Math.cos(a) * r1} y1={100 + Math.sin(a) * r1} x2={100 + Math.cos(a) * 34} y2={100 + Math.sin(a) * 34} stroke={dark} strokeWidth={i % 3 === 0 ? 2.5 : 1.2} />
                );
              })}
              <line x1="100" y1="100" x2="100" y2="76" stroke={dark} strokeWidth="3" strokeLinecap="round" />
              <line x1="100" y1="100" x2="118" y2="110" stroke={dark} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="100" y1="104" x2="92" y2="72" stroke="#FF5100" strokeWidth="1.2" />
              <circle cx="100" cy="100" r="3" fill={dark} />
            </g>
          )}
        </g>
      );
    }
    case 'gem':
      return gemShape(art.cut, gem, art.color);
  }
}

function gemShape(cut: string, fill: string, color: string) {
  const stroke = shade(color);
  const facets = { stroke, strokeOpacity: 0.45, fill: 'none', strokeWidth: 1.2 } as const;
  switch (cut) {
    case 'emerald':
      return (
        <g>
          <path d="M66 52 H134 L152 70 V130 L134 148 H66 L48 130 V70 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <path d="M78 70 H122 L134 82 V118 L122 130 H78 L66 118 V82 Z" {...facets} />
          <path d="M66 52 L78 70 M134 52 L122 70 M152 70 L134 82 M152 130 L134 118 M134 148 L122 130 M66 148 L78 130 M48 130 L66 118 M48 70 L66 82" {...facets} />
        </g>
      );
    case 'heart':
      return (
        <g>
          <path d="M100 156 C50 122 42 86 62 68 C80 54 96 62 100 78 C104 62 120 54 138 68 C158 86 150 122 100 156 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <path d="M100 78 L100 156 M62 68 L100 110 L138 68 M48 96 L100 110 L152 96" {...facets} />
        </g>
      );
    case 'drop':
      return (
        <g>
          <path d="M100 36 C70 84 60 112 70 136 C80 158 120 158 130 136 C140 112 130 84 100 36 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <path d="M100 36 L100 152 M100 36 L78 120 L100 152 L122 120 Z M68 128 L78 120 M132 128 L122 120" {...facets} />
        </g>
      );
    case 'cabochon':
      return (
        <g>
          {[
            [70, 92, 1],
            [128, 86, 0.9],
            [100, 132, 1.1],
          ].map(([x, y, s], i) => (
            <g key={i}>
              <ellipse cx={x} cy={y} rx={24 * s} ry={30 * s} fill={fill} stroke={stroke} strokeWidth="1.2" />
              <ellipse cx={x - 7 * s} cy={y - 10 * s} rx={6 * s} ry={9 * s} fill="#fff" opacity=".55" />
            </g>
          ))}
        </g>
      );
    default:
      return (
        <g>
          <ellipse cx="100" cy="100" rx="58" ry="44" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <ellipse cx="100" cy="100" rx="34" ry="25" {...facets} />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <line key={i} x1={100 + Math.cos(a) * 34} y1={100 + Math.sin(a) * 25} x2={100 + Math.cos(a) * 58} y2={100 + Math.sin(a) * 44} {...facets} />;
          })}
          <ellipse cx="84" cy="86" rx="10" ry="6" fill="#fff" opacity=".6" />
        </g>
      );
  }
}

function hexToRgb(h: string) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function tint(h: string) {
  const [r, g, b] = hexToRgb(h);
  const t = (c: number) => Math.round(c + (255 - c) * 0.86);
  return `rgb(${t(r)},${t(g)},${t(b)})`;
}
function shade(h: string) {
  const [r, g, b] = hexToRgb(h);
  return `rgb(${Math.round(r * 0.55)},${Math.round(g * 0.55)},${Math.round(b * 0.55)})`;
}
