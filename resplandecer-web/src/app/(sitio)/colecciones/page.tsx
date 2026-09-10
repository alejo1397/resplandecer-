import Link from "next/link";
import { getCategoriasCached } from "@/lib/cache";

export const metadata = { title: "Colecciones | Resplandecer" };

export default async function ColeccionesPage() {
  const categorias = await getCategoriasCached();

  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <p className="label-mono text-ink/50">Por categoria</p>
      <h1 className="display mt-3 text-[clamp(2.2rem,6vw,4.5rem)] text-ink">Colecciones</h1>

      {categorias.length === 0 ? (
        <p className="mt-12 text-sm text-ink/50">Aun no hay colecciones.</p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border hairline-light bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
          {categorias.map((c) => (
            <Link
              key={c.id}
              href={`/colecciones/${c.slug}`}
              className="reveal group flex min-h-40 flex-col justify-between bg-paper p-7 transition-colors hover:bg-ink hover:text-paper"
            >
              <span className="label-mono text-ink/40 group-hover:text-paper/50">
                {String(c.orden).padStart(2, "0")}
              </span>
              <div>
                <h2 className="display text-2xl text-ink group-hover:text-paper">
                  {c.nombre}
                </h2>
                {c.descripcion ? (
                  <p className="mt-1 text-sm text-ink/60 group-hover:text-paper/70">
                    {c.descripcion}
                  </p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
