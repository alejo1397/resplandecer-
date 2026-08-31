import { requireAdmin } from "@/lib/auth/guard";
import { getClientes } from "@/lib/queries/clientes";
import { PageHeader, TableShell, EmptyState } from "../_components/ui";

export default async function ClientesPage() {
  await requireAdmin();
  const clientes = await getClientes();

  return (
    <div>
      <PageHeader
        titulo="Clientes"
        descripcion="Contactos recibidos desde el formulario del sitio."
      />

      {clientes.length === 0 ? (
        <EmptyState mensaje="Aun no hay contactos recibidos." />
      ) : (
        <TableShell headers={["Nombre", "Contacto", "Ciudad", "Mensaje", "Fecha"]}>
          {clientes.map((c) => (
            <tr key={c.id}>
              <td className="px-4 py-3 font-medium">{c.nombre}</td>
              <td className="px-4 py-3 text-gray-500">
                <div>{c.email ?? "-"}</div>
                <div>{c.telefono ?? ""}</div>
              </td>
              <td className="px-4 py-3 text-gray-500">{c.ciudad ?? "-"}</td>
              <td className="max-w-xs truncate px-4 py-3 text-gray-500">{c.mensaje ?? "-"}</td>
              <td className="px-4 py-3 text-gray-500">
                {new Date(c.creadoEn).toLocaleDateString("es-CO")}
              </td>
            </tr>
          ))}
        </TableShell>
      )}
    </div>
  );
}
