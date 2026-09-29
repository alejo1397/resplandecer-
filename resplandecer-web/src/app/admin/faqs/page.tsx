import { requireAdmin } from "@/lib/auth/guard";
import { listarFaqs } from "@/lib/queries/admin/home";
import { PageHeader, LinkButton, TableShell, EstadoBadge, EmptyState } from "../_components/ui";
import { alternarEstadoFaqAction, eliminarFaqAction } from "./actions";

export default async function FaqsPage() {
  await requireAdmin();
  const faqs = await listarFaqs();

  return (
    <div>
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
                  <form action={alternarEstadoFaqAction}>
                    <input type="hidden" name="id" value={f.id} />
                    <input type="hidden" name="estado" value={String(f.estado)} />
                    <button type="submit" className="text-sm text-gray-500 hover:underline">
                      {f.estado ? "Inactivar" : "Activar"}
                    </button>
                  </form>
                  <form action={eliminarFaqAction}>
                    <input type="hidden" name="id" value={f.id} />
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
