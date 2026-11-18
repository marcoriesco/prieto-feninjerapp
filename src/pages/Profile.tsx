import * as Accordion from '@radix-ui/react-accordion';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { Link, useNavigate } from 'react-router-dom';
import { BedDouble, Bookmark, Mic, ChevronDown, ChevronRight, LogOut, MapPin, RotateCcw, Send } from 'lucide-react';
import { getProduct, getStore, unitLabel } from '../data/stores';
import { Empty, PageHeader, StoreMark } from '../components/ui';
import { brl, quoteStatus, useApp } from '../store';

export function Profile() {
  const { user, quotes, savedEvents, savedTalks, logout, resetDemo, showToast } = useApp();
  const nav = useNavigate();
  if (!user) return null;
  const initials = user.name.split(' ').map((p) => p[0]).slice(0, 2).join('');

  return (
    <div className="page page-flush">
      <PageHeader title="Minha conta" />
      <div className="pad">
        <div className="profile-card">
          <span className="avatar-lg">{initials}</span>
          <div>
            <strong>{user.name}</strong>
            <span>{user.company}</span>
            <small>
              CNPJ {user.cnpj} · {user.city}
            </small>
          </div>
        </div>

        <h2 className="h2">Orçamentos enviados ({quotes.length})</h2>
        {quotes.length === 0 ? (
          <Empty
            icon={<Send size={26} />}
            title="Nenhum orçamento enviado"
            text="Quando você enviar um pedido para uma loja, ele aparece aqui com o status."
            action={
              <Link to="/orcamento" className="btn btn-outline">
                Ir para meu orçamento
              </Link>
            }
          />
        ) : (
          <Accordion.Root type="single" collapsible className="stack">
            {quotes.map((q) => {
              const s = getStore(q.storeId)!;
              const st = quoteStatus(q);
              return (
                <Accordion.Item key={q.id} value={q.id} className="quote-card">
                  <Accordion.Header>
                    <Accordion.Trigger className="quote-head group">
                      <StoreMark store={s} size={40} />
                      <span className="qh-info">
                        <strong>{s.name}</strong>
                        <small>
                          {q.id} · {new Date(q.createdAt).toLocaleDateString('pt-BR')}
                        </small>
                      </span>
                      <span className={`status status-${st.tone}`}>{st.label}</span>
                      <ChevronDown size={18} className="transition-transform group-data-[state=open]:rotate-180" />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="quote-body">
                    <ul className="plain-list">
                      {q.items.map((it) => {
                        const p = getProduct(it.productId)!;
                        return (
                          <li key={it.productId}>
                            {it.qty} {unitLabel(p.unit)} · {p.name} <span className="muted">({it.variant})</span>
                          </li>
                        );
                      })}
                    </ul>
                    <p className="small muted">
                      Estimativa {brl(q.estimate)} · prazo {q.form.deadline.toLowerCase()} · pagamento {q.form.payment.toLowerCase()}
                    </p>
                    <Link to={`/mapa?estande=${s.stand}`} className="link small">
                      <MapPin size={14} /> Estande {s.stand}
                    </Link>
                  </Accordion.Content>
                </Accordion.Item>
              );
            })}
          </Accordion.Root>
        )}

        <h2 className="h2">Atalhos</h2>
        <div className="menu">
          <Link to="/agenda?salvos=1" className="menu-item">
            <Bookmark size={20} /> <span>Minha agenda</span> <small>{savedEvents.length} {savedEvents.length === 1 ? "evento" : "eventos"}</small> <ChevronRight size={18} />
          </Link>
          <Link to="/palestras?salvas=1" className="menu-item">
            <Mic size={20} /> <span>Palestras salvas</span> <small>{savedTalks.length}</small> <ChevronRight size={18} />
          </Link>
          <Link to="/hospedagem" className="menu-item">
            <BedDouble size={20} /> <span>Onde ficar</span> <ChevronRight size={18} />
          </Link>
          <AlertDialog.Root>
            <AlertDialog.Trigger className="menu-item">
              <RotateCcw size={20} /> <span>Reiniciar demonstração</span> <ChevronRight size={18} />
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="fixed inset-0 z-50 bg-black/45 data-[state=open]:animate-fade-in" />
              <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-32px)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 shadow-2xl data-[state=open]:animate-pop-in">
                <AlertDialog.Title className="text-lg font-bold text-ink-strong">Reiniciar a demonstração?</AlertDialog.Title>
                <AlertDialog.Description className="mt-2 text-sm text-muted">
                  O orçamento atual, os pedidos enviados e a agenda salva serão apagados. Sua conta continua ativa.
                </AlertDialog.Description>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <AlertDialog.Cancel className="btn btn-outline">Cancelar</AlertDialog.Cancel>
                  <AlertDialog.Action
                    className="btn btn-primary"
                    onClick={() => {
                      resetDemo();
                      showToast('Demonstração reiniciada');
                    }}
                  >
                    Reiniciar
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
          <button
            className="menu-item danger"
            onClick={() => {
              logout();
              nav('/login', { replace: true });
            }}
          >
            <LogOut size={20} /> <span>Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
}
