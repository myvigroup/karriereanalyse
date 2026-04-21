/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // pdf-parse hat einen bekannten Bug in Next.js Serverless (liest Test-Dateien)
  // → als externe Package markieren damit es im Node.js Runtime läuft
  // Next.js 14: experimental.serverComponentsExternalPackages (ab v15: serverExternalPackages)
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse'],
  },
};

module.exports = nextConfig;
