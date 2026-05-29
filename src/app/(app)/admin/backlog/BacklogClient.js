'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createTicket, updateTicketStatus, updateTicket, deleteTicket } from './actions';

const PRIORITY_STYLE = {
  urgent: { bg: 'rgba(204,20,38,0.1)', color: '#CC1426', label: '🔥 Dringend' },
  high:   { bg: 'rgba(220,90,30,0.1)', color: '#9A3412', label: '⬆ Hoch' },
  medium: { bg: 'rgba(202,138,4,0.1)', color: '#92400E', label: '· Mittel' },
  low:    { bg: 'rgba(100,100,100,0.08)', color: '#525252', label: '↓ Niedrig' },
};

const STATUS_STYLE = {
  open:         { bg: '#FEF3C7', color: '#92400E', label: 'Offen' },
  in_progress:  { bg: '#DBEAFE', color: '#1D4ED8', label: 'In Arbeit' },
  done:         { bg: '#D1FAE5', color: '#059669', label: '✓ Fertig' },
  wont_do:      { bg: '#F3F4F6', color: '#525252', label: 'Verworfen' },
};

const STATUS_FILTERS = [
  { key: 'open', label: 'Offen' },
  { key: 'in_progress', label: 'In Arbeit' },
  { key: 'done', label: 'Fertig' },
  { key: 'wont_do', label: 'Verworfen' },
  { key: 'all', label: 'Alle' },
];

export default function BacklogClient({ tickets, counts, currentStatusFilter }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState(null);

  function notify(text, kind = 'success') {
    setMessage({ text, kind });
    setTimeout(() => setMessage(null), 3000);
  }

  function handleCreate(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    startTransition(async () => {
      const result = await createTicket(formData);
      if (result?.error) {
        notify(result.error, 'error');
      } else {
        notify('Ticket angelegt.');
        setShowForm(false);
        e.target.reset();
      }
    });
  }

  function handleEdit(e, ticketId) {
    e.preventDefault();
    const formData = new FormData(e.target);
    startTransition(async () => {
      const result = await updateTicket(ticketId, formData);
      if (result?.error) notify(result.error, 'error');
      else { notify('Ticket aktualisiert.'); setEditing(null); }
    });
  }

  function changeStatus(ticketId, newStatus) {
    startTransition(async () => {
      const result = await updateTicketStatus(ticketId, newStatus);
      if (result?.error) notify(result.error, 'error');
      else notify('Status geändert.');
    });
  }

  function handleDelete(ticketId) {
    if (!confirm('Ticket wirklich löschen?')) return;
    startTransition(async () => {
      const result = await deleteTicket(ticketId);
      if (result?.error) notify(result.error, 'error');
      else notify('Ticket gelöscht.');
    });
  }

  return (
    <div className="admin-coaches">
      <div className="admin-pageheader">
        <div>
          <div className="title-kicker"><span className="pulse" /> Admin · Backlog</div>
          <h1 className="page-title">Backlog <span className="faded">{counts.all}</span></h1>
          <p className="page-sub">
            Alle offenen Features, Bugs und Aufgaben am Karriere-Institut-System. Eigene Tickets anlegen,
            Status setzen, abarbeiten.
          </p>
        </div>
        <button
          onClick={() => { setShowForm(s => !s); setEditing(null); }}
          className="admin-cta-primary"
        >
          {showForm ? 'Schließen' : '+ Neues Ticket'}
        </button>
      </div>

      {message && (
        <div style={{
          padding: '10px 14px',
          borderRadius: 10,
          marginBottom: 20,
          background: message.kind === 'success' ? 'rgba(5,150,105,0.08)' : 'rgba(204,20,38,0.08)',
          color: message.kind === 'success' ? '#059669' : '#CC1426',
          fontSize: 14,
        }}>{message.text}</div>
      )}

      {/* Neues Ticket Form */}
      {showForm && (
        <form onSubmit={handleCreate} style={{
          background: '#fff', border: '1px solid #E8E6E1', borderRadius: 16,
          padding: 20, marginBottom: 24,
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Neues Ticket anlegen</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <input name="title" required placeholder="Titel *" className="input" />
            <input name="category" placeholder="Kategorie (z.B. Feature, Bug, Design)" className="input" />
          </div>
          <textarea
            name="description"
            placeholder="Beschreibung — was muss gemacht werden, warum, wer profitiert davon?"
            rows={4}
            className="input"
            style={{ width: '100%', marginBottom: 12, resize: 'vertical', fontFamily: 'inherit' }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <select name="priority" defaultValue="medium" className="input">
              <option value="low">↓ Niedrig</option>
              <option value="medium">· Mittel</option>
              <option value="high">⬆ Hoch</option>
              <option value="urgent">🔥 Dringend</option>
            </select>
            <input name="assignee" placeholder="Zuständig (optional)" className="input" />
          </div>
          <button type="submit" disabled={isPending} className="btn btn-primary" style={{ padding: '10px 24px' }}>
            {isPending ? 'Speichere…' : 'Ticket anlegen'}
          </button>
        </form>
      )}

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {STATUS_FILTERS.map(f => {
          const active = currentStatusFilter === f.key;
          const count = counts[f.key] ?? 0;
          return (
            <Link
              key={f.key}
              href={`/admin/backlog?status=${f.key}`}
              style={{
                padding: '7px 16px', borderRadius: 980, fontSize: 13, fontWeight: 600,
                textDecoration: 'none',
                background: active ? '#1A1A1A' : '#fff',
                color: active ? '#fff' : '#6B7280',
                border: '1px solid', borderColor: active ? '#1A1A1A' : '#E8E6E1',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              {f.label}
              <span style={{
                background: active ? 'rgba(255,255,255,0.2)' : '#F5F5F7',
                color: active ? '#fff' : '#525252',
                padding: '1px 8px', borderRadius: 980, fontSize: 11,
              }}>{count}</span>
            </Link>
          );
        })}
      </div>

      {/* Tickets-Liste */}
      {tickets.length === 0 ? (
        <div style={{
          background: '#fff', borderRadius: 16, padding: 48, textAlign: 'center',
          border: '1px solid #E8E6E1', color: '#86868b',
        }}>
          Keine Tickets in dieser Ansicht.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tickets.map(ticket => {
            const isEditing = editing === ticket.id;
            const prio = PRIORITY_STYLE[ticket.priority] || PRIORITY_STYLE.medium;
            const stat = STATUS_STYLE[ticket.status] || STATUS_STYLE.open;

            return (
              <div key={ticket.id} style={{
                background: '#fff', border: '1px solid #E8E6E1', borderRadius: 14, padding: 18,
              }}>
                {isEditing ? (
                  <form onSubmit={(e) => handleEdit(e, ticket.id)} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <input name="title" defaultValue={ticket.title} required className="input" />
                    <textarea name="description" defaultValue={ticket.description || ''} rows={3} className="input" style={{ width: '100%', fontFamily: 'inherit' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                      <select name="priority" defaultValue={ticket.priority} className="input">
                        <option value="low">↓ Niedrig</option>
                        <option value="medium">· Mittel</option>
                        <option value="high">⬆ Hoch</option>
                        <option value="urgent">🔥 Dringend</option>
                      </select>
                      <input name="category" defaultValue={ticket.category || ''} placeholder="Kategorie" className="input" />
                      <input name="assignee" defaultValue={ticket.assignee || ''} placeholder="Zuständig" className="input" />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="submit" disabled={isPending} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>Speichern</button>
                      <button type="button" onClick={() => setEditing(null)} className="admin-action-btn">Abbrechen</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12, marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 980,
                            background: stat.bg, color: stat.color,
                          }}>{stat.label}</span>
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 980,
                            background: prio.bg, color: prio.color,
                          }}>{prio.label}</span>
                          {ticket.category && (
                            <span style={{
                              fontSize: 11, padding: '3px 9px', borderRadius: 980,
                              background: '#F5F5F7', color: '#525252',
                            }}>{ticket.category}</span>
                          )}
                          {ticket.assignee && (
                            <span style={{ fontSize: 12, color: '#86868b' }}>· {ticket.assignee}</span>
                          )}
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>
                          {ticket.title}
                        </h3>
                        {ticket.description && (
                          <p style={{ fontSize: 14, color: '#525252', lineHeight: 1.5, margin: 0, whiteSpace: 'pre-wrap' }}>
                            {ticket.description}
                          </p>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 130 }}>
                        <select
                          value={ticket.status}
                          onChange={(e) => changeStatus(ticket.id, e.target.value)}
                          disabled={isPending}
                          className="input"
                          style={{ fontSize: 12, padding: '6px 10px' }}
                        >
                          <option value="open">Offen</option>
                          <option value="in_progress">In Arbeit</option>
                          <option value="done">Fertig</option>
                          <option value="wont_do">Verworfen</option>
                        </select>
                        <button onClick={() => { setEditing(ticket.id); setShowForm(false); }} className="admin-action-btn" style={{ fontSize: 12, padding: '6px 10px' }}>
                          Bearbeiten
                        </button>
                        <button onClick={() => handleDelete(ticket.id)} className="admin-action-btn" style={{ fontSize: 12, padding: '6px 10px', color: '#CC1426' }}>
                          Löschen
                        </button>
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 8 }}>
                      Angelegt {new Date(ticket.created_at).toLocaleDateString('de-DE')}
                      {ticket.updated_at !== ticket.created_at && ` · Aktualisiert ${new Date(ticket.updated_at).toLocaleDateString('de-DE')}`}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
