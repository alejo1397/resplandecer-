import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { obtenerCategoria, listarCategorias } from "@/lib/queries/admin/categorias";
import { PageHeader } from "../../_components/ui";
import { ListaCompacta } from "../../_components/lista-compacta";
import { CategoriaForm } from "../categoria-form";

export default async function EditarCategoriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const [categoria, categorias] = await Promise.all([
    obtenerCategoria(Number(id)),
    listarCategorias(),
  ]);
  if (!categoria) notFound();

  return (
    <div>
      <PageHeader titulo="Editar categoría" descripcion={categoria.nombre} />
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <CategoriaForm categoria={categoria} />
        </div>
        <ListaCompacta
          base="/admin/categorias"
          actualId={categoria.id}
          titulo="Ir a otra categoría"
          items={categorias.map((c) => ({ id: c.id, titulo: c.nombre, activo: c.estado, imagenUrl: c.imagenUrl }))}
        />
      </div>
    </div>
  );
}
