import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
