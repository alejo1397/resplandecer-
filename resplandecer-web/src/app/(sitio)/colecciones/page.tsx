import Link from "next/link";
import { getCategoriasCached } from "@/lib/cache";

export const metadata = { title: "Colecciones | Resplandecer" };

export default async function ColeccionesPage() {
  const categorias = await getCategoriasCached();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Colecciones</h1>
      <p className="mt-1 text-sm text-gray-500">Explora nuestros muebles por categoria.</p>

      {categorias.length === 0 ? (
        <p className="mt-10 text-sm text-gray-400">Aun no hay colecciones.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categorias.map((c) => (
            <Link
              key={c.id}
              href={`/colecciones/${c.slug}`}
              className="rounded-xl border border-gray-200 bg-white p-6 transition hover:border-gray-400"
            >
              <h2 className="text-lg font-medium text-gray-900">{c.nombre}</h2>
              {c.descripcion ? (
                <p className="mt-1 text-sm text-gray-500">{c.descripcion}</p>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
