'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import InfoTooltip from '@/components/ui/InfoTooltip';

/* ─── Quick-Prompts ─────────────────────────────────────────────────────── */
const QUICK_PROMPTS = [
  { label: '💰 Gehaltsverhandlung',  text: 'Hilf mir bei der Gehaltsverhandlung – was sind die besten Strategien?' },
  { label: '📋 Interview-Prep',      text: 'Bereite mich auf ein Jobinterview vor – welche Fragen kommen?' },
  { label: '🗺️ Karriereplan',        text: 'Analysiere meinen Karrierepfad und gib mir einen konkreten Plan.' },
  { label: '✍️ Bewerbung schreiben', text: 'Hilf mir, ein überzeugendes Bewerbungsschreiben zu verfassen.' },
  { label: '🔗 LinkedIn optimieren', text: 'Wie kann ich mein LinkedIn-Profil optimieren, damit Recruiter mich finden?' },
  { label: '😰 Ich bin überfordert', text: 'Ich fühle mich gerade überfordert und weiß nicht, wo ich anfangen soll.' },
];

/* ─── Mood options ───────────────────────────────────────────────────────── */
const MOODS = [
  { emoji: '😊', label: 'Gut',         value: 'gut' },
  { emoji: '😐', label: 'Ok',          value: 'ok' },
  { emoji: '😟', label: 'Gestresst',   value: 'gestresst' },
  { emoji: '😤', label: 'Frustriert',  value: 'frustriert' },
  { emoji: '😔', label: 'Erschöpft',   value: 'erschöpft' },
];

/* ─── Daily impulse helper ───────────────────────────────────────────────── */
function getDailyImpulse(profile) {
  const name = profile?.first_name ? `, ${profile.first_name}` : '';
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Guten Morgen' :
    hour < 18 ? 'Hallo' :
    'Guten Abend';

  const impulses = [
    `${greeting}${name}! Heute ist ein guter Tag, um einen konkreten Karriereschritt zu planen. Womit kann ich dir helfen?`,
    `${greeting}${name}! Hast du schon über deine nächste Gehaltsverhandlung nachgedacht? Ich unterstütze dich gerne.`,
    `${greeting}${name}! Manchmal reicht ein gutes Gespräch, um Klarheit zu gewinnen. Was beschäftigt dich gerade beruflich?`,
    `${greeting}${name}! Dein LinkedIn-Profil könnte heute der Schlüssel zu deinem nächsten Job sein. Sollen wir es zusammen verbessern?`,
    `${greeting}${name}! Große Ziele beginnen mit dem ersten Schritt. Was ist dein berufliches Ziel für die nächsten 6 Monate?`,
  ];

  // Pick a stable-ish impulse based on day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return impulses[dayOfYear % impulses.length];
}

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function CoachClient({ chats: initialChats, userId, profile }) {
  const [chats, setChats]               = useState(initialChats || []);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages]         = useState([]);
  const [input, setInput]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [showHistory, setShowHistory]   = useState(false);

  // Mood state – null means not yet selected for this session
  const [mood, setMood]                 = useState(null);
  const [moodSubmitted, setMoodSubmitted] = useState(false);

  // Whether the daily impulse has been injected as the first assistant message
  const [impulseShown, setImpulseShown] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  /* scroll to bottom on new messages */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* load messages for an existing chat */
  const loadMessages = useCallback(async (chatId) => {
    if (!chatId) return;
    const supabase = createClient();
    const { data } = await supabase
      .from('coaching_messages')
      .select('role, content')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })
      .limit(50);
    setMessages((data || []).map(m => ({ role: m.role, content: m.content })));
  }, []);

  useEffect(() => {
    if (activeChatId) {
      loadMessages(activeChatId);
      setMoodSubmitted(true); // existing chat → skip mood check
      setImpulseShown(true);
    }
  }, [activeChatId, loadMessages]);

  /* ── send message ─────────────────────────────────────────────────── */
  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Build optional mood context for the API
    const moodContext = mood ? `[Stimmung des Nutzers: ${mood}]` : '';

    try {
      const res = await fetch('/api/coach-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: activeChatId,
          message: text,
          moodContext,
        }),
      });
      const data = await res.json();
      if (data.chatId && !activeChatId) {
        setActiveChatId(data.chatId);
        setChats(prev => [
          { id: data.chatId, title: text.substring(0, 50), created_at: new Date().toISOString() },
          ...prev,
        ]);
      }
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Entschuldigung, es gab einen Fehler. Bitte versuche es erneut.' },
      ]);
    }

    setLoading(false);
    inputRef.current?.focus();
  };

  /* ── start new chat ──────────────────────────────────────────────── */
  const startNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setInput('');
    setMood(null);
    setMoodSubmitted(false);
    setImpulseShown(false);
  };

  /* ── mood submission ─────────────────────────────────────────────── */
  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood);
    setMoodSubmitted(true);

    // After mood is set, show the daily impulse as an assistant message
    if (!impulseShown) {
      setImpulseShown(true);
      const impulse = getDailyImpulse(profile);
      const moodMap = { gut: 'Schön, dass es dir gut geht!', ok: 'Okay – ich bin da für dich.', gestresst: 'Stress kennt jeder. Lass uns das gemeinsam angehen.', frustriert: 'Das klingt frustrierend. Ich helfe dir, einen klaren Kopf zu bekommen.', erschöpft: 'Schön, dass du trotzdem hier bist. Lass uns heute leicht halten.' };
      const moodReply = moodMap[selectedMood] || '';
      setTimeout(() => {
        setMessages([{ role: 'assistant', content: `${moodReply}\n\n${impulse}` }]);
      }, 300);
    }
  };

  /* ── markdown-lite formatter ─────────────────────────────────────── */
  const formatMessage = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <div key={i} style={{ fontWeight: 700, marginTop: 8, marginBottom: 4 }}>
            {line.replace(/\*\*/g, '')}
          </div>
        );
      }
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <div key={i} style={{ paddingLeft: 16, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0 }}>•</span>
            {line.replace(/^[-•]\s*/, '')}
          </div>
        );
      }
      if (line.match(/^\d+\.\s/)) {
        return <div key={i} style={{ paddingLeft: 16 }}>{line}</div>;
      }
      if (line.trim() === '') return <div key={i} style={{ height: 8 }} />;
      return <div key={i}>{line.replace(/\*\*/g, '')}</div>;
    });
  };

  /* ── derived state ───────────────────────────────────────────────── */
  const isNewSession = !activeChatId && messages.length === 0;

  /* ══════════════════════════════════════════════════════════════════ */
  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 0px)', overflow: 'hidden' }}>

      {/* ── Chat History Sidebar ─────────────────────────────────── */}
      <div style={{
        width: showHistory ? 260 : 0,
        background: 'var(--ki-card)',
        borderRight: '1px solid var(--ki-border)',
        transition: 'width var(--t-med)',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <div style={{ width: 260, padding: 16 }}>
          <button className="btn btn-primary" onClick={startNewChat}
            style={{ width: '100%', marginBottom: 16, fontSize: 13 }}>
            + Neues Gespräch
          </button>
          <div style={{
            fontSize: 11, fontWeight: 600, color: 'var(--ki-text-tertiary)',
            textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8,
          }}>
            Verlauf
          </div>
          {chats.map(c => (
            <div key={c.id} onClick={() => setActiveChatId(c.id)}
              style={{
                padding: '8px 12px', borderRadius: 'var(--r-sm)', cursor: 'pointer', marginBottom: 2,
                background: activeChatId === c.id ? 'rgba(204,20,38,0.06)' : 'transparent',
                color: activeChatId === c.id ? 'var(--ki-red)' : 'var(--ki-text-secondary)',
                fontSize: 13, fontWeight: activeChatId === c.id ? 600 : 400,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
              {c.title || 'Gespräch'}
            </div>
          ))}

          {/* ── Video-Platzhalter in Sidebar ──────────────────────── */}
          {chats.length === 0 && (
            <div style={{ marginTop: 24 }}>
              <div style={{
                fontSize: 11, fontWeight: 600, color: 'var(--ki-text-tertiary)',
                textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8,
              }}>
                Tipp des Tages
              </div>
              <div style={{
                borderRadius: 'var(--r-md)', overflow: 'hidden',
                background: 'var(--ki-bg-alt)', border: '1px solid var(--ki-border)',
                aspectRatio: '16/9', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer',
              }}>
                <span style={{ fontSize: 28 }}>▶️</span>
                <span style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', textAlign: 'center', padding: '0 8px' }}>
                  Gehaltsverhandlung meistern
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Main Chat Area ───────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--ki-bg)', minWidth: 0 }}>

        {/* Header */}
        <div style={{
          padding: '12px 24px', borderBottom: '1px solid var(--ki-border)',
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'var(--ki-card)', flexShrink: 0,
        }}>
          <button className="btn btn-ghost" onClick={() => setShowHistory(!showHistory)}
            style={{ padding: '6px 10px', fontSize: 16 }}>☰</button>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>KI-Coach<InfoTooltip moduleId="coach" profile={profile} /></div>
            <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>
              Dein persönlicher Karriereberater — rund um die Uhr
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            {mood && (
              <span style={{
                fontSize: 12, color: 'var(--ki-text-secondary)', background: 'var(--ki-bg-alt)',
                padding: '3px 10px', borderRadius: 'var(--r-pill)', fontWeight: 500,
              }}>
                Stimmung: {MOODS.find(m => m.value === mood)?.emoji}
              </span>
            )}
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ki-success)' }} />
            <span style={{ fontSize: 12, color: 'var(--ki-success)', fontWeight: 500 }}>Online</span>
          </div>
        </div>

        {/* Messages area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 0' }}>

          {/* ── Empty state: Mood-Check + Welcome ─────────────────── */}
          {isNewSession && (
            <div className="animate-in" style={{ textAlign: 'center', paddingTop: 32 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🤖</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>
                Hallo{profile?.first_name ? `, ${profile.first_name}` : ''}!
              </h2>
              <p style={{ color: 'var(--ki-text-secondary)', maxWidth: 420, margin: '0 auto 28px', lineHeight: 1.6, fontSize: 15 }}>
                Ich bin dein KI-Coach. Ich kenne dein Profil und deine Bewerbungen.
                Frag mich alles rund um Karriere, Gehalt und Verhandlung.
              </p>

              {/* Stimmungs-Check */}
              {!moodSubmitted && (
                <div className="card animate-in" style={{
                  display: 'inline-block', padding: '20px 28px', marginBottom: 28,
                  borderRadius: 'var(--r-lg)', boxShadow: 'var(--sh-md)',
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-text-secondary)', marginBottom: 14 }}>
                    Wie geht es dir heute?
                  </div>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                    {MOODS.map(m => (
                      <button key={m.value} onClick={() => handleMoodSelect(m.value)}
                        title={m.label}
                        style={{
                          background: 'var(--ki-bg-alt)', border: '2px solid var(--ki-border)',
                          borderRadius: 'var(--r-md)', padding: '10px 14px',
                          cursor: 'pointer', fontSize: 24, lineHeight: 1,
                          transition: 'all var(--t-fast)',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = 'var(--ki-red)';
                          e.currentTarget.style.background = 'rgba(204,20,38,0.05)';
                          e.currentTarget.style.transform = 'scale(1.08)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'var(--ki-border)';
                          e.currentTarget.style.background = 'var(--ki-bg-alt)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}>
                        <span>{m.emoji}</span>
                        <span style={{ fontSize: 10, color: 'var(--ki-text-tertiary)', fontWeight: 500 }}>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick-Prompts (6 pills) */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 640, margin: '0 auto' }}>
                {QUICK_PROMPTS.map(qp => (
                  <button key={qp.label} className="pill pill-grey"
                    onClick={() => sendMessage(qp.text)}
                    style={{
                      fontSize: 13, padding: '9px 18px', cursor: 'pointer',
                      border: '1px solid var(--ki-border)',
                      transition: 'all var(--t-fast)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(204,20,38,0.06)';
                      e.currentTarget.style.color = 'var(--ki-red)';
                      e.currentTarget.style.borderColor = 'var(--ki-red)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'var(--grey-6)';
                      e.currentTarget.style.color = 'var(--ki-text-secondary)';
                      e.currentTarget.style.borderColor = 'var(--ki-border)';
                    }}>
                    {qp.label}
                  </button>
                ))}
              </div>

              {/* Video-Platzhalter below empty chat */}
              <div style={{ marginTop: 36, maxWidth: 480, margin: '36px auto 0' }}>
                <div style={{
                  fontSize: 11, fontWeight: 600, color: 'var(--ki-text-tertiary)',
                  textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10,
                }}>
                  Empfohlenes Video
                </div>
                <div style={{
                  borderRadius: 'var(--r-lg)', overflow: 'hidden',
                  background: 'linear-gradient(135deg, var(--ki-charcoal) 0%, #1a1a2e 100%)',
                  aspectRatio: '16/9', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 10,
                  cursor: 'pointer', position: 'relative', boxShadow: 'var(--sh-md)',
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, paddingLeft: 4,
                  }}>▶</div>
                  <div style={{ textAlign: 'center', padding: '0 24px' }}>
                    <div style={{ color: 'white', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                      Gehaltsverhandlung meistern
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>
                      12 Min. · Karriere Institut
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Messages ──────────────────────────────────────────── */}
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 16,
              animation: 'fadeIn 0.3s var(--ease-apple) both',
            }}>
              {msg.role === 'assistant' && (
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', background: 'var(--ki-red)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, flexShrink: 0, marginRight: 8, alignSelf: 'flex-end',
                }}>
                  🤖
                </div>
              )}
              <div style={{
                maxWidth: '70%', padding: '12px 16px', borderRadius: 16,
                background: msg.role === 'user' ? 'var(--ki-red)' : 'var(--ki-card)',
                color: msg.role === 'user' ? 'white' : 'var(--ki-text)',
                boxShadow: msg.role === 'user' ? 'none' : 'var(--sh-sm)',
                fontSize: 14, lineHeight: 1.6,
                borderBottomRightRadius: msg.role === 'user' ? 4 : 16,
                borderBottomLeftRadius:  msg.role === 'user' ? 16 : 4,
              }}>
                {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 16 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', background: 'var(--ki-red)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0,
              }}>🤖</div>
              <div style={{
                padding: '12px 16px', borderRadius: 16, background: 'var(--ki-card)',
                boxShadow: 'var(--sh-sm)', borderBottomLeftRadius: 4,
              }}>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 8, height: 8, borderRadius: '50%', background: 'var(--ki-text-tertiary)',
                      animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} style={{ paddingBottom: 16 }} />
        </div>

        {/* ── Quick-Prompts bar above input (visible when chat active) ── */}
        {!isNewSession && (
          <div style={{
            padding: '10px 24px 0',
            display: 'flex', gap: 6, flexWrap: 'wrap',
            borderTop: '1px solid var(--ki-border)',
            background: 'var(--ki-card)',
          }}>
            {QUICK_PROMPTS.map(qp => (
              <button key={qp.label} className="pill pill-grey"
                onClick={() => sendMessage(qp.text)}
                style={{
                  fontSize: 12, padding: '5px 12px', cursor: 'pointer',
                  border: '1px solid var(--ki-border)',
                  transition: 'all var(--t-fast)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(204,20,38,0.06)';
                  e.currentTarget.style.color = 'var(--ki-red)';
                  e.currentTarget.style.borderColor = 'var(--ki-red)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--grey-6)';
                  e.currentTarget.style.color = 'var(--ki-text-secondary)';
                  e.currentTarget.style.borderColor = 'var(--ki-border)';
                }}>
                {qp.label}
              </button>
            ))}
          </div>
        )}

        {/* ── Input area ────────────────────────────────────────── */}
        <div style={{
          padding: isNewSession ? '16px 24px' : '12px 24px',
          borderTop: isNewSession ? '1px solid var(--ki-border)' : 'none',
          background: 'var(--ki-card)',
        }}>
          <div style={{ display: 'flex', gap: 8, maxWidth: 800, margin: '0 auto' }}>
            <input
              ref={inputRef}
              className="input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              placeholder="Frag mich alles zu Karriere, Gehalt, Bewerbungen..."
              disabled={loading}
              style={{ flex: 1, borderRadius: 'var(--r-pill)', paddingLeft: 20 }}
            />
            <button className="btn btn-primary"
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              style={{ borderRadius: 'var(--r-pill)', padding: '12px 20px', fontSize: 18 }}>
              ↑
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, color: 'var(--ki-text-tertiary)' }}>
            KI-Coach kann Fehler machen. Wichtige Entscheidungen bitte mit einem Berater abstimmen.
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1);   }
        }
      `}</style>
    </div>
  );
}
