import { requireAdmin } from "@/lib/auth/guard";
import { listarProductos } from "@/lib/queries/admin/catalogo";
import { formatCOP } from "@/lib/serializers";
import { PageHeader, LinkButton, TableShell, EstadoBadge, EmptyState } from "../_components/ui";
import { AccionConfirmable } from "../_components/accion-confirmable";
import { Flash } from "../_components/flash";
import { alternarEstadoProductoAction } from "./actions";

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  await requireAdmin();
  const { ok } = await searchParams;
  const productos = await listarProductos();

  return (
    <div>
      <Flash ok={ok} />
      <PageHeader
        titulo="Catálogo"
        descripcion="Gestiona los productos y sus imágenes."
        accion={<LinkButton href="/admin/catalogo/nuevo">Nuevo producto</LinkButton>}
      />

      {productos.length === 0 ? (
        <EmptyState mensaje="Aún no hay productos." />
      ) : (
        <TableShell headers={["Producto", "Categoría", "Precio", "Imgs", "Estado", "Acciones"]}>
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
                  <AccionConfirmable
                    action={alternarEstadoProductoAction}
                    campos={{ id: p.id, estado: String(p.estado) }}
                    etiqueta={p.estado ? "Inactivar" : "Activar"}
                    variante="neutro"
                    confirmacion={
                      p.estado
                        ? "¿Seguro que deseas inactivar este elemento? Dejará de mostrarse en el sitio público."
                        : "¿Seguro que deseas cambiar el estado de este elemento?"
                    }
                    textoCargando="Actualizando..."
                  />
                </div>
              </td>
            </tr>
          ))}
        </TableShell>
      )}
    </div>
  );
}
