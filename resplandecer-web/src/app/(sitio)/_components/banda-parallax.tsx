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
        const desplazamiento = progreso * -24; // px (parallax mas sutil)
        inner.style.transform = `translateY(${desplazamiento}px) scale(1.08)`;
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
    <div ref={wrapRef} className="relative my-8 h-[45vh] overflow-hidden md:h-[65vh]">
      <div ref={innerRef} className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.08)" }}>
        <Image src={src} alt={alt} fill priority={false} sizes="100vw" className="object-cover" unoptimized />
      </div>
      {/* Degradado solo en la parte inferior, para que la imagen se vea clara
          y el texto siga siendo legible abajo */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
      {titulo ? (
        <div className="absolute inset-x-0 bottom-0 flex items-end px-6 pb-8 md:px-10 md:pb-10">
          <p
            className="display max-w-3xl text-[clamp(1.6rem,4.5vw,3.5rem)] text-paper"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
          >
            {titulo}
          </p>
        </div>
      ) : null}
    </div>
  );
}
