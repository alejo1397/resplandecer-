import { requireAdmin } from "@/lib/auth/guard";
import { listarPaginas, asegurarPagina } from "@/lib/queries/admin/paginas";
import { PageHeader, TableShell, EstadoBadge, EmptyState } from "../_components/ui";

/** Páginas de contenido que siempre deben existir. */
const PAGINAS_BASE = [
  { slug: "terminos-y-condiciones", titulo: "Términos y condiciones" },
  { slug: "nuestra-historia", titulo: "Nuestra historia" },
];

export default async function PaginasPage() {
  await requireAdmin();

  // Asegura que las páginas base existan (idempotente).
  for (const p of PAGINAS_BASE) {
    await asegurarPagina(p);
  }

  const paginas = await listarPaginas();

  return (
    <div>
      <PageHeader
        titulo="Páginas de contenido"
        descripcion="Edita el contenido de Términos y condiciones y Nuestra historia."
      />

      {paginas.length === 0 ? (
        <EmptyState mensaje="No hay páginas." />
      ) : (
        <TableShell headers={["Título", "Slug", "Bloques", "Estado", "Acciones"]}>
          {paginas.map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-3 font-medium">{p.titulo}</td>
              <td className="px-4 py-3 text-gray-500">{p.slug}</td>
              <td className="px-4 py-3 text-gray-500">{p._count.bloques}</td>
              <td className="px-4 py-3">
                <EstadoBadge activo={p.estado} />
              </td>
              <td className="px-4 py-3">
                <a href={`/admin/paginas/${p.id}`} className="text-sm font-medium text-gray-900 hover:underline">
                  Editar
                </a>
              </td>
            </tr>
          ))}
        </TableShell>
      )}
    </div>
  );
}
