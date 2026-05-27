'use client';
import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function leadStatus(lead) {
  const fb = lead.cv_feedback?.[0];
  if (fb?.status === 'completed') return { label: 'Abgeschlossen', tier: 'good' };
  if (fb?.ai_parsed_at) return { label: 'KI fertig', tier: 'mid' };
  if (lead.cv_documents?.length > 0) return { label: 'CV hochgeladen', tier: 'mid' };
  return { label: 'Wartet', tier: 'low' };
}

function qrCodeUrl(url) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}&margin=2`;
}

export default function AffiliateDashboardClient({ advisor, affiliateUrl, leads, referrals }) {
  const [toast, setToast] = useState(null);

  function showToast(text, kind = 'ok') {
    setToast({ text, kind });
    setTimeout(() => setToast(null), 2500);
  }
  function copyUrl() {
    if (!affiliateUrl) return;
    navigator.clipboard.writeText(affiliateUrl).then(
      () => showToast('Link kopiert.'),
      () => showToast('Konnte nicht kopieren.', 'error')
    );
  }

  const conversionRate = (advisor.affiliate_clicks || 0) > 0
    ? Math.round(((advisor.affiliate_signups || 0) / advisor.affiliate_clicks) * 100)
    : 0;

  return (
    <div className="admin-coaches">
      <div className="admin-pageheader">
        <div>
          <div className="title-kicker"><span className="pulse" /> Berater · Affiliate-Übersicht</div>
          <h1 className="page-title">
            Dein Affiliate-Trichter.{' '}
            <span className="faded">Wer kommt über deinen Link rein?</span>
          </h1>
          <p className="page-sub">
            Teile deinen persönlichen Link mit Kunden — du siehst hier wer geklickt hat, sich angemeldet hat und welche Leads draus geworden sind.
          </p>
        </div>
      </div>

      {/* Stats-Reihe */}
      <div className="admin-stats-row">
        <div className="admin-stat highlight">
          <div className="admin-stat-icon"><Icon name="target" size={18} stroke={1.6} /></div>
          <div className="admin-stat-body">
            <div className="admin-stat-value">{advisor.affiliate_clicks || 0}</div>
            <div className="admin-stat-label">Klicks auf deinen Link</div>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-icon"><Icon name="user" size={18} stroke={1.6} /></div>
          <div className="admin-stat-body">
            <div className="admin-stat-value">{referrals.length}</div>
            <div className="admin-stat-label">Konto-Anmeldungen</div>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-icon"><Icon name="file-text" size={18} stroke={1.6} /></div>
          <div className="admin-stat-body">
            <div className="admin-stat-value">{leads.length}</div>
            <div className="admin-stat-label">CV-Leads (über Link)</div>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-icon"><Icon name="trending-up" size={18} stroke={1.6} /></div>
          <div className="admin-stat-body">
            <div className="admin-stat-value">{conversionRate}%</div>
            <div className="admin-stat-label">Conversion</div>
          </div>
        </div>
      </div>

      {/* Link + QR */}
      {affiliateUrl ? (
        <div className="quick-lead-result" style={{ marginTop: 28 }}>
          <div className="quick-lead-result-head">
            <Icon name="globe" size={20} stroke={1.7} />
            <div>
              <h3>Dein Affiliate-Link</h3>
              <p>Teile diesen Link auf Visitenkarten, in Mails oder als QR — alle Anmeldungen werden dir zugeordnet.</p>
            </div>
          </div>
          <div className="quick-lead-result-body">
            <div className="quick-lead-qr">
              <img src={qrCodeUrl(affiliateUrl)} alt="QR-Code" />
              <span>QR scannen lassen</span>
            </div>
            <div className="quick-lead-actions">
              <div className="quick-lead-url"><code>{affiliateUrl}</code></div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button type="button" className="admin-action-btn" onClick={copyUrl}>
                  <Icon name="paperclip" size={13} stroke={1.8} /> Link kopieren
                </button>
                <a href={affiliateUrl} target="_blank" rel="noopener noreferrer" className="admin-action-btn">
                  <Icon name="arrow-right" size={13} stroke={1.8} /> Vorschau öffnen
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="admin-empty" style={{ marginTop: 24 }}>
          Kein Affiliate-Link hinterlegt. Bitte einen Admin bitten, dir einen Slug zuzuweisen.
        </div>
      )}

      {/* Anmeldungen über Link */}
      <div className="admin-hub-section" style={{ marginTop: 32 }}>
        <div className="admin-hub-secthead">
          <h3>Konto-Anmeldungen über deinen Link · {referrals.length}</h3>
        </div>
        <div className="admin-list">
          {referrals.length === 0 && (
            <div className="admin-empty">Noch keine Anmeldungen. Teile deinen Link, um die ersten zu bekommen.</div>
          )}
          {referrals.map(r => (
            <div key={r.id} className="admin-row">
              <div className="admin-avatar small">{(r.first_name?.[0] || r.name?.[0] || '?').toUpperCase()}</div>
              <div className="admin-row-body">
                <div className="admin-row-name">{r.name || r.first_name || r.email}</div>
                <div className="admin-row-content">{r.email}</div>
                <div className="admin-row-meta"><span>Angemeldet {formatDate(r.created_at)}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CV-Leads über Link */}
      <div className="admin-hub-section" style={{ marginTop: 28 }}>
        <div className="admin-hub-secthead">
          <h3>CV-Leads über deinen Link · {leads.length}</h3>
        </div>
        <div className="admin-list">
          {leads.length === 0 && (
            <div className="admin-empty">Noch keine CV-Leads über deinen Link.</div>
          )}
          {leads.map(l => {
            const status = leadStatus(l);
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
                  <Link href={`/advisor/leads`} className="admin-action-btn">Details</Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {toast && <div className={`admin-toast ${toast.kind}`}>{toast.text}</div>}
    </div>
  );
}
