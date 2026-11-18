import { useState } from 'react';
import { Bus, Car, Check, Copy, Footprints, MapPin, Plane, Star } from 'lucide-react';
import { FAIR, HOTELS, HOTEL_CODE, Hotel } from '../data/fair';
import { Chips, PageHeader, QtyStepper, Sheet } from '../components/ui';
import { brl, useApp } from '../store';

type Filter = 'all' | 'walk' | 'shuttle' | 'budget';

function HotelArt({ hue, stars }: { hue: number; stars: number }) {
  return (
    <svg viewBox="0 0 320 120" className="hotel-art" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`sky${hue}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={`hsl(${hue} 70% 82%)`} />
          <stop offset="1" stopColor={`hsl(${hue} 60% 94%)`} />
        </linearGradient>
      </defs>
      <rect width="320" height="120" fill={`url(#sky${hue})`} />
      <circle cx="270" cy="30" r="16" fill="#fff" opacity=".7" />
      <rect x="40" y="40" width="70" height="80" fill={`hsl(${hue} 25% 40%)`} opacity=".35" />
      <rect x="120" y={30 - stars * 4} width="80" height={90 + stars * 4} rx="3" fill={`hsl(${hue} 30% 28%)`} />
      <rect x="210" y="55" width="60" height="65" fill={`hsl(${hue} 25% 40%)`} opacity=".5" />
      {Array.from({ length: 6 }).map((_, r) =>
        Array.from({ length: 4 }).map((__, c) => (
          <rect key={`${r}${c}`} x={130 + c * 17} y={36 - stars * 4 + r * 14} width="10" height="8" fill="#FFE2A8" opacity={(r + c) % 3 ? 0.9 : 0.35} />
        )),
      )}
    </svg>
  );
}

export function Hotels() {
  const { showToast } = useApp();
  const [filter, setFilter] = useState<Filter>('all');
  const [booking, setBooking] = useState<Hotel | null>(null);
  const [guests, setGuests] = useState(1);
  const [nights, setNights] = useState(4);

  const list = HOTELS.filter((h) => (filter === 'walk' ? !!h.walk : filter === 'shuttle' ? h.shuttle : filter === 'budget' ? h.price <= 400 : true));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(HOTEL_CODE);
      showToast('Código copiado');
    } catch {
      showToast(`Código: ${HOTEL_CODE}`);
    }
  };

  return (
    <div className="page page-flush">
      <PageHeader title="Onde ficar" subtitle="Hotéis parceiros" />
      <div className="pad">
        <div className="code-card">
          <div>
            <small>Código de tarifa especial</small>
            <strong>{HOTEL_CODE}</strong>
            <span>Desconto de até 18% para visitantes credenciados</span>
          </div>
          <button className="btn btn-light" onClick={copy}>
            <Copy size={16} /> Copiar
          </button>
        </div>

        <Chips
          label="Filtrar hotéis"
          value={filter}
          onChange={setFilter}
          options={[
            { id: 'all', label: 'Todos' },
            { id: 'walk', label: 'A pé da feira' },
            { id: 'shuttle', label: 'Com traslado' },
            { id: 'budget', label: 'Até R$ 400' },
          ]}
        />

        <div className="stack">
          {list.map((h) => (
            <article key={h.id} className="hotel-card">
              <HotelArt hue={h.hue} stars={h.stars} />
              <div className="hc-body">
                <div className="hc-top">
                  <div>
                    <h3>{h.name}</h3>
                    <span className="stars" aria-label={`${h.stars} estrelas`}>
                      {Array.from({ length: h.stars }).map((_, i) => (
                        <Star key={i} size={12} fill="currentColor" />
                      ))}
                      <span className="muted"> · {h.neighborhood}</span>
                    </span>
                  </div>
                  <span className="rating">{h.rating.toFixed(1)}</span>
                </div>
                <p className="meta">
                  {h.walk ? <Footprints size={14} /> : <Car size={14} />} {h.distance} da feira{h.walk ? ` · ${h.walk}` : ''}
                </p>
                <div className="perks">
                  {h.perks.map((p) => (
                    <span key={p} className={`perk ${p.startsWith('Traslado') ? 'perk-hi' : ''}`}>
                      {p.startsWith('Traslado') ? <Bus size={12} /> : <Check size={12} />} {p}
                    </span>
                  ))}
                </div>
                <div className="hc-foot">
                  <div>
                    <s>{brl(h.oldPrice)}</s>
                    <strong>{brl(h.price)}</strong>
                    <small>/noite</small>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setGuests(1);
                      setNights(4);
                      setBooking(h);
                    }}
                  >
                    Reservar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <h2 className="h2">Como chegar</h2>
        <div className="card how">
          <p>
            <MapPin size={18} /> <span><strong>{FAIR.venue}</strong><br />{FAIR.address}</span>
          </p>
          <p>
            <Plane size={18} /> <span>Aeroporto de Congonhas a ~9 km · Guarulhos a ~45 km</span>
          </p>
          <p>
            <Bus size={18} /> <span>Traslado oficial gratuito entre os hotéis parceiros e a feira, a cada 30 min</span>
          </p>
          <p>
            <Car size={18} /> <span>Embarque e desembarque de apps pelo Portão 1</span>
          </p>
        </div>
      </div>

      <Sheet open={!!booking} onClose={() => setBooking(null)} title="Pré-reserva">
        {booking && (
          <div>
            <h3 className="sheet-title">{booking.name}</h3>
            <p className="muted small">Check-in 14/02 · tarifa {HOTEL_CODE} aplicada</p>
            <div className="row-between">
              <span>Noites</span>
              <QtyStepper value={nights} min={1} onChange={setNights} label="noites" />
            </div>
            <div className="row-between">
              <span>Hóspedes</span>
              <QtyStepper value={guests} min={1} onChange={(n) => setGuests(Math.min(4, n))} label="hóspedes" />
            </div>
            <div className="row-between total">
              <span>Total estimado</span>
              <strong>{brl(booking.price * nights)}</strong>
            </div>
            <button
              className="btn btn-primary btn-block"
              onClick={() => {
                setBooking(null);
                showToast('Pré-reserva enviada ao hotel (demonstração)');
              }}
            >
              Solicitar pré-reserva
            </button>
            <p className="hint center">O hotel confirma por e-mail. Nenhuma cobrança é feita agora.</p>
          </div>
        )}
      </Sheet>
    </div>
  );
}
