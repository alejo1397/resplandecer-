import { requireAdmin } from "@/lib/auth/guard";
import { PageHeader } from "../../_components/ui";
import { MetricaForm } from "../metrica-form";

export default async function NuevaMetricaPage() {
  await requireAdmin();
  return (
    <div>
      <PageHeader titulo="Nueva métrica" descripcion="Agrega una cifra a la sección de estadísticas." />
      <MetricaForm />
    </div>
  );
}
