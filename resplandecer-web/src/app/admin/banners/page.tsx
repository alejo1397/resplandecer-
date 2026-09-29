import { requireAdmin } from "@/lib/auth/guard";
import { listarHomeBanners } from "@/lib/queries/admin/home";
import { PageHeader, LinkButton, TableShell, EstadoBadge, EmptyState } from "../_components/ui";
import { alternarEstadoBannerAction, eliminarBannerAction } from "./actions";

const SECCION_LABEL: Record<string, string> = {
  mobiliario: "Mobiliario",
  colecciones: "Colecciones",
};

export default async function BannersPage() {
  await requireAdmin();
  const banners = await listarHomeBanners();

  return (
    <div>
      <PageHeader
        titulo="Banners del inicio"
        descripcion="Gestiona los banners de Mobiliario y Colecciones (debajo del marquee)."
        accion={<LinkButton href="/admin/banners/nuevo">Nuevo banner</LinkButton>}
      />

      {banners.length === 0 ? (
        <EmptyState mensaje="Aún no hay banners. Crea el primero." />
      ) : (
        <TableShell headers={["Sección", "Etiqueta", "Orden", "Estado", "Acciones"]}>
          {banners.map((b) => (
            <tr key={b.id}>
              <td className="px-4 py-3 font-medium">{SECCION_LABEL[b.seccion] ?? b.seccion}</td>
              <td className="px-4 py-3 text-gray-500">{b.etiqueta ?? "-"}</td>
              <td className="px-4 py-3 text-gray-500">{b.orden}</td>
              <td className="px-4 py-3">
                <EstadoBadge activo={b.estado} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <a href={`/admin/banners/${b.id}`} className="text-sm font-medium text-gray-900 hover:underline">
                    Editar
                  </a>
                  <form action={alternarEstadoBannerAction}>
                    <input type="hidden" name="id" value={b.id} />
                    <input type="hidden" name="estado" value={String(b.estado)} />
                    <button type="submit" className="text-sm text-gray-500 hover:underline">
                      {b.estado ? "Inactivar" : "Activar"}
                    </button>
                  </form>
                  <form action={eliminarBannerAction}>
                    <input type="hidden" name="id" value={b.id} />
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
