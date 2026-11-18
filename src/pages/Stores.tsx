import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, ClipboardList, Clock, MapPin, Search, X } from 'lucide-react';
import { PRODUCTS, SECTORS, STORES, getProduct, getStore, productsOf, sectorLabel, unitLabel } from '../data/stores';
import type { SectorId } from '../data/stores';
import { ProductCard, StoreCard } from '../components/cards';
import { ProductArt } from '../components/ProductArt';
import { Chips, Empty, PageHeader, QtyStepper, StoreMark } from '../components/ui';
import { brl, useApp } from '../store';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function Stores() {
  const [q, setQ] = useState('');
  const [sector, setSector] = useState<'all' | SectorId>('all');
  const term = norm(q.trim());

  const stores = useMemo(
    () =>
      STORES.filter(
        (s) => (sector === 'all' || s.sector === sector) && (!term || norm(`${s.name} ${s.tagline} ${s.city} ${s.stand}`).includes(term)),
      ),
    [sector, term],
  );
  const products = useMemo(
    () =>
      term
        ? PRODUCTS.filter(
            (p) => (sector === 'all' || getStore(p.storeId)!.sector === sector) && norm(`${p.name} ${p.material} ${p.ref}`).includes(term),
          )
        : [],
    [sector, term],
  );

  return (
    <div className="page">
      <h1 className="page-title">Expositores</h1>
      <div className="search">
        <Search size={20} aria-hidden="true" />
        <input
          type="search"
          placeholder="Buscar loja, produto ou referência"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Buscar expositores e produtos"
          enterKeyHint="search"
        />
        {q && (
          <button className="input-icon" onClick={() => setQ('')} aria-label="Limpar busca">
            <X size={18} />
          </button>
        )}
      </div>
      <Chips
        label="Filtrar por setor"
        value={sector}
        onChange={setSector}
        options={[{ id: 'all' as const, label: 'Todos' }, ...SECTORS.map((s) => ({ id: s.id, label: s.label }))]}
      />

      {stores.length > 0 && (
        <>
          <p className="result-count">
            {stores.length} {stores.length === 1 ? 'expositor' : 'expositores'}
          </p>
          <div className="stack">
            {stores.map((s) => (
              <StoreCard key={s.id} store={s} />
            ))}
          </div>
        </>
      )}

      {products.length > 0 && (
        <>
          <p className="result-count">
            {products.length} {products.length === 1 ? 'produto' : 'produtos'}
          </p>
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}

      {!stores.length && !products.length && (
        <Empty icon={<Search size={28} />} title="Nada encontrado" text={`Não achamos resultados para “${q}”. Tente outro termo ou setor.`} />
      )}
    </div>
  );
}

export function StorePage() {
  const { id = '' } = useParams();
  const { cart } = useApp();
  const store = getStore(id);
  if (!store) return <Navigate to="/lojas" replace />;
  const prods = productsOf(store.id);
  const inCart = cart.filter((c) => getProduct(c.productId)?.storeId === store.id);

  return (
    <div className="page page-flush">
      <PageHeader title={store.name} subtitle={`Estande ${store.stand}`} />
      <div className="store-cover" style={{ background: `linear-gradient(135deg, ${store.color} 0%, #1c1c1c 120%)` }}>
        <StoreMark store={store} size={72} />
      </div>
      <div className="pad">
        <div className="store-head">
          <h1>{store.name}</h1>
          <p>{store.tagline}</p>
          <div className="stc-meta">
            <span className="tag">{sectorLabel(store.sector)}</span>
            <span className="meta">{store.city}</span>
            <span className="meta">desde {store.since}</span>
          </div>
        </div>

        <div className="info-row">
          <Link to={`/mapa?estande=${store.stand}`} className="info-tile">
            <MapPin size={20} />
            <span>
              <small>Estande</small>
              <strong>{store.stand}</strong>
            </span>
            <ArrowRight size={16} className="info-arrow" />
          </Link>
          <div className="info-tile">
            <Clock size={20} />
            <span>
              <small>Responde em</small>
              <strong>{store.responseTime}</strong>
            </span>
          </div>
        </div>

        <p className="about">{store.about}</p>

        {inCart.length > 0 && (
          <Link to="/orcamento" className="cart-banner">
            <ClipboardList size={22} />
            <span>
              <strong>
                {inCart.length} {inCart.length === 1 ? 'item' : 'itens'} desta loja no orçamento
              </strong>
              <small>Revise e envie quando quiser</small>
            </span>
            <ArrowRight size={20} />
          </Link>
        )}

        <h2 className="h2">Produtos ({prods.length})</h2>
        <div className="product-grid">
          {prods.map((p) => (
            <ProductCard key={p.id} product={p} showStore={false} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProductPage() {
  const { id = '' } = useParams();
  const { cart, addToCart, showToast, cartCount } = useApp();
  const product = getProduct(id);
  const existing = cart.find((c) => c.productId === id);
  const [qty, setQty] = useState(existing?.qty ?? 1);
  const [variant, setVariant] = useState(existing?.variant ?? product?.variants[0] ?? '');
  const [note, setNote] = useState(existing?.note ?? '');

  if (!product) return <Navigate to="/lojas" replace />;
  const store = getStore(product.storeId)!;
  const others = productsOf(store.id).filter((p) => p.id !== product.id);

  const add = () => {
    addToCart({ productId: product.id, qty, variant, note: note.trim() });
    showToast(existing ? 'Orçamento atualizado' : `Adicionado ao orçamento de ${store.name}`, { label: 'Ver orçamento', to: '/orcamento' });
  };

  return (
    <div className="page page-flush has-action-bar">
      <PageHeader
        title={product.name}
        subtitle={store.name}
        right={
          <Link to="/orcamento" className="icon-btn" aria-label={`Orçamento, ${cartCount} itens`}>
            <ClipboardList size={22} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
        }
      />
      <div className="product-hero">
        <ProductArt art={product.art} />
      </div>
      <div className="pad">
        <Link to={`/lojas/${store.id}`} className="store-line">
          <StoreMark store={store} size={36} />
          <span>
            <strong>{store.name}</strong>
            <small>
              Estande {store.stand} · {sectorLabel(store.sector)}
            </small>
          </span>
          <ArrowRight size={18} />
        </Link>

        <h1 className="product-title">{product.name}</h1>
        <p className="muted">
          Ref. {product.ref} · {product.material}
        </p>

        <div className="price-box">
          <div>
            <small>Preço de referência</small>
            <strong>
              {brl(product.priceRef)}
              <span>/{unitLabel(product.unit)}</span>
            </strong>
          </div>
          <div className="price-min">
            <small>Loja responde em</small>
            <strong>
              {store.responseTime}
            </strong>
          </div>
        </div>
        <p className="hint">O valor final, prazos e condições são enviados pela loja na resposta ao orçamento.</p>

        <p className="about">{product.description}</p>

        <fieldset className="fieldset">
          <legend>Variação</legend>
          <Chips wrap check label="Variação" value={variant} onChange={setVariant} options={product.variants.map((v) => ({ id: v, label: v }))} />
        </fieldset>

        <label className="field">
          <span>Observação para a loja (opcional)</span>
          <textarea rows={2} placeholder="Ex.: preciso de numerações 14 a 18, gravação, embalagem…" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>

        {others.length > 0 && (
          <>
            <h2 className="h2">Mais de {store.name}</h2>
            <div className="h-scroll">
              {others.map((p) => (
                <div className="h-scroll-item" key={p.id}>
                  <ProductCard product={p} showStore={false} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="action-bar">
        <QtyStepper value={qty} min={1} onChange={setQty} label={product.name} />
        <button className="btn btn-primary grow" onClick={add}>
          {existing ? 'Atualizar orçamento' : 'Adicionar ao orçamento'}
        </button>
      </div>
    </div>
  );
}
