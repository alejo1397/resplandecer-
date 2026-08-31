import { requireAdmin } from "@/lib/auth/guard";
import { listarProyectos } from "@/lib/queries/admin/proyectos";
import { PageHeader, LinkButton, TableShell, EstadoBadge, EmptyState } from "../_components/ui";
import { alternarEstadoProyectoAction } from "./actions";

export default async function ProyectosPage() {
  await requireAdmin();
  const proyectos = await listarProyectos();

  return (
    <div>
      <PageHeader
        titulo="Proyectos"
        descripcion="Gestiona la galeria de proyectos realizados."
        accion={<LinkButton href="/admin/proyectos/nuevo">Nuevo proyecto</LinkButton>}
      />

      {proyectos.length === 0 ? (
        <EmptyState mensaje="Aun no hay proyectos." />
      ) : (
        <TableShell headers={["Titulo", "Ubicacion", "Imgs", "Estado", "Acciones"]}>
          {proyectos.map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-3 font-medium">
                {p.titulo}
                {p.destacado ? (
                  <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800">
                    Destacado
                  </span>
                ) : null}
              </td>
              <td className="px-4 py-3 text-gray-500">{p.ubicacion ?? "-"}</td>
              <td className="px-4 py-3 text-gray-500">{p.imagenes.length}</td>
              <td className="px-4 py-3">
                <EstadoBadge activo={p.estado} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <a href={`/admin/proyectos/${p.id}`} className="text-sm font-medium text-gray-900 hover:underline">
                    Editar
                  </a>
                  <form action={alternarEstadoProyectoAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="estado" value={String(p.estado)} />
                    <button type="submit" className="text-sm text-gray-500 hover:underline">
                      {p.estado ? "Inactivar" : "Activar"}
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
