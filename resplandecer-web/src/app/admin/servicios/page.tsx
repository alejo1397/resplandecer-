import { requireAdmin } from "@/lib/auth/guard";
import { listarServicios } from "@/lib/queries/admin/home";
import { PageHeader, LinkButton, TableShell, EstadoBadge, EmptyState } from "../_components/ui";
import { AccionConfirmable } from "../_components/accion-confirmable";
import { Flash } from "../_components/flash";
import { alternarEstadoServicioAction, eliminarServicioAction } from "./actions";

export default async function ServiciosPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  await requireAdmin();
  const { ok } = await searchParams;
  const servicios = await listarServicios();

  return (
    <div>
      <Flash ok={ok} />
      <PageHeader
        titulo="Servicios"
        descripcion="Gestiona los servicios de la sección «Qué hacemos»."
        accion={<LinkButton href="/admin/servicios/nuevo">Nuevo servicio</LinkButton>}
      />

      {servicios.length === 0 ? (
        <EmptyState mensaje="Aún no hay servicios. Crea el primero." />
      ) : (
        <TableShell headers={["Título", "Orden", "Estado", "Acciones"]}>
          {servicios.map((s) => (
            <tr key={s.id}>
              <td className="px-4 py-3 font-medium">{s.titulo}</td>
              <td className="px-4 py-3 text-gray-500">{s.orden}</td>
              <td className="px-4 py-3">
                <EstadoBadge activo={s.estado} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <a href={`/admin/servicios/${s.id}`} className="text-sm font-medium text-gray-900 hover:underline">
                    Editar
                  </a>
                  <AccionConfirmable
                    action={alternarEstadoServicioAction}
                    campos={{ id: s.id, estado: String(s.estado) }}
                    etiqueta={s.estado ? "Inactivar" : "Activar"}
                    variante="neutro"
                    confirmacion={
                      s.estado
                        ? "¿Seguro que deseas inactivar este elemento? Dejará de mostrarse en el sitio público."
                        : "¿Seguro que deseas cambiar el estado de este elemento?"
                    }
                    textoCargando="Actualizando..."
                  />
                  <AccionConfirmable
                    action={eliminarServicioAction}
                    campos={{ id: s.id }}
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
