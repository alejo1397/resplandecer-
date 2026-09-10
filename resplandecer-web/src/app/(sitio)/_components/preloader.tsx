"use client";

import { useEffect, useState } from "react";

/**
 * Preloader: contador 000 -> 100 y cortina que se levanta al terminar.
 *
 * ROBUSTEZ (nunca debe dejar la pagina tapada):
 *  - Solo se muestra una vez por sesion (sessionStorage).
 *  - Se autodestruye SIEMPRE al llegar a 100 o tras un tope de 2.2s.
 *  - Respeta prefers-reduced-motion (no aparece).
 *  - Si algo falla, el componente se desmonta y deja ver la pagina.
 */
export function Preloader() {
  const [mostrar, setMostrar] = useState(false);
  const [saliendo, setSaliendo] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const prefiereMenos = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const yaVisto = sessionStorage.getItem("preloader-visto");

    if (prefiereMenos || yaVisto) {
      return; // no mostrar
    }

    setMostrar(true);
    sessionStorage.setItem("preloader-visto", "1");

    const inicio = performance.now();
    const duracion = 1400;
    let rafId = 0;

    const step = (now: number) => {
      const t = Math.min((now - inicio) / duracion, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setPct(Math.round(eased * 100));
      if (t < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setSaliendo(true);
        window.setTimeout(() => setMostrar(false), 700);
      }
    };
    rafId = requestAnimationFrame(step);

    // Tope de seguridad: pase lo que pase, se cierra a los 2.2s.
    const tope = window.setTimeout(() => {
      setSaliendo(true);
      window.setTimeout(() => setMostrar(false), 700);
    }, 2200);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(tope);
    };
  }, []);

  if (!mostrar) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[200] flex items-end justify-between bg-ink px-6 pb-8 transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.2,1)]"
      style={{ transform: saliendo ? "translateY(-100%)" : "translateY(0)" }}
    >
      <span className="display text-[clamp(3rem,12vw,9rem)] leading-none text-paper">
        {String(pct).padStart(3, "0")}
      </span>
      <span className="label-mono mb-4 text-paper/50">Resplandecer</span>
    </div>
  );
}
