'use client';

import { useState } from 'react';

const CIRCLES = [
  { id: 'kernteam', label: 'Kernteam', farbe: '#EF4444', beschreibung: '5-8 Personen, denen du wirklich vertraust', ring: 0 },
  { id: 'allies', label: 'Allies', farbe: '#F59E0B', beschreibung: 'Regelmaessige Kontakte, die dich unterstuetzen', ring: 1 },
  { id: 'bruecken', label: 'Bruecken', farbe: '#3B82F6', beschreibung: 'Verbinden dich mit neuen Netzwerken (Weak Ties)', ring: 2 },
  { id: 'schlafende', label: 'Schlafende', farbe: '#8B5CF6', beschreibung: 'Frueehere Kontakte, die eingeschlafen sind', ring: 3 },
  { id: 'wunsch', label: 'Wunsch', farbe: '#10B981', beschreibung: 'Personen, die du gerne kennenlernen wuerdest', ring: 4 },
];

export default function NetzwerkMapBuilder({ onComplete }) {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [selectedCircle, setSelectedCircle] = useState('kernteam');
  const [showMap, setShowMap] = useState(false);

  const addContact = () => {
    if (!name.trim()) return;
    setContacts((prev) => [...prev, { id: Date.now(), name: name.trim(), circle: selectedCircle }]);
    setName('');
  };

  const removeContact = (id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const getCircle = (id) => CIRCLES.find((c) => c.id === id);
  const contactsByCircle = (circleId) => contacts.filter((c) => c.circle === circleId);

  const hasMinContacts = contacts.length >= 5;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Deine Netzwerk-Map</h2>
      <p style={styles.subtitle}>
        Ordne deine Kontakte den 5 Kreisen zu. Fuege mindestens 5 Kontakte hinzu, um fortzufahren.
      </p>

      {/* Circle legend */}
      <div style={styles.legend}>
        {CIRCLES.map((c) => (
          <div key={c.id} style={{ ...styles.legendItem, borderLeft: `3px solid ${c.farbe}` }}>
            <strong style={{ color: c.farbe }}>{c.label}</strong>
            <span style={styles.legendDesc}>{c.beschreibung}</span>
          </div>
        ))}
      </div>

      {/* Add contact form */}
      <div className="card" style={styles.formCard}>
        <h3 style={styles.formTitle}>Kontakt hinzufuegen</h3>
        <div style={styles.formRow}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addContact()}
            placeholder="Name des Kontakts"
            style={styles.input}
          />
          <select
            value={selectedCircle}
            onChange={(e) => setSelectedCircle(e.target.value)}
            style={styles.select}
          >
            {CIRCLES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={addContact} style={styles.addBtn}>
            +
          </button>
        </div>
      </div>

      {/* Toggle view */}
      {contacts.length > 0 && (
        <div style={styles.toggleRow}>
          <button
            className={`btn ${!showMap ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowMap(false)}
            style={styles.toggleBtn}
          >
            Liste
          </button>
          <button
            className={`btn ${showMap ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowMap(true)}
            style={styles.toggleBtn}
          >
            Kreise
          </button>
        </div>
      )}

      {/* List view */}
      {!showMap && contacts.length > 0 && (
        <div style={styles.listView}>
          {CIRCLES.map((circle) => {
            const cContacts = contactsByCircle(circle.id);
            if (cContacts.length === 0) return null;
            return (
              <div key={circle.id} style={styles.circleGroup}>
                <h4 style={{ ...styles.circleLabel, color: circle.farbe }}>
                  {circle.label} ({cContacts.length})
                </h4>
                <div style={styles.contactList}>
                  {cContacts.map((contact) => (
                    <div key={contact.id} style={{ ...styles.contactPill, background: `${circle.farbe}15`, borderColor: `${circle.farbe}40` }}>
                      <span style={styles.contactName}>{contact.name}</span>
                      <button onClick={() => removeContact(contact.id)} style={styles.removeBtn}>x</button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Circle map view */}
      {showMap && contacts.length > 0 && (
        <div style={styles.mapContainer}>
          <div style={styles.mapCenter}>DU</div>
          {CIRCLES.map((circle, ringIdx) => {
            const cContacts = contactsByCircle(circle.id);
            const radius = 60 + ringIdx * 55;
            return (
              <div key={circle.id}>
                <div style={{
                  ...styles.ring,
                  width: radius * 2,
                  height: radius * 2,
                  borderColor: `${circle.farbe}40`,
                }} />
                {cContacts.map((contact, i) => {
                  const angle = (2 * Math.PI * i) / Math.max(cContacts.length, 1) - Math.PI / 2;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  return (
                    <div
                      key={contact.id}
                      style={{
                        ...styles.mapDot,
                        background: circle.farbe,
                        transform: `translate(${x}px, ${y}px)`,
                      }}
                      title={contact.name}
                    >
                      <span style={styles.mapDotText}>{contact.name.charAt(0)}</span>
                      <div style={styles.mapDotTooltip}>{contact.name}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* Stats */}
      {contacts.length > 0 && (
        <div style={styles.statsRow}>
          {CIRCLES.map((c) => (
            <div key={c.id} style={styles.statItem}>
              <div style={{ ...styles.statNumber, color: c.farbe }}>{contactsByCircle(c.id).length}</div>
              <div style={styles.statLabel}>{c.label}</div>
            </div>
          ))}
          <div style={styles.statItem}>
            <div style={{ ...styles.statNumber, color: 'var(--ki-text, #1a1a1a)' }}>{contacts.length}</div>
            <div style={styles.statLabel}>Gesamt</div>
          </div>
        </div>
      )}

      {/* Progress / Complete */}
      <div style={styles.progressBarOuter}>
        <div style={{ ...styles.progressBarInner, width: `${Math.min((contacts.length / 5) * 100, 100)}%` }} />
      </div>
      <p style={styles.progressText}>{contacts.length} von 5 Kontakten (Minimum)</p>

      {hasMinContacts && (
        <div style={styles.completeSection}>
          <p style={styles.completeText}>
            Deine Netzwerk-Map hat {contacts.length} Kontakte. Denke daran: Bruecken-Kontakte sind oft die wertvollsten!
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
  legend: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 },
  legendItem: { padding: '8px 12px', background: '#fafafa', borderRadius: 8, fontSize: 14 },
  legendDesc: { display: 'block', fontSize: 12, color: '#888', marginTop: 2 },
  formCard: { padding: 16, marginBottom: 20 },
  formTitle: { fontSize: 16, fontWeight: 700, color: 'var(--ki-text, #1a1a1a)', margin: '0 0 12px', fontFamily: 'Instrument Sans, sans-serif' },
  formRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  input: {
    flex: 1, minWidth: 150, padding: '10px 14px', border: '1px solid #ddd', borderRadius: 8,
    fontSize: 15, fontFamily: 'Instrument Sans, sans-serif', outline: 'none',
    background: 'var(--ki-bg, #fff)', color: 'var(--ki-text, #1a1a1a)',
  },
  select: {
    padding: '10px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14,
    fontFamily: 'Instrument Sans, sans-serif', background: 'var(--ki-bg, #fff)', color: 'var(--ki-text, #1a1a1a)',
  },
  addBtn: { padding: '10px 18px', fontSize: 18, fontWeight: 700 },
  toggleRow: { display: 'flex', gap: 8, marginBottom: 16 },
  toggleBtn: { padding: '8px 20px', fontSize: 14 },
  listView: { display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 },
  circleGroup: {},
  circleLabel: { fontSize: 15, fontWeight: 700, margin: '0 0 8px', fontFamily: 'Instrument Sans, sans-serif' },
  contactList: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  contactPill: {
    display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
    borderRadius: 20, border: '1px solid', fontSize: 14,
  },
  contactName: { color: 'var(--ki-text, #333)' },
  removeBtn: {
    background: 'none', border: 'none', color: '#aaa', cursor: 'pointer',
    fontSize: 14, fontWeight: 700, padding: '0 2px', lineHeight: 1,
  },
  mapContainer: {
    position: 'relative', width: '100%', height: 500, display: 'flex',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    background: '#fafafa', borderRadius: 16, overflow: 'hidden',
  },
  mapCenter: {
    position: 'absolute', width: 50, height: 50, borderRadius: '50%',
    background: 'var(--ki-red, #CC1426)', color: '#fff', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14,
    zIndex: 10,
  },
  ring: {
    position: 'absolute', borderRadius: '50%', border: '1px dashed',
    top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  },
  mapDot: {
    position: 'absolute', width: 32, height: 32, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
    zIndex: 5, top: '50%', left: '50%', marginTop: -16, marginLeft: -16,
  },
  mapDotText: { pointerEvents: 'none' },
  mapDotTooltip: {
    display: 'none', position: 'absolute', bottom: '110%', left: '50%',
    transform: 'translateX(-50%)', background: '#333', color: '#fff',
    padding: '4px 8px', borderRadius: 4, fontSize: 11, whiteSpace: 'nowrap',
  },
  statsRow: {
    display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center',
    marginBottom: 20, padding: 16, background: '#fafafa', borderRadius: 12,
  },
  statItem: { textAlign: 'center', minWidth: 60 },
  statNumber: { fontSize: 24, fontWeight: 700 },
  statLabel: { fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' },
  progressBarOuter: { height: 4, background: '#e0e0e0', borderRadius: 2, marginBottom: 6, overflow: 'hidden' },
  progressBarInner: { height: '100%', background: 'var(--ki-red, #CC1426)', borderRadius: 2, transition: 'width 0.4s ease' },
  progressText: { fontSize: 12, color: '#aaa', marginBottom: 20 },
  completeSection: { textAlign: 'center', marginTop: 24, padding: 24, background: 'rgba(204, 20, 38, 0.03)', borderRadius: 16 },
  completeText: { fontSize: 16, color: 'var(--ki-text, #333)', marginBottom: 16, lineHeight: 1.5 },
  completeBtn: { fontSize: 18, padding: '14px 40px' },
};
