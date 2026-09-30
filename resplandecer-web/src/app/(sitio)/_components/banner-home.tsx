import Image from "next/image";
import Link from "next/link";

type Banner = {
  id: number;
  titulo: string | null;
  subtitulo: string | null;
  etiqueta: string | null;
  imagenUrl: string;
  enlaceUrl: string | null;
};

/**
 * Sección de banners del home (Mobiliario / Colecciones).
 *  - Movimiento horizontal AUTOMÁTICO y continuo (sin barra de scroll), en loop.
 *  - Se pausa al pasar el mouse y respeta `prefers-reduced-motion`.
 *  - Zoom lento y suave al pasar el mouse sobre cada imagen.
 *  - variante "mobiliario": etiqueta arriba-izquierda ("Producto - Categoría").
 *  - variante "colecciones": etiqueta centrada.
 */
export function BannerHome({
  titulo,
  subtitulo,
  items,
  variante,
}: {
  titulo: string;
  subtitulo?: string;
  items: Banner[];
  variante: "mobiliario" | "colecciones";
}) {
  if (items.length === 0) return null;

  // Duplicamos la lista para que el loop sea continuo sin saltos.
  const secuencia = [...items, ...items];

  return (
    <section className="mx-auto max-w-7xl px-5 py-12">
      <div className="mb-6">
        <h2 className="display text-[clamp(1.4rem,3vw,2.2rem)] text-ink">{titulo}</h2>
        {subtitulo ? <p className="mt-1 text-sm text-ink/60">{subtitulo}</p> : null}
      </div>

      {/* Carril con movimiento horizontal automático (sin barra de scroll) */}
      <div className="banner-carril">
        <div className="banner-pista gap-4">
          {secuencia.map((b, idx) => {
            const contenido = (
              <div className="group relative h-56 w-72 overflow-hidden rounded-2xl bg-ink/5 sm:h-64 sm:w-80">
                <Image
                  src={b.imagenUrl}
                  alt={b.etiqueta ?? b.titulo ?? ""}
                  fill
                  sizes="320px"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20" />

                {b.etiqueta ? (
                  variante === "mobiliario" ? (
                    <span className="absolute left-4 top-4 text-sm font-medium" style={{ color: "#ffffff" }}>
                      {b.etiqueta}
                    </span>
                  ) : (
                    <span
                      className="absolute inset-0 flex items-center justify-center px-4 text-center text-xl font-medium"
                      style={{ color: "#ffffff" }}
                    >
                      {b.etiqueta}
                    </span>
                  )
                ) : null}
              </div>
            );

            // Las copias duplicadas se ocultan a lectores de pantalla.
            const esDuplicado = idx >= items.length;

            return b.enlaceUrl ? (
              <Link
                key={`${b.id}-${idx}`}
                href={b.enlaceUrl}
                className="shrink-0"
                aria-hidden={esDuplicado}
                tabIndex={esDuplicado ? -1 : undefined}
              >
                {contenido}
              </Link>
            ) : (
              <div key={`${b.id}-${idx}`} className="shrink-0" aria-hidden={esDuplicado}>
                {contenido}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
