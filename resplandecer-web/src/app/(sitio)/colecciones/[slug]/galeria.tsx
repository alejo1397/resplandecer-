"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";

type Imagen = { url: string; textoAlternativo: string | null };

/**
 * Galería de la colección: muestra una imagen grande que va cambiando entre las
 * disponibles (con miniaturas). Al hacer clic abre un lightbox con zoom.
 * Accesible: navegable con teclado (flechas para cambiar, Escape para cerrar).
 */
export function GaleriaColeccion({ imagenes, titulo }: { imagenes: Imagen[]; titulo: string }) {
  const [activa, setActiva] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const total = imagenes.length;

  const siguiente = useCallback(() => setActiva((i) => (i + 1) % total), [total]);
  const anterior = useCallback(() => setActiva((i) => (i - 1 + total) % total), [total]);

  useEffect(() => {
    if (total <= 1) return;
    // Auto-rotación suave cuando el lightbox está cerrado.
    if (lightbox) return;
    const t = setInterval(siguiente, 4000);
    return () => clearInterval(t);
  }, [siguiente, total, lightbox]);

  useEffect(() => {
    if (!lightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") siguiente();
      if (e.key === "ArrowLeft") anterior();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, siguiente, anterior]);

  if (total === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-ink/5 text-sm text-ink/40">
        Sin imágenes aún.
      </div>
    );
  }

  const actual = imagenes[activa]!;

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightbox(true)}
        className="relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ink/5"
        aria-label="Ampliar imagen"
      >
        <Image
          src={actual.url}
          alt={actual.textoAlternativo ?? titulo}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-opacity duration-500"
          priority
        />
      </button>

      {total > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Miniaturas">
          {imagenes.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiva(i)}
              aria-label={`Ver imagen ${i + 1}`}
              aria-current={i === activa}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === activa ? "border-ink" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={img.url} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      {lightbox ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Imagen de ${titulo}`}
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label="Cerrar"
            className="absolute right-4 top-4 text-3xl text-white/80 hover:text-white"
          >
            ×
          </button>

          {total > 1 ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                anterior();
              }}
              aria-label="Anterior"
              className="absolute left-4 text-4xl text-white/70 hover:text-white"
            >
              ‹
            </button>
          ) : null}

          <div className="relative h-[80vh] w-[90vw] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={actual.url}
              alt={actual.textoAlternativo ?? titulo}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>

          {total > 1 ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                siguiente();
              }}
              aria-label="Siguiente"
              className="absolute right-4 text-4xl text-white/70 hover:text-white"
            >
              ›
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
