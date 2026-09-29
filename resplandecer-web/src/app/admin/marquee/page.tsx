import { requireAdmin } from "@/lib/auth/guard";
import { listarMarqueeItems } from "@/lib/queries/admin/home";
import { PageHeader, LinkButton, TableShell, EstadoBadge, EmptyState } from "../_components/ui";
import { alternarEstadoMarqueeAction, eliminarMarqueeAction } from "./actions";

export default async function MarqueePage() {
  await requireAdmin();
  const items = await listarMarqueeItems();

  return (
    <div>
      <PageHeader
        titulo="Marquee"
        descripcion="Gestiona los textos de la cinta animada de la página principal."
        accion={<LinkButton href="/admin/marquee/nuevo">Nuevo texto</LinkButton>}
      />

      {items.length === 0 ? (
        <EmptyState mensaje="Aún no hay textos. Crea el primero." />
      ) : (
        <TableShell headers={["Texto", "Orden", "Estado", "Acciones"]}>
          {items.map((m) => (
            <tr key={m.id}>
              <td className="px-4 py-3 font-medium">{m.texto}</td>
              <td className="px-4 py-3 text-gray-500">{m.orden}</td>
              <td className="px-4 py-3">
                <EstadoBadge activo={m.estado} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <a href={`/admin/marquee/${m.id}`} className="text-sm font-medium text-gray-900 hover:underline">
                    Editar
                  </a>
                  <form action={alternarEstadoMarqueeAction}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="estado" value={String(m.estado)} />
                    <button type="submit" className="text-sm text-gray-500 hover:underline">
                      {m.estado ? "Inactivar" : "Activar"}
                    </button>
                  </form>
                  <form action={eliminarMarqueeAction}>
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
