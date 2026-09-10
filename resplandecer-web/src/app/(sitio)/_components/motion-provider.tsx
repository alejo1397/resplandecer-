"use client";

import { useEffect } from "react";

/**
 * Provider de animaciones. Arranca el smooth scroll (Lenis) sincronizado con
 * GSAP ScrollTrigger, SOLO en el cliente y de forma diferida.
 *
 * Performance:
 *  - Las librerias (gsap, lenis) se importan dinamicamente (no entran en el
 *    bundle inicial ni bloquean la primera pintura).
 *  - Se desactiva si el usuario prefiere menos movimiento.
 *  - Se inicia cuando el navegador esta libre (requestIdleCallback).
 */
export function MotionProvider() {
  useEffect(() => {
    const prefiereMenosMovimiento = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefiereMenosMovimiento) return;

    let lenis: import("lenis").default | null = null;
    let rafId: number = 0;
    let cancelled = false;

    async function init() {
      const [{ default: Lenis }, gsapMod, stMod] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      const gsap = gsapMod.default ?? gsapMod.gsap;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time: number) => {
        lenis?.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      // Reveals: cualquier elemento con la clase .reveal aparece al entrar.
      const els = gsap.utils.toArray<HTMLElement>(".reveal");
      els.forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => el.classList.add("is-visible"),
        });
      });

      ScrollTrigger.refresh();
    }

    const idle = (
      window as typeof window & {
        requestIdleCallback?: (cb: () => void) => number;
      }
    ).requestIdleCallback;

    if (typeof idle === "function") {
      idle(init);
    } else {
      rafId = window.setTimeout(init, 200);
    }

    // Salvaguarda: si algo falla al cargar las animaciones, revela todo el
    // contenido para que nunca quede invisible.
    const safety: number = window.setTimeout(() => {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
        el.classList.add("is-visible");
      });
    }, 3000);

    return () => {
      cancelled = true;
      if (rafId) clearTimeout(rafId);
      clearTimeout(safety);
      lenis?.destroy();
    };
  }, []);

  return null;
}
