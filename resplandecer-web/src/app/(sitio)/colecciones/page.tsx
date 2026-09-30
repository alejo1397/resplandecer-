import Image from "next/image";
import Link from "next/link";
import { getColeccionesCached } from "@/lib/cache";

export const metadata = { title: "Colecciones | Resplandecer" };

export default async function ColeccionesPage() {
  const colecciones = await getColeccionesCached();

  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <p className="label-mono text-ink/50">Colecciones de diseño</p>
      <h1 className="display mt-3 text-[clamp(2.2rem,6vw,4.5rem)] text-ink">Colecciones</h1>

      {colecciones.length === 0 ? (
        <p className="mt-12 text-sm text-ink/50">Aún no hay colecciones.</p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {colecciones.map((c) => (
            <Link
              key={c.id}
              href={`/colecciones/${c.slug}`}
              className="group relative flex min-h-56 flex-col justify-end overflow-hidden rounded-2xl bg-ink p-7"
            >
              {c.imagenUrl ? (
                <Image
                  src={c.imagenUrl}
                  alt={c.imagenAlt ?? c.titulo}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-80"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="relative">
                <span className="label-mono text-white/60">
                  {String(c.orden).padStart(2, "0")}
                </span>
                <h2 className="display mt-1 text-2xl text-white">{c.titulo}</h2>
                {c.resumen ? (
                  <p className="mt-1 text-sm text-white/75">{c.resumen}</p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
