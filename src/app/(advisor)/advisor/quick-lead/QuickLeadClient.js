'use client';
import { useState, useEffect } from 'react';
import Icon from '@/components/ui/Icon';
import { createQuickLead, deleteQuickLead } from './actions';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function leadStatus(lead) {
  const fb = lead.cv_feedback?.[0];
  if (fb?.status === 'completed') return { label: 'Abgeschlossen', tier: 'good' };
  if (fb?.ai_parsed_at) return { label: 'KI-Analyse fertig', tier: 'mid' };
  if (lead.cv_documents?.length > 0) return { label: 'CV hochgeladen', tier: 'mid' };
  return { label: 'Wartet auf CV-Upload', tier: 'low' };
}

function qrCodeUrl(url) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(url)}&margin=2`;
}

export default function QuickLeadClient({ initialLeads, advisorName, baseUrl }) {
  const [leads, setLeads] = useState(initialLeads);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(null); // Lead just created → show QR + Link
  const [toast, setToast] = useState(null);

  function showToast(text, kind = 'ok') {
    setToast({ text, kind });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.target);
    const result = await createQuickLead(fd);
    setSubmitting(false);
    if (result.error) {
      showToast('Fehler: ' + result.error, 'error');
      return;
    }
    const uploadUrl = `${baseUrl}/cv-upload/${result.leadId}`;
    setCreated({
      leadId: result.leadId,
      uploadUrl,
      name: fd.get('name'),
      email: fd.get('email'),
    });
    setLeads(prev => [{
      id: result.leadId,
      first_name: fd.get('name'),
      last_name: '',
      email: fd.get('email') || null,
      phone: fd.get('phone') || null,
      target_position: fd.get('target_position') || null,
      source: 'direct',
      status: 'new',
      created_at: new Date().toISOString(),
      cv_documents: [],
      cv_feedback: [],
    }, ...prev]);
    e.target.reset();
    setShowForm(false);
  }

  async function handleDelete(lead) {
    if (!confirm(`Lead „${lead.first_name}" wirklich löschen?`)) return;
    const result = await deleteQuickLead(lead.id);
    if (result.error) { showToast(result.error, 'error'); return; }
    setLeads(prev => prev.filter(l => l.id !== lead.id));
    showToast('Lead gelöscht.');
  }

  function copyUrl(url) {
    navigator.clipboard.writeText(url).then(
      () => showToast('Link kopiert.'),
      () => showToast('Konnte nicht kopieren.', 'error')
    );
  }

  function emailMailto(lead, url) {
    const subj = `Dein CV-Check beim Karriere-Institut`;
    const body = `Hallo ${lead.name},

wie besprochen hier der Link für deinen CV-Check:

${url}

Lade einfach deinen Lebenslauf hoch — die KI-Analyse liefert dir in wenigen Sekunden ein erstes Feedback. Danach gehe ich es im Gespräch mit dir durch.

Viele Grüße,
${advisorName}`;
    return `mailto:${lead.email || ''}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="quick-lead-page admin-coaches">
      <div className="admin-pageheader">
        <div>
          <div className="title-kicker"><span className="pulse" /> Berater · Direkt-CV-Check</div>
          <h1 className="page-title">Quick-Leads <span className="faded">{leads.length}</span></h1>
          <p className="page-sub">
            Ad-hoc CV-Check für Kunden anlegen. Du bekommst einen QR-Code und Direkt-Link, den du per E-Mail oder im Gespräch übergibst.
          </p>
        </div>
        {!showForm && (
          <button className="admin-cta-primary" type="button" onClick={() => { setCreated(null); setShowForm(true); }}>
            <Icon name="plus" size={14} stroke={2} /> Neuer Quick-Lead
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="quick-lead-form">
          <h3>Kundendaten</h3>
          <div className="admin-form-row">
            <label className="admin-form-field">
              <span className="admin-form-label">Vorname *</span>
              <input name="name" required autoFocus placeholder="z.B. Sarah" />
            </label>
            <label className="admin-form-field">
              <span className="admin-form-label">E-Mail</span>
              <input name="email" type="email" placeholder="sarah@beispiel.de" />
            </label>
          </div>
          <div className="admin-form-row">
            <label className="admin-form-field">
              <span className="admin-form-label">Telefon</span>
              <input name="phone" placeholder="+49 …" />
            </label>
            <label className="admin-form-field">
              <span className="admin-form-label">Zielposition (optional)</span>
              <input name="target_position" placeholder="z.B. Marketing Manager" />
            </label>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button type="button" className="admin-action-btn" onClick={() => setShowForm(false)}>Abbrechen</button>
            <button type="submit" className="admin-cta-primary" disabled={submitting}>
              {submitting ? 'Erstelle…' : 'Quick-Lead anlegen'}
            </button>
          </div>
        </form>
      )}

      {created && (
        <div className="quick-lead-result">
          <div className="quick-lead-result-head">
            <Icon name="check-circle" size={20} stroke={1.7} />
            <div>
              <h3>Lead für {created.name} angelegt</h3>
              <p>Sende deinem Kunden den Link oder zeige den QR-Code direkt am Bildschirm.</p>
            </div>
            <button type="button" className="admin-icon-btn" onClick={() => setCreated(null)} title="Schließen">
              <Icon name="x" size={16} stroke={1.8} />
            </button>
          </div>
          <div className="quick-lead-result-body">
            <div className="quick-lead-qr">
              <img src={qrCodeUrl(created.uploadUrl)} alt="QR-Code für CV-Upload" />
              <span>Direkt scannen lassen</span>
            </div>
            <div className="quick-lead-actions">
              <div className="quick-lead-url">
                <code>{created.uploadUrl}</code>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button type="button" className="admin-action-btn" onClick={() => copyUrl(created.uploadUrl)}>
                  <Icon name="paperclip" size={13} stroke={1.8} /> Link kopieren
                </button>
                {created.email && (
                  <a href={emailMailto(created, created.uploadUrl)} className="admin-cta-primary">
                    <Icon name="mail" size={13} stroke={1.8} /> Per E-Mail senden
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="admin-list" style={{ marginTop: 24 }}>
        {leads.length === 0 && (
          <div className="admin-empty">Noch keine Quick-Leads. Klick auf „Neuer Quick-Lead" um zu starten.</div>
        )}
        {leads.map(l => {
          const status = leadStatus(l);
          const uploadUrl = `${baseUrl}/cv-upload/${l.id}`;
          return (
            <div key={l.id} className="admin-row">
              <div className="admin-avatar small">{(l.first_name?.[0] || '?').toUpperCase()}</div>
              <div className="admin-row-body">
                <div className="admin-row-name">
                  {l.first_name} {l.last_name}
                  <span className={`admin-coach-badge tier-${status.tier}`}>{status.label}</span>
                </div>
                <div className="admin-row-content">
                  {l.email || '—'}
                  {l.phone && ` · ${l.phone}`}
                  {l.target_position && ` · Ziel: ${l.target_position}`}
                </div>
                <div className="admin-row-meta">
                  <span>Erstellt {formatDate(l.created_at)}</span>
                  {l.cv_feedback?.[0]?.overall_rating && (
                    <><span>·</span><span>★ {l.cv_feedback[0].overall_rating}/5</span></>
                  )}
                </div>
              </div>
              <div className="admin-coach-actions">
                <button type="button" className="admin-action-btn" onClick={() => copyUrl(uploadUrl)}>
                  Link kopieren
                </button>
                <button type="button" className="admin-icon-btn danger" onClick={() => handleDelete(l)} title="Löschen">
                  <Icon name="x" size={16} stroke={1.8} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {toast && <div className={`admin-toast ${toast.kind}`}>{toast.text}</div>}
    </div>
  );
}
