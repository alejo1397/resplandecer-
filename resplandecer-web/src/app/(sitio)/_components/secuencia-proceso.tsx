"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Secuencia cinematografica sticky: seccion alta (~300vh) donde el scroll avanza
 * por 4 fases del proceso de fabricacion, aplicando efectos progresivos sobre
 * una imagen base en canvas 2D. HUD de telemetria + barra de progreso.
 *
 * Performance:
 *  - Una sola imagen base (no 60 archivos); los "fotogramas" son efectos de
 *    canvas (filtros) calculados por scroll.
 *  - Solo se activa en desktop (pointer fino y pantalla ancha).
 *  - En movil / reduced-motion: imagen estatica simple.
 *  - Scroll pasivo + rAF.
 */

const FASES = ["Replanteo", "Corte y armado", "Acabados", "Instalacion"];

export function SecuenciaProceso({ imagen }: { imagen: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [progreso, setProgreso] = useState(0);
  const [activa, setActiva] = useState(false);

  useEffect(() => {
    const esDesktop = window.matchMedia("(min-width: 768px) and (pointer: fine)").matches;
    const prefiereMenos = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!esDesktop || prefiereMenos) return;

    setActiva(true);

    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imagen;
    let cargada = false;
    img.onload = () => {
      cargada = true;
      draw();
    };

    let width = 0;
    let height = 0;
    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    let p = 0;
    function draw() {
      if (!cargada) return;
      ctx!.clearRect(0, 0, width, height);

      // cover
      const ir = img.width / img.height;
      const cr = width / height;
      let dw = width, dh = height, dx = 0, dy = 0;
      if (ir > cr) {
        dh = height; dw = height * ir; dx = (width - dw) / 2;
      } else {
        dw = width; dh = width / ir; dy = (height - dh) / 2;
      }

      // Efecto progresivo por fase:
      // fase 0: gris/plano; fase 1: contraste; fase 2: saturacion; fase 3: final nitido
      const sat = 0.2 + p * 0.9;       // 0.2 -> 1.1
      const contrast = 0.9 + p * 0.3;  // 0.9 -> 1.2
      const bright = 0.85 + p * 0.2;   // 0.85 -> 1.05
      ctx!.filter = `grayscale(${1 - p}) saturate(${sat}) contrast(${contrast}) brightness(${bright})`;
      ctx!.drawImage(img, dx, dy, dw, dh);
      ctx!.filter = "none";

      // vinieta
      const grad = ctx!.createRadialGradient(
        width / 2, height / 2, Math.min(width, height) * 0.3,
        width / 2, height / 2, Math.max(width, height) * 0.7,
      );
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(0,0,0,0.45)");
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, width, height);
    }

    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = wrap.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = rect.height - vh;
        const avance = Math.max(0, Math.min(1, -rect.top / total));
        p = avance;
        setProgreso(avance);
        draw();
      });
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("scroll", onScroll, { passive: true });
    resize();
    onScroll();

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [imagen]);

  const faseActual = Math.min(FASES.length - 1, Math.floor(progreso * FASES.length));
  const frame = Math.round(progreso * 60);

  // Fallback movil / reduced-motion: imagen estatica con titulo.
  if (!activa) {
    return (
      <section data-theme="dark" className="relative bg-ink text-paper">
        <div
          className="relative flex min-h-[60vh] items-center justify-center bg-cover bg-center px-5"
          style={{ backgroundImage: `url(${imagen})` }}
        >
          <div className="absolute inset-0 bg-ink/55" />
          <div className="relative text-center">
            <p className="label-mono text-paper/60">Nuestro proceso</p>
            <p className="display mt-3 text-[clamp(1.8rem,6vw,3rem)] text-paper">
              Del diseno a tu espacio
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={wrapRef} data-theme="dark" className="relative h-[300vh] bg-ink">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* HUD */}
        <div className="pointer-events-none relative z-10 flex h-full w-full max-w-7xl flex-col justify-between px-6 py-10 text-paper">
          <div className="flex items-start justify-between">
            <div>
              <p className="label-mono text-paper/60">Nuestro proceso</p>
              <p className="display mt-2 text-[clamp(2rem,6vw,4.5rem)] text-paper">
                {FASES[faseActual]}
              </p>
            </div>
            <div className="text-right">
              <p className="label-mono text-paper/60">Fase {faseActual + 1}/4</p>
              <p className="label-mono text-paper/40">Frame {String(frame).padStart(2, "0")}/60</p>
            </div>
          </div>

          {/* Barra de progreso + fases */}
          <div>
            <div className="mb-3 flex justify-between">
              {FASES.map((f, i) => (
                <span
                  key={f}
                  className={`label-mono ${i <= faseActual ? "text-ember" : "text-paper/30"}`}
                >
                  {f}
                </span>
              ))}
            </div>
            <div className="h-0.5 w-full bg-white/15">
              <div className="h-full bg-ember" style={{ width: `${progreso * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
