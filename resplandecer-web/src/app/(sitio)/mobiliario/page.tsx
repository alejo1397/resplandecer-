import { getProductosActivos } from "@/lib/queries";
import { ProductoCard } from "../_components/producto-card";

export const metadata = { title: "Mobiliario | Resplandecer" };

export default async function MobiliarioPage() {
  const productos = await getProductosActivos();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Mobiliario</h1>
      <p className="mt-1 text-sm text-gray-500">Todo nuestro catalogo.</p>

      {productos.length === 0 ? (
        <p className="mt-10 text-sm text-gray-400">Aun no hay productos disponibles.</p>
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
