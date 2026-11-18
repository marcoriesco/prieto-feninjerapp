import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { Bookmark, BookmarkCheck, CalendarDays, CheckCircle2, Clock, MapPin, Mic, Pause, Play, Search, X } from 'lucide-react';
import { DAYS, EVENTS, PLACES } from '../data/fair';
import { TALKS, TALK_THEMES, Talk, TalkTheme, getTalk, initials, themeOf } from '../data/talks';
import { Chips, Empty, PageHeader } from '../components/ui';
import { useApp } from '../store';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Capa gerada: cor do tema, aspas e as iniciais dos palestrantes. */
export function TalkCover({ talk, size = 'md' }: { talk: Talk; size?: 'sm' | 'md' | 'lg' }) {
  const t = themeOf(talk.theme);
  return (
    <div className={`talk-cover talk-cover-${size}`} style={{ background: `linear-gradient(140deg, ${t.color} 0%, #1c1c1c 95%)` }}>
      <span className="tc-brand">
        FENINJER<b>+</b> TALKS
      </span>
      <span className="tc-quote" aria-hidden="true">
        “
      </span>
      <div className="tc-avatars" aria-hidden="true">
        {talk.speakers.map((s) => (
          <span key={s.name}>{initials(s.name)}</span>
        ))}
      </div>
      <span className="tc-time">
        <Clock size={12} /> {talk.minutes} min
      </span>
    </div>
  );
}

/** Card compacto para listas horizontais (home). */
export function TalkCardCompact({ talk }: { talk: Talk }) {
  return (
    <Link to={`/palestras/${talk.id}`} className="talk-compact">
      <TalkCover talk={talk} size="sm" />
      <div className="tcc-body">
        <span className="em-cat" style={{ color: themeOf(talk.theme).color }}>
          {themeOf(talk.theme).label}
        </span>
        <h3>{talk.title}</h3>
        <small>{talk.speakers.map((s) => s.name).join(' e ')}</small>
      </div>
    </Link>
  );
}

function TalkCard({ talk }: { talk: Talk }) {
  const { savedTalks, toggleTalk, showToast } = useApp();
  const saved = savedTalks.includes(talk.id);
  const theme = themeOf(talk.theme);
  return (
    <article className="talk-card">
      <Link to={`/palestras/${talk.id}`} className="tap block" tabIndex={-1} aria-hidden="true">
        <TalkCover talk={talk} />
      </Link>
      <div className="tk-body">
        <div className="tk-meta">
          <span className="em-cat" style={{ color: theme.color }}>
            {theme.label}
          </span>
          <span className="meta">· {talk.format}</span>
          {talk.eventId && <span className="tk-live">Ao vivo na 84ª</span>}
        </div>
        <Link to={`/palestras/${talk.id}`} className="tk-title">
          <h3>{talk.title}</h3>
        </Link>
        <p className="tk-speakers">
          <Mic size={13} /> {talk.speakers.map((s) => s.name).join(' e ')}
        </p>
        <p className="tk-summary">{talk.summary}</p>
        <div className="tk-actions">
          <Link to={`/palestras/${talk.id}`} className="btn btn-primary tk-btn">
            <Play size={16} fill="currentColor" /> Assistir
          </Link>
          <button
            className={`icon-btn bookmark ${saved ? 'on' : ''}`}
            aria-pressed={saved}
            aria-label={saved ? 'Remover das palestras salvas' : 'Salvar palestra'}
            onClick={() => {
              toggleTalk(talk.id);
              showToast(saved ? 'Palestra removida das salvas' : 'Palestra salva');
            }}
          >
            {saved ? <BookmarkCheck size={22} /> : <Bookmark size={22} />}
          </button>
        </div>
      </div>
    </article>
  );
}

export function Talks() {
  const [params] = useSearchParams();
  const { savedTalks } = useApp();
  const [theme, setTheme] = useState<'all' | 'saved' | TalkTheme>(params.get('salvas') ? 'saved' : 'all');
  const [q, setQ] = useState('');
  const term = norm(q.trim());

  const list = useMemo(
    () =>
      TALKS.filter(
        (t) =>
          (theme === 'all' || (theme === 'saved' ? savedTalks.includes(t.id) : t.theme === theme)) &&
          (!term || norm(`${t.title} ${t.summary} ${t.speakers.map((s) => s.name).join(' ')}`).includes(term)),
      ),
    [theme, term, savedTalks],
  );

  return (
    <div className="page page-flush">
      <PageHeader title="Palestras" subtitle="FENINJER+ Talks" />
      <div className="talks-hero">
        <span className="hero-eyebrow">FENINJER+ Talks</span>
        <h1>Conhecimento para quem vive de joias</h1>
        <p>Bate-papos e entrevistas com especialistas do setor sobre gestão, vendas, tendências e design.</p>
        <div className="talks-hero-stats">
          <span>
            <strong>{TALKS.length}</strong> palestras
          </span>
          <span>
            <strong>{TALKS.filter((t) => t.eventId).length}</strong> ao vivo na 84ª
          </span>
        </div>
      </div>
      <div className="pad">
        <div className="search !mt-0">
          <Search size={20} aria-hidden="true" />
          <input type="search" placeholder="Buscar tema ou palestrante" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar palestras" enterKeyHint="search" />
          {q && (
            <button className="input-icon" onClick={() => setQ('')} aria-label="Limpar busca">
              <X size={18} />
            </button>
          )}
        </div>
        <Chips
          label="Filtrar palestras por tema"
          value={theme}
          onChange={setTheme}
          options={[
            { id: 'all' as const, label: 'Todas' },
            { id: 'saved' as const, label: `★ Salvas (${savedTalks.length})` },
            ...TALK_THEMES.map((t) => ({ id: t.id, label: t.label })),
          ]}
        />

        {list.length ? (
          <>
            <p className="result-count">
              {list.length} {list.length === 1 ? 'palestra' : 'palestras'}
            </p>
            <div className="stack">
              {list.map((t) => (
                <TalkCard key={t.id} talk={t} />
              ))}
            </div>
          </>
        ) : (
          <Empty
            icon={theme === 'saved' ? <Bookmark size={28} /> : <Search size={28} />}
            title={theme === 'saved' ? 'Nenhuma palestra salva' : 'Nada encontrado'}
            text={theme === 'saved' ? 'Toque no marcador de uma palestra para assistir depois.' : 'Tente outro tema ou termo de busca.'}
          />
        )}
      </div>
    </div>
  );
}

const fmt = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

/** Player ilustrativo: simula a reprodução (a demo não tem vídeos reais). */
function DemoPlayer({ talk }: { talk: Talk }) {
  const total = talk.minutes * 60;
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const t = window.setInterval(() => setPos((p) => Math.min(total, p + 15)), 250);
    return () => window.clearInterval(t);
  }, [playing, total]);

  useEffect(() => {
    if (pos >= total) setPlaying(false);
  }, [pos, total]);

  const toggle = () => {
    if (!playing && pos >= total) setPos(0);
    setPlaying((p) => !p);
  };

  return (
    <div className="player">
      <TalkCover talk={talk} size="lg" />
      <button className={`player-btn ${playing ? 'playing' : ''}`} onClick={toggle} aria-label={playing ? 'Pausar' : 'Reproduzir'}>
        {playing ? <Pause size={30} fill="currentColor" /> : <Play size={30} fill="currentColor" className="ml-1" />}
      </button>
      <div className="player-bar">
        <span>{fmt(pos)}</span>
        <input
          type="range"
          min={0}
          max={total}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Posição do vídeo"
          style={{ backgroundSize: `${(pos / total) * 100}% 100%` }}
        />
        <span>{fmt(total)}</span>
      </div>
    </div>
  );
}

export function TalkDetail() {
  const { id = '' } = useParams();
  const { savedTalks, toggleTalk, savedEvents, toggleEvent, showToast } = useApp();
  const talk = getTalk(id);
  if (!talk) return <Navigate to="/palestras" replace />;
  const theme = themeOf(talk.theme);
  const saved = savedTalks.includes(talk.id);
  const live = talk.eventId ? EVENTS.find((e) => e.id === talk.eventId) : undefined;
  const related = TALKS.filter((t) => t.theme === talk.theme && t.id !== talk.id).concat(TALKS.filter((t) => t.theme !== talk.theme)).slice(0, 4);

  return (
    <div className="page page-flush">
      <PageHeader
        title={talk.title}
        subtitle={`${theme.label} · ${talk.format}`}
        right={
          <button
            className={`icon-btn bookmark ${saved ? 'on' : ''}`}
            aria-pressed={saved}
            aria-label={saved ? 'Remover das palestras salvas' : 'Salvar palestra'}
            onClick={() => {
              toggleTalk(talk.id);
              showToast(saved ? 'Palestra removida das salvas' : 'Palestra salva');
            }}
          >
            {saved ? <BookmarkCheck size={22} /> : <Bookmark size={22} />}
          </button>
        }
      />
      <DemoPlayer talk={talk} />
      <div className="pad">
        <div className="tk-meta">
          <span className="em-cat" style={{ color: theme.color }}>
            {theme.label}
          </span>
          <span className="meta">
            · {talk.format} · {talk.minutes} min
          </span>
        </div>
        <h1 className="product-title !mt-1">{talk.title}</h1>
        <p className="about">{talk.summary}</p>

        {live && (
          <div className="live-card">
            <div>
              <span className="tk-live">Ao vivo na 84ª edição</span>
              <strong>
                {DAYS.find((d) => d.day === live.day)!.weekday}, {live.day}/02 · {live.start}
              </strong>
              <small>
                <MapPin size={12} /> {PLACES[live.place].name} · {PLACES[live.place].hall}
              </small>
            </div>
            <button
              className={`btn ${savedEvents.includes(live.id) ? 'btn-outline' : 'btn-primary'} !h-11 !px-4 !text-sm`}
              onClick={() => {
                const was = savedEvents.includes(live.id);
                toggleEvent(live.id);
                showToast(was ? 'Removido da sua agenda' : 'Adicionado à sua agenda', was ? undefined : { label: 'Ver agenda', to: `/agenda?dia=${live.day}` });
              }}
            >
              <CalendarDays size={16} /> {savedEvents.includes(live.id) ? 'Na agenda' : 'Agendar'}
            </button>
          </div>
        )}

        <h2 className="h2">{talk.speakers.length > 1 ? 'Palestrantes' : 'Palestrante'}</h2>
        <div className="stack">
          {talk.speakers.map((s) => (
            <div key={s.name} className="speaker">
              <span className="speaker-avatar" style={{ background: theme.color }}>
                {initials(s.name)}
              </span>
              <span>
                <strong>{s.name}</strong>
                <small>{s.role}</small>
              </span>
            </div>
          ))}
        </div>

        <h2 className="h2">O que você vai aprender</h2>
        <ul className="takeaways">
          {talk.takeaways.map((t) => (
            <li key={t}>
              <CheckCircle2 size={18} /> {t}
            </li>
          ))}
        </ul>

        <h2 className="h2">Mais palestras</h2>
        <div className="h-scroll">
          {related.map((t) => (
            <TalkCardCompact key={t.id} talk={t} />
          ))}
        </div>
        <p className="demo-foot">Vídeo ilustrativo · palestrantes e conteúdos fictícios da demonstração</p>
      </div>
    </div>
  );
}
