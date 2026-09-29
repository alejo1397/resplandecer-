import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { obtenerHomeBanner } from "@/lib/queries/admin/home";
import { PageHeader } from "../../_components/ui";
import { BannerForm } from "../banner-form";

export default async function EditarBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const banner = await obtenerHomeBanner(Number(id));
  if (!banner) notFound();

  return (
    <div>
      <PageHeader titulo="Editar banner" descripcion={banner.etiqueta ?? banner.seccion} />
      <BannerForm banner={banner} />
    </div>
  );
}
