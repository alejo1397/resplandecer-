"use client";

import { useEffect, useState } from "react";

/**
 * Barra de progreso de lectura: una linea fija arriba que se llena segun
 * cuanto ha bajado el usuario. Ligera (listener de scroll pasivo).
 */
export function ProgresoLectura() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const h = document.documentElement;
        const total = h.scrollHeight - h.clientHeight;
        const avance = total > 0 ? (h.scrollTop / total) * 100 : 0;
        setPct(avance);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent" aria-hidden>
      <div
        className="h-full bg-ember transition-[width] duration-100 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
