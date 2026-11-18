import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BedDouble, CalendarDays, ClipboardList, Clock, Map, MapPin, Mic, Store as StoreIcon } from 'lucide-react';
import { TALKS } from '../data/talks';
import { TalkCardCompact } from './Talks';
import { DAYS, EVENTS, EVENT_CATS, FAIR, PLACES } from '../data/fair';
import { PRODUCTS, SECTORS, STORES, getProduct } from '../data/stores';
import type { SectorId } from '../data/stores';
import { ProductCard, StoreCardCompact } from '../components/cards';
import { Chips, SectionTitle } from '../components/ui';
import { useApp } from '../store';
import { countdown } from '../utils';

export function Home() {
  const { user, cart } = useApp();
  const [now, setNow] = useState(Date.now());
  const [sector, setSector] = useState<'all' | SectorId>('all');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(t);
  }, []);

  const cd = countdown(FAIR.start, now);
  const firstName = user?.name.split(' ')[0];
  const products = useMemo(() => PRODUCTS.filter((p) => sector === 'all' || STORES.find((s) => s.id === p.storeId)?.sector === sector), [sector]);
  const visible = expanded ? products : products.slice(0, 6);
  const cartStores = new Set(cart.map((c) => getProduct(c.productId)?.storeId)).size;
  const nextEvents = EVENTS.slice(0, 3);

  return (
    <div className="page home">
      <p className="greeting">
        Olá, <strong>{firstName}</strong> 👋
      </p>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-rings" aria-hidden="true" />
        <span className="hero-eyebrow">{FAIR.edition} edição · {FAIR.name}</span>
        <h1 id="hero-title">{FAIR.slogan}</h1>
        <p className="hero-place">
          <CalendarDays size={16} /> {FAIR.datesLabel}
        </p>
        <p className="hero-place">
          <MapPin size={16} /> {FAIR.venue} · {FAIR.halls}
        </p>

        <div className="countdown" aria-label={`Faltam ${cd.days} dias para a feira`}>
          <span className="cd-label">Faltam</span>
          <div className="cd-box">
            <strong>{cd.days}</strong>
            <small>dias</small>
          </div>
          <div className="cd-box">
            <strong>{String(cd.hours).padStart(2, '0')}</strong>
            <small>horas</small>
          </div>
          <div className="cd-box">
            <strong>{String(cd.minutes).padStart(2, '0')}</strong>
            <small>min</small>
          </div>
        </div>

        <div className="hero-stats">
          {FAIR.stats.map((s) => (
            <div key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <nav className="quick" aria-label="Atalhos">
        <Link to="/mapa" className="quick-item">
          <span className="qi-icon"><Map size={22} /></span>Mapa
        </Link>
        <Link to="/agenda" className="quick-item">
          <span className="qi-icon"><CalendarDays size={22} /></span>Agenda
        </Link>
        <Link to="/palestras" className="quick-item">
          <span className="qi-icon"><Mic size={22} /></span>Palestras
        </Link>
        <Link to="/hospedagem" className="quick-item">
          <span className="qi-icon"><BedDouble size={22} /></span>Hotéis
        </Link>
        <Link to="/lojas" className="quick-item">
          <span className="qi-icon"><StoreIcon size={22} /></span>Expositores
        </Link>
      </nav>

      {cart.length > 0 && (
        <Link to="/orcamento" className="cart-banner">
          <ClipboardList size={22} />
          <span>
            <strong>
              {cart.length} {cart.length === 1 ? 'item' : 'itens'} para orçar
            </strong>
            <small>
              em {cartStores} {cartStores === 1 ? 'loja' : 'lojas'} · revise e envie
            </small>
          </span>
          <ArrowRight size={20} />
        </Link>
      )}

      <section>
        <SectionTitle title="Expositores" to="/lojas" />
        <div className="h-scroll">
          {STORES.map((s) => (
            <StoreCardCompact key={s.id} store={s} />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Produtos para orçar" />
        <Chips
          label="Filtrar produtos por setor"
          value={sector}
          onChange={(v) => {
            setSector(v);
            setExpanded(false);
          }}
          options={[{ id: 'all' as const, label: 'Todos' }, ...SECTORS.map((s) => ({ id: s.id, label: s.label }))]}
        />
        <div className="product-grid">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {products.length > visible.length && (
          <button className="btn btn-outline btn-block" onClick={() => setExpanded(true)}>
            Ver mais {products.length - visible.length} produtos
          </button>
        )}
      </section>

      <section>
        <SectionTitle title="Agenda da feira" to="/agenda" linkLabel="Ver agenda" />
        <div className="event-mini-list">
          {nextEvents.map((e) => {
            const cat = EVENT_CATS.find((c) => c.id === e.cat)!;
            const day = DAYS.find((d) => d.day === e.day)!;
            return (
              <Link to={`/agenda?dia=${e.day}`} key={e.id} className="event-mini">
                <div className="em-date">
                  <small>{day.short}</small>
                  <strong>{e.day}</strong>
                  <small>fev</small>
                </div>
                <div className="em-body">
                  <span className="em-cat" style={{ color: cat.color }}>{cat.label}</span>
                  <h3>{e.title}</h3>
                  <span className="meta">
                    <Clock size={13} /> {e.start} · {PLACES[e.place].name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <SectionTitle title="FENINJER+ Talks" to="/palestras" linkLabel="Ver palestras" />
        <div className="h-scroll">
          {TALKS.slice(0, 6).map((t) => (
            <TalkCardCompact key={t.id} talk={t} />
          ))}
        </div>
      </section>

      <Link to="/hospedagem" className="promo-card">
        <BedDouble size={28} />
        <div>
          <strong>Hotéis parceiros com tarifa especial</strong>
          <span>Até 18% de desconto e traslado gratuito até a feira</span>
        </div>
        <ArrowRight size={20} />
      </Link>

      <p className="demo-foot">Ambiente de demonstração · lojas, produtos e preços fictícios</p>
    </div>
  );
}
