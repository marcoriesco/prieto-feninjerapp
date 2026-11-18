import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Minus, Navigation, Plus } from 'lucide-react';
import { EVENTS, PLACES, PlaceId } from '../data/fair';
import { SECTORS, STORES, sectorColor, sectorLabel } from '../data/stores';
import type { SectorId } from '../data/stores';
import { Chips, Sheet, StoreMark } from '../components/ui';

type Stand = { id: string; x: number; y: number; w: number; h: number };

const COLS = [22, 72, 122, 172];
const STAND_W = 44;
const STAND_H = 34;

function hallStands(hall: 'D' | 'E', top: number): Stand[] {
  const out: Stand[] = [];
  for (let r = 0; r < 5; r++)
    for (let c = 0; c < 4; c++) {
      const n = r * 4 + c + 1;
      out.push({ id: `${hall}-${String(n).padStart(2, '0')}`, x: COLS[c], y: top + r * 40, w: STAND_W, h: STAND_H });
    }
  return out;
}

const STANDS = [...hallStands('D', 46), ...hallStands('E', 346)];

const FACILITIES: { id: PlaceId; x: number; y: number; w: number; h: number; label: string[] }[] = [
  { id: 'auditorio', x: 226, y: 46, w: 92, h: 94, label: ['Auditório'] },
  { id: 'espaco-design', x: 226, y: 150, w: 92, h: 90, label: ['Espaço', 'Design'] },
  { id: 'lounge', x: 22, y: 268, w: 296, h: 36, label: ['Lounge FENINJER+'] },
  { id: 'arena', x: 226, y: 346, w: 92, h: 94, label: ['Arena de', 'Negócios'] },
  { id: 'praca', x: 226, y: 450, w: 92, h: 90, label: ['Praça de', 'alimentação'] },
  { id: 'credenciamento', x: 90, y: 568, w: 160, h: 30, label: ['Entrada · Credenciamento'] },
];

export function MapPage() {
  const [params, setParams] = useSearchParams();
  const [sector, setSector] = useState<'all' | SectorId>('all');
  const [zoom, setZoom] = useState(1);
  const scroller = useRef<HTMLDivElement>(null);

  const standParam = params.get('estande');
  const placeParam = params.get('local') as PlaceId | null;
  const selectedStore = STORES.find((s) => s.stand === standParam);
  const selectedPlace = placeParam && PLACES[placeParam] ? placeParam : null;

  const storeByStand = useMemo(() => Object.fromEntries(STORES.map((s) => [s.stand, s])), []);

  const select = (q: Record<string, string>) => setParams(q, { replace: true });
  const close = () => setParams({}, { replace: true });

  // ao chegar com um estande selecionado, aproxima e centraliza
  useEffect(() => {
    if (!standParam) return;
    const st = STANDS.find((s) => s.id === standParam);
    const el = scroller.current;
    if (!st || !el) return;
    setZoom((z) => Math.max(z, 1.6));
    requestAnimationFrame(() => {
      const scale = el.scrollWidth / 340;
      el.scrollTo({ left: st.x * scale - el.clientWidth / 2, top: st.y * scale - el.clientHeight / 2, behavior: 'smooth' });
    });
  }, [standParam]);

  const placeEvents = selectedPlace ? EVENTS.filter((e) => e.place === selectedPlace).slice(0, 3) : [];

  return (
    <div className="page map-page">
      <h1 className="page-title">Mapa da feira</h1>
      <p className="muted small">Transamérica Expo Center · Halls D e E. Toque em um estande ou espaço.</p>

      <Chips
        label="Destacar setor"
        value={sector}
        onChange={setSector}
        options={[{ id: 'all' as const, label: 'Todos' }, ...SECTORS.map((s) => ({ id: s.id, label: s.label }))]}
      />

      <div className="map-wrap">
        <div className="map-scroll" ref={scroller}>
          <svg viewBox="0 0 340 610" style={{ width: `${zoom * 100}%` }} className="map-svg" role="img" aria-label="Planta da feira">
            <defs>
              <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="6" stroke="#000" strokeOpacity=".05" strokeWidth="3" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="340" height="610" fill="#f7f7f7" />
            {/* Halls */}
            {[
              { y: 16, label: 'HALL D' },
              { y: 316, label: 'HALL E' },
            ].map((h) => (
              <g key={h.label}>
                <rect x="12" y={h.y} width="316" height="240" rx="10" fill="#fff" stroke="#d9d9d9" />
                <text x="22" y={h.y + 20} className="map-hall">
                  {h.label}
                </text>
              </g>
            ))}
            <rect x="12" y="262" width="316" height="48" fill="url(#hatch)" />

            {/* Facilities */}
            {FACILITIES.map((f) => {
              const on = selectedPlace === f.id;
              return (
                <g key={f.id} className="map-hit" onClick={() => select({ local: f.id })} role="button" tabIndex={0} aria-label={PLACES[f.id].name} onKeyDown={(e) => e.key === 'Enter' && select({ local: f.id })}>
                  <rect x={f.x} y={f.y} width={f.w} height={f.h} rx="6" fill={on ? '#FF5100' : f.id === 'credenciamento' ? '#3A3A3A' : '#FFE9DE'} stroke={on ? '#c43e00' : '#FFC7AA'} />
                  {f.label.map((t, i) => (
                    <text
                      key={t}
                      x={f.x + f.w / 2}
                      y={f.y + f.h / 2 + (i - (f.label.length - 1) / 2) * 13 + 4}
                      textAnchor="middle"
                      className="map-fac"
                      fill={on || f.id === 'credenciamento' ? '#fff' : '#B23A00'}
                    >
                      {t}
                    </text>
                  ))}
                </g>
              );
            })}

            {/* Stands */}
            {STANDS.map((st) => {
              const store = storeByStand[st.id];
              const isSel = st.id === standParam;
              const dim = store && sector !== 'all' && store.sector !== sector;
              const fill = store ? sectorColor(store.sector) : '#ECECEC';
              return (
                <g
                  key={st.id}
                  className={store ? 'map-hit' : ''}
                  onClick={store ? () => select({ estande: st.id }) : undefined}
                  role={store ? 'button' : undefined}
                  tabIndex={store ? 0 : undefined}
                  aria-label={store ? `${store.name}, estande ${st.id}` : undefined}
                  onKeyDown={store ? (e) => e.key === 'Enter' && select({ estande: st.id }) : undefined}
                  opacity={dim ? 0.25 : 1}
                >
                  <rect x={st.x} y={st.y} width={st.w} height={st.h} rx="4" fill={fill} stroke={isSel ? '#FF5100' : store ? 'none' : '#dcdcdc'} strokeWidth={isSel ? 3 : 1} />
                  <text x={st.x + st.w / 2} y={st.y + (store ? 15 : 21)} textAnchor="middle" className="map-stand" fill={store ? '#fff' : '#9a9a9a'}>
                    {st.id}
                  </text>
                  {store && (
                    <text x={st.x + st.w / 2} y={st.y + 27} textAnchor="middle" className="map-stand-name" fill="#fff">
                      {store.initials}
                    </text>
                  )}
                  {isSel && <circle cx={st.x + st.w - 3} cy={st.y + 3} r="6" fill="#FF5100" stroke="#fff" strokeWidth="2" className="pulse" />}
                </g>
              );
            })}

            {/* WC / you are here */}
            {[
              [196, 22],
              [196, 322],
            ].map(([x, y]) => (
              <g key={y}>
                <rect x={x} y={y} width="22" height="16" rx="3" fill="#E3EEF9" />
                <text x={x + 11} y={y + 12} textAnchor="middle" className="map-wc">
                  WC
                </text>
              </g>
            ))}
            <g transform="translate(170 562)">
              <circle r="9" fill="#FF5100" opacity=".25" className="pulse" />
              <circle r="5" fill="#FF5100" stroke="#fff" strokeWidth="2" />
            </g>
          </svg>
        </div>
        <div className="map-zoom">
          <button className="icon-btn" aria-label="Aproximar" onClick={() => setZoom((z) => Math.min(2.4, +(z + 0.4).toFixed(1)))}>
            <Plus size={20} />
          </button>
          <button className="icon-btn" aria-label="Afastar" onClick={() => setZoom((z) => Math.max(1, +(z - 0.4).toFixed(1)))}>
            <Minus size={20} />
          </button>
        </div>
      </div>

      <div className="legend">
        {SECTORS.map((s) => (
          <span key={s.id}>
            <i style={{ background: s.color }} /> {s.label}
          </span>
        ))}
        <span>
          <i style={{ background: '#FFE9DE', border: '1px solid #FFC7AA' }} /> Serviços
        </span>
        <span>
          <i style={{ background: '#ECECEC' }} /> Outros
        </span>
        <span>
          <i className="you" /> Você está aqui
        </span>
      </div>

      <h2 className="h2">Expositores da demo</h2>
      <div className="stand-list">
        {STORES.map((s) => (
          <button key={s.id} className={`stand-row ${s.stand === standParam ? 'on' : ''}`} onClick={() => select({ estande: s.stand })}>
            <StoreMark store={s} size={36} />
            <span>
              <strong>{s.name}</strong>
              <small>{sectorLabel(s.sector)}</small>
            </span>
            <span className="stand-pill">{s.stand}</span>
          </button>
        ))}
      </div>

      <Sheet open={!!selectedStore} onClose={close} title={selectedStore ? `Estande ${selectedStore.stand}` : ''}>
        {selectedStore && (
          <div className="sheet-store">
            <div className="checkout-store">
              <StoreMark store={selectedStore} size={52} />
              <div>
                <strong>{selectedStore.name}</strong>
                <small>{selectedStore.tagline}</small>
              </div>
            </div>
            <p className="muted small">
              <Navigation size={14} /> Hall {selectedStore.stand[0]} · a partir da entrada, siga pelo corredor central.
            </p>
            <Link to={`/lojas/${selectedStore.id}`} className="btn btn-primary btn-block">
              Ver produtos da loja <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </Sheet>

      <Sheet open={!!selectedPlace} onClose={close} title={selectedPlace ? PLACES[selectedPlace].name : ''}>
        {selectedPlace && (
          <div>
            <p className="tag">{PLACES[selectedPlace].hall}</p>
            <p className="about">{PLACES[selectedPlace].description}</p>
            {placeEvents.length > 0 && (
              <>
                <h3 className="h3">Programação neste espaço</h3>
                <ul className="plain-list">
                  {placeEvents.map((e) => (
                    <li key={e.id}>
                      <strong>
                        {e.day}/02 · {e.start}
                      </strong>{' '}
                      {e.title}
                    </li>
                  ))}
                </ul>
                <Link to="/agenda" className="btn btn-outline btn-block">
                  Ver agenda completa
                </Link>
              </>
            )}
          </div>
        )}
      </Sheet>
    </div>
  );
}
