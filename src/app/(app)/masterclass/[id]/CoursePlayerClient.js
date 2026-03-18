'use client';

import { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';

function getVideoEmbed(url) {
  if (!url) return null;
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/);
  if (ytMatch) return { type: 'youtube', id: ytMatch[1] };
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return { type: 'vimeo', id: vimeoMatch[1] };
  // Wistia
  const wistiaMatch = url.match(/wistia\.com\/medias\/([\w]+)/);
  if (wistiaMatch) return { type: 'wistia', id: wistiaMatch[1] };
  // Direct video
  if (url.match(/\.(mp4|webm|ogg)(\?|$)/i)) return { type: 'direct', url };
  // Fallback: try as iframe
  return { type: 'iframe', url };
}

export default function CoursePlayerClient({ course, progress, analysisResults, profile, userId }) {
  const supabase = createClient();

  // Flatten all lessons with module info
  const allLessons = useMemo(() => {
    return (course.modules || []).flatMap(mod =>
      (mod.lessons || []).map(lesson => ({ ...lesson, moduleName: mod.title, moduleId: mod.id }))
    );
  }, [course]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progressMap, setProgressMap] = useState(() => {
    const map = {};
    (progress || []).forEach(p => { map[p.lesson_id] = p; });
    return map;
  });
  const [notes, setNotes] = useState(() => progressMap[allLessons[0]?.id]?.notes || '');
  const [saving, setSaving] = useState(false);
  const [mediaMode, setMediaMode] = useState('video'); // 'video' | 'audio'

  const currentLesson = allLessons[currentIndex];
  const completedCount = allLessons.filter(l => progressMap[l.id]?.completed).length;
  const totalCount = allLessons.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  function navigateTo(index) {
    setCurrentIndex(index);
    setNotes(progressMap[allLessons[index]?.id]?.notes || '');
    setMediaMode('video');
  }

  async function saveNotes() {
    if (!currentLesson) return;
    setSaving(true);
    await supabase.from('lesson_progress').upsert({
      user_id: userId,
      lesson_id: currentLesson.id,
      notes,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,lesson_id' });
    setProgressMap(prev => ({
      ...prev,
      [currentLesson.id]: { ...prev[currentLesson.id], notes }
    }));
    setSaving(false);
  }

  async function markComplete() {
    if (!currentLesson) return;
    setSaving(true);
    await supabase.from('lesson_progress').upsert({
      user_id: userId,
      lesson_id: currentLesson.id,
      completed: true,
      completed_at: new Date().toISOString(),
      notes,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,lesson_id' });
    setProgressMap(prev => ({
      ...prev,
      [currentLesson.id]: { ...prev[currentLesson.id], completed: true, notes }
    }));
    setSaving(false);
  }

  if (!currentLesson) {
    return (
      <div className="page-container">
        <h1 className="page-title">{course.title}</h1>
        <p style={{ color: 'var(--ki-text-secondary)', marginTop: 16 }}>Dieser Kurs hat noch keine Lektionen.</p>
        <a href="/masterclass" className="btn btn-secondary" style={{ marginTop: 24 }}>← Zurück zur Übersicht</a>
      </div>
    );
  }

  const video = getVideoEmbed(currentLesson.video_url);
  const isCompleted = progressMap[currentLesson.id]?.completed;
  const typePill = currentLesson.type === 'video' ? 'Video' : currentLesson.type === 'exercise' ? 'Übung' : 'Lektion';

  return (
    <div className="page-container animate-in" style={{ maxWidth: 1400 }}>
      {/* Back link */}
      <a href="/masterclass" style={{ fontSize: 13, color: 'var(--ki-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20, textDecoration: 'none' }}>
        ← Zurück zur Masterclass
      </a>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
        {/* === LEFT: Video + Content === */}
        <div>
          {/* Video Player */}
          <div style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden', background: '#000', marginBottom: 24 }}>
            {mediaMode === 'audio' && currentLesson.audio_url ? (
              <div style={{ padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200, background: 'var(--ki-charcoal)' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎧</div>
                <div style={{ color: 'white', fontSize: 15, fontWeight: 500, marginBottom: 16 }}>{currentLesson.title}</div>
                <audio controls src={currentLesson.audio_url} style={{ width: '100%', maxWidth: 500 }} />
              </div>
            ) : video ? (
              <>
                {video.type === 'youtube' && (
                  <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                    <iframe src={`https://www.youtube.com/embed/${video.id}?rel=0`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                  </div>
                )}
                {video.type === 'vimeo' && (
                  <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                    <iframe src={`https://player.vimeo.com/video/${video.id}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
                  </div>
                )}
                {video.type === 'wistia' && (
                  <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                    <iframe src={`https://fast.wistia.net/embed/iframe/${video.id}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} allow="autoplay; fullscreen" allowFullScreen />
                  </div>
                )}
                {video.type === 'direct' && (
                  <video controls style={{ width: '100%', display: 'block' }} src={video.url} />
                )}
                {video.type === 'iframe' && (
                  <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                    <iframe src={video.url} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} allowFullScreen />
                  </div>
                )}
              </>
            ) : (
              <div style={{ padding: 64, textAlign: 'center', color: 'var(--grey-3)' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>▶</div>
                <div style={{ fontSize: 15 }}>Video wird noch hinzugefügt</div>
              </div>
            )}
          </div>

          {/* Audio/Video Toggle */}
          {currentLesson.audio_url && (
            <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-pill)', padding: 4, width: 'fit-content' }}>
              <button onClick={() => setMediaMode('video')} className="btn" style={{ padding: '8px 16px', fontSize: 13, background: mediaMode === 'video' ? 'var(--ki-card)' : 'transparent', boxShadow: mediaMode === 'video' ? 'var(--sh-sm)' : 'none', color: mediaMode === 'video' ? 'var(--ki-text)' : 'var(--ki-text-secondary)' }}>
                📺 Video
              </button>
              <button onClick={() => setMediaMode('audio')} className="btn" style={{ padding: '8px 16px', fontSize: 13, background: mediaMode === 'audio' ? 'var(--ki-card)' : 'transparent', boxShadow: mediaMode === 'audio' ? 'var(--sh-sm)' : 'none', color: mediaMode === 'audio' ? 'var(--ki-text)' : 'var(--ki-text-secondary)' }}>
                🎧 Audio
              </button>
            </div>
          )}

          {/* Lesson Meta */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em' }}>{currentLesson.title}</h2>
              <span className={`pill pill-${currentLesson.type === 'exercise' ? 'gold' : 'grey'}`}>{typePill}</span>
              {currentLesson.duration_minutes && (
                <span style={{ fontSize: 13, color: 'var(--ki-text-tertiary)' }}>{currentLesson.duration_minutes} Min.</span>
              )}
            </div>
            {currentLesson.market_value_impact > 0 && (
              <span className="pill pill-green" style={{ marginTop: 4 }}>+€{currentLesson.market_value_impact} Marktwert</span>
            )}
          </div>

          {/* Description */}
          {currentLesson.description && (
            <p style={{ fontSize: 15, color: 'var(--ki-text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>
              {currentLesson.description}
            </p>
          )}

          {/* Content Box */}
          {currentLesson.content && (
            <div className="card" style={{ marginBottom: 24, background: 'var(--ki-bg-alt)', border: 'none' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Kerninhalt</div>
              <div style={{ fontSize: 15, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{currentLesson.content}</div>
            </div>
          )}

          {/* Exercise Box */}
          {currentLesson.exercise && (
            <div className="card" style={{ marginBottom: 24, background: 'rgba(204,20,38,0.03)', border: '1px solid rgba(204,20,38,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 18 }}>✎</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-red)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Übung</span>
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{currentLesson.exercise}</div>
            </div>
          )}

          {/* Notes */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Deine Notizen</div>
            <textarea
              className="input"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              onBlur={saveNotes}
              placeholder="Notizen zu dieser Lektion..."
              rows={4}
              style={{ resize: 'vertical', marginBottom: 12 }}
            />
            <button onClick={saveNotes} className="btn btn-ghost" style={{ fontSize: 13 }} disabled={saving}>
              {saving ? 'Speichert...' : 'Notizen speichern'}
            </button>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            {!isCompleted ? (
              <button onClick={markComplete} className="btn btn-primary" disabled={saving}>
                {saving ? 'Speichert...' : '✓ Als erledigt markieren'}
              </button>
            ) : (
              <span className="pill pill-green" style={{ fontSize: 14, padding: '8px 16px' }}>✓ Abgeschlossen</span>
            )}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, borderTop: '1px solid var(--ki-border)' }}>
            <button
              onClick={() => navigateTo(currentIndex - 1)}
              className="btn btn-secondary"
              disabled={currentIndex === 0}
              style={{ opacity: currentIndex === 0 ? 0.4 : 1 }}
            >
              ← Zurück
            </button>
            <span style={{ fontSize: 13, color: 'var(--ki-text-tertiary)' }}>
              {currentIndex + 1} / {totalCount}
            </span>
            <button
              onClick={() => navigateTo(currentIndex + 1)}
              className="btn btn-primary"
              disabled={currentIndex === totalCount - 1}
              style={{ opacity: currentIndex === totalCount - 1 ? 0.4 : 1 }}
            >
              Weiter →
            </button>
          </div>
        </div>

        {/* === RIGHT: Lesson Sidebar === */}
        <div style={{ position: 'sticky', top: 24 }}>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Course Header */}
            <div style={{ padding: '20px 20px 16px' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>{course.title}</h3>
              <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 12 }}>
                {completedCount}/{totalCount} abgeschlossen
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
              </div>
            </div>

            {/* Lesson List */}
            <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
              {(course.modules || []).map(mod => (
                <div key={mod.id}>
                  <div style={{ padding: '12px 20px 6px', fontSize: 11, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', background: 'var(--ki-bg-alt)' }}>
                    {mod.title}
                  </div>
                  {(mod.lessons || []).map(lesson => {
                    const idx = allLessons.findIndex(l => l.id === lesson.id);
                    const isActive = idx === currentIndex;
                    const isDone = progressMap[lesson.id]?.completed;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => navigateTo(idx)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          width: '100%', padding: '10px 20px', border: 'none',
                          background: isActive ? 'rgba(204,20,38,0.06)' : 'transparent',
                          cursor: 'pointer', textAlign: 'left',
                          transition: 'background var(--t-fast)',
                          borderLeft: isActive ? '3px solid var(--ki-red)' : '3px solid transparent',
                        }}
                      >
                        <span style={{
                          width: 20, height: 20, borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 700, flexShrink: 0,
                          background: isDone ? 'var(--ki-success)' : isActive ? 'var(--ki-red)' : 'var(--grey-5)',
                          color: isDone || isActive ? 'white' : 'var(--ki-text-tertiary)',
                        }}>
                          {isDone ? '✓' : isActive ? '▶' : '○'}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 13, fontWeight: isActive ? 600 : 400,
                            color: isActive ? 'var(--ki-text)' : 'var(--ki-text-secondary)',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>
                            {lesson.title}
                          </div>
                          {lesson.duration_minutes && (
                            <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)' }}>{lesson.duration_minutes} Min.</div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
