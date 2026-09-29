import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { obtenerServicio } from "@/lib/queries/admin/home";
import { PageHeader } from "../../_components/ui";
import { ServicioForm } from "../servicio-form";

export default async function EditarServicioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const servicio = await obtenerServicio(Number(id));
  if (!servicio) notFound();

  return (
    <div>
      <PageHeader titulo="Editar servicio" descripcion={servicio.titulo} />
      <ServicioForm servicio={servicio} />
    </div>
  );
}
