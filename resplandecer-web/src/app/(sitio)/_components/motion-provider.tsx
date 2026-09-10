"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Provider de animaciones.
 *
 * DISENO ROBUSTO (el contenido NUNCA queda invisible):
 *  1. Los reveals usan IntersectionObserver NATIVO (no depende de GSAP) y se
 *     re-escanean en CADA cambio de ruta (por eso no hay que recargar la pagina).
 *  2. Lenis (smooth scroll) se carga una sola vez, diferido y opcional.
 *  3. Respeta prefers-reduced-motion.
 */
export function MotionProvider() {
  const pathname = usePathname();

  // ── Reveals: se re-ejecutan en cada navegacion ──
  useEffect(() => {
    const prefiereMenos = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveals = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)"));

    if (reveals.length === 0) return;

    if (prefiereMenos || !("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    reveals.forEach((el) => io.observe(el));

    // Lo que ya este visible al cargar/navegar, se muestra de inmediato.
    requestAnimationFrame(() => {
      const vh = window.innerHeight;
      reveals.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh) el.classList.add("is-visible");
      });
    });

    // Salvaguarda: pase lo que pase, tras 1.2s todo visible.
    const safety = window.setTimeout(() => {
      reveals.forEach((el) => el.classList.add("is-visible"));
    }, 1200);

    return () => {
      io.disconnect();
      clearTimeout(safety);
    };
  }, [pathname]);

  // ── Smooth scroll (Lenis): una sola vez, diferido y opcional ──
  useEffect(() => {
    const prefiereMenos = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefiereMenos) return;

    let lenis: import("lenis").default | null = null;
    let cancelled = false;

    async function initLenis() {
      try {
        const { default: Lenis } = await import("lenis");
        if (cancelled) return;
        lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
        function raf(time: number) {
          lenis?.raf(time);
          if (!cancelled) requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      } catch {
        // Si falla, se usa el scroll normal. La pagina funciona igual.
      }
    }

    const idle = (
      window as typeof window & { requestIdleCallback?: (cb: () => void) => number }
    ).requestIdleCallback;
    if (typeof idle === "function") idle(initLenis);
    else window.setTimeout(initLenis, 300);

    return () => {
      cancelled = true;
      lenis?.destroy();
    };
  }, []);

  return null;
}
