import { requireAdmin } from "@/lib/auth/guard";
import { listarCategorias } from "@/lib/queries/admin/categorias";
import {
  PageHeader,
  LinkButton,
  TableShell,
  EstadoBadge,
  EmptyState,
} from "../_components/ui";
import { AccionConfirmable } from "../_components/accion-confirmable";
import { Flash } from "../_components/flash";
import { alternarEstadoCategoriaAction } from "./actions";

export default async function CategoriasPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  await requireAdmin();
  const { ok } = await searchParams;
  const categorias = await listarCategorias();

  return (
    <div>
      <Flash ok={ok} />
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
                  <AccionConfirmable
                    action={alternarEstadoCategoriaAction}
                    campos={{ id: c.id, estado: String(c.estado) }}
                    etiqueta={c.estado ? "Inactivar" : "Activar"}
                    variante="neutro"
                    confirmacion={
                      c.estado
                        ? c._count.productos > 0
                          ? `Esta categoría tiene ${c._count.productos} producto(s). ¿Seguro que deseas inactivarla? Dejará de mostrarse en el sitio público; los productos no se eliminan.`
                          : "¿Seguro que deseas inactivar este elemento? Dejará de mostrarse en el sitio público."
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
