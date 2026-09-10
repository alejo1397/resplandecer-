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
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Link href="/proyectos" className="label-mono text-ink/50 hover:text-ink">
        ← Proyectos
      </Link>
      <h1 className="display mt-4 text-[clamp(2.2rem,6vw,4.5rem)] text-ink">
        {proyecto.titulo}
      </h1>
      {proyecto.ubicacion ? (
        <p className="label-mono mt-2 text-ink/50">{proyecto.ubicacion}</p>
      ) : null}

      {proyecto.descripcion ? (
        <p className="mt-6 max-w-2xl whitespace-pre-line text-base leading-relaxed text-ink/70">
          {proyecto.descripcion}
        </p>
      ) : null}

      {proyecto.imagenes.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {proyecto.imagenes.map((img) => (
            <div key={img.id} className="reveal relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink/5">
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
