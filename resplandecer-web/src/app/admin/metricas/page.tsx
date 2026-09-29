import { requireAdmin } from "@/lib/auth/guard";
import { listarMetricas } from "@/lib/queries/admin/home";
import { PageHeader, LinkButton, TableShell, EstadoBadge, EmptyState } from "../_components/ui";
import { alternarEstadoMetricaAction, eliminarMetricaAction } from "./actions";

export default async function MetricasPage() {
  await requireAdmin();
  const metricas = await listarMetricas();

  return (
    <div>
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
                  <form action={alternarEstadoMetricaAction}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="estado" value={String(m.estado)} />
                    <button type="submit" className="text-sm text-gray-500 hover:underline">
                      {m.estado ? "Inactivar" : "Activar"}
                    </button>
                  </form>
                  <form action={eliminarMetricaAction}>
                    <input type="hidden" name="id" value={m.id} />
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
