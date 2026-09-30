import { requireAdmin } from "@/lib/auth/guard";
import { listarFaqs } from "@/lib/queries/admin/home";
import { PageHeader, LinkButton, TableShell, EstadoBadge, EmptyState } from "../_components/ui";
import { AccionConfirmable } from "../_components/accion-confirmable";
import { Flash } from "../_components/flash";
import { alternarEstadoFaqAction, eliminarFaqAction } from "./actions";

export default async function FaqsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  await requireAdmin();
  const { ok } = await searchParams;
  const faqs = await listarFaqs();

  return (
    <div>
      <Flash ok={ok} />
      <PageHeader
        titulo="Preguntas frecuentes"
        descripcion="Gestiona las preguntas frecuentes de la página principal."
        accion={<LinkButton href="/admin/faqs/nueva">Nueva pregunta</LinkButton>}
      />

      {faqs.length === 0 ? (
        <EmptyState mensaje="Aún no hay preguntas. Crea la primera." />
      ) : (
        <TableShell headers={["Pregunta", "Orden", "Estado", "Acciones"]}>
          {faqs.map((f) => (
            <tr key={f.id}>
              <td className="px-4 py-3 font-medium">{f.pregunta}</td>
              <td className="px-4 py-3 text-gray-500">{f.orden}</td>
              <td className="px-4 py-3">
                <EstadoBadge activo={f.estado} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <a href={`/admin/faqs/${f.id}`} className="text-sm font-medium text-gray-900 hover:underline">
                    Editar
                  </a>
                  <AccionConfirmable
                    action={alternarEstadoFaqAction}
                    campos={{ id: f.id, estado: String(f.estado) }}
                    etiqueta={f.estado ? "Inactivar" : "Activar"}
                    variante="neutro"
                    confirmacion={
                      f.estado
                        ? "¿Seguro que deseas inactivar este elemento? Dejará de mostrarse en el sitio público."
                        : "¿Seguro que deseas cambiar el estado de este elemento?"
                    }
                    textoCargando="Actualizando..."
                  />
                  <AccionConfirmable
                    action={eliminarFaqAction}
                    campos={{ id: f.id }}
                    etiqueta="Eliminar"
                    variante="peligro"
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
