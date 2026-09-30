"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";

type Imagen = { url: string; alt?: string | null };

/**
 * Galería con lightbox y zoom (RF-10).
 *
 * - Grid de miniaturas; al hacer clic abre el lightbox.
 * - Zoom con la rueda del mouse (scroll) dentro del lightbox.
 * - Cierra con botón X y con tecla Escape; el zoom se reinicia al cerrar.
 * - Navegación entre imágenes con flechas (‹ ›) y teclado.
 * - Bloquea el scroll del fondo mientras está abierto.
 * - Accesible: role="dialog", aria-modal, labels.
 */
export function Lightbox({
  imagenes,
  titulo,
  className = "",
}: {
  imagenes: Imagen[];
  titulo: string;
  className?: string;
}) {
  const [abierto, setAbierto] = useState(false);
  const [indice, setIndice] = useState(0);
  const [zoom, setZoom] = useState(1);
  const total = imagenes.length;

  const cerrar = useCallback(() => {
    setAbierto(false);
    setZoom(1);
  }, []);
  const siguiente = useCallback(() => {
    setIndice((i) => (i + 1) % total);
    setZoom(1);
  }, [total]);
  const anterior = useCallback(() => {
    setIndice((i) => (i - 1 + total) % total);
    setZoom(1);
  }, [total]);

  useEffect(() => {
    if (!abierto) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") cerrar();
      if (e.key === "ArrowRight") siguiente();
      if (e.key === "ArrowLeft") anterior();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [abierto, cerrar, siguiente, anterior]);

  function abrirEn(i: number) {
    setIndice(i);
    setZoom(1);
    setAbierto(true);
  }

  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    setZoom((z) => {
      const next = z - e.deltaY * 0.0015;
      return Math.min(4, Math.max(1, next));
    });
  }

  if (total === 0) return null;
  const actual = imagenes[indice]!;

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {imagenes.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => abrirEn(i)}
            aria-label={`Ampliar imagen ${i + 1}`}
            className="relative aspect-[4/3] overflow-hidden rounded-xl bg-ink/5"
          >
            <Image
              src={img.url}
              alt={img.alt ?? titulo}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </button>
        ))}
      </div>

      {abierto ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90"
          role="dialog"
          aria-modal="true"
          aria-label={`Imagen de ${titulo}`}
          onClick={cerrar}
        >
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar"
            className="absolute right-4 top-4 z-10 text-3xl text-white/80 hover:text-white"
          >
            ×
          </button>

          {total > 1 ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); anterior(); }}
              aria-label="Imagen anterior"
              className="absolute left-4 z-10 text-4xl text-white/70 hover:text-white"
            >
              ‹
            </button>
          ) : null}

          {/* Área de imagen con zoom por rueda */}
          <div
            className="relative h-[85vh] w-[92vw] max-w-5xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onWheel={onWheel}
          >
            <Image
              src={actual.url}
              alt={actual.alt ?? titulo}
              fill
              sizes="92vw"
              className="object-contain transition-transform duration-100"
              style={{ transform: `scale(${zoom})` }}
            />
            <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white/80">
              Usa la rueda del mouse para acercar
            </span>
          </div>

          {total > 1 ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); siguiente(); }}
              aria-label="Imagen siguiente"
              className="absolute right-4 z-10 text-4xl text-white/70 hover:text-white"
            >
              ›
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
