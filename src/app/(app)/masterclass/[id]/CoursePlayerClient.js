'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { awardPoints } from '@/lib/gamification';
import InfoTooltip from '@/components/ui/InfoTooltip';
import EmptyState from '@/components/ui/EmptyState';

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
  const [showAction, setShowAction] = useState(false);
  const [actionItem, setActionItem] = useState('');
  const [actionDeadline, setActionDeadline] = useState(() => { const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().split('T')[0]; });

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({}); // { [questionIndex]: selectedOption }
  const [quizResults, setQuizResults] = useState({}); // { [questionIndex]: 'correct' | 'wrong' }
  const [quizSaved, setQuizSaved] = useState(false);
  const [quizXpPills, setQuizXpPills] = useState({}); // { [questionIndex]: true } show +50 XP pill
  const shakeTimers = useRef({});

  // Practice state
  const [practiceResponse, setPracticeResponse] = useState('');
  const [practiceSaving, setPracticeSaving] = useState(false);
  const [practiceCompleted, setPracticeCompleted] = useState(false);

  const currentLesson = allLessons[currentIndex];
  const completedCount = allLessons.filter(l => progressMap[l.id]?.completed).length;
  const totalCount = allLessons.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  function navigateTo(index) {
    setCurrentIndex(index);
    setNotes(progressMap[allLessons[index]?.id]?.notes || '');
    setMediaMode('video');
    // Reset quiz & practice for new lesson
    setQuizAnswers({});
    setQuizResults({});
    setQuizSaved(false);
    setQuizXpPills({});
    const lessonId = allLessons[index]?.id;
    setPracticeResponse(progressMap[lessonId]?.practice_response || '');
    setPracticeCompleted(progressMap[lessonId]?.practice_completed || false);
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

  const saveAction = async () => {
    if (!currentLesson || !actionItem.trim()) return;
    setSaving(true);
    await supabase.from('lesson_progress').upsert({
      user_id: userId,
      lesson_id: currentLesson.id,
      action_item: actionItem,
      action_deadline: actionDeadline,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,lesson_id' });
    setProgressMap(prev => ({
      ...prev,
      [currentLesson.id]: { ...prev[currentLesson.id], action_item: actionItem, action_deadline: actionDeadline }
    }));
    setSaving(false);
    setShowAction(false);
  };

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

  // Sync practice state from progressMap on mount / lesson change
  useEffect(() => {
    if (!currentLesson) return;
    const p = progressMap[currentLesson.id];
    setPracticeResponse(p?.practice_response || '');
    setPracticeCompleted(p?.practice_completed || false);
    setQuizAnswers({});
    setQuizResults({});
    setQuizSaved(false);
    setQuizXpPills({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLesson?.id]);

  // Award custom XP (not tied to POINT_ACTIONS enum)
  async function awardCustomPoints(points) {
    const { data: prof } = await supabase.from('profiles').select('total_points').eq('id', userId).single();
    const newTotal = (prof?.total_points || 0) + points;
    await supabase.from('profiles').update({ total_points: newTotal }).eq('id', userId);
  }

  async function handleQuizAnswer(qIndex, optionIndex, correctIndex) {
    if (quizResults[qIndex]) return; // already answered correctly
    const isCorrect = optionIndex === correctIndex;
    setQuizAnswers(prev => ({ ...prev, [qIndex]: optionIndex }));
    setQuizResults(prev => ({ ...prev, [qIndex]: isCorrect ? 'correct' : 'wrong' }));
    if (isCorrect) {
      setQuizXpPills(prev => ({ ...prev, [qIndex]: true }));
      await awardCustomPoints(50);
      // Hide XP pill after 2.5s
      setTimeout(() => setQuizXpPills(prev => ({ ...prev, [qIndex]: false })), 2500);
    } else {
      // Clear wrong answer after 1.5s to allow retry
      if (shakeTimers.current[qIndex]) clearTimeout(shakeTimers.current[qIndex]);
      shakeTimers.current[qIndex] = setTimeout(() => {
        setQuizAnswers(prev => ({ ...prev, [qIndex]: undefined }));
        setQuizResults(prev => ({ ...prev, [qIndex]: 'retry' }));
      }, 1500);
    }
  }

  async function saveQuizProgress(questions) {
    if (quizSaved || !currentLesson) return;
    const correctCount = Object.values(quizResults).filter(r => r === 'correct').length;
    const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    setQuizSaved(true);
    await supabase.from('lesson_progress').upsert({
      user_id: userId,
      lesson_id: currentLesson.id,
      quiz_score: score,
      quiz_answers: quizAnswers,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,lesson_id' });
    setProgressMap(prev => ({
      ...prev,
      [currentLesson.id]: { ...prev[currentLesson.id], quiz_score: score, quiz_answers: quizAnswers }
    }));
  }

  async function savePractice() {
    if (!currentLesson || !practiceResponse.trim()) return;
    setPracticeSaving(true);
    await supabase.from('lesson_progress').upsert({
      user_id: userId,
      lesson_id: currentLesson.id,
      practice_response: practiceResponse,
      practice_completed: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,lesson_id' });
    setProgressMap(prev => ({
      ...prev,
      [currentLesson.id]: { ...prev[currentLesson.id], practice_response: practiceResponse, practice_completed: true }
    }));
    setPracticeCompleted(true);
    await awardCustomPoints(30);
    setPracticeSaving(false);
  }

  if (!currentLesson) {
    return (
      <div className="page-container">
        <h1 className="page-title">{course.title}</h1><InfoTooltip moduleId="masterclass" profile={profile} />
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
      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
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
              <div className="card" style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(204,20,38,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>▶</div>
                <div style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>Video wird vorbereitet</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Interaktive Übung verfügbar ↓</div>
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

          {/* Quiz Section */}
          {(() => {
            const questions = currentLesson.quiz_data?.questions;
            if (!questions || questions.length === 0) return null;
            const allCorrect = questions.every((_, i) => quizResults[i] === 'correct');
            return (
              <div className="card" style={{ marginBottom: 24, border: '1px solid rgba(204,20,38,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                  <span style={{ fontSize: 20 }}>🧠</span>
                  <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>Quiz</span>
                  {allCorrect && (
                    <span className="pill pill-green" style={{ marginLeft: 'auto', fontSize: 12 }}>Abgeschlossen ✓</span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                  {questions.map((q, qi) => {
                    const result = quizResults[qi];
                    const selected = quizAnswers[qi];
                    const isCorrect = result === 'correct';
                    const isWrong = result === 'wrong';
                    const showXp = quizXpPills[qi];
                    return (
                      <div key={qi}>
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, lineHeight: 1.5 }}>
                          {qi + 1}. {q.question}
                          {showXp && (
                            <span style={{
                              marginLeft: 10, fontSize: 12, fontWeight: 700,
                              background: 'var(--ki-success)', color: 'white',
                              padding: '2px 10px', borderRadius: 20,
                              animation: 'fadeInUp 0.3s ease',
                            }}>+50 XP</span>
                          )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {(q.options || []).map((opt, oi) => {
                            const isSelected = selected === oi;
                            const isThisCorrect = oi === q.correct;
                            let bg = 'var(--ki-bg-alt)';
                            let border = '1px solid var(--ki-border)';
                            let color = 'var(--ki-text)';
                            if (isCorrect && isThisCorrect) { bg = 'rgba(34,197,94,0.12)'; border = '1px solid rgba(34,197,94,0.4)'; color = '#16a34a'; }
                            else if (isWrong && isSelected) { bg = 'rgba(239,68,68,0.10)'; border = '1px solid rgba(239,68,68,0.4)'; color = '#dc2626'; }
                            return (
                              <button
                                key={oi}
                                onClick={() => handleQuizAnswer(qi, oi, q.correct)}
                                disabled={isCorrect}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 10,
                                  padding: '10px 14px', borderRadius: 'var(--r-md)',
                                  background: bg, border, color,
                                  cursor: isCorrect ? 'default' : 'pointer',
                                  textAlign: 'left', fontSize: 14,
                                  transition: 'all 0.15s',
                                  animation: (isWrong && isSelected) ? 'shake 0.4s ease' : 'none',
                                  fontWeight: isSelected ? 600 : 400,
                                }}
                              >
                                <span style={{
                                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: 11, fontWeight: 700,
                                  background: isCorrect && isThisCorrect ? 'rgba(34,197,94,0.2)' : isWrong && isSelected ? 'rgba(239,68,68,0.2)' : 'var(--ki-card)',
                                  border: '1px solid currentColor',
                                }}>
                                  {isCorrect && isThisCorrect ? '✓' : isWrong && isSelected ? '✗' : String.fromCharCode(65 + oi)}
                                </span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {isWrong && (
                          <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 'var(--r-sm)', background: 'rgba(239,68,68,0.06)', fontSize: 13, color: '#dc2626' }}>
                            Tipp: Schau dir den Lektionsinhalt nochmal an und versuche es erneut.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {allCorrect && !quizSaved && (
                  <div style={{ marginTop: 20 }}>
                    <button onClick={() => saveQuizProgress(questions)} className="btn btn-primary" style={{ fontSize: 13 }}>
                      Quiz-Ergebnis speichern
                    </button>
                  </div>
                )}
                {quizSaved && (
                  <div style={{ marginTop: 16, fontSize: 13, color: 'var(--ki-text-tertiary)' }}>
                    Ergebnis gespeichert ✓
                  </div>
                )}
              </div>
            );
          })()}

          {/* Practice Section */}
          {currentLesson.practice_prompt && (
            <div className="card" style={{ marginBottom: 24, border: '1px solid rgba(204,20,38,0.12)', background: 'rgba(204,20,38,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>✍️</span>
                <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>Praxisaufgabe</span>
                {practiceCompleted && (
                  <span className="pill pill-green" style={{ marginLeft: 'auto', fontSize: 12 }}>Erledigt +30 XP ✓</span>
                )}
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
                {currentLesson.practice_prompt}
              </p>
              <textarea
                className="input"
                value={practiceResponse}
                onChange={e => setPracticeResponse(e.target.value)}
                placeholder="Deine Antwort oder Ergebnis..."
                rows={4}
                style={{ resize: 'vertical', marginBottom: 12 }}
                disabled={practiceCompleted}
              />
              {!practiceCompleted && (
                <button
                  onClick={savePractice}
                  className="btn btn-primary"
                  disabled={practiceSaving || !practiceResponse.trim()}
                  style={{ fontSize: 13 }}
                >
                  {practiceSaving ? 'Speichert...' : 'Erledigt (+30 XP)'}
                </button>
              )}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            {!isCompleted ? (
              <button onClick={markComplete} className="btn btn-primary" disabled={saving}>
                {saving ? 'Speichert...' : '✓ Als erledigt markieren'}
              </button>
            ) : (
              <span className="pill pill-green" style={{ fontSize: 14, padding: '8px 16px' }}>✓ Abgeschlossen</span>
            )}
            <button onClick={() => { setActionItem(progressMap[currentLesson.id]?.action_item || ''); setShowAction(true); }} className="btn btn-secondary">
              🎯 In Action
            </button>
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

      {/* Action Modal */}
      {showAction && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowAction(false)}>
          <div className="card" style={{ width: '100%', maxWidth: 520, margin: 16 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>🎯 In Action</div>
            <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 20 }}>Was ist dein konkreter nächster Schritt aus dieser Lektion?</p>
            <textarea
              className="input"
              value={actionItem}
              onChange={e => setActionItem(e.target.value)}
              placeholder="z.B. LinkedIn-Profil aktualisieren, Netzwerk-Mail versenden..."
              rows={4}
              style={{ resize: 'vertical', marginBottom: 16 }}
            />
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-text-secondary)', display: 'block', marginBottom: 6 }}>Deadline</label>
              <input
                type="date"
                className="input"
                value={actionDeadline}
                onChange={e => setActionDeadline(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowAction(false)} className="btn btn-ghost">Abbrechen</button>
              <button onClick={saveAction} className="btn btn-primary" disabled={saving || !actionItem.trim()}>
                {saving ? 'Speichert...' : 'Speichern'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
