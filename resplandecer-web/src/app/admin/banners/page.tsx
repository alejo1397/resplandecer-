import { requireAdmin } from "@/lib/auth/guard";
import { listarHomeBanners } from "@/lib/queries/admin/home";
import { PageHeader, LinkButton, TableShell, EstadoBadge, EmptyState } from "../_components/ui";
import { AccionConfirmable } from "../_components/accion-confirmable";
import { Flash } from "../_components/flash";
import { alternarEstadoBannerAction, eliminarBannerAction } from "./actions";

const SECCION_LABEL: Record<string, string> = {
  mobiliario: "Mobiliario",
  colecciones: "Colecciones",
};

export default async function BannersPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  await requireAdmin();
  const { ok } = await searchParams;
  const banners = await listarHomeBanners();

  return (
    <div>
      <Flash ok={ok} />
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
                  <AccionConfirmable
                    action={alternarEstadoBannerAction}
                    campos={{ id: b.id, estado: String(b.estado) }}
                    etiqueta={b.estado ? "Inactivar" : "Activar"}
                    variante="neutro"
                    confirmacion={
                      b.estado
                        ? "¿Seguro que deseas inactivar este elemento? Dejará de mostrarse en el sitio público."
                        : "¿Seguro que deseas cambiar el estado de este elemento?"
                    }
                    textoCargando="Actualizando..."
                  />
                  <AccionConfirmable
                    action={eliminarBannerAction}
                    campos={{ id: b.id }}
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
