import { HeroFigura } from "./hero-figura";

/**
 * Fondo multimedia administrable del hero.
 *
 * - Si hay un video configurado, lo reproduce en bucle (autoplay, muted,
 *   loop, playsInline) con un overlay para legibilidad.
 * - Si hay una imagen, la muestra de fondo con overlay.
 * - Si no hay nada configurado, cae al plano orbital interactivo original.
 */
export function HeroMedia({
  mediaUrl,
  mediaTipo,
  posterUrl,
}: {
  mediaUrl?: string;
  mediaTipo?: string;
  posterUrl?: string;
}) {
  if (!mediaUrl) {
    // Fallback: figura interactiva original (plano orbital).
    return <HeroFigura />;
  }

  const esVideo = mediaTipo === "video" || /\.(mp4|webm|ogv|ogg)(\?|$)/i.test(mediaUrl);

  return (
    <div className="absolute inset-0">
      {esVideo ? (
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={posterUrl || undefined}
          // Fallback si el video no carga: queda el fondo del contenedor (bg-ink).
        >
          <source src={mediaUrl} />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={mediaUrl} alt="" className="h-full w-full object-cover" />
      )}
      {/* Overlay/gradiente para garantizar legibilidad del texto del hero */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/30" />
    </div>
  );
}
