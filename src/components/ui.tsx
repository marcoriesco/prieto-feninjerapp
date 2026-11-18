import { ReactNode, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { CalendarDays, Check, ChevronLeft, ClipboardList, Home, Map, Minus, Plus, Store as StoreIcon, X } from 'lucide-react';
import { useApp } from '../store';
import type { Store } from '../data/stores';
import { sectorLabel } from '../data/stores';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

export function Logo({ light = false, size = 'md' }: { light?: boolean; size?: 'md' | 'lg' }) {
  return (
    <span
      className={cx(
        'font-extrabold tracking-tight leading-none',
        size === 'lg' ? 'text-[32px]' : 'text-[22px]',
        light ? 'text-white' : 'text-ink-strong',
      )}
      aria-label="FENINJER+"
    >
      FENINJER<span className="text-brand">+</span>
    </span>
  );
}

export function TopBar() {
  const { user } = useApp();
  const initials = user?.name.split(' ').map((p) => p[0]).slice(0, 2).join('') ?? '';
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-white/90 px-4 pt-safe backdrop-blur-md">
      <Link to="/" aria-label="Início" className="tap">
        <Logo />
      </Link>
      <Link
        to="/perfil"
        aria-label="Minha conta"
        className="tap grid size-10 place-items-center rounded-full bg-ink text-sm font-bold text-white"
      >
        {initials}
      </Link>
    </header>
  );
}

export function PageHeader({ title, subtitle, right, back }: { title: string; subtitle?: string; right?: ReactNode; back?: string }) {
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-30 flex min-h-14 items-center gap-1 border-b border-line bg-white/90 px-1 pt-safe backdrop-blur-md">
      <button
        className="icon-btn"
        aria-label="Voltar"
        onClick={() => (back ? nav(back) : window.history.length > 1 ? nav(-1) : nav('/'))}
      >
        <ChevronLeft size={24} />
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-bold text-ink-strong">{title}</h1>
        {subtitle && <p className="truncate text-xs text-muted">{subtitle}</p>}
      </div>
      <div className="flex min-w-11 justify-end">{right}</div>
    </header>
  );
}

export function BottomNav() {
  const { cartCount } = useApp();
  const items = [
    { to: '/', label: 'Início', icon: Home, end: true },
    { to: '/lojas', label: 'Expositores', icon: StoreIcon },
    { to: '/mapa', label: 'Mapa', icon: Map },
    { to: '/agenda', label: 'Agenda', icon: CalendarDays },
    { to: '/orcamento', label: 'Orçamento', icon: ClipboardList, badge: cartCount },
  ];
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed bottom-0 left-1/2 z-40 grid w-full max-w-[480px] -translate-x-1/2 grid-cols-5 border-t border-line bg-white/95 pb-safe backdrop-blur-md"
    >
      {items.map(({ to, label, icon: Icon, end, badge }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cx(
              'tap relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold',
              isActive ? 'text-brand-ink' : 'text-muted',
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && <span className="absolute top-0 h-[3px] w-8 rounded-b-full bg-brand" />}
              <span className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
                {!!badge && <span className="badge absolute -right-2.5 -top-1.5">{badge}</span>}
              </span>
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export function StoreMark({ store, size = 44 }: { store: Store; size?: number }) {
  return (
    <span
      className="store-mark grid shrink-0 place-items-center rounded-xl font-extrabold tracking-wide text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.25)]"
      style={{ width: size, height: size, background: store.color, fontSize: size * 0.36 }}
      aria-hidden="true"
    >
      {store.initials}
    </span>
  );
}

export function SectorTag({ store }: { store: Store }) {
  return <span className="tag">{sectorLabel(store.sector)}</span>;
}

export function QtyStepper({ value, min, onChange, label }: { value: number; min: number; onChange: (n: number) => void; label: string }) {
  return (
    <div className="inline-flex h-11 items-center rounded-full border border-line bg-white" role="group" aria-label={`Quantidade de ${label}`}>
      <button
        type="button"
        aria-label="Diminuir"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="tap grid size-11 place-items-center rounded-full text-ink disabled:opacity-30"
      >
        <Minus size={18} />
      </button>
      <output aria-live="polite" className="min-w-8 text-center text-base font-bold tabular-nums">
        {value}
      </output>
      <button type="button" aria-label="Aumentar" onClick={() => onChange(value + 1)} className="tap grid size-11 place-items-center rounded-full text-ink">
        <Plus size={18} />
      </button>
    </div>
  );
}

/** Grupo de chips de seleção única (Radix ToggleGroup). `wrap` quebra linha; senão rola na horizontal. */
export function Chips<T extends string>({
  options,
  value,
  onChange,
  label,
  wrap = false,
  check = false,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  wrap?: boolean;
  check?: boolean;
}) {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as T)}
      aria-label={label}
      className={cx('flex gap-2', wrap ? 'flex-wrap' : 'no-scrollbar -mx-4 mb-2 overflow-x-auto px-4 py-1')}
    >
      {options.map((o) => (
        <ToggleGroup.Item key={o.id} value={o.id} className="chip">
          {check && value === o.id && <Check size={14} strokeWidth={3} />}
          {o.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}

/** Bottom sheet acessível (Radix Dialog): foco preso, Esc fecha, scroll travado. */
export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/45 data-[state=open]:animate-fade-in" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed bottom-0 left-1/2 z-50 max-h-[88dvh] w-full max-w-[480px] -translate-x-1/2 overflow-y-auto rounded-t-3xl bg-white px-5 pb-[calc(24px+env(safe-area-inset-bottom))] pt-2 shadow-2xl outline-none data-[state=open]:animate-sheet-up"
        >
          <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-line" aria-hidden="true" />
          <div className="mb-3 flex items-center justify-between gap-2">
            <Dialog.Title className="text-lg font-bold text-ink-strong">{title}</Dialog.Title>
            <Dialog.Close className="icon-btn -mr-2" aria-label="Fechar">
              <X size={22} />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Toast global (Radix Toast), alimentado pelo estado do app. */
export function Toaster() {
  const { toast } = useApp();
  const { pathname } = useLocation();
  // o aviso pertence à tela onde surgiu: ao navegar, some para não cobrir botões da próxima tela
  const shownAt = useRef<{ id: number; path: string } | null>(null);
  if (toast && shownAt.current?.id !== toast.id) shownAt.current = { id: toast.id, path: pathname };
  const visible = toast && shownAt.current?.path === pathname;
  return (
    <ToastPrimitive.Provider swipeDirection="down" duration={3200}>
      {visible && (
        <ToastPrimitive.Root
          key={toast.id}
          className="flex items-center justify-between gap-3 rounded-2xl bg-ink-strong px-4 py-3 text-sm font-semibold text-white shadow-xl data-[state=open]:animate-toast-in data-[swipe=end]:animate-fade-out"
        >
          <ToastPrimitive.Title>{toast.message}</ToastPrimitive.Title>
          {toast.action && (
            <ToastPrimitive.Action altText={toast.action.label} asChild>
              <Link to={toast.action.to} className="tap shrink-0 rounded-full px-2 py-1 font-bold text-brand">
                {toast.action.label}
              </Link>
            </ToastPrimitive.Action>
          )}
        </ToastPrimitive.Root>
      )}
      <ToastPrimitive.Viewport className="fixed bottom-[calc(80px+env(safe-area-inset-bottom))] left-1/2 z-[60] flex w-full max-w-[480px] -translate-x-1/2 flex-col gap-2 px-4 outline-none" />
    </ToastPrimitive.Provider>
  );
}

export function SectionTitle({ title, to, linkLabel = 'Ver tudo' }: { title: string; to?: string; linkLabel?: string }) {
  return (
    <div className="mb-3 mt-7 flex items-baseline justify-between">
      <h2 className="text-lg font-bold text-ink-strong">{title}</h2>
      {to && (
        <Link to={to} className="link">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

export function Empty({ icon, title, text, action }: { icon: ReactNode; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <div className="mb-4 grid size-16 place-items-center rounded-full bg-brand-50 text-brand-ink">{icon}</div>
      <h2 className="text-lg font-bold text-ink-strong">{title}</h2>
      <p className="mb-5 mt-1 max-w-72 text-sm text-muted">{text}</p>
      {action}
    </div>
  );
}

export { cx };
