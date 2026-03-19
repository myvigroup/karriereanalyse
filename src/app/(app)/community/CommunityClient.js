'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import InfoTooltip from '@/components/ui/InfoTooltip';
import EmptyState from '@/components/ui/EmptyState';
import { hasAccess } from '@/lib/access-control';
import UpgradePrompt from '@/components/ui/UpgradePrompt';

const TABS = [
  { key: 'feed', label: 'Feed', icon: '\uD83D\uDCE2' },
  { key: 'courses', label: 'Kurs-Diskussionen', icon: '\uD83D\uDCAC' },
  { key: 'achievements', label: 'Erfolge', icon: '\uD83C\uDFC6' },
  { key: 'matching', label: 'Peer-Matching', icon: '\uD83E\uDD1D' },
];

const POST_TYPES = [
  { key: 'text', label: 'Text', icon: '\u270D\uFE0F' },
  { key: 'poll', label: 'Umfrage', icon: '\uD83D\uDCCA' },
  { key: 'success', label: 'Erfolg', icon: '\uD83C\uDF89' },
  { key: 'question', label: 'Frage', icon: '\u2753' },
];

const BADGE_LABELS = {
  first_lesson: 'Erste Lektion',
  course_complete: 'Kurs abgeschlossen',
  streak_7: '7-Tage-Serie',
  streak_30: '30-Tage-Serie',
  community_helper: 'Community-Helfer',
  top_contributor: 'Top Beitragender',
  milestone: 'Meilenstein',
};

const AVATAR_COLORS = [
  '#CC1426', '#2563eb', '#059669', '#d97706', '#7c3aed',
  '#db2777', '#0891b2', '#4f46e5', '#dc2626', '#16a34a',
];

function getAvatarColor(name) {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getDisplayName(post) {
  const p = post.profiles || post;
  if (p?.community_display_name) return p.community_display_name;
  if (p?.first_name) return p.first_name;
  return 'Anonym';
}

function getInitial(post) {
  const name = getDisplayName(post);
  return name.charAt(0).toUpperCase();
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'gerade eben';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `vor ${minutes} Min.`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `vor ${days} Tag${days > 1 ? 'en' : ''}`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `vor ${weeks} Woche${weeks > 1 ? 'n' : ''}`;
  const months = Math.floor(days / 30);
  return `vor ${months} Monat${months > 1 ? 'en' : ''}`;
}

function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: 'var(--ki-success)', color: '#fff', padding: '12px 20px',
      borderRadius: 8, fontWeight: 600, fontSize: 14,
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)', animation: 'fadeIn 0.3s ease',
    }}>
      {message}
    </div>
  );
}

/* ─────────────────── COMMENT ITEM COMPONENT ─────────────────── */

function CommentItem({ comment, postId, allComments, depth, replyInputs, setReplyInputs, addComment, renderAvatar, renderComment }) {
  const [showReply, setShowReply] = useState(false);
  const replies = allComments.filter(c => c.parent_id === comment.id);
  const replyKey = `${postId}-${comment.id}`;

  return (
    <div style={{ marginLeft: depth * 24, marginBottom: 10 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        {renderAvatar(comment, 28)}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--ki-text)' }}>
              {getDisplayName(comment)}
            </span>
            {comment.profiles?.role === 'coach' && (
              <span className="pill pill-green" style={{ fontSize: 10 }}>Coach</span>
            )}
            <span style={{ fontSize: 11, color: 'var(--ki-text-tertiary)' }}>
              {timeAgo(comment.created_at)}
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--ki-text)', lineHeight: 1.5, margin: '4px 0' }}>
            {comment.content}
          </p>
          {depth < 1 && (
            <button
              className="btn btn-ghost"
              style={{ fontSize: 12, padding: '2px 6px' }}
              onClick={() => setShowReply(!showReply)}
            >
              Antworten
            </button>
          )}
          {showReply && (
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              <input
                className="input"
                placeholder="Antwort..."
                value={replyInputs[replyKey] || ''}
                onChange={e => setReplyInputs(prev => ({ ...prev, [replyKey]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && addComment(postId, comment.id)}
                style={{ flex: 1, fontSize: 12 }}
              />
              <button className="btn btn-primary" style={{ fontSize: 12, padding: '4px 10px' }}
                onClick={() => addComment(postId, comment.id)}>
                Senden
              </button>
            </div>
          )}
        </div>
      </div>
      {replies.map(r => renderComment(r, postId, allComments, depth + 1))}
    </div>
  );
}

/* ─────────────────────── MAIN COMPONENT ─────────────────────── */

export default function CommunityClient({ profile, posts: initialPosts, courses, userId }) {
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState(initialPosts);
  const [toast, setToast] = useState(null);

  // Composer state
  const [composerText, setComposerText] = useState('');
  const [composerType, setComposerType] = useState('text');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [badgeType, setBadgeType] = useState('milestone');
  const [isPosting, setIsPosting] = useState(false);

  // Feed sort
  const [feedSort, setFeedSort] = useState('newest');

  // Comments
  const [expandedComments, setExpandedComments] = useState({});
  const [commentsData, setCommentsData] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [replyInputs, setReplyInputs] = useState({});

  // Course discussions
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // Peer matching
  const [peers, setPeers] = useState([]);
  const [peersLoaded, setPeersLoaded] = useState(false);

  // Achievements
  const [achievementPosts, setAchievementPosts] = useState([]);
  const [achievementsLoaded, setAchievementsLoaded] = useState(false);

  const showToast = useCallback((msg) => setToast(msg), []);

  /* ── Access check ── */
  const communityAccess = hasAccess(profile, 'community');

  /* ── Sorted / filtered posts ── */
  const sortedPosts = useMemo(() => {
    let filtered = [...posts];
    if (feedSort === 'popular') {
      filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (feedSort === 'unanswered') {
      filtered = filtered.filter(p => p.post_type === 'question' && (p.comments_count || 0) === 0);
    }
    return filtered;
  }, [posts, feedSort]);

  const coursePosts = useMemo(() => {
    if (!selectedCourseId) return [];
    return posts.filter(p => p.course_id === selectedCourseId);
  }, [posts, selectedCourseId]);

  /* ── Create post ── */
  async function createPost() {
    if (!composerText.trim() && composerType !== 'poll') return;
    setIsPosting(true);
    try {
      const payload = {
        user_id: userId,
        content: composerText.trim(),
        post_type: composerType,
        likes: 0,
        comments_count: 0,
      };
      if (composerType === 'poll') {
        const validOptions = pollOptions.filter(o => o.trim());
        if (validOptions.length < 2) {
          showToast('Mindestens 2 Optionen erforderlich');
          setIsPosting(false);
          return;
        }
        const votes = {};
        validOptions.forEach((_, i) => { votes[i] = 0; });
        payload.poll_options = validOptions;
        payload.poll_votes = votes;
      }
      if (composerType === 'success') {
        payload.badge_type = badgeType;
      }

      const { data, error } = await supabase
        .from('community_posts')
        .insert(payload)
        .select('*, profiles(first_name, industry, community_display_name)')
        .single();

      if (error) throw error;
      setPosts(prev => [data, ...prev]);
      setComposerText('');
      setComposerType('text');
      setPollOptions(['', '']);
      showToast('+10 XP \u2014 Beitrag ver\u00F6ffentlicht!');
    } catch (err) {
      console.error('Post error:', err);
      showToast('Fehler beim Posten');
    } finally {
      setIsPosting(false);
    }
  }

  /* ── Like post ── */
  async function likePost(postId) {
    try {
      const { error: likeErr } = await supabase
        .from('community_likes')
        .insert({ user_id: userId, post_id: postId });
      if (likeErr) {
        if (likeErr.code === '23505') {
          showToast('Bereits geliked');
          return;
        }
        throw likeErr;
      }
      await supabase.rpc('increment_field', {
        table_name: 'community_posts',
        field_name: 'likes',
        row_id: postId,
      }).catch(() => {
        // Fallback: manual update
        return supabase
          .from('community_posts')
          .update({ likes: posts.find(p => p.id === postId)?.likes + 1 || 1 })
          .eq('id', postId);
      });
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p
      ));
      showToast('+2 XP');
    } catch (err) {
      console.error('Like error:', err);
    }
  }

  /* ── Comments ── */
  async function fetchComments(postId) {
    const { data } = await supabase
      .from('community_comments')
      .select('*, profiles(first_name, industry, community_display_name, role)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    setCommentsData(prev => ({ ...prev, [postId]: data || [] }));
  }

  function toggleComments(postId) {
    const isOpen = expandedComments[postId];
    setExpandedComments(prev => ({ ...prev, [postId]: !isOpen }));
    if (!isOpen && !commentsData[postId]) {
      fetchComments(postId);
    }
  }

  async function addComment(postId, parentId = null) {
    const key = parentId ? `${postId}-${parentId}` : postId;
    const text = parentId ? replyInputs[key] : commentInputs[postId];
    if (!text?.trim()) return;
    try {
      const { data, error } = await supabase
        .from('community_comments')
        .insert({
          post_id: postId,
          user_id: userId,
          content: text.trim(),
          parent_id: parentId || null,
        })
        .select('*, profiles(first_name, industry, community_display_name, role)')
        .single();
      if (error) throw error;

      setCommentsData(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), data],
      }));
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, comments_count: (p.comments_count || 0) + 1 } : p
      ));
      if (parentId) {
        setReplyInputs(prev => ({ ...prev, [key]: '' }));
      } else {
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      }
      showToast('+5 XP \u2014 Kommentar hinzugef\u00FCgt!');
    } catch (err) {
      console.error('Comment error:', err);
    }
  }

  /* ── Poll vote ── */
  async function voteOnPoll(postId, optionIndex) {
    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;
      const votes = { ...(post.poll_votes || {}) };
      votes[optionIndex] = (votes[optionIndex] || 0) + 1;

      const { error } = await supabase
        .from('community_posts')
        .update({ poll_votes: votes })
        .eq('id', postId);
      if (error) throw error;
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, poll_votes: votes } : p
      ));
      showToast('Stimme abgegeben!');
    } catch (err) {
      console.error('Vote error:', err);
    }
  }

  /* ── Copy link ── */
  function sharePost(postId) {
    const url = `${window.location.origin}/community?post=${postId}`;
    navigator.clipboard.writeText(url).then(() => showToast('Link kopiert!'));
  }

  /* ── Report ── */
  async function reportPost(postId) {
    try {
      await supabase.from('community_reports').insert({
        post_id: postId,
        reporter_id: userId,
      });
      showToast('Beitrag gemeldet \u2014 danke!');
    } catch (err) {
      console.error('Report error:', err);
    }
  }

  /* ── Fetch achievements ── */
  useEffect(() => {
    if (activeTab === 'achievements' && !achievementsLoaded) {
      (async () => {
        const { data } = await supabase
          .from('community_posts')
          .select('*, profiles(first_name, industry, community_display_name)')
          .in('post_type', ['success', 'milestone'])
          .order('created_at', { ascending: false })
          .limit(50);
        setAchievementPosts(data || []);
        setAchievementsLoaded(true);
      })();
    }
  }, [activeTab, achievementsLoaded, supabase]);

  /* ── Fetch peers ── */
  useEffect(() => {
    if (activeTab === 'matching' && !peersLoaded) {
      (async () => {
        const { data } = await supabase
          .from('profiles')
          .select('id, first_name, industry, community_display_name, community_visible')
          .eq('community_visible', true)
          .neq('id', userId)
          .limit(30);
        setPeers(data || []);
        setPeersLoaded(true);
      })();
    }
  }, [activeTab, peersLoaded, supabase, userId]);

  /* ── Poll option helpers ── */
  function addPollOption() {
    if (pollOptions.length < 4) setPollOptions(prev => [...prev, '']);
  }
  function updatePollOption(idx, val) {
    setPollOptions(prev => prev.map((o, i) => i === idx ? val : o));
  }
  function removePollOption(idx) {
    if (pollOptions.length > 2) setPollOptions(prev => prev.filter((_, i) => i !== idx));
  }

  /* ─────────────────── RENDER HELPERS ─────────────────── */

  function renderAvatar(post, size = 40) {
    const name = getDisplayName(post);
    const color = getAvatarColor(name);
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%', backgroundColor: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 700, fontSize: size * 0.45, flexShrink: 0,
      }}>
        {getInitial(post)}
      </div>
    );
  }

  function renderPostCard(post, showCourseBadge = false) {
    const totalVotes = post.poll_votes
      ? Object.values(post.poll_votes).reduce((a, b) => a + b, 0)
      : 0;
    const comments = commentsData[post.id] || [];
    const topLevel = comments.filter(c => !c.parent_id);
    const isExpanded = expandedComments[post.id];

    return (
      <div key={post.id} className="card animate-in" style={{
        padding: 20, marginBottom: 16,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
          {renderAvatar(post)}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600, color: 'var(--ki-text)' }}>
                {getDisplayName(post)}
              </span>
              {post.profiles?.industry && (
                <span className="pill pill-grey" style={{ fontSize: 11 }}>
                  {post.profiles.industry}
                </span>
              )}
              {post.post_type === 'question' && (
                <span className="pill pill-red" style={{ fontSize: 11 }}>Frage</span>
              )}
              {post.post_type === 'success' && (
                <span className="pill pill-gold" style={{ fontSize: 11 }}>
                  {BADGE_LABELS[post.badge_type] || 'Erfolg'}
                </span>
              )}
              {showCourseBadge && post.profiles?.role === 'coach' && (
                <span className="pill pill-green" style={{ fontSize: 11 }}>Coach</span>
              )}
            </div>
            <span style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>
              {timeAgo(post.created_at)}
            </span>
          </div>
        </div>

        {/* Content */}
        <p style={{ color: 'var(--ki-text)', lineHeight: 1.6, marginBottom: 12, whiteSpace: 'pre-wrap' }}>
          {post.content}
        </p>

        {/* Poll */}
        {post.post_type === 'poll' && post.poll_options && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            {post.poll_options.map((option, idx) => {
              const count = post.poll_votes?.[idx] || 0;
              const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
              return (
                <button
                  key={idx}
                  onClick={() => voteOnPoll(post.id, idx)}
                  style={{
                    position: 'relative', padding: '10px 14px', borderRadius: 8,
                    border: '1px solid var(--ki-border)', background: 'var(--ki-bg-alt)',
                    cursor: 'pointer', textAlign: 'left', overflow: 'hidden',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: `${pct}%`, background: 'var(--ki-red)', opacity: 0.1,
                    borderRadius: 8, transition: 'width 0.4s ease',
                  }} />
                  <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--ki-text)', fontSize: 14 }}>{option}</span>
                    <span style={{ color: 'var(--ki-text-secondary)', fontSize: 13, fontWeight: 600 }}>
                      {pct}% ({count})
                    </span>
                  </div>
                </button>
              );
            })}
            <span style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>
              {totalVotes} Stimme{totalVotes !== 1 ? 'n' : ''}
            </span>
          </div>
        )}

        {/* Actions */}
        <div style={{
          display: 'flex', gap: 4, borderTop: '1px solid var(--ki-border)',
          paddingTop: 12, flexWrap: 'wrap',
        }}>
          <button className="btn btn-ghost" style={{ fontSize: 13, gap: 6 }}
            onClick={() => likePost(post.id)}>
            <span>{'\u2764\uFE0F'}</span> {post.likes || 0}
          </button>
          <button className="btn btn-ghost" style={{ fontSize: 13, gap: 6 }}
            onClick={() => toggleComments(post.id)}>
            <span>{'\uD83D\uDCAC'}</span> {post.comments_count || 0}
          </button>
          <button className="btn btn-ghost" style={{ fontSize: 13, gap: 6 }}
            onClick={() => sharePost(post.id)}>
            <span>{'\uD83D\uDD17'}</span> Teilen
          </button>
          <button className="btn btn-ghost" style={{ fontSize: 13, gap: 6, marginLeft: 'auto' }}
            onClick={() => reportPost(post.id)}>
            <span>{'\u26A0\uFE0F'}</span> Melden
          </button>
        </div>

        {/* Comments section */}
        {isExpanded && (
          <div style={{
            marginTop: 12, borderTop: '1px solid var(--ki-border)',
            paddingTop: 12,
          }}>
            {comments.length === 0 && (
              <p style={{ fontSize: 13, color: 'var(--ki-text-tertiary)', marginBottom: 12 }}>
                Noch keine Kommentare. Sei der Erste!
              </p>
            )}
            {topLevel.map(comment => renderComment(comment, post.id, comments))}

            {/* New comment input */}
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <input
                className="input"
                placeholder="Kommentar schreiben..."
                value={commentInputs[post.id] || ''}
                onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && addComment(post.id)}
                style={{ flex: 1, fontSize: 13 }}
              />
              <button className="btn btn-primary" style={{ fontSize: 13 }}
                onClick={() => addComment(post.id)}>
                Senden
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderComment(comment, postId, allComments, depth = 0) {
    if (depth >= 2) return null;
    return (
      <CommentItem
        key={comment.id}
        comment={comment}
        postId={postId}
        allComments={allComments}
        depth={depth}
        replyInputs={replyInputs}
        setReplyInputs={setReplyInputs}
        addComment={addComment}
        renderAvatar={renderAvatar}
        renderComment={renderComment}
      />
    );
  }

  /* ─────────────────── TAB: FEED ─────────────────── */
  function renderFeedTab() {
    if (!communityAccess) {
      return <UpgradePrompt feature="community" profile={profile} />;
    }
    return (
      <>
        {/* Composer */}
        <div className="card animate-in" style={{ padding: 20, marginBottom: 24 }}>
          <textarea
            className="input"
            placeholder="Was besch\u00E4ftigt dich gerade?"
            value={composerText}
            onChange={e => setComposerText(e.target.value)}
            rows={3}
            style={{ width: '100%', resize: 'vertical', marginBottom: 12 }}
          />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
            {POST_TYPES.map(pt => (
              <button
                key={pt.key}
                className={`btn ${composerType === pt.key ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: 13 }}
                onClick={() => setComposerType(pt.key)}
              >
                {pt.icon} {pt.label}
              </button>
            ))}
          </div>

          {/* Poll options */}
          {composerType === 'poll' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
              {pollOptions.map((opt, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="input"
                    placeholder={`Option ${idx + 1}`}
                    value={opt}
                    onChange={e => updatePollOption(idx, e.target.value)}
                    style={{ flex: 1, fontSize: 13 }}
                  />
                  {pollOptions.length > 2 && (
                    <button className="btn btn-ghost" onClick={() => removePollOption(idx)}
                      style={{ fontSize: 16, padding: '4px 8px', color: 'var(--ki-text-tertiary)' }}>
                      {'\u2715'}
                    </button>
                  )}
                </div>
              ))}
              {pollOptions.length < 4 && (
                <button className="btn btn-ghost" onClick={addPollOption}
                  style={{ fontSize: 13, alignSelf: 'flex-start' }}>
                  + Option hinzuf\u00FCgen
                </button>
              )}
            </div>
          )}

          {/* Success badge selection */}
          {composerType === 'success' && (
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 6, display: 'block' }}>
                Badge-Typ:
              </label>
              <select
                className="input"
                value={badgeType}
                onChange={e => setBadgeType(e.target.value)}
                style={{ fontSize: 13, maxWidth: 260 }}
              >
                {Object.entries(BADGE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={createPost}
            disabled={isPosting}
            style={{ minWidth: 100 }}
          >
            {isPosting ? 'Wird gepostet...' : 'Posten'}
          </button>
        </div>

        {/* Sort */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {[
            { key: 'newest', label: 'Neueste' },
            { key: 'popular', label: 'Beliebteste' },
            { key: 'unanswered', label: 'Unbeantwortete Fragen' },
          ].map(s => (
            <button
              key={s.key}
              className={`btn ${feedSort === s.key ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: 13 }}
              onClick={() => setFeedSort(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Posts */}
        {sortedPosts.length === 0 ? (
          <EmptyState
            title="Noch keine Beitr\u00E4ge"
            description="Starte die Diskussion \u2014 teile deine Gedanken mit der Community!"
          />
        ) : (
          sortedPosts.map(post => renderPostCard(post))
        )}
      </>
    );
  }

  /* ─────────────────── TAB: KURS-DISKUSSIONEN ─────────────────── */
  function renderCoursesTab() {
    if (!communityAccess) {
      return <UpgradePrompt feature="community" profile={profile} />;
    }

    if (selectedCourseId) {
      const course = courses.find(c => c.id === selectedCourseId);
      return (
        <>
          <button className="btn btn-ghost" style={{ marginBottom: 16, fontSize: 13 }}
            onClick={() => setSelectedCourseId(null)}>
            {'\u2190'} Zur\u00FCck zu allen Kursen
          </button>
          <h3 style={{ color: 'var(--ki-text)', marginBottom: 16, fontSize: 18 }}>
            {course?.title || 'Kurs-Diskussion'}
          </h3>
          {coursePosts.length === 0 ? (
            <EmptyState
              title="Noch keine Diskussionen"
              description="Starte die erste Diskussion zu diesem Kurs!"
            />
          ) : (
            coursePosts.map(post => renderPostCard(post, true))
          )}
        </>
      );
    }

    return (
      <>
        <p style={{ color: 'var(--ki-text-secondary)', marginBottom: 20, fontSize: 14 }}>
          W\u00E4hle einen Kurs, um Diskussionen zu sehen und Fragen zu stellen.
        </p>
        <div className="grid-3">
          {courses.map(course => {
            const count = posts.filter(p => p.course_id === course.id).length;
            return (
              <button
                key={course.id}
                className="card animate-in"
                onClick={() => setSelectedCourseId(course.id)}
                style={{
                  padding: 20, textAlign: 'left', cursor: 'pointer',
                  border: '1px solid var(--ki-border)', background: 'var(--ki-card)',
                  transition: 'all 0.2s', width: '100%',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--ki-red)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--ki-border)'}
              >
                <h4 style={{ color: 'var(--ki-text)', marginBottom: 8, fontSize: 15 }}>
                  {'\uD83D\uDCDA'} {course.title}
                </h4>
                <span style={{ fontSize: 13, color: 'var(--ki-text-tertiary)' }}>
                  {count} Beitr\u00E4g{count !== 1 ? 'e' : ''}
                </span>
              </button>
            );
          })}
        </div>
        {courses.length === 0 && (
          <EmptyState title="Keine Kurse verf\u00FCgbar" description="Kurse werden bald hinzugef\u00FCgt." />
        )}
      </>
    );
  }

  /* ─────────────────── TAB: ERFOLGE ─────────────────── */
  function renderAchievementsTab() {
    if (!communityAccess) {
      return <UpgradePrompt feature="community" profile={profile} />;
    }

    return (
      <>
        <p style={{ color: 'var(--ki-text-secondary)', marginBottom: 20, fontSize: 14 }}>
          Feiere die Erfolge unserer Community-Mitglieder!
        </p>
        {achievementPosts.length === 0 ? (
          <EmptyState
            title="Noch keine Erfolge geteilt"
            description="Teile deinen ersten Erfolg im Feed-Tab!"
          />
        ) : (
          achievementPosts.map(post => (
            <div key={post.id} className="card animate-in" style={{ padding: 20, marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                {renderAvatar(post)}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, color: 'var(--ki-text)' }}>
                      {getDisplayName(post)}
                    </span>
                    <span className="pill pill-gold" style={{ fontSize: 11 }}>
                      {BADGE_LABELS[post.badge_type] || 'Erfolg'}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>
                    {timeAgo(post.created_at)}
                  </span>
                </div>
              </div>
              <p style={{ color: 'var(--ki-text)', lineHeight: 1.6, marginBottom: 12 }}>
                {post.content}
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary" style={{ fontSize: 13, gap: 6 }}
                  onClick={() => likePost(post.id)}>
                  {'\uD83C\uDF89'} Gratulieren ({post.likes || 0})
                </button>
              </div>
            </div>
          ))
        )}
      </>
    );
  }

  /* ─────────────────── TAB: PEER-MATCHING ─────────────────── */
  function renderMatchingTab() {
    if (!communityAccess) {
      return <UpgradePrompt feature="community" profile={profile} />;
    }

    return (
      <>
        <div className="card animate-in" style={{ padding: 20, marginBottom: 24 }}>
          <h3 style={{ color: 'var(--ki-text)', marginBottom: 8, fontSize: 17 }}>
            {'\uD83E\uDD1D'} Finde einen Accountability-Partner
          </h3>
          <p style={{ color: 'var(--ki-text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
            Verbinde dich mit anderen Mitgliedern, die \u00E4hnliche Ziele verfolgen.
            Gemeinsam erreicht ihr mehr!
          </p>
        </div>

        {peers.length === 0 ? (
          <EmptyState
            title="Noch keine Partner verf\u00FCgbar"
            description="Aktiviere dein Profil unter Einstellungen, um hier sichtbar zu werden."
          />
        ) : (
          <div className="grid-2">
            {peers.map(peer => (
              <div key={peer.id} className="card animate-in" style={{ padding: 20 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                  {renderAvatar(peer, 44)}
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--ki-text)', fontSize: 15 }}>
                      {peer.community_display_name || peer.first_name || 'Anonym'}
                    </div>
                    {peer.industry && (
                      <span className="pill pill-grey" style={{ fontSize: 11, marginTop: 4 }}>
                        {peer.industry}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', fontSize: 13 }}
                  onClick={async () => {
                    try {
                      await supabase.from('peer_requests').insert({
                        from_user_id: userId,
                        to_user_id: peer.id,
                        status: 'pending',
                      });
                      showToast('Anfrage gesendet!');
                    } catch (err) {
                      showToast('Anfrage konnte nicht gesendet werden');
                    }
                  }}
                >
                  Anfrage senden
                </button>
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  /* ─────────────────── MAIN RENDER ─────────────────── */
  return (
    <div className="page-container">
      <div className="animate-in">
        <h1 className="page-title">Community</h1>
        <p className="page-subtitle">
          Austausch, Diskussionen und gemeinsames Wachstum
          <InfoTooltip text="In der Community kannst du Fragen stellen, Erfolge teilen und dich mit anderen Mitgliedern vernetzen." />
        </p>
      </div>

      {/* Tab navigation */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 28,
        borderBottom: '2px solid var(--ki-border)', paddingBottom: 0,
        overflowX: 'auto',
      }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 18px', fontSize: 14, fontWeight: activeTab === tab.key ? 700 : 500,
              color: activeTab === tab.key ? 'var(--ki-red)' : 'var(--ki-text-secondary)',
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: activeTab === tab.key ? '2px solid var(--ki-red)' : '2px solid transparent',
              marginBottom: -2, transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'feed' && renderFeedTab()}
      {activeTab === 'courses' && renderCoursesTab()}
      {activeTab === 'achievements' && renderAchievementsTab()}
      {activeTab === 'matching' && renderMatchingTab()}

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
