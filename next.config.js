/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // pdf-parse hat einen bekannten Bug in Next.js Serverless (liest Test-Dateien)
  // → als externe Package markieren damit es im Node.js Runtime läuft
  serverExternalPackages: ['pdf-parse'],
};

module.exports = nextConfig;
