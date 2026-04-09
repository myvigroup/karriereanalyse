'use client';
import { useState, useEffect } from 'react';

// ─────────────────────────────────────────────────────────────────────
// Utility: read / write to localStorage for cross-lesson data
// ─────────────────────────────────="ki_gehalt_data"
const STORAGE_KEY = 'ki_gehalt_data';
function loadGehaltData() {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}
function saveGehaltData(patch) {
  const current = loadGehaltData();
  const updated = { ...current, ...patch };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
  return updated;
}

// ─────────────────────────────────────────────────────────────────────
// SALARY GAP CALCULATOR — Lesson 1.1
// ─────────────────────────────────────────────────────────────────────
export function SalaryGapWidget({ onSave }) {
  const stored = loadGehaltData();
  const [current, setCurrent] = useState(stored.currentSalary || '');
  const [desired, setDesired] = useState(stored.desiredSalary || '');
  const [saved, setSaved] = useState(!!(stored.currentSalary && stored.desiredSalary));

  const gap = parseInt(desired) - parseInt(current);
  const gap10yr = gap * 10;
  const isValid = !isNaN(gap) && gap > 0;

  function handleSave() {
    if (!isValid) return;
    saveGehaltData({ currentSalary: parseInt(current), desiredSalary: parseInt(desired), gap, gap10yr });
    setSaved(true);
    if (onSave) onSave();
  }

  return (
    <div className="card" style={{ background: 'var(--ki-bg-alt)', border: 'none', marginBottom: 24 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
        Deine Gehaltslücke berechnen
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-secondary)', display: 'block', marginBottom: 6 }}>
            Aktuelles Gehalt (€/Jahr)
          </label>
          <input
            className="input"
            type="number"
            value={current}
            onChange={e => { setCurrent(e.target.value); setSaved(false); }}
            placeholder="z. B. 52000"
            min="0"
          />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-secondary)', display: 'block', marginBottom: 6 }}>
            Wunschgehalt (€/Jahr)
          </label>
          <input
            className="input"
            type="number"
            value={desired}
            onChange={e => { setDesired(e.target.value); setSaved(false); }}
            placeholder="z. B. 60000"
            min="0"
          />
        </div>
      </div>

      {isValid && (
        <div style={{
          padding: '16px 20px', borderRadius: 12, marginBottom: 16,
          background: 'rgba(204,20,38,0.04)', border: '1px solid rgba(204,20,38,0.12)',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deine Gehaltslücke</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--ki-red)' }}>
                {gap.toLocaleString('de-DE')} €
                <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--ki-text-secondary)', marginLeft: 4 }}>/Jahr</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Über 10 Jahre</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--ki-red)' }}>
                {gap10yr.toLocaleString('de-DE')} €
              </div>
            </div>
          </div>
          <div style={{ marginTop: 10, fontSize: 13, color: 'var(--ki-text-secondary)', lineHeight: 1.5 }}>
            Genau darum geht es in diesem Kurs — diese Lücke zu schließen.
          </div>
        </div>
      )}

      {!saved ? (
        <button onClick={handleSave} className="btn btn-primary" disabled={!isValid} style={{ width: '100%' }}>
          Lücke speichern →
        </button>
      ) : (
        <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600, textAlign: 'center' }}>
          ✓ Gespeichert — wir arbeiten in Modul 3 mit diesen Zahlen
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// FEAR SELECTOR — Lesson 1.2
// ─────────────────────────────────────────────────────────────────────
export function FearSelectorWidget({ fearOptions, onSave }) {
  const stored = loadGehaltData();
  const [selected, setSelected] = useState(stored.fear || null);
  const [saved, setSaved] = useState(!!stored.fear);

  function handleSelect(id) {
    if (saved) return;
    setSelected(id);
  }

  function handleSave() {
    if (!selected) return;
    saveGehaltData({ fear: selected });
    setSaved(true);
    if (onSave) onSave();
  }

  const selectedOpt = fearOptions.find(f => f.id === selected);

  return (
    <div className="card" style={{ background: 'var(--ki-bg-alt)', border: 'none', marginBottom: 24 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
        Was ist deine größte Angst bei einer Gehaltsverhandlung?
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
        {fearOptions.map(opt => {
          const isSelected = selected === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              style={{
                padding: '12px 16px', borderRadius: 10,
                border: `2px solid ${isSelected ? 'var(--ki-red)' : 'var(--ki-border)'}`,
                background: isSelected ? 'rgba(204,20,38,0.04)' : 'var(--ki-card)',
                cursor: saved ? 'default' : 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                  border: `2px solid ${isSelected ? 'var(--ki-red)' : 'var(--ki-border)'}`,
                  background: isSelected ? 'var(--ki-red)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isSelected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: 'var(--ki-text)', lineHeight: 1.5 }}>{opt.text}</div>
                  {isSelected && saved && (
                    <div style={{
                      marginTop: 8, padding: '8px 12px', borderRadius: 8,
                      background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.15)',
                      fontSize: 13, color: '#1d4ed8', lineHeight: 1.6,
                    }}>
                      {opt.feedback}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!saved ? (
        <button onClick={handleSave} className="btn btn-primary" disabled={!selected} style={{ width: '100%' }}>
          Bestätigen →
        </button>
      ) : (
        <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600, textAlign: 'center' }}>
          ✓ Notiert — wir berücksichtigen das in den Simulationen
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// SELF ASSESSMENT SLIDER — Lesson 1.3
// ─────────────────────────────────────────────────────────────────────
export function SelfAssessmentWidget({ sliderLabels, sliderFeedback, onSave }) {
  const stored = loadGehaltData();
  const [value, setValue] = useState(stored.selfAssessmentBefore || 3);
  const [saved, setSaved] = useState(stored.selfAssessmentBefore !== undefined);

  function getFeedback(v) {
    if (v <= 2) return sliderFeedback.low;
    if (v <= 3) return sliderFeedback.mid;
    return sliderFeedback.high;
  }

  function handleSave() {
    saveGehaltData({ selfAssessmentBefore: value });
    setSaved(true);
    if (onSave) onSave();
  }

  return (
    <div className="card" style={{ background: 'var(--ki-bg-alt)', border: 'none', marginBottom: 24 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
        Wie selbstbewusst gehst du aktuell in ein Gehaltsgespräch?
      </div>
      <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 20 }}>
        {sliderLabels[value]}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        {[1, 2, 3, 4, 5].map(v => (
          <button
            key={v}
            onClick={() => !saved && setValue(v)}
            style={{
              flex: 1, height: 44, borderRadius: 10, border: 'none',
              background: v <= value ? 'var(--ki-red)' : 'var(--ki-border)',
              color: v <= value ? 'white' : 'var(--ki-text-tertiary)',
              fontWeight: 700, fontSize: 16,
              cursor: saved ? 'default' : 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {v}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ki-text-tertiary)', marginBottom: 16 }}>
        <span>Vermeide es</span>
        <span>Profi-Verhandler</span>
      </div>

      {saved && (
        <div style={{
          padding: '10px 14px', borderRadius: 8, marginBottom: 14,
          background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.12)',
          fontSize: 13, color: '#1d4ed8', lineHeight: 1.6,
        }}>
          {getFeedback(value)}
        </div>
      )}

      {!saved ? (
        <button onClick={handleSave} className="btn btn-primary" style={{ width: '100%' }}>
          Einschätzung speichern →
        </button>
      ) : (
        <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600, textAlign: 'center' }}>
          ✓ Gespeichert — wir vergleichen am Ende des Kurses
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// THREE NUMBERS — Lesson 2.1
// ─────────────────────────────────────────────────────────────────────
export function ThreeNumbersWidget({ onSave }) {
  const stored = loadGehaltData();
  const [min, setMin] = useState(stored.minimum || '');
  const [target, setTarget] = useState(stored.targetSalary || '');
  const [stretch, setStretch] = useState(stored.stretch || '');
  const [saved, setSaved] = useState(!!(stored.minimum && stored.targetSalary && stored.stretch));
  const [error, setError] = useState('');

  const gap = loadGehaltData().gap;

  function validate() {
    const m = parseInt(min), t = parseInt(target), s = parseInt(stretch);
    if (isNaN(m) || isNaN(t) || isNaN(s)) return 'Bitte alle drei Felder ausfüllen.';
    if (t <= m) return 'Dein Ziel sollte über deinem Minimum liegen — sonst verhandelst du gegen dich selbst.';
    if (s <= t) return 'Dein Stretch sollte über deinem Ziel liegen.';
    return '';
  }

  function handleSave() {
    const err = validate();
    if (err) { setError(err); return; }
    const m = parseInt(min), t = parseInt(target), s = parseInt(stretch);
    saveGehaltData({ minimum: m, targetSalary: t, stretch: s });
    setSaved(true);
    setError('');
    if (onSave) onSave();
  }

  const fields = [
    { key: 'min', label: 'Minimum', sub: 'Absolute Untergrenze — darunter gehst du nicht', value: min, set: setMin, color: '#dc2626' },
    { key: 'target', label: 'Ziel', sub: 'Das forderst du — musst du laut ansagen können', value: target, set: setTarget, color: '#2563EB' },
    { key: 'stretch', label: 'Stretch', sub: 'Best-Case — oberes Marktende', value: stretch, set: setStretch, color: '#16a34a' },
  ];

  const m = parseInt(min), t = parseInt(target), s = parseInt(stretch);
  const isValid = !isNaN(m) && !isNaN(t) && !isNaN(s) && t > m && s > t;

  return (
    <div className="card" style={{ background: 'var(--ki-bg-alt)', border: 'none', marginBottom: 24 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
        Deine drei Verhandlungszahlen
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
        {fields.map(f => (
          <div key={f.key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: f.color }}>{f.label}</label>
              <span style={{ fontSize: 11, color: 'var(--ki-text-tertiary)' }}>{f.sub}</span>
            </div>
            <input
              className="input"
              type="number"
              value={f.value}
              onChange={e => { f.set(e.target.value); setSaved(false); setError(''); }}
              placeholder="z. B. 52000"
              disabled={saved}
            />
          </div>
        ))}
      </div>

      {error && (
        <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 12, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 13, color: '#dc2626' }}>
          {error}
        </div>
      )}

      {isValid && !error && (
        <div style={{
          padding: '14px 18px', borderRadius: 10, marginBottom: 14,
          background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.12)',
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1d4ed8', marginBottom: 6 }}>Deine Verhandlungsrange</div>
          <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', lineHeight: 1.6 }}>
            {m.toLocaleString('de-DE')} € → <strong>{t.toLocaleString('de-DE')} €</strong> → {s.toLocaleString('de-DE')} €
            <br />Spielraum: {(s - m).toLocaleString('de-DE')} €
            {gap && <> · In Modul 3 bauen wir deinen Pitch um dein Ziel von <strong>{t.toLocaleString('de-DE')} €</strong>.</>}
          </div>
        </div>
      )}

      {!saved ? (
        <button onClick={handleSave} className="btn btn-primary" disabled={!isValid} style={{ width: '100%' }}>
          Zahlen festlegen →
        </button>
      ) : (
        <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600, textAlign: 'center' }}>
          ✓ Deine Range ist gesetzt — ab Modul 3 arbeiten wir damit
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// IMPACT SENTENCES — Lesson 2.3
// ─────────────────────────────────────────────────────────────────────
export function ImpactSentencesWidget({ factorLevels, onSave }) {
  const stored = loadGehaltData();
  const [sentences, setSentences] = useState(stored.impactSentences || ['', '', '']);
  const [saved, setSaved] = useState(!!(stored.impactSentences?.some(s => s.length > 10)));

  function handleChange(i, val) {
    const next = [...sentences];
    next[i] = val;
    setSentences(next);
    setSaved(false);
  }

  const isValid = sentences.filter(s => s.trim().length > 10).length >= 1;

  function handleSave() {
    saveGehaltData({ impactSentences: sentences });
    setSaved(true);
    if (onSave) onSave();
  }

  return (
    <div className="card" style={{ background: 'var(--ki-bg-alt)', border: 'none', marginBottom: 24 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
        Deine Top-3 Impact-Sätze
      </div>
      <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
        Formuliere 3 konkrete Ergebnisse der letzten 12 Monate — jeder mit einer Zahl und einem "Davor/Danach".
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        {[0, 1, 2].map(i => (
          <div key={i}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-secondary)', display: 'block', marginBottom: 6 }}>
              Ergebnis {i + 1} {i === 0 ? '(stärkstes zuerst)' : ''}
            </label>
            <input
              className="input"
              type="text"
              value={sentences[i]}
              onChange={e => handleChange(i, e.target.value)}
              placeholder={
                i === 0 ? 'z. B. "Ich habe den Umsatz um 22 % gesteigert — 18 Neukunden gewonnen."'
                : i === 1 ? 'z. B. "Ich habe den Onboarding-Prozess von 8 auf 4 Wochen verkürzt."'
                : 'z. B. "Ich habe das Team auf eine neue CRM-Plattform migriert — 3 Wochen vor Deadline."'
              }
              disabled={saved}
            />
          </div>
        ))}
      </div>

      <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 14, background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', fontSize: 12, color: '#92400e', lineHeight: 1.6 }}>
        💡 <strong>So-what-Test:</strong> Füge nach jedem Satz gedanklich hinzu: "…und das hat dem Unternehmen X gebracht." Wenn du es nicht beantworten kannst — umformulieren.
      </div>

      {!saved ? (
        <button onClick={handleSave} className="btn btn-primary" disabled={!isValid} style={{ width: '100%' }}>
          Impact-Sätze speichern →
        </button>
      ) : (
        <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600, textAlign: 'center' }}>
          ✓ Gespeichert — das ist deine Munition für Modul 3
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// PITCH BUILDER — Lesson 3.2
// ─────────────────────────────────────────────────────────────────────
export function PitchBuilderWidget({ examplePitches, onSave }) {
  const stored = loadGehaltData();
  const target = stored.targetSalary ? `${stored.targetSalary.toLocaleString('de-DE')} Euro` : '[dein Ziel-Gehalt]';
  const range = stored.minimum && stored.stretch
    ? `${stored.minimum.toLocaleString('de-DE')} bis ${stored.stretch.toLocaleString('de-DE')} Euro`
    : '[Markt-Range]';
  const impact1 = stored.impactSentences?.[0] || '[dein stärkster Impact-Satz mit Zahl]';

  const template = `Ich möchte mein Gehalt auf ${target} anpassen. In den letzten 12 Monaten habe ich ${impact1}. Der Marktwert für meine Position liegt bei ${range}.`;

  const [pitch, setPitch] = useState(stored.pitch || template);
  const [saved, setSaved] = useState(!!stored.pitch);
  const [showExamples, setShowExamples] = useState(false);
  const wordCount = pitch.trim().split(/\s+/).filter(Boolean).length;
  const wordCountColor = wordCount < 30 ? '#d97706' : wordCount > 80 ? '#dc2626' : '#16a34a';

  function handleSave() {
    if (pitch.trim().length < 20) return;
    saveGehaltData({ pitch });
    setSaved(true);
    if (onSave) onSave();
  }

  return (
    <div className="card" style={{ background: 'var(--ki-bg-alt)', border: 'none', marginBottom: 24 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
        Dein persönlicher Gehalts-Pitch
      </div>
      <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 14, lineHeight: 1.6 }}>
        Vorlage aus deinen Angaben vorausgefüllt — passe sie an und übe ihn laut.
      </div>

      <textarea
        className="input"
        value={pitch}
        onChange={e => { setPitch(e.target.value); setSaved(false); }}
        rows={5}
        style={{ resize: 'vertical', lineHeight: 1.7, fontSize: 14 }}
        disabled={saved}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, marginBottom: 14 }}>
        <span style={{ fontSize: 12, color: wordCountColor, fontWeight: 600 }}>
          {wordCount} Wörter {wordCount < 30 ? '(zu kurz)' : wordCount > 80 ? '(zu lang)' : '(ideal: 40–60)'}
        </span>
        <button
          onClick={() => setShowExamples(!showExamples)}
          style={{ fontSize: 12, color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {showExamples ? 'Beispiele ausblenden' : '3 Beispiele ansehen'}
        </button>
      </div>

      {showExamples && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
          {examplePitches.map((ex, i) => (
            <div key={i} style={{
              padding: '12px 14px', borderRadius: 10,
              background: 'var(--ki-card)', border: '1px solid var(--ki-border)',
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', marginBottom: 6 }}>{ex.role}</div>
              <div style={{ fontSize: 13, color: 'var(--ki-text)', lineHeight: 1.7 }}>{ex.pitch}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{
        padding: '10px 14px', borderRadius: 8, marginBottom: 14,
        background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)',
        fontSize: 12, color: '#92400e', lineHeight: 1.6,
      }}>
        🎤 <strong>Jetzt laut üben:</strong> Lies den Pitch dreimal laut vor — einmal vor dem Spiegel, einmal aufgenommen. Er muss sich wie Überzeugung anfühlen, nicht wie Vortrag.
      </div>

      {!saved ? (
        <button onClick={handleSave} className="btn btn-primary" disabled={pitch.trim().length < 20} style={{ width: '100%' }}>
          Pitch speichern →
        </button>
      ) : (
        <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600, textAlign: 'center' }}>
          ✓ Pitch gespeichert — du startest in Modul 4 damit
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// ARGUMENTS BUILDER — Lesson 3.3
// ─────────────────────────────────────────────────────────────────────
export function ArgumentsBuilderWidget({ weakArguments, soWhatExamples, onSave }) {
  const stored = loadGehaltData();
  const [args, setArgs] = useState(stored.top3Arguments || ['', '', '']);
  const [saved, setSaved] = useState(!!(stored.top3Arguments?.some(a => a.length > 10)));

  function handleChange(i, val) {
    const next = [...args];
    next[i] = val;
    setArgs(next);
    setSaved(false);
  }

  const isValid = args.filter(a => a.trim().length > 10).length >= 1;

  function handleSave() {
    saveGehaltData({ top3Arguments: args });
    setSaved(true);
    if (onSave) onSave();
  }

  return (
    <div className="card" style={{ background: 'var(--ki-bg-alt)', border: 'none', marginBottom: 24 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
        Deine Top-3 Argumente mit Zahl
      </div>
      <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 12, lineHeight: 1.6 }}>
        Jedes Argument braucht eine Zahl und besteht den So-what-Test: Was hat es dem Unternehmen gebracht?
      </div>

      {/* Weak argument examples */}
      <div style={{
        padding: '10px 14px', borderRadius: 8, marginBottom: 14,
        background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', marginBottom: 8 }}>Diese Argumente wirken nie:</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {weakArguments.map((w, i) => (
            <div key={i} style={{ fontSize: 12, color: '#dc2626', display: 'flex', gap: 6 }}>
              <span>✗</span> <span style={{ textDecoration: 'line-through', opacity: 0.7 }}>{w}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 14 }}>
        {[0, 1, 2].map(i => (
          <div key={i}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-secondary)', display: 'block', marginBottom: 6 }}>
              Argument {i + 1}
            </label>
            <textarea
              className="input"
              value={args[i]}
              onChange={e => handleChange(i, e.target.value)}
              rows={2}
              placeholder={
                i === 0
                  ? 'z. B. "Ich habe den Beschaffungsprozess optimiert — Kosten um 15 % gesenkt (60.000 €/Jahr Einsparung)."'
                  : i === 1
                  ? 'z. B. "Ich leite seit 6 Monaten 3 Junior-Mitarbeiter — sind jetzt eigenständig produktiv."'
                  : 'z. B. "Ich habe das ERP-Rollout 3 Wochen früher abgeschlossen — 45.000 € Beraterkosten gespart."'
              }
              disabled={saved}
              style={{ resize: 'none', fontSize: 13, lineHeight: 1.6 }}
            />
          </div>
        ))}
      </div>

      {!saved ? (
        <button onClick={handleSave} className="btn btn-primary" disabled={!isValid} style={{ width: '100%' }}>
          Argumente speichern →
        </button>
      ) : (
        <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600, textAlign: 'center' }}>
          ✓ Argumente gespeichert — sie werden in Simulation 4.5 getestet
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// STRATEGY PICKER — Lesson 3.4
// ─────────────────────────────────────────────────────────────────────
export function StrategyPickerWidget({ strategies, batnaOptions, onSave }) {
  const stored = loadGehaltData();
  const [chosen, setChosen] = useState(stored.strategy || null);
  const [batna, setBatna] = useState(stored.batna || []);
  const [saved, setSaved] = useState(!!stored.strategy);

  function toggleBatna(opt) {
    if (saved) return;
    setBatna(prev => prev.includes(opt) ? prev.filter(b => b !== opt) : [...prev, opt]);
  }

  function handleSave() {
    if (!chosen) return;
    saveGehaltData({ strategy: chosen, batna });
    setSaved(true);
    if (onSave) onSave();
  }

  return (
    <div className="card" style={{ background: 'var(--ki-bg-alt)', border: 'none', marginBottom: 24 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
        Deine Verhandlungsstrategie
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {Object.entries(strategies).map(([key, s]) => {
          const isSelected = chosen === key;
          return (
            <div
              key={key}
              onClick={() => !saved && setChosen(key)}
              style={{
                padding: '16px 14px', borderRadius: 12, cursor: saved ? 'default' : 'pointer',
                border: `2px solid ${isSelected ? 'var(--ki-red)' : 'var(--ki-border)'}`,
                background: isSelected ? 'rgba(204,20,38,0.04)' : 'var(--ki-card)',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, color: isSelected ? 'var(--ki-red)' : 'var(--ki-text)', marginBottom: 6 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                {s.description}
              </div>
              <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', fontStyle: 'italic' }}>
                Wann: {s.when}
              </div>
            </div>
          );
        })}
      </div>

      {chosen && (
        <div style={{
          padding: '12px 14px', borderRadius: 8, marginBottom: 16,
          background: 'rgba(37,99,235,0.04)', border: '1px solid rgba(37,99,235,0.12)',
          fontSize: 13, color: '#1d4ed8', lineHeight: 1.7,
        }}>
          <strong>Dein Einstiegssatz:</strong> {strategies[chosen]?.script}
        </div>
      )}

      {/* BATNA */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-text)', marginBottom: 6 }}>
          Dein Plan B: Was verhandelst du, wenn Gehalt scheitert?
        </div>
        <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)', marginBottom: 10, lineHeight: 1.5 }}>
          Wähle 1–3 Alternativen, die du im Hinterkopf hast (kosten das Unternehmen meist weniger als eine Gehaltserhöhung).
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {batnaOptions.map((opt, i) => {
            const isChecked = batna.includes(opt);
            return (
              <label
                key={i}
                style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: saved ? 'default' : 'pointer' }}
                onClick={() => toggleBatna(opt)}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                  border: `2px solid ${isChecked ? 'var(--ki-red)' : 'var(--ki-border)'}`,
                  background: isChecked ? 'var(--ki-red)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isChecked && <span style={{ color: 'white', fontSize: 10, fontWeight: 700 }}>✓</span>}
                </div>
                <span style={{ fontSize: 13, color: 'var(--ki-text)', lineHeight: 1.5 }}>{opt}</span>
              </label>
            );
          })}
        </div>
      </div>

      {!saved ? (
        <button onClick={handleSave} className="btn btn-primary" disabled={!chosen} style={{ width: '100%' }}>
          Strategie festlegen →
        </button>
      ) : (
        <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600, textAlign: 'center' }}>
          ✓ Strategie gespeichert — ab Modul 4 geht es in die Übung
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// EMAIL TEMPLATE — Lesson 5.1
// ─────────────────────────────────────────────────────────────────────
export function EmailTemplateWidget({ template }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(template).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div className="card" style={{ background: 'var(--ki-bg-alt)', border: 'none', marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Bestätigungs-E-Mail Vorlage
        </div>
        <button
          onClick={handleCopy}
          className="btn btn-secondary"
          style={{ fontSize: 12, padding: '6px 14px' }}
        >
          {copied ? '✓ Kopiert!' : '📋 Kopieren'}
        </button>
      </div>
      <pre style={{
        background: 'var(--ki-card)', borderRadius: 10, padding: '16px 18px',
        fontSize: 13, lineHeight: 1.8, color: 'var(--ki-text)',
        whiteSpace: 'pre-wrap', fontFamily: 'inherit',
        border: '1px solid var(--ki-border)',
      }}>
        {template}
      </pre>
      <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginTop: 10 }}>
        💡 Sende diese Mail noch am selben Tag — innerhalb von 2 Stunden.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// FINAL ASSESSMENT — Lesson 5.2
// ─────────────────────────────────────────────────────────────────────
export function FinalAssessmentWidget({ onSave }) {
  const stored = loadGehaltData();
  const before = stored.selfAssessmentBefore;
  const [after, setAfter] = useState(stored.selfAssessmentAfter);
  const [saved, setSaved] = useState(stored.selfAssessmentAfter !== undefined);

  const sliderLabels = {
    1: 'Ich vermeide Gehaltsgespräche komplett',
    2: 'Ich denke drüber nach, traue mich aber nicht',
    3: 'Ich habe es versucht, aber ohne echte Strategie',
    4: 'Ich verhandle, könnte aber besser sein',
    5: 'Ich gehe vorbereitet und selbstbewusst rein',
  };

  function handleSave() {
    if (after === undefined) return;
    saveGehaltData({ selfAssessmentAfter: after });
    setSaved(true);
    if (onSave) onSave();
  }

  const improvement = after !== undefined && before !== undefined ? after - before : null;

  return (
    <div className="card" style={{ background: 'var(--ki-bg-alt)', border: 'none', marginBottom: 24 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
        Kursabschluss — Dein Fortschritt
      </div>

      {before !== undefined && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          <div style={{ flex: 1, padding: '12px 14px', borderRadius: 10, background: 'var(--ki-card)', border: '1px solid var(--ki-border)', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', marginBottom: 4 }}>Vorher</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--ki-text-secondary)' }}>{before}</div>
            <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)' }}>{sliderLabels[before]?.slice(0, 25)}…</div>
          </div>
          {saved && after !== undefined && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: 20 }}>→</div>
              <div style={{ flex: 1, padding: '12px 14px', borderRadius: 10, background: improvement > 0 ? 'rgba(34,197,94,0.06)' : 'var(--ki-card)', border: `1px solid ${improvement > 0 ? 'rgba(34,197,94,0.2)' : 'var(--ki-border)'}`, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', marginBottom: 4 }}>Nachher</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: improvement > 0 ? '#16a34a' : 'var(--ki-text)' }}>{after}</div>
                {improvement > 0 && <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 700 }}>+{improvement} Stufe{improvement > 1 ? 'n' : ''} ↑</div>}
              </div>
            </>
          )}
        </div>
      )}

      {!saved && (
        <>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-text)', marginBottom: 10 }}>
            Wie selbstbewusst gehst du jetzt in ein Gehaltsgespräch?
          </div>
          {after !== undefined && (
            <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 12 }}>
              {sliderLabels[after]}
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            {[1, 2, 3, 4, 5].map(v => (
              <button
                key={v}
                onClick={() => setAfter(v)}
                style={{
                  flex: 1, height: 44, borderRadius: 10, border: 'none',
                  background: after !== undefined && v <= after ? '#16a34a' : 'var(--ki-border)',
                  color: after !== undefined && v <= after ? 'white' : 'var(--ki-text-tertiary)',
                  fontWeight: 700, fontSize: 16, cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {v}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ki-text-tertiary)', marginBottom: 16 }}>
            <span>Vermeide es</span>
            <span>Profi-Verhandler</span>
          </div>
          <button onClick={handleSave} className="btn btn-primary" disabled={after === undefined} style={{ width: '100%' }}>
            Kurs abschließen →
          </button>
        </>
      )}

      {saved && (
        <div style={{
          padding: '16px 18px', borderRadius: 12,
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          color: 'white', textAlign: 'center',
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🎯</div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Kurs abgeschlossen</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
            Du hast die Angst benannt, deinen Marktwert ermittelt, deinen Pitch formuliert und unter Druck geübt.
          </div>
          <div style={{ marginTop: 16, fontSize: 15, fontWeight: 700, color: '#f59e0b' }}>
            Geh raus und hol dir, was dir zusteht.
          </div>
        </div>
      )}
    </div>
  );
}
