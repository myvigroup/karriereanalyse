'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import AppIcon from '@/components/ui/Icon';

// ─── Daily impulse (preserved from previous version) ─────────────────────────
function getDailyImpulse(profile) {
  const impulses = [
    'Tag-Idee: Schreib heute eine Bewerbung — auch wenn sie nicht perfekt ist. Versendet ist besser als perfekt.',
    'Frage des Tages: Was wäre dein nächster Schritt, wenn du wüsstest, dass es nicht schiefgehen kann?',
    'Reminder: Dein Marktwert wächst nicht durch warten, sondern durch sichtbare Resultate.',
    'Tipp: Such dir heute eine Person aus deinem Netzwerk und schreib ihr eine Nachricht — ohne Bitte, einfach Hallo.',
    'Mini-Übung: Welche drei Stärken würde dein bester Freund über dich nennen? Notiere sie.',
  ];
  const day = new Date().getDate();
  return impulses[day % impulses.length];
}

const MOOD_OPTIONS = [
  { id: 'gut',         label: 'Gut',         iconName: 'mood-happy' },
  { id: 'ok',          label: 'Okay',        iconName: 'mood-neutral' },
  { id: 'gestresst',   label: 'Gestresst',   iconName: 'mood-stressed' },
  { id: 'frustriert',  label: 'Frustriert',  iconName: 'mood-stressed' },
  { id: 'erschöpft',   label: 'Erschöpft',   iconName: 'mood-tired' },
];

const SUGGESTIONS = [
  'Wie verhandle ich mein Gehalt um 10 % nach oben?',
  'Welche Fragen sollte ich im Bewerbungsgespräch stellen?',
  'Wie schreibe ich einen Lebenslauf, der auffällt?',
  'Was tun, wenn ich keine Antwort auf meine Bewerbung bekomme?',
];

function Icon({ name, size = 14, stroke = 1.7 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
              stroke: 'currentColor', strokeWidth: stroke,
              strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'plus':    return (<svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
    case 'send':    return (<svg {...p}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>);
    case 'chat':    return (<svg {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>);
    case 'sparkle': return (<svg {...p}><path d="M5 3v4M3 5h4M19 17v4M17 19h4M12 2l2.4 5.1L20 9l-5.1 2.4L12 16l-2.4-5L4 9l5.4-2L12 2z"/></svg>);
    default: return null;
  }
}

// ─── Markdown-lite formatter (preserved) ─────────────────────────────────────
function formatMessage(text) {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return (<div key={i} style={{ fontWeight: 700, marginTop: 8, marginBottom: 4 }}>{line.replace(/\*\*/g, '')}</div>);
    }
    if (line.startsWith('- ') || line.startsWith('• ')) {
      return (<div key={i} style={{ paddingLeft: 16, position: 'relative' }}>
        <span style={{ position: 'absolute', left: 0 }}>•</span>{line.replace(/^[-•]\s*/, '')}
      </div>);
    }
    if (line.match(/^\d+\.\s/)) {
      return <div key={i} style={{ paddingLeft: 16 }}>{line}</div>;
    }
    if (line.trim() === '') return <div key={i} style={{ height: 8 }} />;
    return <div key={i}>{line.replace(/\*\*/g, '')}</div>;
  });
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function CoachClient({ chats: initialChats, userId, profile }) {
  const [chats, setChats] = useState(initialChats || []);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState(null);
  const [moodSubmitted, setMoodSubmitted] = useState(false);
  const [impulseShown, setImpulseShown] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = useCallback(async (chatId) => {
    if (!chatId) return;
    const supabase = createClient();
    const { data } = await supabase
      .from('coaching_messages').select('role, content')
      .eq('chat_id', chatId).order('created_at', { ascending: true }).limit(50);
    setMessages((data || []).map(m => ({ role: m.role, content: m.content })));
  }, []);

  useEffect(() => {
    if (activeChatId) {
      loadMessages(activeChatId);
      setMoodSubmitted(true);
      setImpulseShown(true);
    }
  }, [activeChatId, loadMessages]);

  async function sendMessage(text) {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    const moodContext = mood ? `[Stimmung des Nutzers: ${mood}]` : '';
    try {
      const res = await fetch('/api/coach-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: activeChatId, message: text, moodContext }),
      });
      const data = await res.json();
      if (data.chatId && !activeChatId) {
        setActiveChatId(data.chatId);
        setChats(prev => [{ id: data.chatId, title: text.substring(0, 50), created_at: new Date().toISOString() }, ...prev]);
      }
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Entschuldigung, es gab einen Fehler. Bitte versuche es erneut.' }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  }

  function startNewChat() {
    setActiveChatId(null);
    setMessages([]);
    setInput('');
    setMood(null);
    setMoodSubmitted(false);
    setImpulseShown(false);
  }

  function handleMoodSelect(selectedMood) {
    setMood(selectedMood);
    setMoodSubmitted(true);
    if (!impulseShown) {
      setImpulseShown(true);
      const impulse = getDailyImpulse(profile);
      const moodMap = {
        gut: 'Schön, dass es dir gut geht!',
        ok: 'Okay — ich bin da für dich.',
        gestresst: 'Stress kennt jeder. Lass uns das gemeinsam angehen.',
        frustriert: 'Das klingt frustrierend. Ich helfe dir, einen klaren Kopf zu bekommen.',
        erschöpft: 'Schön, dass du trotzdem hier bist. Lass uns heute leicht halten.',
      };
      const moodReply = moodMap[selectedMood] || '';
      setTimeout(() => {
        setMessages([{ role: 'assistant', content: `${moodReply}\n\n${impulse}` }]);
      }, 300);
    }
  }

  const isNewSession = !activeChatId && messages.length === 0;
  const firstName = profile?.first_name || (profile?.name?.split(' ')[0]) || 'du';

  return (
    <div className="coach-v2">
      <div className="coach-shell">
        {/* Sidebar */}
        <aside className="coach-sidebar">
          <button type="button" className="coach-new" onClick={startNewChat}>
            <Icon name="plus" size={14} stroke={2} /> Neues Gespräch
          </button>

          <div className="coach-section-label">Verlauf</div>
          <div className="coach-chat-list">
            {chats.length === 0 ? (
              <div className="coach-empty-list">Noch keine Gespräche</div>
            ) : (
              chats.map(c => (
                <button
                  key={c.id}
                  type="button"
                  className={`coach-chat-item ${activeChatId === c.id ? 'active' : ''}`}
                  onClick={() => setActiveChatId(c.id)}
                >
                  <Icon name="chat" size={13} />
                  <span className="coach-chat-title">{c.title || 'Gespräch'}</span>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Main chat area */}
        <main className="coach-main">
          {/* Header */}
          <header className="coach-header">
            <div>
              <h1 className="coach-h1">KI-Coach</h1>
              <div className="coach-h-sub">Dein persönlicher Karriereberater — rund um die Uhr</div>
            </div>
          </header>

          {/* Body */}
          <div className="coach-body">
            {isNewSession && !moodSubmitted ? (
              /* Mood selection */
              <div className="coach-welcome">
                <div className="coach-welcome-eyebrow">
                  <span className="pulse" />
                  Hi {firstName}
                </div>
                <h2 className="coach-welcome-title">
                  Wie geht's dir heute?{' '}
                  <span className="faded">Wähle eine Stimmung, dann starten wir.</span>
                </h2>
                <div className="coach-mood-grid">
                  {MOOD_OPTIONS.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      className="coach-mood-btn"
                      onClick={() => handleMoodSelect(m.id)}
                    >
                      <span className="emoji"><AppIcon name={m.iconName} size={22} stroke={1.6} /></span>
                      <span className="label">{m.label}</span>
                    </button>
                  ))}
                </div>
                <button type="button" className="coach-mood-skip" onClick={() => handleMoodSelect(null)}>
                  Überspringen
                </button>
              </div>
            ) : isNewSession && moodSubmitted ? (
              /* Suggestions before first message */
              <div className="coach-welcome">
                <div className="coach-welcome-eyebrow">
                  <span className="pulse" />
                  Bereit
                </div>
                <h2 className="coach-welcome-title">
                  Wobei kann ich dir helfen, {firstName}?
                </h2>
                <div className="coach-suggest-list">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      className="coach-suggest-btn"
                      onClick={() => sendMessage(s)}
                    >
                      <Icon name="sparkle" size={14} />
                      <span>{s}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Messages */
              <div className="coach-messages">
                {messages.map((m, i) => (
                  <div key={i} className={`coach-msg ${m.role}`}>
                    {m.role === 'assistant' && (
                      <div className="coach-msg-avatar">
                        <Icon name="sparkle" size={14} stroke={2} />
                      </div>
                    )}
                    <div className="coach-msg-bubble">
                      {formatMessage(m.content)}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="coach-msg assistant">
                    <div className="coach-msg-avatar"><Icon name="sparkle" size={14} stroke={2} /></div>
                    <div className="coach-msg-bubble">
                      <div className="coach-typing">
                        <span /><span /><span />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="coach-composer-wrap">
            <div className="coach-composer">
              <textarea
                ref={inputRef}
                className="coach-composer-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                placeholder="Frag den KI-Coach…"
                rows={1}
                disabled={loading || (isNewSession && !moodSubmitted)}
              />
              <button
                type="button"
                className="coach-send"
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim() || (isNewSession && !moodSubmitted)}
                aria-label="Senden"
              >
                <Icon name="send" size={16} stroke={2} />
              </button>
            </div>
            <div className="coach-hint">
              Enter zum Senden · Shift+Enter für neue Zeile
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
