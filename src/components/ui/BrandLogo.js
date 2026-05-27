// Karriere-Institut Logo — überall einheitlich verwenden.
// Verwende prop `variant` für Größen-Varianten.

export default function BrandLogo({ variant = 'default', className = '', style = {} }) {
  const heights = {
    small: 24,
    default: 32,
    large: 44,
    xl: 56,
  };
  const h = heights[variant] || heights.default;
  return (
    <img
      src="/logo-karriereinstitut.png"
      alt="Karriere-Institut"
      style={{ height: h, width: 'auto', display: 'block', ...style }}
      className={className}
    />
  );
}
