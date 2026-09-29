import { requireAdmin } from "@/lib/auth/guard";
import { listarServicios } from "@/lib/queries/admin/home";
import { PageHeader, LinkButton, TableShell, EstadoBadge, EmptyState } from "../_components/ui";
import { alternarEstadoServicioAction, eliminarServicioAction } from "./actions";

export default async function ServiciosPage() {
  await requireAdmin();
  const servicios = await listarServicios();

  return (
    <div>
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
                  <form action={alternarEstadoServicioAction}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="estado" value={String(s.estado)} />
                    <button type="submit" className="text-sm text-gray-500 hover:underline">
                      {s.estado ? "Inactivar" : "Activar"}
                    </button>
                  </form>
                  <form action={eliminarServicioAction}>
                    <input type="hidden" name="id" value={s.id} />
                    <button type="submit" className="text-sm text-red-600 hover:underline">
                      Eliminar
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
