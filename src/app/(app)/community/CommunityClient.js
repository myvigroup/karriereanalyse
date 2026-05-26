'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

// ─── Icons ───────────────────────────────────────────────────────────────────
function Icon({ name, size = 14, stroke = 1.7 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
              stroke: 'currentColor', strokeWidth: stroke,
              strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'users':   return (<svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
    case 'trophy':  return (<svg {...p}><path d="M6 9a6 6 0 0 0 12 0V3H6z"/><path d="M9 21h6"/><path d="M12 17v4"/></svg>);
    case 'book':    return (<svg {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>);
    case 'heart':   return (<svg {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>);
    case 'reply':   return (<svg {...p}><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>);
    case 'spark':   return (<svg {...p}><path d="M5 3v4M3 5h4M19 17v4M17 19h4M12 2l2.4 5.1L20 9l-5.1 2.4L12 16l-2.4-5L4 9l5.4-2L12 2z"/></svg>);
    default: return null;
  }
}

function avatarColor(name) {
  const palette = ['#4a0a14', '#1d4e89', '#5d3a91', '#1d4d2e', '#8a4a14', '#353A3B', '#0071E3', '#CC1426'];
  const i = (name || 'x').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length;
  return palette[i];
}

function relativeTime(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'gerade eben';
  if (min < 60) return `vor ${min} Min.`;
  const h = Math.floor(min / 60);
  if (h < 24) return `vor ${h} Std.`;
  const d = Math.floor(h / 24);
  if (d < 7) return `vor ${d} Tag${d === 1 ? '' : 'en'}`;
  return new Date(dateStr).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' });
}

const HUB_TILES = [
  { id: 'peers', icon: 'users', title: 'Peer-Matching', subtitle: 'Verbinde dich mit Mitgliedern in derselben Karriere-Phase', cta: 'Peers finden', href: '/community/peers' },
  { id: 'achievements', icon: 'trophy', title: 'Erfolge & Badges', subtitle: 'Achievements der Community — was läuft gerade?', cta: 'Bestenliste ansehen', href: '/community/achievements' },
  { id: 'stories', icon: 'book', title: 'Karriere-Stories', subtitle: 'Echte Geschichten aus dem Berufsleben — anonym oder mit Namen', cta: 'Stories lesen', href: '/community/stories' },
];

export default function CommunityClient({ profile, posts, courses, userId }) {
  const supabase = createClient();
  const router = useRouter();

  const [composerOpen, setComposerOpen] = useState(false);
  const [composerText, setComposerText] = useState('');
  const [posting, setPosting] = useState(false);

  const onlineApprox = useMemo(() => {
    // Rough: count posts in last 24h
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return (posts || []).filter(p => new Date(p.created_at).getTime() > oneDayAgo).length;
  }, [posts]);

  const userInitials = useMemo(() => {
    if (profile?.avatar_initials) return profile.avatar_initials;
    const f = profile?.first_name?.[0] || '';
    const l = profile?.last_name?.[0] || '';
    return (f + l).toUpperCase() || (profile?.name?.[0] || '?').toUpperCase();
  }, [profile]);

  async function handlePost() {
    if (!composerText.trim()) return;
    setPosting(true);
    try {
      await supabase.from('community_posts').insert({
        user_id: userId,
        content: composerText.trim(),
        type: 'text',
      });
      setComposerText('');
      setComposerOpen(false);
      router.refresh();
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="community-v2">
      {/* Title */}
      <div className="title-kicker">
        <span className="pulse" />
        {posts?.length || 0} Beiträge insgesamt
        {onlineApprox > 0 && ` · ${onlineApprox} aktiv heute`}
      </div>
      <h1 className="page-title">
        Community.{' '}
        <span className="faded">Lerne mit den Klügsten — und teile, was dir geholfen hat.</span>
      </h1>
      <p className="page-sub">
        Stell Fragen, teile Erfahrungen aus Bewerbungen, gib Feedback zu Lebensläufen — oder hilf jemandem mit deinem Wissen weiter.
      </p>

      {/* Hub-Navigation: Peers / Achievements / Stories */}
      <div className="hub-nav">
        {HUB_TILES.map(t => (
          <a key={t.id} className="hub-nav-card" href={t.href}>
            <div className={`hub-nav-ic ${t.id}`}><Icon name={t.icon} size={18} stroke={1.8} /></div>
            <div className="hub-nav-title">{t.title}</div>
            <div className="hub-nav-sub">{t.subtitle}</div>
            <div className="hub-nav-foot">
              <span>{t.cta} →</span>
            </div>
          </a>
        ))}
      </div>

      {/* Composer */}
      <div className="card" style={{ marginBottom: 'var(--gap)' }}>
        <div className="card-head">
          <h3 className="card-title">
            Neuer Beitrag <span className="kicker">Öffentlich für alle Mitglieder</span>
          </h3>
        </div>
        <div className="composer">
          <div className="composer-avatar" style={{ background: avatarColor(profile?.name || '') }}>
            {userInitials}
          </div>
          {composerOpen ? (
            <textarea
              className="composer-input"
              autoFocus
              value={composerText}
              onChange={e => setComposerText(e.target.value)}
              placeholder="Was beschäftigt dich? — Frage stellen, Tipp teilen, Erfolg feiern …"
              rows={3}
              style={{ resize: 'vertical', minHeight: 80 }}
            />
          ) : (
            <input
              className="composer-input"
              placeholder="Was beschäftigt dich?"
              onFocus={() => setComposerOpen(true)}
              readOnly
            />
          )}
          {composerOpen && (
            <div className="composer-actions">
              <button type="button" className="composer-chip" onClick={() => { setComposerOpen(false); setComposerText(''); }}>
                Abbrechen
              </button>
              <button
                type="button"
                className="composer-submit"
                onClick={handlePost}
                disabled={posting || !composerText.trim()}
              >
                {posting ? 'Postet…' : 'Posten'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Feed */}
      <div className="card">
        <div className="card-head">
          <h3 className="card-title">
            Feed <span className="kicker">{posts?.length || 0} Beiträge</span>
          </h3>
        </div>
        {(!posts || posts.length === 0) ? (
          <div className="saved-empty">
            <div className="saved-empty-ic"><Icon name="spark" size={20} /></div>
            <div className="saved-empty-title">Noch keine Beiträge</div>
            <div style={{ maxWidth: '40ch', margin: '0 auto', fontSize: 13.5, color: 'var(--label-3)' }}>
              Sei der erste, der etwas teilt. Beiträge erscheinen für alle Mitglieder.
            </div>
          </div>
        ) : (
          <div>
            {posts.map((p) => {
              const author = p.profiles?.community_display_name
                || (p.profiles?.first_name ? `${p.profiles.first_name}${p.profiles.industry ? ` · ${p.profiles.industry}` : ''}` : 'Mitglied');
              const initials = (author?.[0] || '?').toUpperCase();
              return (
                <div className="thread" key={p.id}>
                  <div className="thread-avatar" style={{ background: avatarColor(author) }}>
                    {initials}
                  </div>
                  <div className="thread-body">
                    <div className="thread-meta-top">
                      <span className="thread-author">{author}</span>
                      <span className="thread-time">· {relativeTime(p.created_at)}</span>
                    </div>
                    {p.title && <div className="thread-title">{p.title}</div>}
                    {p.content && <div className="thread-snippet">{p.content}</div>}
                    <div className="thread-stats">
                      <span className="thread-stat"><Icon name="heart" size={12} /> {p.likes_count || 0}</span>
                      <span className="thread-stat"><Icon name="reply" size={12} /> {p.replies_count || 0}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
