import Image from "next/image";

/**
 * Logo de Resplandecer.
 *
 * Usa el archivo `public/logo_r.png`. El logo es apaisado (proporción ~3.18:1),
 * por eso se dimensiona por alto y el ancho se ajusta de forma automática.
 * Si el tema es oscuro se aplica un filtro para que el logo se vea claro.
 */
export function Logo({
  alto = 28,
  oscuro = false,
  className = "",
}: {
  alto?: number;
  oscuro?: boolean;
  className?: string;
}) {
  const ancho = Math.round((alto * 1113) / 350);
  return (
    <Image
      src="/logo_r.png"
      alt="Logo de Resplandecer"
      width={ancho}
      height={alto}
      priority
      className={`object-contain transition-[filter] duration-300 ${
        oscuro ? "brightness-0 invert" : ""
      } ${className}`}
      style={{ height: `${alto}px`, width: "auto" }}
    />
  );
}
