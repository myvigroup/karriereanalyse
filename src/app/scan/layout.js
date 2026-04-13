export default function ScanLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8' }}>
      {/* Top bar */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid #E8E6E1',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: '#CC1426', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 16,
          }}>K</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#1A1A1A' }}>Karriere-Institut</span>
        </div>
      </div>
      {children}
    </div>
  );
}
