import { requireAdmin } from "@/lib/auth/guard";
import { PageHeader } from "../../_components/ui";
import { CategoriaForm } from "../categoria-form";

export default async function NuevaCategoriaPage() {
  await requireAdmin();
  return (
    <div>
      <PageHeader titulo="Nueva categoría" descripcion="Crea una categoría para el catálogo." />
      <CategoriaForm />
    </div>
  );
}
