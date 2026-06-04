'use client';
import { useRouter } from 'next/navigation';

export default function FairFilterSelect({ fairs, currentFairId, statusFilter, followUpFilter }) {
  const router = useRouter();

  function handleChange(e) {
    const fairId = e.target.value;
    const params = new URLSearchParams();
    if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
    if (followUpFilter) params.set('followUp', followUpFilter);
    if (fairId) params.set('fair', fairId);
    router.push(`/advisor/leads?${params.toString()}`);
  }

  return (
    <select
      value={currentFairId || ''}
      onChange={handleChange}
      style={{
        padding: '7px 14px',
        borderRadius: 980,
        fontSize: 13,
        fontWeight: currentFairId ? 600 : 400,
        background: currentFairId ? '#1A1A1A' : '#fff',
        color: currentFairId ? '#fff' : '#1A1A1A',
        border: '1px solid',
        borderColor: currentFairId ? '#1A1A1A' : '#E8E6E1',
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      <option value="">Alle Messen</option>
      {(fairs || []).map(f => (
        <option key={f.id} value={f.id}>{f.name}</option>
      ))}
    </select>
  );
}
