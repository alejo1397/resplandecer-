import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { obtenerCategoria } from "@/lib/queries/admin/categorias";
import { PageHeader } from "../../_components/ui";
import { CategoriaForm } from "../categoria-form";

export default async function EditarCategoriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const categoria = await obtenerCategoria(Number(id));
  if (!categoria) notFound();

  return (
    <div>
      <PageHeader titulo="Editar categoria" descripcion={categoria.nombre} />
      <CategoriaForm categoria={categoria} />
    </div>
  );
}
