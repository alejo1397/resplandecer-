import Image from "next/image";
import Link from "next/link";
import { getProyectosCached } from "@/lib/cache";

export const metadata = { title: "Proyectos | Resplandecer" };

export default async function ProyectosPage() {
  const proyectos = await getProyectosCached();

  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <p className="label-mono text-ink/50">Trabajos realizados</p>
      <h1 className="display mt-3 text-[clamp(2.2rem,6vw,4.5rem)] text-ink">Proyectos</h1>

      {proyectos.length === 0 ? (
        <p className="mt-12 text-sm text-ink/50">Aun no hay proyectos publicados.</p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {proyectos.map((p) => {
            const imagen = p.imagenes[0];
            return (
              <Link key={p.id} href={`/proyectos/${p.slug}`} className="reveal group flex flex-col">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ink/5">
                  {imagen ? (
                    <Image
                      src={imagen.url}
                      alt={imagen.textoAlternativo ?? p.titulo}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-ink/40">
                      Sin imagen
                    </div>
                  )}
                </div>
                <h2 className="display mt-4 text-2xl text-ink">{p.titulo}</h2>
                {p.ubicacion ? (
                  <p className="label-mono mt-1 text-ink/50">{p.ubicacion}</p>
                ) : null}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
