'use client';
import { useState, useEffect, useTransition } from 'react';
import Icon from '@/components/ui/Icon';
import { saveCoach, deleteCoach, toggleCoachActive } from './actions';

// Seminar-IDs aus MasterclassClient.js (sollten irgendwann auch aus DB kommen).
const SEMINAR_OPTIONS = [
  { id: 'sem-typgerecht',   label: 'Typgerechtes Lernen' },
  { id: 'sem-worklife',     label: 'Work-Life-Balance' },
  { id: 'sem-leadership',   label: 'Personal Leadership' },
  { id: 'sem-speedreading', label: 'Speedreading' },
  { id: 'sem-achtsamkeit',  label: 'Achtsamkeit' },
  { id: 'sem-rhetorik',     label: 'Rhetorik, Dialektik, Kinesik' },
  { id: 'sem-motivation',   label: 'Selbstmotivation' },
  { id: 'sem-kommunikation',label: 'Kommunikation' },
  { id: 'sem-konflikt',     label: 'Konfliktmanagement' },
  { id: 'sem-homeoffice',   label: 'Arbeiten im Home Office' },
  { id: 'sem-prioritaeten', label: 'Prioritätenmanagement' },
  { id: 'sem-networking',   label: 'Networking' },
  { id: 'sem-knigge',       label: 'Business-Knigge' },
];

const MASTERCLASS_OPTIONS = [
  { id: 'soon-gehaltsverhandlung',      label: 'Gehaltsverhandlung' },
  { id: 'soon-vg-fragen',               label: 'Kritische Fragen im VG' },
  { id: 'soon-karriere-grundlagen',     label: 'Karriereseminar Grundlagen' },
  { id: 'soon-weiche-gehaltsfaktoren',  label: 'Weiche Gehaltsfaktoren' },
  { id: 'soon-finanzielle-intelligenz', label: 'Finanzielle Intelligenz' },
];

const GRADIENT_PRESETS = [
  { label: 'Rot (Karriere-Institut)', value: 'linear-gradient(135deg, #8b1832 0%, #4a0a14 100%)' },
  { label: 'Dunkelblau',              value: 'linear-gradient(135deg, #1d3a5f 0%, #0c1f36 100%)' },
  { label: 'Mittelblau',              value: 'linear-gradient(135deg, #1d4e89 0%, #0f2e4f 100%)' },
  { label: 'Grün',                    value: 'linear-gradient(135deg, #1d4d2e 0%, #0e2818 100%)' },
  { label: 'Smaragd',                 value: 'linear-gradient(135deg, #2d5d3a 0%, #163420 100%)' },
  { label: 'Lila',                    value: 'linear-gradient(135deg, #5d3a91 0%, #3a2266 100%)' },
  { label: 'Magenta',                 value: 'linear-gradient(135deg, #b8336a 0%, #6b1d3c 100%)' },
  { label: 'Orange/Braun',            value: 'linear-gradient(135deg, #8a4a14 0%, #4d2906 100%)' },
  { label: 'Anthrazit',               value: 'linear-gradient(135deg, #2d3e50 0%, #1a2533 100%)' },
];

const EMPTY_COACH = {
  id: '',
  name: '',
  role: '',
  title: '',
  initials: '',
  gradient: GRADIENT_PRESETS[0].value,
  photoUrl: '',
  status: 'available',
  sinceYear: new Date().getFullYear(),
  experience: '',
  rating: 5.0,
  sessionCount: 0,
  responseTime: '< 24 Std',
  location: '',
  languages: ['Deutsch'],
  short: '',
  bio: '',
  successStory: '',
  specialties: [],
  industries: [],
  slots: [],
  seminarIds: [],
  masterclassIds: [],
  external: false,
  poweredBy: '',
  isActive: true,
  sortOrder: 100,
};

export default function AdminCoachesClient({ initialCoaches }) {
  const [coaches, setCoaches] = useState(initialCoaches);
  const [editing, setEditing] = useState(null); // Coach being edited (or {} for new)
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState(null);

  // ESC schließt Modal + Scroll-Lock
  useEffect(() => {
    if (!editing) return;
    const onKey = (e) => { if (e.key === 'Escape') setEditing(null); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [editing]);

  function openNew() {
    setEditing({ ...EMPTY_COACH });
  }

  function openEdit(coach) {
    setEditing({ ...coach });
  }

  function showToast(text, kind = 'ok') {
    setToast({ text, kind });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleSave() {
    if (!editing.id || !editing.name || !editing.initials) {
      showToast('Bitte ID, Name und Initialen ausfüllen.', 'error');
      return;
    }
    try {
      const { coach: saved } = await saveCoach(editing);
      setCoaches(prev => {
        const idx = prev.findIndex(c => c.id === saved.id);
        const ui = {
          ...editing,
          // sicherstellen dass DB-Werte siegen
          isActive: saved.is_active,
        };
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = ui;
          return copy;
        }
        return [...prev, ui].sort((a, b) => a.sortOrder - b.sortOrder);
      });
      setEditing(null);
      showToast('Coach gespeichert.', 'ok');
    } catch (e) {
      showToast('Fehler: ' + e.message, 'error');
    }
  }

  async function handleDelete(coach) {
    if (!confirm(`„${coach.name}" wirklich löschen? Das kann nicht rückgängig gemacht werden.`)) return;
    try {
      await deleteCoach(coach.id);
      setCoaches(prev => prev.filter(c => c.id !== coach.id));
      showToast('Coach gelöscht.', 'ok');
    } catch (e) {
      showToast('Fehler: ' + e.message, 'error');
    }
  }

  async function handleToggleActive(coach) {
    try {
      await toggleCoachActive(coach.id, !coach.isActive);
      setCoaches(prev => prev.map(c =>
        c.id === coach.id ? { ...c, isActive: !c.isActive } : c
      ));
      showToast(coach.isActive ? 'Coach deaktiviert.' : 'Coach aktiviert.', 'ok');
    } catch (e) {
      showToast('Fehler: ' + e.message, 'error');
    }
  }

  function updateField(field, value) {
    setEditing(prev => ({ ...prev, [field]: value }));
  }

  function toggleArrayItem(field, item) {
    setEditing(prev => {
      const arr = prev[field] || [];
      const next = arr.includes(item)
        ? arr.filter(x => x !== item)
        : [...arr, item];
      return { ...prev, [field]: next };
    });
  }

  return (
    <div className="admin-coaches">
      <div className="admin-pageheader">
        <div>
          <div className="title-kicker"><span className="pulse" /> Admin · Coaches</div>
          <h1 className="page-title">Coaches verwalten <span className="faded">{coaches.length}</span></h1>
          <p className="page-sub">
            Alle Coach-Profile zentral pflegen. Änderungen sind sofort im Mitgliederportal sichtbar.
          </p>
        </div>
        <button className="admin-cta-primary" type="button" onClick={openNew}>
          <Icon name="plus" size={14} stroke={2} /> Neuer Coach
        </button>
      </div>

      <div className="admin-coaches-grid">
        {coaches.map(c => (
          <div key={c.id} className={`admin-coach-row ${!c.isActive ? 'inactive' : ''}`}>
            <div className="admin-coach-avatar" style={{ background: c.gradient }}>
              {c.photoUrl ? <img src={c.photoUrl} alt={c.name} /> : <span>{c.initials}</span>}
            </div>
            <div className="admin-coach-info">
              <div className="admin-coach-name">
                {c.name}
                {!c.isActive && <span className="admin-coach-badge inactive">Inaktiv</span>}
                {c.external && <span className="admin-coach-badge ext">extern</span>}
              </div>
              <div className="admin-coach-role">{c.role}</div>
              <div className="admin-coach-meta">
                <span>{c.location || '—'}</span>
                <span>·</span>
                <span>{c.seminarIds.length} Live-Seminare</span>
                <span>·</span>
                <span>{c.masterclassIds.length} Masterclasses</span>
                <span>·</span>
                <span>★ {c.rating.toFixed(1)}</span>
              </div>
            </div>
            <div className="admin-coach-actions">
              <button type="button" className="admin-icon-btn" onClick={() => handleToggleActive(c)}
                      title={c.isActive ? 'Deaktivieren' : 'Aktivieren'}>
                <Icon name={c.isActive ? 'eye' : 'eye-off'} size={16} stroke={1.7} />
              </button>
              <button type="button" className="admin-action-btn" onClick={() => openEdit(c)}>
                Bearbeiten
              </button>
              <button type="button" className="admin-icon-btn danger" onClick={() => handleDelete(c)}
                      title="Löschen">
                <Icon name="x" size={16} stroke={1.8} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <CoachEditModal
          coach={editing}
          isPending={isPending}
          onClose={() => setEditing(null)}
          onSave={handleSave}
          onChange={updateField}
          onToggleArray={toggleArrayItem}
        />
      )}

      {toast && (
        <div className={`admin-toast ${toast.kind}`}>{toast.text}</div>
      )}
    </div>
  );
}

function CoachEditModal({ coach, isPending, onClose, onSave, onChange, onToggleArray }) {
  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-head">
          <h2>{coach.id ? 'Coach bearbeiten' : 'Neuer Coach'}</h2>
          <button onClick={onClose} className="admin-modal-close" type="button">
            <Icon name="x" size={18} stroke={2} />
          </button>
        </div>

        <div className="admin-modal-body">
          <Section title="Basis-Daten">
            <Row>
              <Field label="ID (slug) *" hint="Eindeutig, lowercase mit Bindestrichen. Nach Erstellung nicht ändern.">
                <input value={coach.id} onChange={e => onChange('id', e.target.value)}
                       placeholder="z.B. max-mustermann" disabled={!!coach.id && coach.id === coach.id} />
              </Field>
              <Field label="Initialen *" hint="2-3 Buchstaben für Avatar-Bubble">
                <input value={coach.initials} onChange={e => onChange('initials', e.target.value)}
                       placeholder="MM" maxLength={4} />
              </Field>
            </Row>
            <Row>
              <Field label="Voller Name *">
                <input value={coach.name} onChange={e => onChange('name', e.target.value)}
                       placeholder="Max Mustermann" />
              </Field>
              <Field label="Sortier-Reihenfolge" hint="Niedriger = weiter vorne">
                <input type="number" value={coach.sortOrder}
                       onChange={e => onChange('sortOrder', parseInt(e.target.value) || 100)} />
              </Field>
            </Row>
            <Row>
              <Field label="Rolle (auf Coach-Karte sichtbar)">
                <input value={coach.role} onChange={e => onChange('role', e.target.value)}
                       placeholder="z.B. Karriere-Coach · Hauptreferentin" />
              </Field>
              <Field label="Titel/Position (im Modal sichtbar)">
                <input value={coach.title} onChange={e => onChange('title', e.target.value)}
                       placeholder="z.B. Lizenzierter Coach & Referent" />
              </Field>
            </Row>
            <Row>
              <Field label="Coach seit (Jahr)">
                <input type="number" value={coach.sinceYear || ''}
                       onChange={e => onChange('sinceYear', parseInt(e.target.value) || null)} />
              </Field>
              <Field label="Erfahrung">
                <input value={coach.experience} onChange={e => onChange('experience', e.target.value)}
                       placeholder="z.B. 10+ J. Erfahrung" />
              </Field>
            </Row>
            <Row>
              <Field label="Standort">
                <input value={coach.location} onChange={e => onChange('location', e.target.value)} />
              </Field>
              <Field label="Sprachen (Komma-getrennt)">
                <input value={(coach.languages || []).join(', ')}
                       onChange={e => onChange('languages', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
              </Field>
            </Row>
          </Section>

          <Section title="Avatar & Branding">
            <Row>
              <Field label="Foto-URL (optional)" hint="Falls leer → Initial-Bubble mit Gradient">
                <input value={coach.photoUrl || ''} onChange={e => onChange('photoUrl', e.target.value)}
                       placeholder="https://..." />
              </Field>
              <Field label="Status">
                <select value={coach.status} onChange={e => onChange('status', e.target.value)}>
                  <option value="available">Verfügbar</option>
                  <option value="busy">Beschäftigt</option>
                </select>
              </Field>
            </Row>
            <Field label="Avatar-Gradient">
              <div className="admin-gradient-picker">
                {GRADIENT_PRESETS.map(g => (
                  <button key={g.value} type="button"
                          className={`admin-gradient-swatch ${coach.gradient === g.value ? 'on' : ''}`}
                          style={{ background: g.value }}
                          title={g.label}
                          onClick={() => onChange('gradient', g.value)} />
                ))}
              </div>
            </Field>
          </Section>

          <Section title="Bio & Pitch">
            <Field label="Kurz-Pitch (1 Satz für Karte)">
              <input value={coach.short} onChange={e => onChange('short', e.target.value)}
                     placeholder="Spezialistin für Rhetorik und Karriereeinstieg." />
            </Field>
            <Field label="Bio (3-5 Sätze für Modal)">
              <textarea value={coach.bio} onChange={e => onChange('bio', e.target.value)} rows={5} />
            </Field>
            <Field label="Erfolgs-Story (optional)">
              <textarea value={coach.successStory} onChange={e => onChange('successStory', e.target.value)} rows={3} />
            </Field>
          </Section>

          <Section title="Schwerpunkte & Branchen">
            <Field label="Schwerpunkte (Komma-getrennt)">
              <input value={(coach.specialties || []).join(', ')}
                     onChange={e => onChange('specialties', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
            </Field>
            <Field label="Branchen (Komma-getrennt)">
              <input value={(coach.industries || []).join(', ')}
                     onChange={e => onChange('industries', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
            </Field>
          </Section>

          <Section title="Coach hält welche Inhalte?">
            <Field label="Live-Seminare">
              <div className="admin-checkbox-grid">
                {SEMINAR_OPTIONS.map(s => (
                  <label key={s.id} className="admin-checkbox">
                    <input type="checkbox" checked={coach.seminarIds.includes(s.id)}
                           onChange={() => onToggleArray('seminarIds', s.id)} />
                    {s.label}
                  </label>
                ))}
              </div>
            </Field>
            <Field label="Masterclasses (aufgenommen/in Planung)">
              <div className="admin-checkbox-grid">
                {MASTERCLASS_OPTIONS.map(s => (
                  <label key={s.id} className="admin-checkbox">
                    <input type="checkbox" checked={coach.masterclassIds.includes(s.id)}
                           onChange={() => onToggleArray('masterclassIds', s.id)} />
                    {s.label}
                  </label>
                ))}
              </div>
            </Field>
          </Section>

          <Section title="Statistik & Status">
            <Row>
              <Field label="Rating (1.0–5.0)">
                <input type="number" step="0.1" min="1" max="5" value={coach.rating}
                       onChange={e => onChange('rating', parseFloat(e.target.value) || 5)} />
              </Field>
              <Field label="Anzahl Sessions">
                <input type="number" value={coach.sessionCount}
                       onChange={e => onChange('sessionCount', parseInt(e.target.value) || 0)} />
              </Field>
              <Field label="Antwortzeit">
                <input value={coach.responseTime} onChange={e => onChange('responseTime', e.target.value)}
                       placeholder="< 4 Std" />
              </Field>
            </Row>
            <Row>
              <Field label="">
                <label className="admin-checkbox">
                  <input type="checkbox" checked={coach.external}
                         onChange={e => onChange('external', e.target.checked)} />
                  Externer Partner
                </label>
              </Field>
              {coach.external && (
                <Field label="Powered by (Partner-Org)">
                  <input value={coach.poweredBy || ''} onChange={e => onChange('poweredBy', e.target.value)}
                         placeholder="z.B. IFI · Institut für Finanzielle Intelligenz" />
                </Field>
              )}
              <Field label="">
                <label className="admin-checkbox">
                  <input type="checkbox" checked={coach.isActive}
                         onChange={e => onChange('isActive', e.target.checked)} />
                  Aktiv (im Frontend sichtbar)
                </label>
              </Field>
            </Row>
          </Section>
        </div>

        <div className="admin-modal-foot">
          <button type="button" onClick={onClose} className="admin-action-btn">Abbrechen</button>
          <button type="button" onClick={onSave} className="admin-cta-primary" disabled={isPending}>
            {isPending ? 'Speichere …' : 'Speichern'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="admin-form-section">
      <h3>{title}</h3>
      <div className="admin-form-section-body">{children}</div>
    </div>
  );
}

function Row({ children }) {
  return <div className="admin-form-row">{children}</div>;
}

function Field({ label, hint, children }) {
  return (
    <label className="admin-form-field">
      {label && <span className="admin-form-label">{label}</span>}
      {children}
      {hint && <span className="admin-form-hint">{hint}</span>}
    </label>
  );
}
