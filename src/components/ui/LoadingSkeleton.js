'use client';

const shimmerStyle = {
  background: 'linear-gradient(90deg, var(--grey-6) 25%, var(--grey-5) 50%, var(--grey-6) 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  borderRadius: 'var(--r-md)',
};

function SkeletonBox({ width = '100%', height = 16, style = {} }) {
  return <div style={{ ...shimmerStyle, width, height, ...style }} />;
}

export function CardSkeleton() {
  return (
    <div className="card" style={{ padding: 24 }}>
      <SkeletonBox width="40%" height={14} style={{ marginBottom: 16 }} />
      <SkeletonBox height={32} style={{ marginBottom: 12 }} />
      <SkeletonBox width="70%" height={12} />
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </div>
  );
}

export function ListSkeleton({ rows = 4 }) {
  return (
    <div className="card" style={{ padding: 24 }}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: i < rows - 1 ? '1px solid var(--ki-border)' : 'none' }}>
          <SkeletonBox width={36} height={36} style={{ borderRadius: '50%', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <SkeletonBox width="60%" height={14} style={{ marginBottom: 6 }} />
            <SkeletonBox width="40%" height={10} />
          </div>
        </div>
      ))}
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="card" style={{ padding: 24 }}>
      <SkeletonBox width="30%" height={14} style={{ marginBottom: 16 }} />
      <SkeletonBox height={200} />
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </div>
  );
}

export default function LoadingSkeleton({ variant = 'card' }) {
  if (variant === 'list') return <ListSkeleton />;
  if (variant === 'chart') return <ChartSkeleton />;
  return <CardSkeleton />;
}
