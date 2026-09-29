import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { obtenerMetrica } from "@/lib/queries/admin/home";
import { PageHeader } from "../../_components/ui";
import { MetricaForm } from "../metrica-form";

export default async function EditarMetricaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const metrica = await obtenerMetrica(Number(id));
  if (!metrica) notFound();

  return (
    <div>
      <PageHeader titulo="Editar métrica" descripcion={metrica.etiqueta} />
      <MetricaForm metrica={metrica} />
    </div>
  );
}
