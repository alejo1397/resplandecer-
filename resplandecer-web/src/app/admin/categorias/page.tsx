import { requireAdmin } from "@/lib/auth/guard";
import { listarCategorias } from "@/lib/queries/admin/categorias";
import {
  PageHeader,
  LinkButton,
  TableShell,
  EstadoBadge,
  EmptyState,
} from "../_components/ui";
import { alternarEstadoCategoriaAction } from "./actions";

export default async function CategoriasPage() {
  await requireAdmin();
  const categorias = await listarCategorias();

  return (
    <div>
      <PageHeader
        titulo="Categorías"
        descripcion="Gestiona las categorías del catálogo."
        accion={<LinkButton href="/admin/categorias/nueva">Nueva categoría</LinkButton>}
      />

      {categorias.length === 0 ? (
        <EmptyState mensaje="Aún no hay categorías. Crea la primera." />
      ) : (
        <TableShell headers={["Nombre", "Slug", "Productos", "Orden", "Estado", "Acciones"]}>
          {categorias.map((c) => (
            <tr key={c.id}>
              <td className="px-4 py-3 font-medium">{c.nombre}</td>
              <td className="px-4 py-3 text-gray-500">{c.slug}</td>
              <td className="px-4 py-3 text-gray-500">{c._count.productos}</td>
              <td className="px-4 py-3 text-gray-500">{c.orden}</td>
              <td className="px-4 py-3">
                <EstadoBadge activo={c.estado} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <a
                    href={`/admin/categorias/${c.id}`}
                    className="text-sm font-medium text-gray-900 hover:underline"
                  >
                    Editar
                  </a>
                  <form action={alternarEstadoCategoriaAction}>
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="estado" value={String(c.estado)} />
                    <button
                      type="submit"
                      className="text-sm text-gray-500 hover:underline"
                      title={
                        c.estado && c._count.productos > 0
                          ? `Esta categoría tiene ${c._count.productos} producto(s). Al inactivarla se ocultará junto con su listado; los productos no se eliminan.`
                          : undefined
                      }
                    >
                      {c.estado ? "Inactivar" : "Activar"}
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
