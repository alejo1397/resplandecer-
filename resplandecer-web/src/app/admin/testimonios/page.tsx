import { requireAdmin } from "@/lib/auth/guard";
import { listarTestimonios } from "@/lib/queries/admin/contenido";
import { PageHeader, LinkButton, TableShell, EstadoBadge, EmptyState } from "../_components/ui";
import { AccionConfirmable } from "../_components/accion-confirmable";
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
        <EmptyState mensaje="Aún no hay testimonios." />
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
                  <AccionConfirmable
                    action={alternarEstadoTestimonioAction}
                    campos={{ id: t.id, estado: String(t.estado) }}
                    etiqueta={t.estado ? "Inactivar" : "Activar"}
                    variante="neutro"
                    confirmacion={
                      t.estado
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
