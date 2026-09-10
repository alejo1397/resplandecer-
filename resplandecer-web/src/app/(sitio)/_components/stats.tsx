"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  valor: number;
  sufijo?: string;
  etiqueta: string;
};

/**
 * Fila de estadisticas con contadores que suben al entrar en pantalla.
 * Ligero: IntersectionObserver nativo, sin librerias. Respeta reduced-motion.
 */
export function Stats({ items }: { items: Stat[] }) {
  return (
    <section className="border-y hairline-light bg-paper">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-5 py-16 md:grid-cols-4">
        {items.map((s, i) => (
          <Contador key={i} {...s} />
        ))}
      </div>
    </section>
  );
}

function Contador({ valor, sufijo = "", etiqueta }: Stat) {
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

    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started) {
          started = true;
          const duracion = 1400;
          const inicio = performance.now();
          const step = (now: number) => {
            const t = Math.min((now - inicio) / duracion, 1);
            // easing suave (easeOutExpo)
            const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            setDisplay(Math.round(eased * valor));
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    // Salvaguarda: si no dispara, mostrar el valor final.
    const safety = window.setTimeout(() => {
      if (!started) setDisplay(valor);
    }, 2000);

    return () => {
      io.disconnect();
      clearTimeout(safety);
    };
  }, [valor]);

  return (
    <div ref={ref} className="text-center">
      <p className="display text-[clamp(2.5rem,7vw,5rem)] text-ink">
        {display.toLocaleString("es-CO")}
        {sufijo}
      </p>
      <p className="label-mono mt-2 text-ink/50">{etiqueta}</p>
    </div>
  );
}
