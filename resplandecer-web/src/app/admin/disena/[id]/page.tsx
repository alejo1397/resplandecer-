import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { obtenerPasoDiseno } from "@/lib/queries/admin/home";
import { PageHeader } from "../../_components/ui";
import { PasoForm } from "../paso-form";

export default async function EditarPasoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const paso = await obtenerPasoDiseno(Number(id));
  if (!paso) notFound();

  return (
    <div>
      <PageHeader titulo="Editar paso" descripcion={paso.titulo} />
      <PasoForm paso={paso} />
    </div>
  );
}
