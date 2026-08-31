import { requireAdmin } from "@/lib/auth/guard";
import { PageHeader } from "../../_components/ui";
import { CategoriaForm } from "../categoria-form";

export default async function NuevaCategoriaPage() {
  await requireAdmin();
  return (
    <div>
      <PageHeader titulo="Nueva categoria" descripcion="Crea una categoria para el catalogo." />
      <CategoriaForm />
    </div>
  );
}
