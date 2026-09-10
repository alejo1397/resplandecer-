"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Contador "scrubbed": una cifra gigante que sube ligada al scroll (avanza y
 * retrocede segun el usuario baja o sube). Distinto de los stats (que cuentan
 * una vez). Ligero: scroll pasivo + rAF. Respeta reduced-motion.
 */
export function ContadorScroll({
  valor,
  sufijo = "",
  etiqueta,
}: {
  valor: number;
  sufijo?: string;
  etiqueta: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefiereMenos = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefiereMenos) {
      setDisplay(valor);
      return;
    }

    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // progreso 0..1 mientras la seccion cruza el centro de la pantalla
        const raw = 1 - (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
        const p = Math.max(0, Math.min(1, raw));
        setDisplay(Math.round(p * valor));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [valor]);

  return (
    <section ref={ref} className="bg-ink py-24 text-paper">
      <div className="mx-auto max-w-7xl px-5 text-center">
        <p className="display text-[clamp(4rem,20vw,16rem)] leading-none text-paper">
          {display.toLocaleString("es-CO")}
          {sufijo}
        </p>
        <p className="label-mono mt-4 text-paper/50">{etiqueta}</p>
      </div>
    </section>
  );
}
