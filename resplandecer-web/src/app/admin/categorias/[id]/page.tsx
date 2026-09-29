import Image from "next/image";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { obtenerCategoria } from "@/lib/queries/admin/categorias";
import { PageHeader, SubmitButton } from "../../_components/ui";
import { CategoriaForm } from "../categoria-form";
import { ImageUploader } from "../../_components/image-uploader";
import { agregarImagenCategoriaAction, eliminarImagenCategoriaAction } from "../actions";

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
    <div className="flex max-w-4xl flex-col gap-10">
      <div>
        <PageHeader titulo="Editar categoría" descripcion={categoria.nombre} />
        <CategoriaForm categoria={categoria} />
      </div>

      <section>
        <h2 className="text-lg font-semibold">Galería de la colección</h2>
        <p className="mt-1 text-sm text-gray-500">
          Estas imágenes se muestran en el detalle de la colección.
        </p>

        <div className="mt-4 flex flex-wrap gap-4">
          {categoria.imagenes.length === 0 ? (
            <p className="text-sm text-gray-400">Sin imágenes aún.</p>
          ) : (
            categoria.imagenes.map((img) => (
              <div key={img.id} className="w-40 rounded-lg border border-gray-200 bg-white p-2">
                <div className="relative h-32 w-full overflow-hidden rounded bg-gray-100">
                  <Image src={img.url} alt={img.textoAlternativo ?? ""} fill className="object-cover" unoptimized />
                </div>
                <form action={eliminarImagenCategoriaAction} className="mt-2">
                  <input type="hidden" name="id" value={img.id} />
                  <input type="hidden" name="categoriaId" value={categoria.id} />
                  <button type="submit" className="text-xs text-red-600 hover:underline">
                    Eliminar
                  </button>
                </form>
              </div>
            ))
          )}
        </div>

        <form action={agregarImagenCategoriaAction} className="mt-6 flex max-w-lg flex-col gap-3">
          <input type="hidden" name="categoriaId" value={categoria.id} />
          <ImageUploader fieldName="url" carpeta="categorias" label="Nueva imagen de galería" />
          <div>
            <SubmitButton variant="secondary">Agregar imagen</SubmitButton>
          </div>
        </form>
      </section>
    </div>
  );
}
