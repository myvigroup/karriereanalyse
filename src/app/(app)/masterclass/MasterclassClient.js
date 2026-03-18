'use client';
import { useState, useMemo } from 'react';
import { classifyScore } from '@/lib/career-logic';

export default function MasterclassClient({ courses, progress, analysisResults, profile }) {
  const [filter, setFilter] = useState('all'); // all, recommended, completed
  const completedSet = new Set((progress || []).filter(p => p.completed).map(p => p.lesson_id));

  const enriched = useMemo(() => {
    return (courses || []).map(c => {
      const result = (analysisResults || []).find(r => r.field_id === c.competency_field_id);
      const total = (c.modules || []).reduce((s, m) => s + (m.lessons || []).length, 0);
      const done = (c.modules || []).reduce((s, m) => s + (m.lessons || []).filter(l => completedSet.has(l.id)).length, 0);
      const score = result?.score ?? null;
      const priority = score !== null ? (score < 40 ? 1 : score < 60 ? 2 : score < 80 ? 3 : 0) : 0;
      return { ...c, fieldScore: score, priority, completedLessons: done, totalLessons: total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
    });
  }, [courses, analysisResults, completedSet]);

  const recommended = enriched.filter(c => c.priority > 0 && c.priority <= 3).sort((a, b) => a.priority - b.priority);
  const filtered = filter === 'recommended' ? recommended :
    filter === 'completed' ? enriched.filter(c => c.pct === 100) : enriched;

  const totalMarketValue = enriched.reduce((s, c) => s + (c.market_value_impact || 0), 0);
  const earnedMarketValue = enriched.reduce((s, c) => {
    if (c.totalLessons === 0) return s;
    return s + Math.round((c.market_value_impact || 0) * (c.completedLessons / c.totalLessons));
  }, 0);

  const CourseCard = ({ course }) => {
    const cls = course.fieldScore !== null ? classifyScore(course.fieldScore) : { color: 'var(--ki-text-secondary)' };
    return (
      <a href={`/masterclass/${course.id}`} className="card animate-in" style={{
        textDecoration: 'none', color: 'inherit', position: 'relative', overflow: 'hidden',
        borderLeft: course.priority > 0 ? '3px solid var(--ki-red)' : '3px solid transparent',
      }}>
        {course.priority > 0 && course.priority <= 3 && (
          <span className="pill pill-red" style={{ position: 'absolute', top: 12, right: 12, fontSize: 11 }}>PRIO {course.priority}</span>
        )}
        <div style={{ fontSize: 13, color: 'var(--ki-text-tertiary)', fontWeight: 500, marginBottom: 4 }}>{course.category}</div>
        <h3 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>{course.title}</h3>
        <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>{course.description}</p>

        {/* Progress */}
        <div className="progress-bar" style={{ marginBottom: 8 }}>
          <div className="progress-bar-fill" style={{ width: `${course.pct}%`, background: course.pct === 100 ? 'var(--ki-success)' : 'var(--ki-red)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ color: 'var(--ki-text-secondary)' }}>{course.completedLessons} / {course.totalLessons} Lektionen</span>
          <span style={{ fontWeight: 600, color: course.pct === 100 ? 'var(--ki-success)' : 'var(--ki-text)' }}>{course.pct}%</span>
        </div>

        {/* Market Value Badge */}
        {course.market_value_impact > 0 && (
          <div style={{ marginTop: 12, padding: '6px 12px', background: 'rgba(45,106,79,0.06)', borderRadius: 'var(--r-pill)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 12, color: 'var(--ki-success)', fontWeight: 600 }}>+ €{course.market_value_impact.toLocaleString('de-DE')} Marktwert</span>
          </div>
        )}

        {/* Field Score */}
        {course.fieldScore !== null && (
          <div style={{ marginTop: 8, fontSize: 12, color: cls.color }}>
            Kompetenz: {Math.round(course.fieldScore)}% — {cls.label}
          </div>
        )}
      </a>
    );
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 className="page-title">Masterclass</h1>
          <p className="page-subtitle">Dein personalisierter Lernpfad — {courses?.length || 0} Module</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--ki-success)' }}>+ €{earnedMarketValue.toLocaleString('de-DE')}</div>
          <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>von €{totalMarketValue.toLocaleString('de-DE')} Potenzial</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[['all', 'Alle Module'], ['recommended', `Empfohlen (${recommended.length})`], ['completed', 'Abgeschlossen']].map(([key, label]) => (
          <button key={key} className={`btn ${filter === key ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(key)} style={{ fontSize: 13, padding: '8px 16px' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Recommended Section */}
      {filter === 'all' && recommended.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>🎯 Dein Fokus</h2>
          <div className="grid-3">
            {recommended.map(c => <CourseCard key={c.id} course={c} />)}
          </div>
        </div>
      )}

      {/* All Courses */}
      <div>
        {filter === 'all' && recommended.length > 0 && (
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>Alle Module</h2>
        )}
        <div className="grid-3">
          {filtered.map(c => <CourseCard key={c.id} course={c} />)}
        </div>
        {filtered.length === 0 && (
          <div className="card" style={{ padding: 48, textAlign: 'center' }}>
            <p style={{ color: 'var(--ki-text-secondary)' }}>Keine Module in dieser Ansicht.</p>
          </div>
        )}
      </div>
    </div>
  );
}
