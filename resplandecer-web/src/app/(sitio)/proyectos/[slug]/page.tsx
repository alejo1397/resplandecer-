import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProyectoPorSlug } from "@/lib/queries";

export default async function ProyectoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const proyecto = await getProyectoPorSlug(slug);
  if (!proyecto) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <Link href="/proyectos" className="text-sm text-gray-500 hover:text-gray-900">
        &larr; Proyectos
      </Link>
      <h1 className="mt-2 text-3xl font-semibold">{proyecto.titulo}</h1>
      {proyecto.ubicacion ? <p className="mt-1 text-sm text-gray-500">{proyecto.ubicacion}</p> : null}

      {proyecto.descripcion ? (
        <p className="mt-4 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-gray-600">
          {proyecto.descripcion}
        </p>
      ) : null}

      {proyecto.imagenes.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {proyecto.imagenes.map((img) => (
            <div key={img.id} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={img.url}
                alt={img.textoAlternativo ?? proyecto.titulo}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
