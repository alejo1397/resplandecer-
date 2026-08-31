import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { obtenerTestimonio } from "@/lib/queries/admin/contenido";
import { PageHeader } from "../../_components/ui";
import { TestimonioForm } from "../testimonio-form";

export default async function EditarTestimonioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const testimonio = await obtenerTestimonio(Number(id));
  if (!testimonio) notFound();

  return (
    <div>
      <PageHeader titulo="Editar testimonio" descripcion={testimonio.nombreCliente} />
      <TestimonioForm testimonio={testimonio} />
    </div>
  );
}
