import { requireAdmin } from "@/lib/auth/guard";
import { PageHeader } from "../../_components/ui";
import { ProyectoForm } from "../proyecto-form";

export default async function NuevoProyectoPage() {
  await requireAdmin();
  return (
    <div>
      <PageHeader
        titulo="Nuevo proyecto"
        descripcion="Crea un proyecto. Podras agregarle imagenes despues de guardarlo."
      />
      <ProyectoForm />
    </div>
  );
}
