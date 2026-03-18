'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminCoursesClient({ courses: initialCourses }) {
  const supabase = createClient();
  const [courses, setCourses] = useState(initialCourses);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonForm, setLessonForm] = useState({});
  const [saving, setSaving] = useState(false);

  function toggleCourse(id) {
    setExpandedCourse(expandedCourse === id ? null : id);
    setEditingLesson(null);
  }

  async function togglePublished(course) {
    const newVal = !course.is_published;
    await supabase.from('courses').update({ is_published: newVal }).eq('id', course.id);
    setCourses(prev => prev.map(c => c.id === course.id ? { ...c, is_published: newVal } : c));
  }

  function startEditLesson(lesson) {
    setEditingLesson(lesson.id);
    setLessonForm({
      title: lesson.title || '',
      description: lesson.description || '',
      content: lesson.content || '',
      exercise: lesson.exercise || '',
      video_url: lesson.video_url || '',
      audio_url: lesson.audio_url || '',
      type: lesson.type || 'lesson',
      duration_minutes: lesson.duration_minutes || '',
      market_value_impact: lesson.market_value_impact || '',
      sort_order: lesson.sort_order || 0,
    });
  }

  async function saveLesson(lessonId, courseId) {
    setSaving(true);
    const updateData = {
      ...lessonForm,
      duration_minutes: lessonForm.duration_minutes ? parseInt(lessonForm.duration_minutes) : null,
      market_value_impact: lessonForm.market_value_impact ? parseInt(lessonForm.market_value_impact) : 0,
      sort_order: parseInt(lessonForm.sort_order) || 0,
    };
    await supabase.from('lessons').update(updateData).eq('id', lessonId);

    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      return {
        ...c,
        modules: c.modules.map(m => ({
          ...m,
          lessons: m.lessons.map(l => l.id === lessonId ? { ...l, ...updateData } : l)
        }))
      };
    }));
    setEditingLesson(null);
    setSaving(false);
  }

  function countVideos(course) {
    let total = 0, withVideo = 0;
    (course.modules || []).forEach(m => {
      (m.lessons || []).forEach(l => {
        total++;
        if (l.video_url) withVideo++;
      });
    });
    return { total, withVideo };
  }

  return (
    <div className="page-container animate-in">
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title">Kursverwaltung</h1>
        <p className="page-subtitle">Module, Lektionen & Videos verwalten</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {courses.map(course => {
          const { total, withVideo } = countVideos(course);
          const isExpanded = expandedCourse === course.id;

          return (
            <div key={course.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Course Header */}
              <div
                onClick={() => toggleCourse(course.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px',
                  cursor: 'pointer', transition: 'background var(--t-fast)',
                }}
              >
                <span style={{ fontSize: 20, transition: 'transform var(--t-fast)', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>▸</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{course.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginTop: 2 }}>
                    {course.category && <span>{course.category} · </span>}
                    {total} Lektionen · {withVideo}/{total} Videos hinterlegt
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); togglePublished(course); }}
                  style={{
                    padding: '6px 14px', borderRadius: 'var(--r-pill)', border: 'none',
                    fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    background: course.is_published ? 'rgba(45,106,79,0.08)' : 'var(--grey-6)',
                    color: course.is_published ? 'var(--ki-success)' : 'var(--ki-text-tertiary)',
                  }}
                >
                  {course.is_published ? '● Published' : '○ Draft'}
                </button>
              </div>

              {/* Expanded: Modules & Lessons */}
              {isExpanded && (
                <div style={{ borderTop: '1px solid var(--ki-border)' }}>
                  {(course.modules || []).map(mod => (
                    <div key={mod.id}>
                      <div style={{ padding: '12px 24px', background: 'var(--ki-bg-alt)', fontSize: 13, fontWeight: 600, color: 'var(--ki-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {mod.title}
                      </div>
                      {(mod.lessons || []).map(lesson => (
                        <div key={lesson.id} style={{ borderBottom: '1px solid var(--ki-border)' }}>
                          {editingLesson === lesson.id ? (
                            /* Edit Form */
                            <div style={{ padding: '20px 24px' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                                <div>
                                  <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>Titel</label>
                                  <input className="input" value={lessonForm.title} onChange={e => setLessonForm(p => ({ ...p, title: e.target.value }))} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                                  <div>
                                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>Typ</label>
                                    <select className="input" value={lessonForm.type} onChange={e => setLessonForm(p => ({ ...p, type: e.target.value }))}>
                                      <option value="video">Video</option>
                                      <option value="lesson">Lektion</option>
                                      <option value="exercise">Übung</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>Dauer (Min)</label>
                                    <input className="input" type="number" value={lessonForm.duration_minutes} onChange={e => setLessonForm(p => ({ ...p, duration_minutes: e.target.value }))} />
                                  </div>
                                  <div>
                                    <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>Marktwert €</label>
                                    <input className="input" type="number" value={lessonForm.market_value_impact} onChange={e => setLessonForm(p => ({ ...p, market_value_impact: e.target.value }))} />
                                  </div>
                                </div>
                              </div>

                              <div style={{ marginBottom: 12 }}>
                                <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>Beschreibung</label>
                                <textarea className="input" rows={2} value={lessonForm.description} onChange={e => setLessonForm(p => ({ ...p, description: e.target.value }))} />
                              </div>

                              <div className="grid-2" style={{ marginBottom: 12 }}>
                                <div>
                                  <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>Video-URL</label>
                                  <input className="input" placeholder="YouTube, Vimeo oder .mp4" value={lessonForm.video_url} onChange={e => setLessonForm(p => ({ ...p, video_url: e.target.value }))} />
                                </div>
                                <div>
                                  <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>Audio-URL</label>
                                  <input className="input" placeholder="MP3 oder Audio-Link" value={lessonForm.audio_url} onChange={e => setLessonForm(p => ({ ...p, audio_url: e.target.value }))} />
                                </div>
                              </div>

                              <div style={{ marginBottom: 12 }}>
                                <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>Kerninhalt</label>
                                <textarea className="input" rows={4} value={lessonForm.content} onChange={e => setLessonForm(p => ({ ...p, content: e.target.value }))} />
                              </div>

                              <div style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', display: 'block', marginBottom: 4 }}>Übung</label>
                                <textarea className="input" rows={3} value={lessonForm.exercise} onChange={e => setLessonForm(p => ({ ...p, exercise: e.target.value }))} />
                              </div>

                              <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={() => saveLesson(lesson.id, course.id)} className="btn btn-primary" style={{ fontSize: 13 }} disabled={saving}>
                                  {saving ? 'Speichert...' : 'Speichern'}
                                </button>
                                <button onClick={() => setEditingLesson(null)} className="btn btn-ghost" style={{ fontSize: 13 }}>Abbrechen</button>
                              </div>
                            </div>
                          ) : (
                            /* Lesson Row */
                            <div
                              onClick={() => startEditLesson(lesson)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '12px 24px', cursor: 'pointer',
                                transition: 'background var(--t-fast)',
                              }}
                            >
                              <span style={{ fontSize: 13, color: 'var(--ki-text-tertiary)', minWidth: 24, textAlign: 'center' }}>
                                {lesson.sort_order || '—'}
                              </span>
                              <div style={{ flex: 1 }}>
                                <span style={{ fontSize: 14, fontWeight: 500 }}>{lesson.title}</span>
                              </div>
                              <span className={`pill pill-${lesson.type === 'exercise' ? 'gold' : lesson.type === 'video' ? 'red' : 'grey'}`} style={{ fontSize: 11 }}>
                                {lesson.type || 'lesson'}
                              </span>
                              {lesson.video_url ? (
                                <span style={{ fontSize: 12, color: 'var(--ki-success)' }}>📹</span>
                              ) : (
                                <span style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>—</span>
                              )}
                              {lesson.market_value_impact > 0 && (
                                <span style={{ fontSize: 12, color: 'var(--ki-success)' }}>+€{lesson.market_value_impact}</span>
                              )}
                              <span style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>✎</span>
                            </div>
                          )}
                        </div>
                      ))}
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
