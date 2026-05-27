'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSelfServiceLead } from '../actions';
import AppFooter from '@/components/layout/AppFooter';

export default function CheckFormClient({ advisor, slug }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const fd = new FormData(e.target);
    const res = await createSelfServiceLead(slug, fd);
    if (res.error) {
      setError(res.error);
      setSubmitting(false);
      return;
    }
    // Direkt zur Upload-Page (anonymer Upload via /api/cv/quick-upload)
    router.push(`/cv-upload/${res.leadId}`);
  }

  return (
    <div className="affiliate-landing">
      <header className="aff-header">
        <img src="/logo-karriereinstitut.svg" alt="Karriere-Institut" style={{ height: 32, width: 'auto' }} />
      </header>

      <section className="aff-hero" style={{ paddingTop: 40, paddingBottom: 24 }}>
        <div className="aff-eyebrow">
          <span className="dot" /> Empfohlen von <strong>{advisor.display_name}</strong>
        </div>
        <h1 className="aff-title">
          Dein Lebenslauf-Check.{' '}
          <span className="aff-title-faded">In 60 Sekunden zur KI-Auswertung.</span>
        </h1>
        <p className="aff-sub">
          Wir scannen deinen Lebenslauf mit KI und zeigen dir, was bei Recruitern wirklich ankommt.
          Danach geht {advisor.display_name.split(' ')[0]} das Ergebnis im Gespräch mit dir durch.
        </p>
      </section>

      <section className="aff-form-section">
        <form onSubmit={handleSubmit} className="aff-form">
          <h3 className="aff-form-title">Kurz deine Daten — dann gehts zum Upload</h3>

          <div className="aff-form-row">
            <label className="aff-form-field">
              <span>Vorname *</span>
              <input name="name" required autoFocus placeholder="z.B. Sarah" />
            </label>
            <label className="aff-form-field">
              <span>E-Mail *</span>
              <input name="email" type="email" required placeholder="deine@mail.de" />
            </label>
          </div>

          <div className="aff-form-row">
            <label className="aff-form-field">
              <span>Telefon (optional)</span>
              <input name="phone" placeholder="+49 …" />
            </label>
            <label className="aff-form-field">
              <span>Welche Position suchst du? *</span>
              <input name="target_position" required placeholder="z.B. Marketing Manager, Duales Studium BWL …" />
            </label>
          </div>

          {error && (
            <div className="aff-form-error">{error}</div>
          )}

          <button type="submit" className="aff-cta-primary aff-form-submit" disabled={submitting}>
            {submitting ? 'Wird angelegt…' : 'Weiter zum CV-Upload →'}
          </button>

          <div className="aff-form-tos">
            Wir nutzen deine Daten ausschließlich für den CV-Check und die Übergabe an
            {' '}<strong>{advisor.display_name}</strong>. Mehr in unserer Datenschutzrichtlinie.
          </div>
        </form>
      </section>

      <AppFooter showLogo={true} />
    </div>
  );
}
