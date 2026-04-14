/**
 * Sanitizes a filename for safe use in Supabase Storage paths.
 * Replaces German umlauts, removes special characters, and normalizes spaces.
 */
export function sanitizeFilename(filename) {
  const ext = filename.includes('.') ? '.' + filename.split('.').pop().toLowerCase() : '';
  const base = filename.includes('.') ? filename.slice(0, filename.lastIndexOf('.')) : filename;

  const sanitized = base
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/Ä/g, 'Ae')
    .replace(/Ö/g, 'Oe')
    .replace(/Ü/g, 'Ue')
    .replace(/ß/g, 'ss')
    .replace(/[àáâãåæ]/gi, 'a')
    .replace(/[èéêë]/gi, 'e')
    .replace(/[ìíîï]/gi, 'i')
    .replace(/[òóôõø]/gi, 'o')
    .replace(/[ùúûý]/gi, 'u')
    .replace(/[ñ]/gi, 'n')
    .replace(/[ç]/gi, 'c')
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  return (sanitized || 'lebenslauf') + ext;
}
