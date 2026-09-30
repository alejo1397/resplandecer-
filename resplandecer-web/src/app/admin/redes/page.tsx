import { requireAdmin } from "@/lib/auth/guard";
import { listarRedesSociales } from "@/lib/queries/admin/contenido";
import { PageHeader, LinkButton, TableShell, EstadoBadge, EmptyState } from "../_components/ui";
import { AccionConfirmable } from "../_components/accion-confirmable";
import { alternarEstadoRedAction } from "./actions";

export default async function RedesPage() {
  await requireAdmin();
  const redes = await listarRedesSociales();

  return (
    <div>
      <PageHeader
        titulo="Redes sociales"
        descripcion="Gestiona los enlaces a redes sociales."
        accion={<LinkButton href="/admin/redes/nueva">Nueva red</LinkButton>}
      />

      {redes.length === 0 ? (
        <EmptyState mensaje="Aún no hay redes sociales." />
      ) : (
        <TableShell headers={["Nombre", "URL", "Orden", "Estado", "Acciones"]}>
          {redes.map((r) => (
            <tr key={r.id}>
              <td className="px-4 py-3 font-medium">{r.nombre}</td>
              <td className="px-4 py-3 text-gray-500">
                <a href={r.url} target="_blank" rel="noreferrer" className="hover:underline">
                  {r.url}
                </a>
              </td>
              <td className="px-4 py-3 text-gray-500">{r.orden}</td>
              <td className="px-4 py-3">
                <EstadoBadge activo={r.estado} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <a href={`/admin/redes/${r.id}`} className="text-sm font-medium text-gray-900 hover:underline">
                    Editar
                  </a>
                  <AccionConfirmable
                    action={alternarEstadoRedAction}
                    campos={{ id: r.id, estado: String(r.estado) }}
                    etiqueta={r.estado ? "Inactivar" : "Activar"}
                    variante="neutro"
                    confirmacion={
                      r.estado
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
