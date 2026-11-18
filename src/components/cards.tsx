import { Link } from 'react-router-dom';
import { Check, MapPin, Plus } from 'lucide-react';
import { getStore, productsOf, sectorLabel, unitLabel } from '../data/stores';
import type { Product, Store } from '../data/stores';
import { brl, useApp } from '../store';
import { ProductArt } from './ProductArt';
import { StoreMark } from './ui';

export function ProductCard({ product, showStore = true }: { product: Product; showStore?: boolean }) {
  const { cart, addToCart, showToast } = useApp();
  const store = getStore(product.storeId)!;
  const item = cart.find((c) => c.productId === product.id);

  // adição rápida: 1 unidade na primeira variação; se já estiver no orçamento, soma +1
  const quickAdd = () => {
    const qty = (item?.qty ?? 0) + 1;
    addToCart({ productId: product.id, qty, variant: item?.variant ?? product.variants[0], note: item?.note ?? '' });
    showToast(item ? `${product.name}: ${qty} ${unitLabel(product.unit)}` : `Adicionado ao orçamento de ${store.name}`, {
      label: 'Ver orçamento',
      to: '/orcamento',
    });
  };

  return (
    <div className="product-card">
      <div className="pc-art">
        {/* imagem também leva à página do produto; fora da ordem de tab para não duplicar o link */}
        <Link to={`/produto/${product.id}`} tabIndex={-1} aria-hidden="true" className="tap block size-full">
          <ProductArt art={product.art} />
        </Link>
        {item && (
          <span className="pc-incart">
            <Check size={14} strokeWidth={3} /> {item.qty} no orçamento
          </span>
        )}
        <button
          type="button"
          className={`pc-add ${item ? 'on' : ''}`}
          onClick={quickAdd}
          aria-label={item ? `Adicionar mais 1 ${product.name}` : `Adicionar ${product.name} ao orçamento`}
        >
          <Plus size={20} strokeWidth={2.6} />
        </button>
      </div>
      <Link to={`/produto/${product.id}`} className="pc-link">
        <div className="pc-body">
          {showStore && <span className="pc-store">{store.name}</span>}
          <h3>{product.name}</h3>
          <span className="pc-price">
            <small>Ref.</small> {brl(product.priceRef)}
            <small>/{unitLabel(product.unit)}</small>
          </span>
        </div>
      </Link>
    </div>
  );
}

export function StoreCardCompact({ store }: { store: Store }) {
  return (
    <Link to={`/lojas/${store.id}`} className="store-compact">
      <div className="sc-cover" style={{ background: `linear-gradient(135deg, ${store.color}, ${store.color}cc)` }}>
        <StoreMark store={store} size={48} />
      </div>
      <div className="sc-body">
        <h3>{store.name}</h3>
        <p>{sectorLabel(store.sector)}</p>
        <span className="sc-stand">
          <MapPin size={13} /> Estande {store.stand}
        </span>
      </div>
    </Link>
  );
}

export function StoreCard({ store }: { store: Store }) {
  const prods = productsOf(store.id);
  return (
    <Link to={`/lojas/${store.id}`} className="store-card">
      <div className="stc-head">
        <StoreMark store={store} size={52} />
        <div className="stc-info">
          <h3>{store.name}</h3>
          <p>{store.tagline}</p>
          <div className="stc-meta">
            <span className="tag">{sectorLabel(store.sector)}</span>
            <span className="meta">
              <MapPin size={13} /> {store.stand}
            </span>
            <span className="meta">{store.city}</span>
          </div>
        </div>
      </div>
      <div className="stc-thumbs" aria-hidden="true">
        {prods.map((p) => (
          <ProductArt key={p.id} art={p.art} className="stc-thumb" />
        ))}
      </div>
    </Link>
  );
}
