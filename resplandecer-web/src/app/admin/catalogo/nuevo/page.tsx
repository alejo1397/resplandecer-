import { requireAdmin } from "@/lib/auth/guard";
import { listarCategorias } from "@/lib/queries/admin/categorias";
import { PageHeader } from "../../_components/ui";
import { ProductoForm } from "../producto-form";

export default async function NuevoProductoPage() {
  await requireAdmin();
  const categorias = await listarCategorias();

  return (
    <div>
      <PageHeader
        titulo="Nuevo producto"
        descripcion="Crea un producto. Podras agregarle imagenes despues de guardarlo."
      />
      <ProductoForm categorias={categorias.map((c) => ({ id: c.id, nombre: c.nombre }))} />
    </div>
  );
}
