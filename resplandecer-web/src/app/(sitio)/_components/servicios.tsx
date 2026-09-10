"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Servicio = {
  nombre: string;
  descripcion: string;
  imagen?: string;
};

/**
 * Lista de servicios con imagen flotante que sigue al cursor en hover (desktop).
 * En movil se muestra como lista simple (sin el efecto de cursor).
 */
export function Servicios({ items }: { items: Servicio[] }) {
  const [activo, setActivo] = useState<number | null>(null);
  const zonaRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);

  function onMove(e: React.MouseEvent) {
    const zona = zonaRef.current;
    const img = imgRef.current;
    if (!zona || !img) return;
    const rect = zona.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    img.style.transform = `translate(${x}px, ${y}px)`;
  }

  return (
    <section className="bg-paper py-20">
      <div className="mx-auto max-w-7xl px-5">
        <p className="label-mono text-ink/50">Que hacemos</p>
        <h2 className="display mt-3 text-[clamp(1.6rem,3.5vw,2.6rem)] text-ink">
          Servicios
        </h2>

        <div
          ref={zonaRef}
          onMouseMove={onMove}
          className="relative mt-10 border-t hairline-light"
        >
          {items.map((s, i) => (
            <div
              key={i}
              onMouseEnter={() => setActivo(i)}
              onMouseLeave={() => setActivo(null)}
              className="group flex cursor-default items-center justify-between border-b hairline-light py-6 transition-colors hover:bg-ink hover:px-5 hover:text-paper"
            >
              <div className="flex items-baseline gap-5">
                <span className="label-mono text-ink/40 group-hover:text-paper/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display text-2xl text-ink group-hover:text-paper md:text-3xl">
                  {s.nombre}
                </h3>
              </div>
              <p className="hidden max-w-xs text-right text-sm text-ink/60 group-hover:text-paper/70 md:block">
                {s.descripcion}
              </p>
            </div>
          ))}

          {/* Imagen flotante que sigue al cursor (solo desktop) */}
          <div
            ref={imgRef}
            className="pointer-events-none absolute left-0 top-0 z-20 hidden -translate-x-1/2 -translate-y-1/2 md:block"
            style={{ opacity: activo !== null && items[activo]?.imagen ? 1 : 0, transition: "opacity 0.3s" }}
          >
            {activo !== null && items[activo]?.imagen ? (
              <div className="relative h-56 w-44 overflow-hidden rounded-xl shadow-2xl">
                <Image
                  src={items[activo]!.imagen!}
                  alt={items[activo]!.nombre}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
