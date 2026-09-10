import { getProductosCached } from "@/lib/cache";
import { ProductoCard } from "../_components/producto-card";

export const metadata = { title: "Mobiliario | Resplandecer" };

export default async function MobiliarioPage() {
  const productos = await getProductosCached();

  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <p className="label-mono text-ink/50">Catalogo</p>
      <h1 className="display mt-3 text-[clamp(2.2rem,6vw,4.5rem)] text-ink">Mobiliario</h1>

      {productos.length === 0 ? (
        <p className="mt-12 text-sm text-ink/50">Aun no hay productos disponibles.</p>
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
