/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    // unpdf bündelt eine serverless-taugliche pdf.js-Variante für die CV-Textextraktion
    serverComponentsExternalPackages: ['unpdf'],
  },
};

module.exports = nextConfig;
