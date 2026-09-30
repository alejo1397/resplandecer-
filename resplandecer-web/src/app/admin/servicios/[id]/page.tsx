import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { obtenerServicio, listarServicios } from "@/lib/queries/admin/home";
import { PageHeader } from "../../_components/ui";
import { ListaCompacta } from "../../_components/lista-compacta";
import { ServicioForm } from "../servicio-form";

export default async function EditarServicioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const [servicio, servicios] = await Promise.all([
    obtenerServicio(Number(id)),
    listarServicios(),
  ]);
  if (!servicio) notFound();

  return (
    <div>
      <PageHeader titulo="Editar servicio" descripcion={servicio.titulo} />
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <ServicioForm servicio={servicio} />
        </div>
        <ListaCompacta
          base="/admin/servicios"
          actualId={servicio.id}
          titulo="Ir a otro servicio"
          items={servicios.map((s) => ({ id: s.id, titulo: s.titulo, activo: s.estado, imagenUrl: s.imagenUrl }))}
        />
      </div>
    </div>
  );
}
