import Image from "next/image";

/**
 * Logo de Resplandecer.
 *
 * Usa dos variantes reales (fondo transparente):
 *  - `logo_r.png`        -> letras blancas, para fondos oscuros.
 *  - `logo_r_black.png`  -> letras negras, para fondos claros.
 *
 * El logo es apaisado (proporción ~3.18:1), por eso se dimensiona por alto y el
 * ancho se ajusta de forma automática para no deformarlo.
 *
 * @param alto    Alto en px del logo.
 * @param oscuro  true si el fondo detrás es oscuro (usa la variante blanca).
 */
export function Logo({
  alto = 36,
  oscuro = false,
  className = "",
}: {
  alto?: number;
  oscuro?: boolean;
  className?: string;
}) {
  const ancho = Math.round((alto * 1113) / 350);
  const src = oscuro ? "/logo_r.png" : "/logo_r_black.png";
  return (
    <Image
      src={src}
      alt="Logo de Resplandecer"
      width={ancho}
      height={alto}
      priority
      className={`object-contain transition-opacity duration-300 ${className}`}
      style={{ height: `${alto}px`, width: "auto" }}
    />
  );
}
