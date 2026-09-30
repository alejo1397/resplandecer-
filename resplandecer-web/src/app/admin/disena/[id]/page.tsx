import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { obtenerPasoDiseno, listarPasosDiseno } from "@/lib/queries/admin/home";
import { PageHeader } from "../../_components/ui";
import { ListaCompacta } from "../../_components/lista-compacta";
import { PasoForm } from "../paso-form";

export default async function EditarPasoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const [paso, pasos] = await Promise.all([
    obtenerPasoDiseno(Number(id)),
    listarPasosDiseno(),
  ]);
  if (!paso) notFound();

  return (
    <div>
      <PageHeader titulo="Editar paso" descripcion={paso.titulo} />
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <PasoForm paso={paso} />
        </div>
        <ListaCompacta
          base="/admin/disena"
          actualId={paso.id}
          titulo="Ir a otro paso"
          items={pasos.map((p) => ({ id: p.id, titulo: p.titulo, activo: p.estado, imagenUrl: p.imagenUrl }))}
        />
      </div>
    </div>
  );
}
