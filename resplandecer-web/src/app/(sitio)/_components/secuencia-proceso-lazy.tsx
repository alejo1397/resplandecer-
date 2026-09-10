"use client";

import dynamic from "next/dynamic";

// Carga diferida: el componente de la secuencia (canvas + logica de scroll) no
// entra en el bundle inicial; se carga solo en el cliente.
const SecuenciaProceso = dynamic(
  () => import("./secuencia-proceso").then((m) => m.SecuenciaProceso),
  {
    ssr: false,
    loading: () => <div className="h-[60vh] bg-ink" />,
  },
);

export function SecuenciaProcesoLazy({ imagen }: { imagen: string }) {
  return <SecuenciaProceso imagen={imagen} />;
}
