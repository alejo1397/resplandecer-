import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { obtenerRedSocial } from "@/lib/queries/admin/contenido";
import { PageHeader } from "../../_components/ui";
import { RedForm } from "../red-form";

export default async function EditarRedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const red = await obtenerRedSocial(Number(id));
  if (!red) notFound();

  return (
    <div>
      <PageHeader titulo="Editar red social" descripcion={red.nombre} />
      <RedForm red={red} />
    </div>
  );
}
