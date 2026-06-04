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
        padding: '7px 32px 7px 14px',
        borderRadius: 980,
        fontSize: 13,
        fontWeight: 500,
        background: currentFairId ? '#1A1A1A' : '#fff',
        color: currentFairId ? '#fff' : '#1A1A1A',
        border: '1px solid',
        borderColor: currentFairId ? '#1A1A1A' : '#E8E6E1',
        cursor: 'pointer',
        appearance: 'none',
        WebkitAppearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='${currentFairId ? 'white' : '%236B7280'}' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 10px center',
        minWidth: 120,
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
