import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoriaPorSlug, getProductosPorCategoria } from "@/lib/queries";
import { ProductoCard } from "../../_components/producto-card";

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categoria = await getCategoriaPorSlug(slug);
  if (!categoria) notFound();

  const productos = await getProductosPorCategoria(slug);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <Link href="/colecciones" className="label-mono text-ink/50 hover:text-ink">
        ← Colecciones
      </Link>
      <h1 className="display mt-4 text-[clamp(2.2rem,6vw,4.5rem)] text-ink">
        {categoria.nombre}
      </h1>
      {categoria.descripcion ? (
        <p className="mt-2 max-w-md text-sm text-ink/60">{categoria.descripcion}</p>
      ) : null}

      {productos.length === 0 ? (
        <p className="mt-12 text-sm text-ink/50">Aun no hay productos en esta coleccion.</p>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {productos.map((p) => (
            <div key={p.id} className="reveal">
              <ProductoCard producto={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
