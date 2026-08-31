import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      // Supabase Storage (para imagenes reales en la Fase 6).
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
