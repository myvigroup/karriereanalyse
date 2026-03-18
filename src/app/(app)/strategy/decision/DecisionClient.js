'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const QUESTIONS = [
  { id: 'satisfaction', text: 'Wie zufrieden bist du mit deiner aktuellen Position?', category: 'stay' },
  { id: 'growth', text: 'Siehst du realistische Aufstiegsmöglichkeiten in deinem Unternehmen?', category: 'stay' },
  { id: 'salary_fair', text: 'Fühlst du dich fair bezahlt im Vergleich zum Markt?', category: 'stay' },
  { id: 'culture', text: 'Passt die Unternehmenskultur zu deinen Werten?', category: 'stay' },
  { id: 'leader', text: 'Unterstützt dein/e Vorgesetzte/r aktiv deine Entwicklung?', category: 'stay' },
  { id: 'market', text: 'Wie attraktiv schätzt du deine Position auf dem externen Arbeitsmarkt ein?', category: 'exit' },
  { id: 'risk', text: 'Wie bereit bist du, ein kalkuliertes Karriere-Risiko einzugehen?', category: 'exit' },
  { id: 'energy', text: 'Wie viel Energie hast du montags morgens für deinen Job?', category: 'stay' },
  { id: 'learning', text: 'Lernst du in deiner aktuellen Rolle noch etwas Neues?', category: 'stay' },
  { id: 'vision', text: 'Kannst du dir vorstellen, in 3 Jahren noch hier zu arbeiten?', category: 'stay' },
];

function getResult(answers) {
  const stayScore = QUESTIONS.filter(q => q.category === 'stay').reduce((s, q) => s + (answers[q.id] || 5), 0);
  const exitScore = QUESTIONS.filter(q => q.category === 'exit').reduce((s, q) => s + (answers[q.id] || 5), 0);
  const stayPct = Math.round((stayScore / (QUESTIONS.filter(q => q.category === 'stay').length * 10)) * 100);
  const exitPct = Math.round((exitScore / (QUESTIONS.filter(q => q.category === 'exit').length * 10)) * 100);

  if (stayPct >= 70 && exitPct < 50) return { key: 'stay_grow', label: 'Intern wachsen', desc: 'Dein Unternehmen bietet dir noch Potenzial. Fokus: Interne Verhandlung und Sichtbarkeit erhöhen.', color: 'var(--ki-success)', module: 'Führungskompetenz', stayPct, exitPct };
  if (stayPct >= 50 && stayPct < 70) return { key: 'stay_negotiate', label: 'Erst verhandeln', desc: 'Es gibt Verbesserungsbedarf, aber auch Potenzial. Starte mit einer Gehaltsverhandlung, bevor du extern suchst.', color: 'var(--ki-warning)', module: 'Gehaltsverhandlung', stayPct, exitPct };
  if (exitPct >= 60) return { key: 'exit_active', label: 'Aktiv wechseln', desc: 'Du bist bereit für den Markt und dein aktuelles Umfeld bremst dich. Starte jetzt aktiv mit Bewerbungen.', color: 'var(--ki-red)', module: 'Personal Branding', stayPct, exitPct };
  return { key: 'exit_passive', label: 'Strategisch positionieren', desc: 'Bau erst deine Sichtbarkeit auf LinkedIn auf und lass dich finden. Parallel: Masterclass für Verhandlung.', color: '#5856D6', module: 'Netzwerk & LinkedIn', stayPct, exitPct };
}

export default function DecisionClient({ userId, existingSession }) {
  const supabase = createClient();
  const [phase, setPhase] = useState(existingSession ? 'result' : 'intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(existingSession?.answers || {});
  const [result, setResult] = useState(existingSession ? getResult(existingSession.answers) : null);
  const [saving, setSaving] = useState(false);

  const handleAnswer = (val) => {
    const q = QUESTIONS[currentQ];
    const newAnswers = { ...answers, [q.id]: val };
    setAnswers(newAnswers);
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(i => i + 1);
    } else {
      finishDecision(newAnswers);
    }
  };

  const finishDecision = async (finalAnswers) => {
    setSaving(true);
    const res = getResult(finalAnswers);
    setResult(res);
    await supabase.from('decision_sessions').insert({
      user_id: userId, answers: finalAnswers, result: res.key,
      result_label: res.label, result_description: res.desc,
      score_stay: res.stayPct, score_exit: res.exitPct,
    });
    await supabase.from('activity_log').insert({ user_id: userId, activity_type: 'decision', activity_label: 'Entscheidungs-Kompass abgeschlossen' });
    setSaving(false);
    setPhase('result');
  };

  // INTRO
  if (phase === 'intro') return (
    <div className="page-container" style={{ maxWidth: 600, textAlign: 'center' }}>
      <div style={{ padding: '64px 0' }}>
        <div style={{ fontSize: 56, marginBottom: 24 }}>🧭</div>
        <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.04em', marginBottom: 12 }}>Entscheidungs-Kompass</h1>
        <p style={{ fontSize: 17, color: 'var(--ki-text-secondary)', maxWidth: 440, margin: '0 auto 32px', lineHeight: 1.6 }}>
          Bleiben, verhandeln oder gehen? 10 Fragen — 5 Minuten — eine klare Richtung.
        </p>
        <button className="btn btn-primary" onClick={() => setPhase('quiz')} style={{ padding: '14px 40px', fontSize: 16 }}>
          Kompass starten →
        </button>
      </div>
    </div>
  );

  // QUIZ
  if (phase === 'quiz') {
    const q = QUESTIONS[currentQ];
    return (
      <div className="page-container" style={{ maxWidth: 600 }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 8 }}>
            <span>Frage {currentQ + 1} von {QUESTIONS.length}</span>
            <span>{Math.round((currentQ / QUESTIONS.length) * 100)}%</span>
          </div>
          <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${(currentQ / QUESTIONS.length) * 100}%` }} /></div>
        </div>
        <div className="card animate-in" style={{ padding: 32, textAlign: 'center' }}>
          <p style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.5, marginBottom: 32 }}>{q.text}</p>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
              <button key={val} onClick={() => handleAnswer(val)} style={{
                width: 44, height: 44, borderRadius: 'var(--r-pill)', border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 600, fontFamily: 'Instrument Sans',
                background: answers[q.id] === val ? 'var(--ki-red)' : 'var(--ki-bg-alt)',
                color: answers[q.id] === val ? 'white' : 'var(--ki-text-secondary)',
                transition: 'all var(--t-fast)',
              }}>{val}</button>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ki-text-tertiary)', marginTop: 8, padding: '0 20px' }}>
            <span>Überhaupt nicht</span><span>Voll und ganz</span>
          </div>
        </div>
      </div>
    );
  }

  // RESULT
  if (phase === 'result' && result) return (
    <div className="page-container" style={{ maxWidth: 600 }}>
      <div className="card animate-in" style={{ padding: 40, textAlign: 'center', borderTop: `4px solid ${result.color}` }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🧭</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Deine Richtung:</h1>
        <div style={{ fontSize: 32, fontWeight: 700, color: result.color, marginBottom: 16 }}>{result.label}</div>
        <p style={{ fontSize: 16, color: 'var(--ki-text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>{result.desc}</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 24 }}>
          <div className="card" style={{ padding: 16, flex: 1 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--ki-success)' }}>{result.stayPct}%</div>
            <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Bleiben-Score</div>
          </div>
          <div className="card" style={{ padding: 16, flex: 1 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--ki-red)' }}>{result.exitPct}%</div>
            <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Wechsel-Score</div>
          </div>
        </div>
        <div style={{ padding: 16, background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-md)', marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ki-text-secondary)', marginBottom: 4 }}>Empfohlenes Modul</div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{result.module}</div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <a href="/analyse" className="btn btn-primary" style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}>Tiefenanalyse starten →</a>
          <button className="btn btn-secondary" onClick={() => { setPhase('intro'); setCurrentQ(0); setAnswers({}); }}>Wiederholen</button>
        </div>
      </div>
    </div>
  );

  return null;
}
