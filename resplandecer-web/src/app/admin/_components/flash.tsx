import { CheckCircleBanner } from "./flash-client";

/**
 * Muestra un banner de éxito según el query param `?ok=<clave>`.
 * Mensajes en español de Latinoamérica (RF-13).
 */
const MENSAJES: Record<string, string> = {
  creado: "Elemento creado correctamente.",
  guardado: "Cambios guardados correctamente.",
  actualizado: "Elemento actualizado correctamente.",
  eliminado: "Elemento eliminado correctamente.",
  estado: "Estado actualizado correctamente.",
  imagen: "Imagen subida correctamente.",
  principal: "Imagen principal actualizada correctamente.",
};

export function Flash({ ok }: { ok?: string }) {
  if (!ok) return null;
  const mensaje = MENSAJES[ok] ?? "Acción realizada correctamente.";
  return <CheckCircleBanner mensaje={mensaje} />;
}
