'use client';

import { useState } from 'react';

const FOLLOW_UP_OPTIONS = [
  { value: '', label: '– Status setzen –', bg: '#F9F9F9', color: '#9CA3AF' },
  { value: 'not_reached', label: 'Nicht erreicht', bg: '#FEF3C7', color: '#D97706' },
  { value: 'appointment_set', label: 'Termin vereinbart', bg: '#DBEAFE', color: '#1D4ED8' },
  { value: 'interested', label: 'Interessiert', bg: '#D1FAE5', color: '#059669' },
  { value: 'no_interest', label: 'Kein Interesse', bg: '#F3F4F6', color: '#6B7280' },
  { value: 'purchased', label: 'Gekauft ✓', bg: '#FCE4EC', color: '#CC1426' },
];

export default function FollowUpSelect({ leadId, initialValue }) {
  const [value, setValue] = useState(initialValue || '');
  const [saving, setSaving] = useState(false);

  const current = FOLLOW_UP_OPTIONS.find(o => o.value === value) || FOLLOW_UP_OPTIONS[0];

  async function handleChange(e) {
    const newVal = e.target.value;
    setValue(newVal);
    setSaving(true);
    await fetch('/api/leads/follow-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId, status: newVal || null }),
    });
    setSaving(false);
  }

  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={handleChange}
        disabled={saving}
        style={{
          appearance: 'none',
          padding: '4px 28px 4px 10px',
          borderRadius: 980,
          border: `1px solid ${current.color}30`,
          background: current.bg,
          color: current.color,
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          outline: 'none',
          opacity: saving ? 0.6 : 1,
          whiteSpace: 'nowrap',
        }}
      >
        {FOLLOW_UP_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <span style={{
        position: 'absolute',
        right: 8,
        top: '50%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
        fontSize: 10,
        color: current.color,
      }}>▾</span>
    </div>
  );
}
