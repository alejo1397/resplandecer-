"use client";

import { useEffect, useRef } from "react";
import { getPaletteRGB } from "@/lib/palette";

/**
 * Figura del hero: un plano arquitectonico isometrico que rota (representa
 * "espacio y proyecto", ideal para mobiliario e interiorismo).
 *
 * - Canvas 2D (no WebGL): ligero y funciona en cualquier dispositivo.
 * - Rotacion automatica que se pausa al pasar el cursor.
 * - Arrastrable con inercia.
 * - Usa los colores de la paleta (src/lib/palette.ts).
 * - Se desactiva en reduced-motion (el contenedor muestra fallback).
 */
export function PlanoOrbital() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefiereMenos = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const palette = getPaletteRGB();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Estado de rotacion
    let angle = 0.6;
    let velocity = 0.0025;
    let dragging = false;
    let lastX = 0;
    let hovering = false;
    let visible = true;

    // Definicion del "plano": habitaciones como rectangulos en un grid,
    // con algunos muebles (rectangulos pequenos) y un nodo destacado.
    const rooms = [
      { x: -1.4, y: -0.9, w: 1.3, h: 1.0 },
      { x: 0.1, y: -0.9, w: 1.3, h: 0.6 },
      { x: 0.1, y: -0.15, w: 0.6, h: 1.0 },
      { x: 0.85, y: -0.15, w: 0.55, h: 1.0 },
      { x: -1.4, y: 0.25, w: 1.3, h: 0.65 },
    ];
    const furniture = [
      { x: -1.1, y: -0.6, w: 0.6, h: 0.35 },
      { x: 0.35, y: -0.7, w: 0.7, h: 0.2 },
      { x: 0.22, y: 0.15, w: 0.32, h: 0.5 },
      { x: -1.1, y: 0.4, w: 0.5, h: 0.28 },
    ];
    const highlight = { x: 0.95, y: 0.1 }; // nodo destacado (signal)

    const SCALE = () => Math.min(width, height) * 0.28;

    // Proyeccion isometrica con rotacion sobre eje Y
    function project(x: number, z: number) {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const rx = x * cos - z * sin;
      const rz = x * sin + z * cos;
      const s = SCALE();
      // isometrico: y baja segun profundidad
      const iso = 0.5;
      return {
        px: width / 2 + rx * s,
        py: height / 2 + rz * s * iso,
      };
    }

    function drawRect(
      r: { x: number; y: number; w: number; h: number },
      stroke: string,
      fill?: string,
      lw = 1,
    ) {
      const p1 = project(r.x, r.y);
      const p2 = project(r.x + r.w, r.y);
      const p3 = project(r.x + r.w, r.y + r.h);
      const p4 = project(r.x, r.y + r.h);
      ctx!.beginPath();
      ctx!.moveTo(p1.px, p1.py);
      ctx!.lineTo(p2.px, p2.py);
      ctx!.lineTo(p3.px, p3.py);
      ctx!.lineTo(p4.px, p4.py);
      ctx!.closePath();
      if (fill) {
        ctx!.fillStyle = fill;
        ctx!.fill();
      }
      ctx!.strokeStyle = stroke;
      ctx!.lineWidth = lw;
      ctx!.stroke();
    }

    let raf = 0;
    function frame() {
      if (!visible) {
        raf = requestAnimationFrame(frame);
        return;
      }
      ctx!.clearRect(0, 0, width, height);

      // rotacion automatica si no se arrastra ni hay hover
      if (!dragging && !hovering) {
        angle += velocity;
      } else if (!dragging) {
        // inercia suave al soltar
        velocity *= 0.96;
        if (Math.abs(velocity) < 0.0006) velocity = 0.0025;
      }

      // habitaciones (planos)
      for (const r of rooms) {
        drawRect(r, `rgba(${palette.electric},0.55)`, `rgba(${palette.electric},0.06)`, 1.2);
      }
      // muebles
      for (const f of furniture) {
        drawRect(f, `rgba(${palette.ember},0.8)`, `rgba(${palette.ember},0.12)`, 1);
      }

      // nodo destacado con onda expansiva (signal)
      const hp = project(highlight.x, highlight.y);
      const t = (Date.now() % 2600) / 2600;
      const radius = 6 + t * 26;
      ctx!.beginPath();
      ctx!.arc(hp.px, hp.py, radius, 0, Math.PI * 2);
      ctx!.strokeStyle = `rgba(${palette.signal},${(1 - t) * 0.7})`;
      ctx!.lineWidth = 1.5;
      ctx!.stroke();
      ctx!.beginPath();
      ctx!.arc(hp.px, hp.py, 4, 0, Math.PI * 2);
      ctx!.fillStyle = `rgb(${palette.signal})`;
      ctx!.fill();

      raf = requestAnimationFrame(frame);
    }

    if (!prefiereMenos) {
      raf = requestAnimationFrame(frame);
    } else {
      // Dibuja un frame estatico
      frame();
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, width, height);
      angle = 0.6;
      for (const r of rooms) drawRect(r, `rgba(${palette.electric},0.55)`, `rgba(${palette.electric},0.06)`, 1.2);
      for (const f of furniture) drawRect(f, `rgba(${palette.ember},0.8)`, `rgba(${palette.ember},0.12)`, 1);
    }

    // Interaccion
    function onDown(e: PointerEvent) {
      dragging = true;
      hovering = true;
      lastX = e.clientX;
      canvas!.setPointerCapture(e.pointerId);
    }
    function onMove(e: PointerEvent) {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      velocity = dx * 0.0009;
      angle += velocity;
    }
    function onUp() {
      dragging = false;
    }
    function onEnter() {
      hovering = true;
    }
    function onLeave() {
      hovering = false;
    }

    // Pausar cuando no esta visible (performance)
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    if (!prefiereMenos) {
      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerup", onUp);
      canvas.addEventListener("pointerenter", onEnter);
      canvas.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerenter", onEnter);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
      aria-label="Plano arquitectonico interactivo"
      role="img"
    />
  );
}
