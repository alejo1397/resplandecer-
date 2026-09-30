import { requireAdmin } from "@/lib/auth/guard";
import { listarMarqueeItems } from "@/lib/queries/admin/home";
import { PageHeader, LinkButton, TableShell, EstadoBadge, EmptyState } from "../_components/ui";
import { AccionConfirmable } from "../_components/accion-confirmable";
import { Flash } from "../_components/flash";
import { alternarEstadoMarqueeAction, eliminarMarqueeAction } from "./actions";

export default async function MarqueePage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  await requireAdmin();
  const { ok } = await searchParams;
  const items = await listarMarqueeItems();

  return (
    <div>
      <Flash ok={ok} />
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
                  <AccionConfirmable
                    action={alternarEstadoMarqueeAction}
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
                    action={eliminarMarqueeAction}
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
