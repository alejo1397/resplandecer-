import { requireAdmin } from "@/lib/auth/guard";
import { PageHeader } from "../../_components/ui";
import { PasoForm } from "../paso-form";

export default async function NuevoPasoPage() {
  await requireAdmin();
  return (
    <div>
      <PageHeader titulo="Nuevo paso" descripcion="Agrega un paso al proceso de diseño." />
      <PasoForm />
    </div>
  );
}
