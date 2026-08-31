import { requireAdmin } from "@/lib/auth/guard";
import { PageHeader } from "../../_components/ui";
import { RedForm } from "../red-form";

export default async function NuevaRedPage() {
  await requireAdmin();
  return (
    <div>
      <PageHeader titulo="Nueva red social" descripcion="Agrega un enlace a una red social." />
      <RedForm />
    </div>
  );
}
