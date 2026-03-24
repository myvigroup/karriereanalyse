'use client';

import { useState } from 'react';

const AMPEL = {
  gruen: { label: 'Gruen', maxTage: 30, farbe: '#10B981' },
  gelb: { label: 'Gelb', maxTage: 90, farbe: '#F59E0B' },
  rot: { label: 'Rot', maxTage: Infinity, farbe: '#EF4444' },
};

function getDaysSince(dateStr) {
  if (!dateStr) return 999;
  const d = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - d) / (1000 * 60 * 60 * 24));
}

function getAmpelColor(dateStr) {
  const days = getDaysSince(dateStr);
  if (days <= 30) return AMPEL.gruen;
  if (days <= 90) return AMPEL.gelb;
  return AMPEL.rot;
}

export default function CRMBuilder({ onComplete }) {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: '', company: '', lastContact: '', notes: '', deepContext: '' });
  const [expandedId, setExpandedId] = useState(null);
  const [touchpointSent, setTouchpointSent] = useState(new Set());

  const addContact = () => {
    if (!form.name.trim()) return;
    setContacts((prev) => [
      ...prev,
      { ...form, id: Date.now(), name: form.name.trim(), company: form.company.trim() },
    ]);
    setForm({ name: '', company: '', lastContact: '', notes: '', deepContext: '' });
  };

  const removeContact = (id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const sendTouchpoint = (id) => {
    setTouchpointSent((prev) => new Set([...prev, id]));
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, lastContact: new Date().toISOString().split('T')[0] } : c))
    );
    setTimeout(() => setTouchpointSent((prev) => { const n = new Set(prev); n.delete(id); return n; }), 2000);
  };

  const hasMinContacts = contacts.length >= 3;

  const stats = {
    gruen: contacts.filter((c) => getAmpelColor(c.lastContact) === AMPEL.gruen).length,
    gelb: contacts.filter((c) => getAmpelColor(c.lastContact) === AMPEL.gelb).length,
    rot: contacts.filter((c) => getAmpelColor(c.lastContact) === AMPEL.rot).length,
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Dein Kontakt-CRM</h2>
      <p style={styles.subtitle}>
        Das Ampel-System: Gruen ({'<'}30 Tage), Gelb (30-90 Tage), Rot ({'>'}90 Tage). Pflege deine wichtigsten Beziehungen systematisch.
      </p>

      {/* Ampel legend */}
      <div style={styles.ampelRow}>
        {Object.entries(AMPEL).map(([key, val]) => (
          <div key={key} style={{ ...styles.ampelItem, background: `${val.farbe}15`, borderColor: `${val.farbe}40` }}>
            <div style={{ ...styles.ampelDot, background: val.farbe }} />
            <span style={{ fontSize: 13, color: 'var(--ki-text, #333)' }}>
              {val.label} {key === 'gruen' ? '(<30 Tage)' : key === 'gelb' ? '(30-90)' : '(90+)'}
            </span>
            <strong style={{ marginLeft: 'auto', color: val.farbe }}>{stats[key]}</strong>
          </div>
        ))}
      </div>

      {/* Add form */}
      <div className="card" style={styles.formCard}>
        <h3 style={styles.formTitle}>Kontakt hinzufuegen</h3>
        <div style={styles.formGrid}>
          <input
            type="text" placeholder="Name" value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            style={styles.input}
          />
          <input
            type="text" placeholder="Firma" value={form.company}
            onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
            style={styles.input}
          />
          <div style={styles.dateRow}>
            <label style={styles.dateLabel}>Letzter Kontakt:</label>
            <input
              type="date" value={form.lastContact}
              onChange={(e) => setForm((p) => ({ ...p, lastContact: e.target.value }))}
              style={styles.dateInput}
            />
          </div>
          <input
            type="text" placeholder="Notizen (z.B. letztes Thema)" value={form.notes}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            style={styles.input}
          />
          <input
            type="text" placeholder="Deep Context (Geburtstag, Hobbies, Kinder...)" value={form.deepContext}
            onChange={(e) => setForm((p) => ({ ...p, deepContext: e.target.value }))}
            style={styles.input}
          />
        </div>
        <button className="btn btn-primary" onClick={addContact} style={styles.addBtn}>
          Kontakt hinzufuegen
        </button>
      </div>

      {/* Contact cards */}
      {contacts.length > 0 && (
        <div style={styles.cardList}>
          {contacts
            .sort((a, b) => getDaysSince(b.lastContact) - getDaysSince(a.lastContact))
            .map((contact) => {
              const ampel = getAmpelColor(contact.lastContact);
              const days = getDaysSince(contact.lastContact);
              const isExpanded = expandedId === contact.id;
              return (
                <div
                  key={contact.id} className="card"
                  style={{ ...styles.contactCard, borderLeft: `4px solid ${ampel.farbe}` }}
                  onClick={() => setExpandedId(isExpanded ? null : contact.id)}
                >
                  <div style={styles.cardHeader}>
                    <div style={{ ...styles.ampelDot, background: ampel.farbe, width: 12, height: 12 }} />
                    <div style={styles.cardInfo}>
                      <strong style={styles.cardName}>{contact.name}</strong>
                      {contact.company && <span style={styles.cardCompany}>{contact.company}</span>}
                    </div>
                    <div style={styles.cardDays}>
                      <span style={{ color: ampel.farbe, fontWeight: 700 }}>
                        {days === 999 ? 'Nie' : `${days}d`}
                      </span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={styles.expandedContent}>
                      {contact.notes && (
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>Notizen:</span>
                          <span style={styles.detailValue}>{contact.notes}</span>
                        </div>
                      )}
                      {contact.deepContext && (
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>Deep Context:</span>
                          <span style={styles.detailValue}>{contact.deepContext}</span>
                        </div>
                      )}
                      <div style={styles.actionRow}>
                        <button
                          className="btn btn-secondary"
                          style={styles.touchpointBtn}
                          onClick={(e) => { e.stopPropagation(); sendTouchpoint(contact.id); }}
                        >
                          {touchpointSent.has(contact.id) ? 'Touchpoint gesendet!' : 'Touchpoint senden'}
                        </button>
                        <button
                          style={styles.deleteBtn}
                          onClick={(e) => { e.stopPropagation(); removeContact(contact.id); }}
                        >
                          Entfernen
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {/* Progress */}
      <div style={styles.progressBarOuter}>
        <div style={{ ...styles.progressBarInner, width: `${Math.min((contacts.length / 3) * 100, 100)}%` }} />
      </div>
      <p style={styles.progressText}>{contacts.length} von 3 Kontakten (Minimum)</p>

      {hasMinContacts && (
        <div style={styles.completeSection}>
          <p style={styles.completeText}>
            Dein CRM hat {contacts.length} Kontakte. Nutze das Ampel-System, um regelmaessig Touchpoints zu setzen!
          </p>
          <button className="btn btn-primary" onClick={() => onComplete?.()} style={styles.completeBtn}>
            Weiter
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { fontFamily: 'Instrument Sans, sans-serif', maxWidth: 640, margin: '0 auto', padding: 16 },
  title: { fontSize: 24, fontWeight: 700, color: 'var(--ki-text, #1a1a1a)', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#888', marginBottom: 16, lineHeight: 1.5 },
  ampelRow: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 },
  ampelItem: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px',
    borderRadius: 8, border: '1px solid', fontSize: 14,
  },
  ampelDot: { width: 16, height: 16, borderRadius: '50%', flexShrink: 0 },
  formCard: { padding: 16, marginBottom: 20 },
  formTitle: { fontSize: 16, fontWeight: 700, color: 'var(--ki-text, #1a1a1a)', margin: '0 0 12px', fontFamily: 'Instrument Sans, sans-serif' },
  formGrid: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 },
  input: {
    padding: '10px 14px', border: '1px solid #ddd', borderRadius: 8,
    fontSize: 15, fontFamily: 'Instrument Sans, sans-serif',
    background: 'var(--ki-bg, #fff)', color: 'var(--ki-text, #1a1a1a)', outline: 'none',
  },
  dateRow: { display: 'flex', alignItems: 'center', gap: 8 },
  dateLabel: { fontSize: 14, color: '#888', whiteSpace: 'nowrap' },
  dateInput: {
    flex: 1, padding: '10px 14px', border: '1px solid #ddd', borderRadius: 8,
    fontSize: 14, fontFamily: 'Instrument Sans, sans-serif',
    background: 'var(--ki-bg, #fff)', color: 'var(--ki-text, #1a1a1a)',
  },
  addBtn: { padding: '10px 24px', fontSize: 15 },
  cardList: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 },
  contactCard: { padding: 14, cursor: 'pointer', transition: 'box-shadow 0.2s' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: 10 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 16, color: 'var(--ki-text, #1a1a1a)', display: 'block' },
  cardCompany: { fontSize: 13, color: '#888' },
  cardDays: { textAlign: 'right', fontSize: 14 },
  expandedContent: { marginTop: 12, paddingTop: 12, borderTop: '1px solid #eee' },
  detailRow: { marginBottom: 8, fontSize: 14 },
  detailLabel: { fontWeight: 700, color: 'var(--ki-text, #555)', marginRight: 6 },
  detailValue: { color: 'var(--ki-text, #666)' },
  actionRow: { display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  touchpointBtn: { fontSize: 13, padding: '6px 16px' },
  deleteBtn: {
    background: 'none', border: '1px solid #ddd', borderRadius: 8,
    padding: '6px 14px', fontSize: 13, color: '#999', cursor: 'pointer',
    fontFamily: 'Instrument Sans, sans-serif',
  },
  progressBarOuter: { height: 4, background: '#e0e0e0', borderRadius: 2, marginBottom: 6, overflow: 'hidden' },
  progressBarInner: { height: '100%', background: 'var(--ki-red, #CC1426)', borderRadius: 2, transition: 'width 0.4s ease' },
  progressText: { fontSize: 12, color: '#aaa', marginBottom: 20 },
  completeSection: { textAlign: 'center', marginTop: 24, padding: 24, background: 'rgba(204, 20, 38, 0.03)', borderRadius: 16 },
  completeText: { fontSize: 16, color: 'var(--ki-text, #333)', marginBottom: 16, lineHeight: 1.5 },
  completeBtn: { fontSize: 18, padding: '14px 40px' },
};
