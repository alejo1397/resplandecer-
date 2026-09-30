import { requireAdmin } from "@/lib/auth/guard";
import { listarPasosDiseno } from "@/lib/queries/admin/home";
import { PageHeader, LinkButton, TableShell, EstadoBadge, EmptyState } from "../_components/ui";
import { AccionConfirmable } from "../_components/accion-confirmable";
import { Flash } from "../_components/flash";
import { alternarEstadoPasoAction, eliminarPasoAction } from "./actions";

export default async function DisenaPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  await requireAdmin();
  const { ok } = await searchParams;
  const pasos = await listarPasosDiseno();

  return (
    <div>
      <Flash ok={ok} />
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
                  <AccionConfirmable
                    action={alternarEstadoPasoAction}
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
                  <AccionConfirmable
                    action={eliminarPasoAction}
                    campos={{ id: p.id }}
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
