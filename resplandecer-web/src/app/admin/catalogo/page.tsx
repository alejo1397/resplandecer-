import { requireAdmin } from "@/lib/auth/guard";
import { listarProductos } from "@/lib/queries/admin/catalogo";
import { formatCOP } from "@/lib/serializers";
import { PageHeader, LinkButton, TableShell, EstadoBadge, EmptyState } from "../_components/ui";
import { alternarEstadoProductoAction } from "./actions";

export default async function CatalogoPage() {
  await requireAdmin();
  const productos = await listarProductos();

  return (
    <div>
      <PageHeader
        titulo="Catalogo"
        descripcion="Gestiona los productos y sus imagenes."
        accion={<LinkButton href="/admin/catalogo/nuevo">Nuevo producto</LinkButton>}
      />

      {productos.length === 0 ? (
        <EmptyState mensaje="Aun no hay productos." />
      ) : (
        <TableShell headers={["Producto", "Categoria", "Precio", "Imgs", "Estado", "Acciones"]}>
          {productos.map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-3 font-medium">
                {p.nombre}
                {p.destacado ? (
                  <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800">
                    Destacado
                  </span>
                ) : null}
              </td>
              <td className="px-4 py-3 text-gray-500">{p.categoria?.nombre ?? "-"}</td>
              <td className="px-4 py-3 text-gray-500">{formatCOP(p.precio)}</td>
              <td className="px-4 py-3 text-gray-500">{p.imagenes.length}</td>
              <td className="px-4 py-3">
                <EstadoBadge activo={p.estado} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <a href={`/admin/catalogo/${p.id}`} className="text-sm font-medium text-gray-900 hover:underline">
                    Editar
                  </a>
                  <form action={alternarEstadoProductoAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="estado" value={String(p.estado)} />
                    <button type="submit" className="text-sm text-gray-500 hover:underline">
                      {p.estado ? "Inactivar" : "Activar"}
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </TableShell>
      )}
    </div>
  );
}
