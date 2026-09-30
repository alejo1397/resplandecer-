import { requireAdmin } from "@/lib/auth/guard";
import { listarMetricas } from "@/lib/queries/admin/home";
import { PageHeader, LinkButton, TableShell, EstadoBadge, EmptyState } from "../_components/ui";
import { AccionConfirmable } from "../_components/accion-confirmable";
import { Flash } from "../_components/flash";
import { alternarEstadoMetricaAction, eliminarMetricaAction } from "./actions";

export default async function MetricasPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  await requireAdmin();
  const { ok } = await searchParams;
  const metricas = await listarMetricas();

  return (
    <div>
      <Flash ok={ok} />
      <PageHeader
        titulo="Métricas"
        descripcion="Gestiona las cifras de la sección de estadísticas (años, artesanos, etc.)."
        accion={<LinkButton href="/admin/metricas/nueva">Nueva métrica</LinkButton>}
      />

      {metricas.length === 0 ? (
        <EmptyState mensaje="Aún no hay métricas. Crea la primera." />
      ) : (
        <TableShell headers={["Valor", "Etiqueta", "Orden", "Estado", "Acciones"]}>
          {metricas.map((m) => (
            <tr key={m.id}>
              <td className="px-4 py-3 font-medium">
                {m.prefijo ?? ""}
                {m.valor}
                {m.sufijo ?? ""}
              </td>
              <td className="px-4 py-3 text-gray-500">{m.etiqueta}</td>
              <td className="px-4 py-3 text-gray-500">{m.orden}</td>
              <td className="px-4 py-3">
                <EstadoBadge activo={m.estado} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <a href={`/admin/metricas/${m.id}`} className="text-sm font-medium text-gray-900 hover:underline">
                    Editar
                  </a>
                  <AccionConfirmable
                    action={alternarEstadoMetricaAction}
                    campos={{ id: m.id, estado: String(m.estado) }}
                    etiqueta={m.estado ? "Inactivar" : "Activar"}
                    variante="neutro"
                    confirmacion={
                      m.estado
                        ? "¿Seguro que deseas inactivar este elemento? Dejará de mostrarse en el sitio público."
                        : "¿Seguro que deseas cambiar el estado de este elemento?"
                    }
                    textoCargando="Actualizando..."
                  />
                  <AccionConfirmable
                    action={eliminarMetricaAction}
                    campos={{ id: m.id }}
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
