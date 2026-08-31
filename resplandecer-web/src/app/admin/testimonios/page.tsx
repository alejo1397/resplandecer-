import { requireAdmin } from "@/lib/auth/guard";
import { listarTestimonios } from "@/lib/queries/admin/contenido";
import { PageHeader, LinkButton, TableShell, EstadoBadge, EmptyState } from "../_components/ui";
import { alternarEstadoTestimonioAction } from "./actions";

export default async function TestimoniosPage() {
  await requireAdmin();
  const testimonios = await listarTestimonios();

  return (
    <div>
      <PageHeader
        titulo="Testimonios"
        descripcion="Gestiona los testimonios de clientes."
        accion={<LinkButton href="/admin/testimonios/nuevo">Nuevo testimonio</LinkButton>}
      />

      {testimonios.length === 0 ? (
        <EmptyState mensaje="Aun no hay testimonios." />
      ) : (
        <TableShell headers={["Cliente", "Mensaje", "Calif.", "Orden", "Estado", "Acciones"]}>
          {testimonios.map((t) => (
            <tr key={t.id}>
              <td className="px-4 py-3 font-medium">{t.nombreCliente}</td>
              <td className="max-w-xs truncate px-4 py-3 text-gray-500">{t.mensaje}</td>
              <td className="px-4 py-3 text-gray-500">{t.calificacion ?? "-"}</td>
              <td className="px-4 py-3 text-gray-500">{t.orden}</td>
              <td className="px-4 py-3">
                <EstadoBadge activo={t.estado} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <a href={`/admin/testimonios/${t.id}`} className="text-sm font-medium text-gray-900 hover:underline">
                    Editar
                  </a>
                  <form action={alternarEstadoTestimonioAction}>
                    <input type="hidden" name="id" value={t.id} />
                    <input type="hidden" name="estado" value={String(t.estado)} />
                    <button type="submit" className="text-sm text-gray-500 hover:underline">
                      {t.estado ? "Inactivar" : "Activar"}
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
