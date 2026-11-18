import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getProduct } from './data/stores';

export type User = {
  name: string;
  company: string;
  cnpj: string;
  email: string;
  phone: string;
  city: string;
};
type Account = User & { password: string };

export type CartItem = { productId: string; qty: number; variant: string; note: string };

export type CheckoutForm = {
  name: string;
  company: string;
  cnpj: string;
  email: string;
  phone: string;
  cep: string;
  city: string;
  deadline: string;
  payment: string;
  contactBy: string;
  visit: boolean;
  notes: string;
};

export type Quote = {
  id: string;
  storeId: string;
  items: CartItem[];
  createdAt: number;
  estimate: number;
  form: CheckoutForm;
};

export const DEMO_ACCOUNT: Account = {
  name: 'Carla Mendes',
  company: 'Joalheria Brilho do Sul',
  cnpj: '12.345.678/0001-90',
  email: 'demo@feninjer.com.br',
  phone: '(51) 99876-5432',
  city: 'Porto Alegre, RS',
  password: 'feninjer84',
};

type Persisted = {
  user: User | null;
  accounts: Account[];
  cart: CartItem[];
  quotes: Quote[];
  savedEvents: string[];
  savedTalks: string[];
};

const KEY = 'feninjer-demo-v1';
const initial: Persisted = { user: null, accounts: [DEMO_ACCOUNT], cart: [], quotes: [], savedEvents: ['e2'], savedTalks: [] };

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    const data = { ...initial, ...JSON.parse(raw) } as Persisted;
    if (!data.accounts.some((a) => a.email === DEMO_ACCOUNT.email)) data.accounts.unshift(DEMO_ACCOUNT);
    return data;
  } catch {
    return initial;
  }
}

type Toast = { id: number; message: string; action?: { label: string; to: string } };

type Ctx = Persisted & {
  login: (email: string, password: string) => string | null;
  register: (a: Account) => string | null;
  logout: () => void;
  addToCart: (item: CartItem) => void;
  setQty: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  submitQuote: (storeId: string, form: CheckoutForm) => Quote;
  toggleEvent: (id: string) => void;
  toggleTalk: (id: string) => void;
  resetDemo: () => void;
  toast: Toast | null;
  showToast: (message: string, action?: Toast['action']) => void;
  cartCount: number;
};

const AppCtx = createContext<Ctx | null>(null);

export const itemEstimate = (it: CartItem) => (getProduct(it.productId)?.priceRef ?? 0) * it.qty;

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(load);
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<number>();

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* armazenamento indisponível: a demo segue funcionando em memória */
    }
  }, [state]);

  const showToast = useCallback((message: string, action?: Toast['action']) => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), message, action });
    timer.current = window.setTimeout(() => setToast(null), 3200);
  }, []);

  const login = useCallback(
    (email: string, password: string) => {
      const acc = state.accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
      if (!acc) return 'Não encontramos uma conta com este e-mail.';
      if (acc.password !== password) return 'Senha incorreta. Confira e tente novamente.';
      const { password: _pw, ...user } = acc;
      setState((s) => ({ ...s, user }));
      return null;
    },
    [state.accounts],
  );

  const register = useCallback(
    (a: Account) => {
      if (state.accounts.some((x) => x.email.toLowerCase() === a.email.trim().toLowerCase()))
        return 'Este e-mail já está cadastrado. Faça login.';
      const { password: _pw, ...user } = a;
      setState((s) => ({ ...s, accounts: [...s.accounts, a], user }));
      return null;
    },
    [state.accounts],
  );

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      toast,
      showToast,
      login,
      register,
      cartCount: state.cart.length,
      logout: () => setState((s) => ({ ...s, user: null })),
      addToCart: (item) =>
        setState((s) => {
          const exists = s.cart.some((c) => c.productId === item.productId);
          return {
            ...s,
            cart: exists ? s.cart.map((c) => (c.productId === item.productId ? item : c)) : [...s.cart, item],
          };
        }),
      setQty: (productId, qty) =>
        setState((s) => ({ ...s, cart: s.cart.map((c) => (c.productId === productId ? { ...c, qty } : c)) })),
      removeItem: (productId) => setState((s) => ({ ...s, cart: s.cart.filter((c) => c.productId !== productId) })),
      submitQuote: (storeId, form) => {
        const items = state.cart.filter((c) => getProduct(c.productId)?.storeId === storeId);
        const quote: Quote = {
          id: `FNJ84-${Math.floor(10000 + Math.random() * 89999)}`,
          storeId,
          items,
          form,
          createdAt: Date.now(),
          estimate: items.reduce((t, i) => t + itemEstimate(i), 0),
        };
        setState((s) => ({
          ...s,
          quotes: [quote, ...s.quotes],
          cart: s.cart.filter((c) => getProduct(c.productId)?.storeId !== storeId),
        }));
        return quote;
      },
      toggleEvent: (id) =>
        setState((s) => ({
          ...s,
          savedEvents: s.savedEvents.includes(id) ? s.savedEvents.filter((e) => e !== id) : [...s.savedEvents, id],
        })),
      toggleTalk: (id) =>
        setState((s) => ({
          ...s,
          savedTalks: s.savedTalks.includes(id) ? s.savedTalks.filter((t) => t !== id) : [...s.savedTalks, id],
        })),
      resetDemo: () => setState((s) => ({ ...initial, accounts: s.accounts, user: s.user })),
    }),
    [state, toast, showToast, login, register],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp fora do provider');
  return c;
}

export const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

/** Status simulado: a loja "começa a analisar" 1 minuto após o envio. */
export const quoteStatus = (q: Quote) =>
  Date.now() - q.createdAt > 60_000 ? { label: 'Em análise', tone: 'info' } : { label: 'Enviado', tone: 'ok' };
