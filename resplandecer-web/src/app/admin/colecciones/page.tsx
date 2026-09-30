import { requireAdmin } from "@/lib/auth/guard";
import { listarColecciones } from "@/lib/queries/admin/colecciones";
import { PageHeader, LinkButton, TableShell, EstadoBadge, EmptyState } from "../_components/ui";
import { AccionConfirmable } from "../_components/accion-confirmable";
import { Flash } from "../_components/flash";
import { alternarEstadoColeccionAction, eliminarColeccionAction } from "./actions";

export default async function ColeccionesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  await requireAdmin();
  const { ok } = await searchParams;
  const colecciones = await listarColecciones();

  return (
    <div>
      <Flash ok={ok} />
      <PageHeader
        titulo="Colecciones"
        descripcion="Gestiona las colecciones de diseño (independientes de productos y categorías)."
        accion={<LinkButton href="/admin/colecciones/nueva">Nueva colección</LinkButton>}
      />

      {colecciones.length === 0 ? (
        <EmptyState mensaje="Aún no hay colecciones. Crea la primera." />
      ) : (
        <TableShell headers={["Título", "Slug", "Imágenes", "Orden", "Estado", "Acciones"]}>
          {colecciones.map((c) => (
            <tr key={c.id}>
              <td className="px-4 py-3 font-medium">{c.titulo}</td>
              <td className="px-4 py-3 text-gray-500">{c.slug}</td>
              <td className="px-4 py-3 text-gray-500">{c._count.imagenes}</td>
              <td className="px-4 py-3 text-gray-500">{c.orden}</td>
              <td className="px-4 py-3">
                <EstadoBadge activo={c.estado} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <a href={`/admin/colecciones/${c.id}`} className="text-sm font-medium text-gray-900 hover:underline">
                    Editar
                  </a>
                  <AccionConfirmable
                    action={alternarEstadoColeccionAction}
                    campos={{ id: c.id, estado: String(c.estado) }}
                    etiqueta={c.estado ? "Inactivar" : "Activar"}
                    variante="neutro"
                    confirmacion={
                      c.estado
                        ? "¿Seguro que deseas inactivar este elemento? Dejará de mostrarse en el sitio público."
                        : "¿Seguro que deseas cambiar el estado de este elemento?"
                    }
                    textoCargando="Actualizando..."
                  />
                  <AccionConfirmable
                    action={eliminarColeccionAction}
                    campos={{ id: c.id }}
                    etiqueta="Eliminar"
                    confirmacion="¿Seguro que deseas eliminar este elemento? Esta acción no se puede deshacer."
                    textoCargando="Eliminando..."
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
