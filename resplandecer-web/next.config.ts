import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Las server actions limitan el cuerpo a 1 MB por defecto. Subimos el limite
  // para permitir la subida de imagenes (el helper valida max 5 MB por archivo).
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      // Supabase Storage (para imagenes reales en la Fase 6).
      { protocol: "https", hostname: "*.supabase.co" },
    ],
    // placehold.co devuelve SVG. Se permite solo para los placeholders de ejemplo
    // (dominios en la lista blanca de arriba). Las imagenes reales seran raster.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
