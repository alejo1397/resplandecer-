import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { obtenerMetrica, listarMetricas } from "@/lib/queries/admin/home";
import { PageHeader } from "../../_components/ui";
import { ListaCompacta } from "../../_components/lista-compacta";
import { MetricaForm } from "../metrica-form";

export default async function EditarMetricaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const [metrica, metricas] = await Promise.all([
    obtenerMetrica(Number(id)),
    listarMetricas(),
  ]);
  if (!metrica) notFound();

  return (
    <div>
      <PageHeader titulo="Editar métrica" descripcion={metrica.etiqueta} />
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <MetricaForm metrica={metrica} />
        </div>
        <ListaCompacta
          base="/admin/metricas"
          actualId={metrica.id}
          titulo="Ir a otra métrica"
          items={metricas.map((m) => ({ id: m.id, titulo: m.etiqueta, activo: m.estado }))}
        />
      </div>
    </div>
  );
}
