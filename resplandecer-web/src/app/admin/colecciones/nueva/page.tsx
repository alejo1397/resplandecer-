import { requireAdmin } from "@/lib/auth/guard";
import { PageHeader } from "../../_components/ui";
import { ColeccionForm } from "../coleccion-form";

export default async function NuevaColeccionPage() {
  await requireAdmin();
  return (
    <div>
      <PageHeader
        titulo="Nueva colección"
        descripcion="Crea una colección con su portada, descripción y datos de WhatsApp."
      />
      <ColeccionForm />
    </div>
  );
}
