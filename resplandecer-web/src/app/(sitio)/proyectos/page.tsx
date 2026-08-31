import Image from "next/image";
import Link from "next/link";
import { getProyectosActivos } from "@/lib/queries";

export const metadata = { title: "Proyectos | Resplandecer" };

export default async function ProyectosPage() {
  const proyectos = await getProyectosActivos();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Proyectos</h1>
      <p className="mt-1 text-sm text-gray-500">Algunos de nuestros trabajos realizados.</p>

      {proyectos.length === 0 ? (
        <p className="mt-10 text-sm text-gray-400">Aun no hay proyectos publicados.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {proyectos.map((p) => {
            const imagen = p.imagenes[0];
            return (
              <Link key={p.id} href={`/proyectos/${p.slug}`} className="group flex flex-col">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">
                  {imagen ? (
                    <Image
                      src={imagen.url}
                      alt={imagen.textoAlternativo ?? p.titulo}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      Sin imagen
                    </div>
                  )}
                </div>
                <h2 className="mt-3 text-base font-medium text-gray-900">{p.titulo}</h2>
                {p.ubicacion ? <p className="text-sm text-gray-500">{p.ubicacion}</p> : null}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
