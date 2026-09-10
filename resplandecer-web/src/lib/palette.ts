"use client";

/**
 * Lee los colores del sistema de diseno (definidos en globals.css) y los expone
 * en formato usable por canvas 2D. Asi los canvas del hero usan EXACTAMENTE los
 * mismos colores que el resto del sitio: cambiar un HEX en globals.css repinta
 * tambien las animaciones.
 */

export type PaletteKey = "ink" | "paper" | "electric" | "ember" | "signal";

function readVar(name: string): string {
  if (typeof window === "undefined") return "#000000";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Devuelve el color hex de una clave de la paleta. */
export function getColor(key: PaletteKey): string {
  return readVar(`--${key}`) || "#000000";
}

/** Convierte "#rrggbb" a "r,g,b" (para usar en rgba de canvas). */
export function toRGB(hex: string): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16) || 0;
  const g = parseInt(full.slice(2, 4), 16) || 0;
  const b = parseInt(full.slice(4, 6), 16) || 0;
  return `${r},${g},${b}`;
}

/** Devuelve todos los colores de la paleta como objeto de strings "r,g,b". */
export function getPaletteRGB(): Record<PaletteKey, string> {
  return {
    ink: toRGB(getColor("ink")),
    paper: toRGB(getColor("paper")),
    electric: toRGB(getColor("electric")),
    ember: toRGB(getColor("ember")),
    signal: toRGB(getColor("signal")),
  };
}
