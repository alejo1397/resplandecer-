"use client";

import dynamic from "next/dynamic";

// El canvas se carga solo en el cliente y de forma diferida (no entra en el
// bundle inicial del servidor). Mientras carga, se ve el fondo del contenedor.
const PlanoOrbital = dynamic(
  () => import("./plano-orbital").then((m) => m.PlanoOrbital),
  {
    ssr: false,
    loading: () => <div className="h-full w-full" />,
  },
);

export function HeroFigura() {
  return (
    <div className="pointer-events-auto absolute inset-0 hidden md:block">
      <PlanoOrbital />
    </div>
  );
}
