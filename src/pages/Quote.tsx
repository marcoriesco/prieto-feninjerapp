import { FormEvent, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import * as Collapsible from '@radix-ui/react-collapsible';
import * as Switch from '@radix-ui/react-switch';
import { ArrowRight, Check, ChevronDown, ClipboardList, Info, MapPin, Send, Trash2 } from 'lucide-react';
import { STORES, getProduct, getStore, unitLabel } from '../data/stores';
import { ProductArt } from '../components/ProductArt';
import { Chips, Empty, PageHeader, QtyStepper, StoreMark } from '../components/ui';
import { CartItem, CheckoutForm, brl, itemEstimate, useApp } from '../store';
import { maskCep, maskCnpj, maskPhone } from '../utils';

function groupByStore(cart: CartItem[]) {
  return STORES.map((s) => ({ store: s, items: cart.filter((c) => getProduct(c.productId)?.storeId === s.id) })).filter((g) => g.items.length);
}

export function Cart() {
  const { cart, setQty, removeItem, quotes, showToast } = useApp();
  const groups = groupByStore(cart);

  if (!cart.length)
    return (
      <div className="page">
        <h1 className="page-title">Meu orçamento</h1>
        <Empty
          icon={<ClipboardList size={30} />}
          title="Seu orçamento está vazio"
          text="Adicione produtos de um ou mais expositores. Cada loja recebe só o pedido dela."
          action={
            <Link to="/lojas" className="btn btn-primary">
              Explorar expositores
            </Link>
          }
        />
        {quotes.length > 0 && (
          <Link to="/perfil" className="cart-banner subtle">
            <Send size={20} />
            <span>
              <strong>
                {quotes.length} {quotes.length === 1 ? 'orçamento enviado' : 'orçamentos enviados'}
              </strong>
              <small>Acompanhe o status na sua conta</small>
            </span>
            <ArrowRight size={18} />
          </Link>
        )}
      </div>
    );

  const grandTotal = cart.reduce((t, i) => t + itemEstimate(i), 0);

  return (
    <div className="page">
      <h1 className="page-title">Meu orçamento</h1>
      <div className="note">
        <Info size={18} />
        <p>
          Você tem itens de <strong>{groups.length} {groups.length === 1 ? 'loja' : 'lojas'}</strong>. Cada loja recebe um pedido de orçamento
          separado. Envie loja por loja ou todos de uma vez. Nenhum pagamento é feito aqui.
        </p>
      </div>

      {groups.length > 1 && (
        <div className="send-all">
          <div>
            <small>
              {groups.length} lojas · {cart.length} {cart.length === 1 ? 'produto' : 'produtos'}
            </small>
            <strong>Estimativa total {brl(grandTotal)}</strong>
          </div>
          <Link to="/checkout/todos" className="btn btn-primary btn-block">
            <Send size={18} /> Enviar todos os orçamentos
          </Link>
        </div>
      )}

      <div className="stack">
        {groups.map(({ store, items }) => {
          const total = items.reduce((t, i) => t + itemEstimate(i), 0);
          return (
            <section className="cart-group" key={store.id} aria-label={`Itens de ${store.name}`}>
              <header className="cg-head">
                <StoreMark store={store} size={40} />
                <Link to={`/lojas/${store.id}`}>
                  <strong>{store.name}</strong>
                  <small>
                    <MapPin size={12} /> Estande {store.stand} · {items.length} {items.length === 1 ? 'item' : 'itens'}
                  </small>
                </Link>
              </header>
              <ul className="cg-items">
                {items.map((it) => {
                  const p = getProduct(it.productId)!;
                  return (
                    <li key={it.productId} className="cg-item">
                      <Link to={`/produto/${p.id}`} className="cg-thumb" aria-label={p.name}>
                        <ProductArt art={p.art} />
                      </Link>
                      <div className="cg-info">
                        <Link to={`/produto/${p.id}`} className="cg-name">
                          {p.name}
                        </Link>
                        <small>
                          {it.variant} · ref. {brl(p.priceRef)}/{unitLabel(p.unit)}
                        </small>
                        {it.note && <small className="cg-note">“{it.note}”</small>}
                        <div className="cg-actions">
                          <QtyStepper value={it.qty} min={1} onChange={(n) => setQty(p.id, n)} label={p.name} />
                          <button
                            className="icon-btn danger"
                            aria-label={`Remover ${p.name}`}
                            onClick={() => {
                              removeItem(p.id);
                              showToast('Item removido do orçamento');
                            }}
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <footer className="cg-foot">
                <div>
                  <small>Estimativa de referência</small>
                  <strong>{brl(total)}</strong>
                </div>
                <Link to={`/checkout/${store.id}`} className="btn btn-primary">
                  {groups.length > 1 ? 'Enviar só esta' : 'Solicitar orçamento'} <ArrowRight size={18} />
                </Link>
              </footer>
            </section>
          );
        })}
      </div>
    </div>
  );
}

const DEADLINES = ['Retirar na feira', 'Até 30 dias', '30 a 60 dias', 'Sem pressa'];
const PAYMENTS = ['PIX', 'Boleto 30/60/90', 'Cartão', 'A combinar'];
const CONTACTS = ['WhatsApp', 'E-mail', 'Ligação'];

function ChoiceGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset className="fieldset">
      <legend>{label}</legend>
      <Chips wrap check label={label} value={value} onChange={onChange} options={options.map((o) => ({ id: o, label: o }))} />
    </fieldset>
  );
}

/** Checkout de uma loja (`/checkout/:storeId`) ou de todas (`/checkout/todos`). Sempre gera um pedido por loja. */
export function Checkout() {
  const { storeId = '' } = useParams();
  const nav = useNavigate();
  const { cart, user, submitQuote } = useApp();
  const all = storeId === 'todos';
  const groups = useMemo(() => groupByStore(cart).filter((g) => all || g.store.id === storeId), [cart, storeId, all]);
  const items = groups.flatMap((g) => g.items);
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [f, setF] = useState<CheckoutForm>({
    name: user?.name ?? '',
    company: user?.company ?? '',
    cnpj: user?.cnpj ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    cep: '90010-000',
    city: user?.city ?? '',
    deadline: DEADLINES[1],
    payment: PAYMENTS[3],
    contactBy: CONTACTS[0],
    visit: true,
    notes: '',
  });

  if ((!all && !getStore(storeId)) || (!items.length && !sending)) return <Navigate to="/orcamento" replace />;
  const single = groups.length === 1 ? groups[0].store : null;
  const total = items.reduce((t, i) => t + itemEstimate(i), 0);
  const units = items.reduce((t, i) => t + i.qty, 0);

  const set = <K extends keyof CheckoutForm>(k: K, v: CheckoutForm[K]) => {
    setF((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: '' }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!f.name.trim()) er.name = 'Informe seu nome.';
    if (!f.company.trim()) er.company = 'Informe a empresa.';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'E-mail inválido.';
    if (f.phone.replace(/\D/g, '').length < 10) er.phone = 'Telefone com DDD.';
    if (f.cep.replace(/\D/g, '').length !== 8) er.cep = 'CEP com 8 dígitos.';
    if (!f.city.trim()) er.city = 'Informe a cidade.';
    setErrors(er);
    if (Object.keys(er).length) {
      document.querySelector('.has-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSending(true);
    const storeIds = groups.map((g) => g.store.id);
    window.setTimeout(() => {
      const ids = storeIds.map((id) => submitQuote(id, f).id);
      nav(`/enviado/${ids.join(',')}`, { replace: true });
    }, 700);
  };

  const input = (k: keyof CheckoutForm, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, mask?: (v: string) => string) => (
    <label className={`field ${errors[k] ? 'has-error' : ''}`}>
      <span>{label}</span>
      <input value={f[k] as string} onChange={(e) => set(k, (mask ? mask(e.target.value) : e.target.value) as never)} aria-invalid={!!errors[k]} {...props} />
      {errors[k] && <small className="field-error">{errors[k]}</small>}
    </label>
  );

  return (
    <form className="page page-flush has-action-bar" onSubmit={submit} noValidate>
      <PageHeader
        title={single ? 'Solicitar orçamento' : 'Enviar todos os orçamentos'}
        subtitle={single ? single.name : `${groups.length} lojas · um pedido para cada`}
      />
      <div className="pad">
        {single ? (
          <div className="checkout-store">
            <StoreMark store={single} size={44} />
            <div>
              <strong>{single.name}</strong>
              <small>
                Estande {single.stand} · responde em {single.responseTime}
              </small>
            </div>
          </div>
        ) : (
          <div className="checkout-stores">
            {groups.map(({ store }) => (
              <span key={store.id} className="cs-chip">
                <StoreMark store={store} size={28} /> {store.name}
              </span>
            ))}
          </div>
        )}

        <Collapsible.Root open={open} onOpenChange={setOpen} className="card">
          <Collapsible.Trigger type="button" className="collapse-head">
            <span>
              <strong>
                {items.length} {items.length === 1 ? 'produto' : 'produtos'} · {units} {units === 1 ? 'unidade' : 'unidades'}
              </strong>
              <small>Estimativa {brl(total)} · toque para ver</small>
            </span>
            <ChevronDown size={20} className={open ? 'rot' : ''} />
          </Collapsible.Trigger>
          <Collapsible.Content>
            {groups.map(({ store, items: gi }) => (
              <div key={store.id}>
                {!single && <p className="sl-store">{store.name}</p>}
                <ul className="summary-list">
                  {gi.map((it) => {
                    const p = getProduct(it.productId)!;
                    return (
                      <li key={p.id}>
                        <ProductArt art={p.art} className="sl-thumb" />
                        <span>
                          <strong>{p.name}</strong>
                          <small>
                            {it.qty} {unitLabel(p.unit)} · {it.variant}
                          </small>
                        </span>
                        <span className="sl-price">{brl(itemEstimate(it))}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </Collapsible.Content>
        </Collapsible.Root>

        <h2 className="h2">Seus dados</h2>
        <div className="card form-card">
          {input('name', 'Nome', { autoComplete: 'name' })}
          {input('company', 'Empresa / loja', { autoComplete: 'organization' })}
          {input('cnpj', 'CNPJ', { inputMode: 'numeric' }, maskCnpj)}
          {input('email', 'E-mail', { type: 'email', inputMode: 'email', autoComplete: 'email' })}
          {input('phone', 'WhatsApp', { type: 'tel', inputMode: 'tel', autoComplete: 'tel' }, maskPhone)}
        </div>

        <h2 className="h2">Entrega</h2>
        <div className="card form-card two-col">
          {input('cep', 'CEP', { inputMode: 'numeric', autoComplete: 'postal-code' }, maskCep)}
          {input('city', 'Cidade / UF', { autoComplete: 'address-level2' })}
        </div>

        <h2 className="h2">Preferências</h2>
        <div className="card form-card">
          <ChoiceGroup label="Prazo desejado" options={DEADLINES} value={f.deadline} onChange={(v) => set('deadline', v)} />
          <ChoiceGroup label="Forma de pagamento preferida" options={PAYMENTS} value={f.payment} onChange={(v) => set('payment', v)} />
          <ChoiceGroup label="Receber a proposta por" options={CONTACTS} value={f.contactBy} onChange={(v) => set('contactBy', v)} />
          <div className="switch-row">
            <label htmlFor="visit">
              <strong>{single ? `Quero visitar o estande ${single.stand}` : 'Quero visitar os estandes'}</strong>
              <small>{single ? 'A loja pode reservar' : 'Cada loja pode reservar'} um horário para você durante a feira</small>
            </label>
            <Switch.Root id="visit" className="switch" checked={f.visit} onCheckedChange={(v) => set('visit', v)}>
              <Switch.Thumb className="switch-thumb" />
            </Switch.Root>
          </div>
          <label className="field">
            <span>Observações (opcional)</span>
            <textarea rows={3} placeholder="Detalhes de embalagem, gravação, grade de numeração…" value={f.notes} onChange={(e) => set('notes', e.target.value)} />
          </label>
        </div>
        <p className="hint center">
          {single
            ? `Ao enviar, só ${single.name} recebe este pedido. Os itens de outras lojas continuam no seu orçamento.`
            : 'Cada loja recebe apenas os próprios itens, com um protocolo separado.'}
        </p>
      </div>

      <div className="action-bar">
        <div className="ab-total">
          <small>Estimativa</small>
          <strong>{brl(total)}</strong>
        </div>
        <button className="btn btn-primary grow" type="submit" disabled={sending}>
          {sending ? <span className="spinner" aria-label="Enviando" /> : <Send size={18} />}
          {sending ? 'Enviando…' : single ? 'Enviar orçamento' : `Enviar para ${groups.length} lojas`}
        </button>
      </div>
    </form>
  );
}

const contactLabel = (c: string) => (c === 'Ligação' ? 'por telefone' : c === 'E-mail' ? 'por e-mail' : 'pelo WhatsApp');

/** Confirmação de um ou vários pedidos (`/enviado/id1,id2`). */
export function QuoteSent() {
  const { quoteId = '' } = useParams();
  const { quotes, cart } = useApp();
  const sent = quoteId
    .split(',')
    .map((id) => quotes.find((x) => x.id === id))
    .filter((q): q is NonNullable<typeof q> => !!q);
  if (!sent.length) return <Navigate to="/" replace />;
  const q = sent[0];
  const store = getStore(q.storeId)!;
  const next = groupByStore(cart)[0];
  const many = sent.length > 1;

  return (
    <div className="page sent">
      <div className="sent-check" aria-hidden="true">
        <Check size={44} strokeWidth={3} />
      </div>
      <h1>{many ? `${sent.length} orçamentos enviados!` : 'Orçamento enviado!'}</h1>
      <p className="muted center">
        {many ? (
          <>Cada loja recebeu só os próprios itens e responde {contactLabel(q.form.contactBy)}.</>
        ) : (
          <>
            <strong>{store.name}</strong> recebeu seu pedido e responde em {store.responseTime} {contactLabel(q.form.contactBy)}.
          </>
        )}
      </p>

      {many ? (
        <ul className="sent-list">
          {sent.map((x) => {
            const s = getStore(x.storeId)!;
            return (
              <li key={x.id}>
                <StoreMark store={s} size={40} />
                <span>
                  <strong>{s.name}</strong>
                  <small>
                    {x.items.length} {x.items.length === 1 ? 'produto' : 'produtos'} · responde em {s.responseTime}
                  </small>
                </span>
                <span className="sent-proto">{x.id}</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="protocol">
          <small>Protocolo</small>
          <strong>{q.id}</strong>
        </div>
      )}

      <ol className="timeline">
        <li className="done">
          <strong>{many ? 'Pedidos enviados' : 'Pedido enviado'}</strong>
          <small>Estimativa {brl(sent.reduce((t, x) => t + x.estimate, 0))}</small>
        </li>
        <li>
          <strong>{many ? 'Lojas analisam e montam as propostas' : 'Loja analisa e monta a proposta'}</strong>
          <small>Preços finais, prazo e condições</small>
        </li>
        <li>
          <strong>{many ? 'Você recebe as propostas' : 'Você recebe a proposta'}</strong>
          <small>
            {q.form.visit ? (many ? 'E pode fechar nos estandes durante a feira' : `E pode fechar no estande ${store.stand}`) : 'E decide se quer seguir'}
          </small>
        </li>
      </ol>

      <div className="stack">
        {next && (
          <Link to={`/checkout/${next.store.id}`} className="btn btn-primary btn-block">
            Enviar também para {next.store.name} ({next.items.length}) <ArrowRight size={18} />
          </Link>
        )}
        {many ? (
          <Link to="/perfil" className={`btn btn-block ${next ? 'btn-outline' : 'btn-primary'}`}>
            <Send size={18} /> Acompanhar orçamentos
          </Link>
        ) : (
          <Link to={`/mapa?estande=${store.stand}`} className={`btn btn-block ${next ? 'btn-outline' : 'btn-primary'}`}>
            <MapPin size={18} /> Ver estande no mapa
          </Link>
        )}
        <Link to="/" className="btn btn-ghost btn-block">
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
