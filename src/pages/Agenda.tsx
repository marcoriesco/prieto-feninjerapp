import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import * as Tabs from '@radix-ui/react-tabs';
import { Bookmark, BookmarkCheck, CalendarX, Clock, MapPin, Mic, User } from 'lucide-react';
import { talkForEvent } from '../data/talks';
import { DAYS, EVENTS, EVENT_CATS, FAIR, FairEvent, PLACES, EventCat } from '../data/fair';
import { Chips, Empty, Sheet } from '../components/ui';
import { useApp } from '../store';

export function Agenda() {
  const [params, setParams] = useSearchParams();
  const { savedEvents, toggleEvent, showToast } = useApp();
  const dayParam = Number(params.get('dia')) as FairEvent['day'];
  const day = DAYS.some((d) => d.day === dayParam) ? dayParam : 15;
  const [cat, setCat] = useState<'all' | 'saved' | EventCat>(params.get('salvos') ? 'saved' : 'all');
  const [open, setOpen] = useState<FairEvent | null>(null);

  const list = EVENTS.filter(
    (e) => e.day === day && (cat === 'all' || (cat === 'saved' ? savedEvents.includes(e.id) : e.cat === cat)),
  );

  const toggle = (e: FairEvent) => {
    const saved = savedEvents.includes(e.id);
    toggleEvent(e.id);
    showToast(saved ? 'Removido da sua agenda' : 'Salvo na sua agenda');
  };

  return (
    <div className="page">
      <h1 className="page-title">Agenda da feira</h1>
      <p className="muted small">
        {FAIR.hours.map((h) => `${h.days}: ${h.time}`).join(' · ')}
      </p>

      <Tabs.Root value={String(day)} onValueChange={(v) => setParams({ dia: v }, { replace: true })}>
        <Tabs.List className="day-tabs" aria-label="Dias da feira">
          {DAYS.map((d) => {
            const count = EVENTS.filter((e) => e.day === d.day && savedEvents.includes(e.id)).length;
            return (
              <Tabs.Trigger key={d.day} value={String(d.day)} className="day-tab">
                <small>{d.short}</small>
                <strong>{d.day}</strong>
                <small>fev</small>
                {count > 0 && <span className="dot" aria-label={`${count} salvos`} />}
              </Tabs.Trigger>
            );
          })}
        </Tabs.List>

      <Chips
        label="Filtrar eventos"
        value={cat}
        onChange={setCat}
        options={[
          { id: 'all' as const, label: 'Todos' },
          { id: 'saved' as const, label: `★ Minha agenda (${savedEvents.length})` },
          ...EVENT_CATS.map((c) => ({ id: c.id, label: c.label })),
        ]}
      />

        <Tabs.Content value={String(day)} className="outline-none">
        {list.length === 0 ? (
          <Empty
            icon={<CalendarX size={28} />}
            title={cat === 'saved' ? 'Nada salvo neste dia' : 'Sem eventos nesta categoria'}
            text={cat === 'saved' ? 'Toque no marcador de um evento para montar sua agenda.' : 'Experimente outro dia ou categoria.'}
          />
        ) : (
          <ol className="timeline-list">
            {list.map((e) => {
              const c = EVENT_CATS.find((x) => x.id === e.cat)!;
              const saved = savedEvents.includes(e.id);
              return (
                <li key={e.id} className="tl-item">
                  <div className="tl-time">
                    <strong>{e.start}</strong>
                    <small>{e.end}</small>
                  </div>
                  <div className="tl-card" style={{ borderLeftColor: c.color }}>
                    <button className="tl-main" onClick={() => setOpen(e)}>
                      <span className="em-cat" style={{ color: c.color }}>
                        {c.label}
                      </span>
                      <h3>{e.title}</h3>
                      {e.speaker && (
                        <span className="meta">
                          <User size={13} /> {e.speaker}
                        </span>
                      )}
                      <span className="meta">
                        <MapPin size={13} /> {PLACES[e.place].name}
                      </span>
                    </button>
                    <button className={`icon-btn bookmark ${saved ? 'on' : ''}`} aria-pressed={saved} aria-label={saved ? 'Remover da minha agenda' : 'Salvar na minha agenda'} onClick={() => toggle(e)}>
                      {saved ? <BookmarkCheck size={22} /> : <Bookmark size={22} />}
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
        </Tabs.Content>
      </Tabs.Root>

      <Sheet open={!!open} onClose={() => setOpen(null)} title="Detalhes do evento">
        {open && (
          <div>
            <span className="em-cat" style={{ color: EVENT_CATS.find((c) => c.id === open.cat)!.color }}>
              {EVENT_CATS.find((c) => c.id === open.cat)!.label}
            </span>
            <h3 className="sheet-title">{open.title}</h3>
            <p className="meta">
              <Clock size={14} /> {DAYS.find((d) => d.day === open.day)!.weekday}, {open.day} de fevereiro · {open.start} às {open.end}
            </p>
            <p className="meta">
              <MapPin size={14} /> {PLACES[open.place].name} · {PLACES[open.place].hall}
            </p>
            {open.speaker && (
              <p className="meta">
                <User size={14} /> {open.speaker}
              </p>
            )}
            <p className="about">{open.description}</p>
            <div className="stack">
              <button className={`btn btn-block ${savedEvents.includes(open.id) ? 'btn-outline' : 'btn-primary'}`} onClick={() => toggle(open)}>
                {savedEvents.includes(open.id) ? (
                  <>
                    <BookmarkCheck size={18} /> Salvo na minha agenda
                  </>
                ) : (
                  <>
                    <Bookmark size={18} /> Salvar na minha agenda
                  </>
                )}
              </button>
              {talkForEvent(open.id) && (
                <Link to={`/palestras/${talkForEvent(open.id)!.id}`} className="btn btn-outline btn-block">
                  <Mic size={18} /> Assistir prévia no FENINJER+ Talks
                </Link>
              )}
              <Link to={`/mapa?local=${open.place}`} className="btn btn-ghost btn-block">
                <MapPin size={18} /> Ver local no mapa
              </Link>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
