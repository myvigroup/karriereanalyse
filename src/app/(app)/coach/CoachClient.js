'use client';
import { useState, useRef, useEffect } from 'react';

const QUICK_PROMPTS = [
  { label: '💰 Gehalt verhandeln', text: 'Ich habe bald ein Gehaltsgespräch. Wie bereite ich mich optimal vor?' },
  { label: '📅 Interview vorbereiten', text: 'Ich habe ein Vorstellungsgespräch. Welche Fragen sollte ich erwarten und wie antworte ich am besten?' },
  { label: '🧭 Bleiben oder gehen?', text: 'Ich bin unsicher, ob ich in meinem aktuellen Job bleiben oder wechseln soll. Was rätst du mir?' },
  { label: '📝 CV optimieren', text: 'Wie kann ich meinen Lebenslauf für Führungspositionen optimieren?' },
  { label: '🤝 Netzwerk aufbauen', text: 'Wie baue ich strategisch ein berufliches Netzwerk auf, das mir Karrierechancen bringt?' },
  { label: '🔗 LinkedIn verbessern', text: 'Wie optimiere ich mein LinkedIn-Profil, damit Headhunter mich finden?' },
];

export default function CoachClient({ chats: initialChats, userId, profile }) {
  const [chats, setChats] = useState(initialChats || []);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/coach-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: activeChatId, message: text }),
      });
      const data = await res.json();
      if (data.chatId && !activeChatId) {
        setActiveChatId(data.chatId);
        setChats(prev => [{ id: data.chatId, title: text.substring(0, 50), created_at: new Date().toISOString() }, ...prev]);
      }
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Entschuldigung, es gab einen Fehler. Bitte versuche es erneut.' }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  const startNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setInput('');
  };

  const formatMessage = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={i} style={{ fontWeight: 700, marginTop: 8, marginBottom: 4 }}>{line.replace(/\*\*/g, '')}</div>;
      }
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return <div key={i} style={{ paddingLeft: 16, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 0 }}>•</span>{line.replace(/^[-•]\s*/, '')}
        </div>;
      }
      if (line.match(/^\d+\.\s/)) {
        return <div key={i} style={{ paddingLeft: 16 }}>{line}</div>;
      }
      if (line.trim() === '') return <div key={i} style={{ height: 8 }} />;
      return <div key={i}>{line.replace(/\*\*/g, '')}</div>;
    });
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 0px)', overflow: 'hidden' }}>
      {/* Chat History Sidebar */}
      <div style={{
        width: showHistory ? 260 : 0, background: 'var(--ki-card)', borderRight: '1px solid var(--ki-border)',
        transition: 'width var(--t-med)', overflow: 'hidden', flexShrink: 0,
      }}>
        <div style={{ width: 260, padding: 16 }}>
          <button className="btn btn-primary" onClick={startNewChat} style={{ width: '100%', marginBottom: 16, fontSize: 13 }}>
            + Neues Gespräch
          </button>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            Verlauf
          </div>
          {chats.map(c => (
            <div key={c.id} onClick={() => { setActiveChatId(c.id); setMessages([]); }}
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
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--ki-bg)' }}>
        {/* Header */}
        <div style={{
          padding: '12px 24px', borderBottom: '1px solid var(--ki-border)', display: 'flex', alignItems: 'center', gap: 12,
          background: 'var(--ki-card)',
        }}>
          <button className="btn btn-ghost" onClick={() => setShowHistory(!showHistory)} style={{ padding: '6px 10px', fontSize: 16 }}>☰</button>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>KI-Coach</div>
            <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>Dein persönlicher Karriereberater — rund um die Uhr</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ki-success)' }} />
            <span style={{ fontSize: 12, color: 'var(--ki-success)', fontWeight: 500 }}>Online</span>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 0' }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', paddingTop: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>
                Hallo{profile?.first_name ? `, ${profile.first_name}` : ''}!
              </h2>
              <p style={{ color: 'var(--ki-text-secondary)', maxWidth: 420, margin: '0 auto 32px', lineHeight: 1.6 }}>
                Ich bin dein KI-Coach. Ich kenne dein Profil, deine Analyse-Ergebnisse und deine Bewerbungen. Frag mich alles rund um Karriere, Gehalt und Verhandlung.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 600, margin: '0 auto' }}>
                {QUICK_PROMPTS.map(qp => (
                  <button key={qp.label} className="btn btn-secondary" onClick={() => sendMessage(qp.text)}
                    style={{ fontSize: 13, padding: '8px 16px' }}>
                    {qp.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 16, animation: 'fadeIn 0.3s var(--ease-apple) both',
            }}>
              <div style={{
                maxWidth: '70%', padding: '12px 16px', borderRadius: 16,
                background: msg.role === 'user' ? 'var(--ki-red)' : 'var(--ki-card)',
                color: msg.role === 'user' ? 'white' : 'var(--ki-text)',
                boxShadow: msg.role === 'user' ? 'none' : 'var(--sh-sm)',
                fontSize: 14, lineHeight: 1.6,
                borderBottomRightRadius: msg.role === 'user' ? 4 : 16,
                borderBottomLeftRadius: msg.role === 'user' ? 16 : 4,
              }}>
                {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', marginBottom: 16 }}>
              <div style={{ padding: '12px 16px', borderRadius: 16, background: 'var(--ki-card)', boxShadow: 'var(--sh-sm)', borderBottomLeftRadius: 4 }}>
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
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--ki-border)', background: 'var(--ki-card)' }}>
          <div style={{ display: 'flex', gap: 8, maxWidth: 800, margin: '0 auto' }}>
            <input ref={inputRef} className="input" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              placeholder="Frag mich alles zu Karriere, Gehalt, Bewerbungen..."
              disabled={loading}
              style={{ flex: 1, borderRadius: 'var(--r-pill)', paddingLeft: 20 }} />
            <button className="btn btn-primary" onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              style={{ borderRadius: 'var(--r-pill)', padding: '12px 20px' }}>
              ↑
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
