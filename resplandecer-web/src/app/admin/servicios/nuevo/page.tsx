import { requireAdmin } from "@/lib/auth/guard";
import { PageHeader } from "../../_components/ui";
import { ServicioForm } from "../servicio-form";

export default async function NuevoServicioPage() {
  await requireAdmin();
  return (
    <div>
      <PageHeader titulo="Nuevo servicio" descripcion="Agrega un servicio." />
      <ServicioForm />
    </div>
  );
}
