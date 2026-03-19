'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const LABEL_STYLE = { fontSize: 12, fontWeight: 500, color: 'var(--ki-text-secondary)', display: 'block', marginBottom: 4 };

function emptyQuestion() {
  return { text: '', options: ['', '', '', ''], correct: 0 };
}

function LessonEditor({ lesson, courseId, onSaved }) {
  const supabase = createClient();

  const parseQuiz = (raw) => {
    if (!raw) return [];
    if (typeof raw === 'string') {
      try { return JSON.parse(raw); } catch { return []; }
    }
    return Array.isArray(raw) ? raw : [];
  };

  const [quizData, setQuizData] = useState(() => parseQuiz(lesson.quiz_data));
  const [practicePrompt, setPracticePrompt] = useState(lesson.practice_prompt || '');
  const [rawJson, setRawJson] = useState(() => JSON.stringify(parseQuiz(lesson.quiz_data), null, 2));
  const [jsonError, setJsonError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Keep rawJson in sync when quizData changes via the quiz builder
  function syncRawFromQuiz(updated) {
    setQuizData(updated);
    setRawJson(JSON.stringify(updated, null, 2));
    setJsonError('');
  }

  function handleRawJsonChange(val) {
    setRawJson(val);
    try {
      const parsed = JSON.parse(val);
      setQuizData(Array.isArray(parsed) ? parsed : []);
      setJsonError('');
    } catch {
      setJsonError('Ungültiges JSON');
    }
  }

  function addQuestion() {
    syncRawFromQuiz([...quizData, emptyQuestion()]);
  }

  function removeQuestion(qi) {
    syncRawFromQuiz(quizData.filter((_, i) => i !== qi));
  }

  function updateQuestion(qi, field, value) {
    const updated = quizData.map((q, i) => i === qi ? { ...q, [field]: value } : q);
    syncRawFromQuiz(updated);
  }

  function updateOption(qi, oi, value) {
    const updated = quizData.map((q, i) => {
      if (i !== qi) return q;
      const options = [...q.options];
      options[oi] = value;
      return { ...q, options };
    });
    syncRawFromQuiz(updated);
  }

  async function save() {
    if (jsonError) return;
    setSaving(true);
    await supabase.from('lessons').update({
      quiz_data: quizData.length > 0 ? quizData : null,
      practice_prompt: practicePrompt || null,
    }).eq('id', lesson.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onSaved(lesson.id, { quiz_data: quizData, practice_prompt: practicePrompt });
  }

  return (
    <div style={{ padding: '20px 24px', borderTop: '1px solid var(--ki-border)', background: 'var(--ki-bg-alt)' }}>

      {/* Practice Prompt */}
      <div style={{ marginBottom: 20 }}>
        <label style={LABEL_STYLE}>Praxis-Prompt</label>
        <textarea
          className="input"
          rows={3}
          placeholder="Aufgabe oder Reflexionsfrage für den Nutzer nach dieser Lektion..."
          value={practicePrompt}
          onChange={e => setPracticePrompt(e.target.value)}
          style={{ resize: 'vertical' }}
        />
      </div>

      {/* Quiz Builder */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <label style={{ ...LABEL_STYLE, marginBottom: 0, fontSize: 13, fontWeight: 600, color: 'var(--ki-text)' }}>
            Quiz erstellen
            {quizData.length > 0 && (
              <span className="pill" style={{ marginLeft: 8, fontSize: 11 }}>{quizData.length} Fragen</span>
            )}
          </label>
          <button className="btn btn-secondary" style={{ fontSize: 12, padding: '5px 12px' }} onClick={addQuestion}>
            + Frage hinzufügen
          </button>
        </div>

        {quizData.length === 0 && (
          <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 12 }}>
            Noch keine Fragen. Klicke auf "+ Frage hinzufügen" oder bearbeite das JSON direkt.
          </p>
        )}

        {quizData.map((q, qi) => (
          <div key={qi} className="card" style={{ padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-secondary)', marginTop: 10, minWidth: 20 }}>
                {qi + 1}.
              </span>
              <input
                className="input"
                style={{ flex: 1 }}
                placeholder="Fragetext"
                value={q.text}
                onChange={e => updateQuestion(qi, 'text', e.target.value)}
              />
              <button
                onClick={() => removeQuestion(qi)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--ki-text-secondary)', padding: '6px 4px', lineHeight: 1 }}
                title="Frage entfernen"
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, paddingLeft: 28 }}>
              {(q.options || ['', '', '', '']).map((opt, oi) => (
                <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={() => updateQuestion(qi, 'correct', oi)}
                    style={{
                      width: 22, height: 22, borderRadius: '50%', border: '2px solid',
                      borderColor: q.correct === oi ? 'var(--ki-success)' : 'var(--ki-border)',
                      background: q.correct === oi ? 'var(--ki-success)' : 'transparent',
                      cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s',
                    }}
                    title="Als korrekte Antwort markieren"
                  />
                  <input
                    className="input"
                    style={{ flex: 1, fontSize: 13 }}
                    placeholder={`Option ${oi + 1}`}
                    value={opt}
                    onChange={e => updateOption(qi, oi, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div style={{ paddingLeft: 28, marginTop: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--ki-text-secondary)' }}>
                Korrekte Antwort: Option {(q.correct ?? 0) + 1}
              </span>
            </div>
          </div>
        ))}

        {/* Raw JSON fallback */}
        <details style={{ marginTop: 8 }}>
          <summary style={{ fontSize: 12, color: 'var(--ki-text-secondary)', cursor: 'pointer', marginBottom: 6 }}>
            JSON direkt bearbeiten
          </summary>
          <textarea
            className="input"
            rows={6}
            value={rawJson}
            onChange={e => handleRawJsonChange(e.target.value)}
            style={{ fontFamily: 'monospace', fontSize: 12, resize: 'vertical' }}
          />
          {jsonError && (
            <p style={{ fontSize: 12, color: 'var(--ki-red)', marginTop: 4 }}>{jsonError}</p>
          )}
        </details>
      </div>

      {/* Save */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          className="btn btn-primary"
          style={{ fontSize: 13 }}
          onClick={save}
          disabled={saving || !!jsonError}
        >
          {saving ? 'Speichert...' : 'Speichern'}
        </button>
        {saved && (
          <span style={{ fontSize: 13, color: 'var(--ki-success)', fontWeight: 500 }}>Gespeichert ✓</span>
        )}
      </div>
    </div>
  );
}

export default function ContentClient({ courses: initialCourses }) {
  const [courses] = useState(initialCourses);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [expandedLesson, setExpandedLesson] = useState(null);

  function toggleCourse(id) {
    setExpandedCourse(prev => prev === id ? null : id);
    setExpandedLesson(null);
  }

  function toggleLesson(id) {
    setExpandedLesson(prev => prev === id ? null : id);
  }

  function handleSaved(lessonId, updates) {
    // Local update is handled inside LessonEditor via saved state; no-op here
  }

  return (
    <div className="page-container animate-in">
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title">Content-Verwaltung</h1>
        <p style={{ color: 'var(--ki-text-secondary)', fontSize: 14, marginTop: 4 }}>
          Quiz-Fragen und Praxis-Prompts pro Lektion bearbeiten
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {courses.length === 0 && (
          <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--ki-text-secondary)' }}>
            Keine Kurse vorhanden.
          </div>
        )}

        {courses.map(course => {
          const isExpanded = expandedCourse === course.id;
          const totalLessons = (course.modules || []).reduce((s, m) => s + (m.lessons || []).length, 0);
          const withQuiz = (course.modules || []).reduce((s, m) =>
            s + (m.lessons || []).filter(l => l.quiz_data && (Array.isArray(l.quiz_data) ? l.quiz_data.length > 0 : true)).length, 0);

          return (
            <div key={course.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Course Header */}
              <div
                onClick={() => toggleCourse(course.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '18px 24px', cursor: 'pointer',
                  transition: 'background var(--t-fast)',
                }}
              >
                <span style={{
                  fontSize: 18, transition: 'transform var(--t-fast)',
                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                  color: 'var(--ki-text-secondary)',
                }}>
                  ▸
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{course.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginTop: 2 }}>
                    {totalLessons} Lektionen · {withQuiz} mit Quiz
                  </div>
                </div>
                {course.category && (
                  <span className="pill" style={{ fontSize: 11 }}>{course.category}</span>
                )}
              </div>

              {/* Modules & Lessons */}
              {isExpanded && (
                <div style={{ borderTop: '1px solid var(--ki-border)' }}>
                  {(course.modules || []).length === 0 && (
                    <div style={{ padding: '16px 24px', color: 'var(--ki-text-secondary)', fontSize: 13 }}>
                      Keine Module in diesem Kurs.
                    </div>
                  )}

                  {(course.modules || []).map(mod => (
                    <div key={mod.id}>
                      {/* Module Header */}
                      <div style={{
                        padding: '10px 24px',
                        background: 'var(--ki-bg-alt)',
                        fontSize: 12, fontWeight: 600,
                        color: 'var(--ki-text-secondary)',
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                        borderBottom: '1px solid var(--ki-border)',
                      }}>
                        {mod.title}
                        <span style={{ fontWeight: 400, textTransform: 'none', marginLeft: 8 }}>
                          ({(mod.lessons || []).length} Lektionen)
                        </span>
                      </div>

                      {/* Lessons */}
                      {(mod.lessons || []).map(lesson => {
                        const isLessonOpen = expandedLesson === lesson.id;
                        const hasQuiz = lesson.quiz_data && (Array.isArray(lesson.quiz_data) ? lesson.quiz_data.length > 0 : true);
                        const hasPrompt = !!lesson.practice_prompt;

                        return (
                          <div key={lesson.id} style={{ borderBottom: '1px solid var(--ki-border)' }}>
                            {/* Lesson Row */}
                            <div
                              onClick={() => toggleLesson(lesson.id)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '12px 24px', cursor: 'pointer',
                                transition: 'background var(--t-fast)',
                              }}
                            >
                              <span style={{
                                fontSize: 14, transition: 'transform var(--t-fast)',
                                transform: isLessonOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                                color: 'var(--ki-text-secondary)',
                              }}>
                                ▸
                              </span>
                              <div style={{ flex: 1 }}>
                                <span style={{ fontSize: 14, fontWeight: 500 }}>{lesson.title}</span>
                              </div>
                              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                {hasQuiz && (
                                  <span className="pill" style={{ fontSize: 11, background: 'rgba(204,20,38,0.08)', color: 'var(--ki-red)' }}>
                                    Quiz
                                  </span>
                                )}
                                {hasPrompt && (
                                  <span className="pill" style={{ fontSize: 11, background: 'rgba(45,106,79,0.08)', color: 'var(--ki-success)' }}>
                                    Prompt
                                  </span>
                                )}
                                {!hasQuiz && !hasPrompt && (
                                  <span style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Leer</span>
                                )}
                                <span style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>✎</span>
                              </div>
                            </div>

                            {/* Lesson Editor */}
                            {isLessonOpen && (
                              <LessonEditor
                                lesson={lesson}
                                courseId={course.id}
                                onSaved={handleSaved}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
