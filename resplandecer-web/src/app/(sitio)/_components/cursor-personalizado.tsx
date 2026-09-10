"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cursor personalizado: un punto que sigue al mouse con mix-blend-mode:difference
 * y crece al pasar sobre enlaces/botones.
 *
 * - Solo en dispositivos con puntero fino (desktop). En tactil no se muestra.
 * - Respeta prefers-reduced-motion.
 * - No interfiere con clics (pointer-events: none).
 */
export function CursorPersonalizado() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [activo, setActivo] = useState(false);
  const [grande, setGrande] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const prefiereMenos = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || prefiereMenos) return;

    setActivo(true);

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      const target = e.target as HTMLElement;
      const interactivo = target.closest("a, button, [role='button'], input, textarea, select");
      setGrande(Boolean(interactivo));
    };

    const render = () => {
      // suavizado (lerp)
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!activo) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70] rounded-full bg-paper transition-[width,height] duration-200 ease-out"
      style={{
        width: grande ? 48 : 12,
        height: grande ? 48 : 12,
        mixBlendMode: "difference",
      }}
    />
  );
}
