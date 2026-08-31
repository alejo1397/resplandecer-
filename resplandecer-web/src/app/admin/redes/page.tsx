import { requireAdmin } from "@/lib/auth/guard";
import { listarRedesSociales } from "@/lib/queries/admin/contenido";
import { PageHeader, LinkButton, TableShell, EstadoBadge, EmptyState } from "../_components/ui";
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
        <EmptyState mensaje="Aun no hay redes sociales." />
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
                  <form action={alternarEstadoRedAction}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="estado" value={String(r.estado)} />
                    <button type="submit" className="text-sm text-gray-500 hover:underline">
                      {r.estado ? "Inactivar" : "Activar"}
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
