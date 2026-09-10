"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * Banda de imagen a todo el ancho con parallax sutil al hacer scroll.
 * Ligero: scroll pasivo + rAF. Respeta reduced-motion (queda estatica).
 */
export function BandaParallax({
  src,
  alt = "",
  titulo,
}: {
  src: string;
  alt?: string;
  titulo?: string;
}) {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefiereMenos = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefiereMenos) return;

    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = wrap.getBoundingClientRect();
        const vh = window.innerHeight;
        // progreso de -1 a 1 mientras la banda cruza la pantalla
        const progreso = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
        const desplazamiento = progreso * -40; // px
        inner.style.transform = `translateY(${desplazamiento}px) scale(1.15)`;
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
    <div ref={wrapRef} className="relative my-8 h-[45vh] overflow-hidden md:h-[60vh]">
      <div ref={innerRef} className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.15)" }}>
        <Image src={src} alt={alt} fill priority={false} className="object-cover" unoptimized />
      </div>
      <div className="absolute inset-0 bg-ink/30" />
      {titulo ? (
        <div className="absolute inset-0 flex items-center justify-center px-5">
          <p className="display text-center text-[clamp(1.8rem,5vw,4rem)] text-paper">
            {titulo}
          </p>
        </div>
      ) : null}
    </div>
  );
}
