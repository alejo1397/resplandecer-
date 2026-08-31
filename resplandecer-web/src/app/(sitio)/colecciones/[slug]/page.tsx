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
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Link href="/colecciones" className="text-sm text-gray-500 hover:text-gray-900">
        &larr; Colecciones
      </Link>
      <h1 className="mt-2 text-3xl font-semibold">{categoria.nombre}</h1>
      {categoria.descripcion ? (
        <p className="mt-1 text-sm text-gray-500">{categoria.descripcion}</p>
      ) : null}

      {productos.length === 0 ? (
        <p className="mt-10 text-sm text-gray-400">Aun no hay productos en esta coleccion.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {productos.map((p) => (
            <ProductoCard key={p.id} producto={p} />
          ))}
        </div>
      )}
    </div>
  );
}
