import { requireAdmin } from "@/lib/auth/guard";
import { listarPasosDiseno } from "@/lib/queries/admin/home";
import { PageHeader, LinkButton, TableShell, EstadoBadge, EmptyState } from "../_components/ui";
import { alternarEstadoPasoAction, eliminarPasoAction } from "./actions";

export default async function DisenaPage() {
  await requireAdmin();
  const pasos = await listarPasosDiseno();

  return (
    <div>
      <PageHeader
        titulo="Diseña tu espacio"
        descripcion="Gestiona los pasos del proceso de diseño personalizado."
        accion={<LinkButton href="/admin/disena/nuevo">Nuevo paso</LinkButton>}
      />

      {pasos.length === 0 ? (
        <EmptyState mensaje="Aún no hay pasos. Crea el primero." />
      ) : (
        <TableShell headers={["Título", "Orden", "Estado", "Acciones"]}>
          {pasos.map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-3 font-medium">{p.titulo}</td>
              <td className="px-4 py-3 text-gray-500">{p.orden}</td>
              <td className="px-4 py-3">
                <EstadoBadge activo={p.estado} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <a href={`/admin/disena/${p.id}`} className="text-sm font-medium text-gray-900 hover:underline">
                    Editar
                  </a>
                  <form action={alternarEstadoPasoAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="estado" value={String(p.estado)} />
                    <button type="submit" className="text-sm text-gray-500 hover:underline">
                      {p.estado ? "Inactivar" : "Activar"}
                    </button>
                  </form>
                  <form action={eliminarPasoAction}>
                    <input type="hidden" name="id" value={p.id} />
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
