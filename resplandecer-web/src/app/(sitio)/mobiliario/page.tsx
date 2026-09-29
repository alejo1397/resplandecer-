import { getProductosCached, getCategoriasCached } from "@/lib/cache";
import { ProductoCard } from "../_components/producto-card";
import { FiltrosMobiliario } from "./filtros";

export const metadata = { title: "Mobiliario | Resplandecer" };

/** Normaliza texto para búsqueda: minúsculas y sin tildes. */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export default async function MobiliarioPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; q?: string }>;
}) {
  const { categoria = "", q = "" } = await searchParams;
  const [productos, categorias] = await Promise.all([
    getProductosCached(),
    getCategoriasCached(),
  ]);

  const qNorm = normalizar(q.trim());

  const filtrados = productos.filter((p) => {
    const coincideCategoria = categoria ? p.categoria?.slug === categoria : true;
    const coincideBusqueda = qNorm ? normalizar(p.nombre).includes(qNorm) : true;
    return coincideCategoria && coincideBusqueda;
  });

  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <p className="label-mono text-ink/50">Catálogo</p>
      <h1 className="display mt-3 text-[clamp(2.2rem,6vw,4.5rem)] text-ink">Mobiliario</h1>

      <FiltrosMobiliario
        categorias={categorias.map((c) => ({ slug: c.slug, nombre: c.nombre }))}
      />

      {filtrados.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed hairline-light py-16 text-center">
          <p className="text-sm text-ink/60">
            No encontramos productos con esos filtros.
          </p>
          <p className="mt-1 text-sm text-ink/40">
            Prueba con otra categoría o cambia la búsqueda.
          </p>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {filtrados.map((p) => (
            <div key={p.id} className="reveal">
              <ProductoCard producto={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
