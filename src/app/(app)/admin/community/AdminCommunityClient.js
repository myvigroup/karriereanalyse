'use client';
import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import { togglePinPost, deletePost, updatePeerRequestStatus, deletePeerMatch } from './actions';

const TABS = [
  { id: 'posts',    label: 'Posts',          icon: 'speech' },
  { id: 'matches',  label: 'Peer-Matches',   icon: 'users' },
  { id: 'requests', label: 'Peer-Anfragen',  icon: 'mail' },
];

function displayName(profile) {
  if (!profile) return 'Unbekannt';
  return profile.name || [profile.first_name].filter(Boolean).join(' ') || 'User';
}
function avatarInitials(profile) {
  if (!profile) return '?';
  return profile.avatar_initials || (profile.first_name?.[0] || '?').toUpperCase();
}
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminCommunityClient({ posts: initialPosts, matches: initialMatches, requests: initialRequests, profileMap, stats }) {
  const [tab, setTab] = useState('posts');
  const [posts, setPosts] = useState(initialPosts);
  const [matches, setMatches] = useState(initialMatches);
  const [requests, setRequests] = useState(initialRequests);
  const [toast, setToast] = useState(null);

  function showToast(text, kind = 'ok') {
    setToast({ text, kind });
    setTimeout(() => setToast(null), 3000);
  }

  async function handlePin(post) {
    try {
      await togglePinPost(post.id, !post.pinned);
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, pinned: !p.pinned } : p));
      showToast(post.pinned ? 'Post entheftet.' : 'Post angeheftet.');
    } catch (e) { showToast('Fehler: ' + e.message, 'error'); }
  }
  async function handleDeletePost(post) {
    if (!confirm(`Post wirklich löschen?\n\n„${(post.content || '').slice(0, 100)}…"`)) return;
    try {
      await deletePost(post.id);
      setPosts(prev => prev.filter(p => p.id !== post.id));
      showToast('Post gelöscht.');
    } catch (e) { showToast('Fehler: ' + e.message, 'error'); }
  }
  async function handleRequestStatus(req, status) {
    try {
      await updatePeerRequestStatus(req.id, status);
      setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status } : r));
      showToast(`Anfrage auf „${status}" gesetzt.`);
    } catch (e) { showToast('Fehler: ' + e.message, 'error'); }
  }
  async function handleDeleteMatch(match) {
    if (!confirm('Peer-Match wirklich löschen? Die User können sich danach neu matchen.')) return;
    try {
      await deletePeerMatch(match.id);
      setMatches(prev => prev.filter(m => m.id !== match.id));
      showToast('Match gelöscht.');
    } catch (e) { showToast('Fehler: ' + e.message, 'error'); }
  }

  return (
    <div className="admin-community admin-coaches">
      <div className="admin-pageheader">
        <div>
          <div className="title-kicker"><span className="pulse" /> Admin · Community</div>
          <h1 className="page-title">Community-Management</h1>
          <p className="page-sub">Posts, Peer-Matches und Anfragen moderieren. Alle Aktionen werden sofort wirksam.</p>
        </div>
      </div>

      {/* Stats-Reihe */}
      <div className="admin-stats-row">
        <Stat label="Posts gesamt"    value={stats.posts} iconName="speech" />
        <Stat label="Kommentare"      value={stats.comments} iconName="speech" />
        <Stat label="Peer-Matches"    value={stats.matches} iconName="users" />
        <Stat label="Offene Anfragen" value={stats.requestsPending} iconName="mail" highlight />
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {TABS.map(t => (
          <button key={t.id} className={`admin-tab ${tab === t.id ? 'on' : ''}`}
                  onClick={() => setTab(t.id)} type="button">
            <Icon name={t.icon} size={14} stroke={1.7} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab-Content */}
      {tab === 'posts' && (
        <div className="admin-list">
          {posts.length === 0 && <div className="admin-empty">Keine Posts vorhanden.</div>}
          {posts.map(p => {
            const user = profileMap[p.user_id];
            return (
              <div key={p.id} className="admin-row">
                <div className="admin-avatar small">{avatarInitials(user)}</div>
                <div className="admin-row-body">
                  <div className="admin-row-name">
                    {displayName(user)}
                    {p.pinned && <span className="admin-coach-badge">📌 Pin</span>}
                    {p.post_type && p.post_type !== 'text' && <span className="admin-coach-badge ext">{p.post_type}</span>}
                  </div>
                  <div className="admin-row-content">{(p.content || '').slice(0, 220)}{(p.content || '').length > 220 ? '…' : ''}</div>
                  <div className="admin-row-meta">
                    <span>{formatDate(p.created_at)}</span>
                    <span>·</span>
                    <span>♥ {p.likes || 0}</span>
                    <span>·</span>
                    <span>{p.comments_count || 0} Kommentare</span>
                  </div>
                </div>
                <div className="admin-coach-actions">
                  <button type="button" className="admin-action-btn" onClick={() => handlePin(p)}>
                    {p.pinned ? 'Entheften' : 'Anheften'}
                  </button>
                  <button type="button" className="admin-icon-btn danger" onClick={() => handleDeletePost(p)} title="Löschen">
                    <Icon name="x" size={16} stroke={1.8} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'matches' && (
        <div className="admin-list">
          {matches.length === 0 && <div className="admin-empty">Noch keine Peer-Matches.</div>}
          {matches.map(m => {
            const a = profileMap[m.user_a];
            const b = profileMap[m.user_b];
            return (
              <div key={m.id} className="admin-row">
                <div className="admin-match-pair">
                  <div className="admin-avatar small">{avatarInitials(a)}</div>
                  <Icon name="arrow-right" size={14} stroke={2} />
                  <div className="admin-avatar small">{avatarInitials(b)}</div>
                </div>
                <div className="admin-row-body">
                  <div className="admin-row-name">{displayName(a)} ↔ {displayName(b)}</div>
                  <div className="admin-row-content">{m.match_reason || 'Kein Match-Grund hinterlegt.'}</div>
                  <div className="admin-row-meta">
                    <span>Status: {m.status || 'aktiv'}</span>
                    <span>·</span>
                    <span>{m.session_count || 0} Sessions</span>
                    <span>·</span>
                    <span>Seit {formatDate(m.created_at)}</span>
                  </div>
                </div>
                <div className="admin-coach-actions">
                  <button type="button" className="admin-icon-btn danger" onClick={() => handleDeleteMatch(m)} title="Match löschen">
                    <Icon name="x" size={16} stroke={1.8} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'requests' && (
        <div className="admin-list">
          {requests.length === 0 && <div className="admin-empty">Keine Anfragen.</div>}
          {requests.map(r => {
            const f = profileMap[r.from_user];
            const t = profileMap[r.to_user];
            const isPending = r.status === 'pending';
            return (
              <div key={r.id} className="admin-row">
                <div className="admin-match-pair">
                  <div className="admin-avatar small">{avatarInitials(f)}</div>
                  <Icon name="arrow-right" size={14} stroke={2} />
                  <div className="admin-avatar small">{avatarInitials(t)}</div>
                </div>
                <div className="admin-row-body">
                  <div className="admin-row-name">{displayName(f)} → {displayName(t)}</div>
                  <div className="admin-row-meta">
                    <span>Status: <strong>{r.status || 'pending'}</strong></span>
                    <span>·</span>
                    <span>{formatDate(r.created_at)}</span>
                  </div>
                </div>
                <div className="admin-coach-actions">
                  {isPending && (
                    <>
                      <button type="button" className="admin-action-btn" onClick={() => handleRequestStatus(r, 'accepted')}>
                        Akzeptieren
                      </button>
                      <button type="button" className="admin-action-btn" onClick={() => handleRequestStatus(r, 'rejected')}>
                        Ablehnen
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {toast && <div className={`admin-toast ${toast.kind}`}>{toast.text}</div>}
    </div>
  );
}

function Stat({ label, value, iconName, highlight }) {
  return (
    <div className={`admin-stat ${highlight ? 'highlight' : ''}`}>
      <div className="admin-stat-icon"><Icon name={iconName} size={18} stroke={1.6} /></div>
      <div className="admin-stat-body">
        <div className="admin-stat-value">{value}</div>
        <div className="admin-stat-label">{label}</div>
      </div>
    </div>
  );
}
