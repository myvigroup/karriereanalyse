'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const overlayRef = useRef(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const supabase = createClient();

        const [coursesRes, contactsRes, applicationsRes] = await Promise.all([
          supabase.from('courses').select('id, title, slug'),
          supabase.from('contacts').select('id, name, company'),
          supabase.from('applications').select('id, company_name, position'),
        ]);

        setCourses(coursesRes.data || []);
        setContacts(contactsRes.data || []);
        setApplications(applicationsRes.data || []);
      } catch (err) {
        console.error('GlobalSearch: failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Keyboard shortcut: Ctrl+K to open, Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Autofocus input when modal opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
    if (!open) {
      setQuery('');
    }
  }, [open]);

  const handleOverlayClick = useCallback((e) => {
    if (e.target === overlayRef.current) {
      setOpen(false);
    }
  }, []);

  // Fuzzy search via simple toLowerCase includes matching
  const match = (value) =>
    value?.toLowerCase().includes(query.toLowerCase());

  const filteredCourses = query
    ? courses.filter((c) => match(c.title))
    : courses.slice(0, 5);

  const filteredContacts = query
    ? contacts.filter((c) => match(c.name) || match(c.company))
    : contacts.slice(0, 5);

  const filteredApplications = query
    ? applications.filter((a) => match(a.company_name) || match(a.position))
    : applications.slice(0, 5);

  const hasResults =
    filteredCourses.length > 0 ||
    filteredContacts.length > 0 ||
    filteredApplications.length > 0;

  const navigate = (href) => {
    setOpen(false);
    window.location.href = href;
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '80px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Search input */}
        <div style={{ padding: '16px', borderBottom: '1px solid var(--ki-border)' }}>
          <input
            ref={inputRef}
            className="input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Suchen… (Ctrl+K zum Schließen)"
            style={{
              width: '100%',
              fontSize: '16px',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: 'var(--ki-text)',
            }}
          />
        </div>

        {/* Results */}
        <div
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
            padding: hasResults || loading ? '8px 0' : '0',
          }}
        >
          {loading && (
            <div
              style={{
                padding: '24px',
                textAlign: 'center',
                color: 'var(--ki-text-secondary)',
                fontSize: '14px',
              }}
            >
              Laden…
            </div>
          )}

          {!loading && query && !hasResults && (
            <div
              style={{
                padding: '24px',
                textAlign: 'center',
                color: 'var(--ki-text-secondary)',
                fontSize: '14px',
              }}
            >
              Keine Ergebnisse für „{query}"
            </div>
          )}

          {!loading && !query && !hasResults && (
            <div
              style={{
                padding: '24px',
                textAlign: 'center',
                color: 'var(--ki-text-secondary)',
                fontSize: '14px',
              }}
            >
              Tippen Sie, um zu suchen…
            </div>
          )}

          {/* Courses */}
          {!loading && filteredCourses.length > 0 && (
            <section>
              <div
                style={{
                  padding: '6px 16px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--ki-text-secondary)',
                }}
              >
                ▶ Kurse
              </div>
              {filteredCourses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => navigate(`/masterclass/${course.slug || course.id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '10px 16px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px',
                    color: 'var(--ki-text)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--ki-bg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ color: 'var(--ki-red)', fontSize: '16px' }}>▶</span>
                  <span>{course.title}</span>
                </button>
              ))}
            </section>
          )}

          {/* Contacts */}
          {!loading && filteredContacts.length > 0 && (
            <section>
              <div
                style={{
                  padding: '6px 16px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--ki-text-secondary)',
                }}
              >
                🤝 Kontakte
              </div>
              {filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => navigate(`/network`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '10px 16px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px',
                    color: 'var(--ki-text)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--ki-bg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontSize: '16px' }}>🤝</span>
                  <span>
                    {contact.name}
                    {contact.company && (
                      <span style={{ color: 'var(--ki-text-secondary)', marginLeft: '6px' }}>
                        · {contact.company}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </section>
          )}

          {/* Applications */}
          {!loading && filteredApplications.length > 0 && (
            <section>
              <div
                style={{
                  padding: '6px 16px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--ki-text-secondary)',
                }}
              >
                ✉ Bewerbungen
              </div>
              {filteredApplications.map((app) => (
                <button
                  key={app.id}
                  onClick={() => navigate(`/applications`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '10px 16px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px',
                    color: 'var(--ki-text)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--ki-bg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontSize: '16px' }}>✉</span>
                  <span>
                    {app.company_name}
                    {app.position && (
                      <span style={{ color: 'var(--ki-text-secondary)', marginLeft: '6px' }}>
                        · {app.position}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </section>
          )}
        </div>

        {/* Footer hint */}
        <div
          style={{
            padding: '10px 16px',
            borderTop: '1px solid var(--ki-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: 'var(--ki-text-secondary)',
          }}
        >
          <kbd
            style={{
              background: 'var(--ki-bg)',
              border: '1px solid var(--ki-border)',
              borderRadius: '4px',
              padding: '2px 6px',
              fontFamily: 'monospace',
              fontSize: '11px',
            }}
          >
            Esc
          </kbd>
          <span>zum Schließen</span>
          <span style={{ marginLeft: 'auto' }}>
            <kbd
              style={{
                background: 'var(--ki-bg)',
                border: '1px solid var(--ki-border)',
                borderRadius: '4px',
                padding: '2px 6px',
                fontFamily: 'monospace',
                fontSize: '11px',
              }}
            >
              Ctrl+K
            </kbd>
            <span style={{ marginLeft: '4px' }}>Suche öffnen/schließen</span>
          </span>
        </div>
      </div>
    </div>
  );
}
