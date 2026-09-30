import Image from "next/image";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { obtenerColeccion, listarColecciones } from "@/lib/queries/admin/colecciones";
import { PageHeader, Checkbox, SubmitButton } from "../../_components/ui";
import { ListaCompacta } from "../../_components/lista-compacta";
import { ColeccionForm } from "../coleccion-form";
import { ImageUploader } from "../../_components/image-uploader";
import {
  agregarImagenColeccionAction,
  eliminarImagenColeccionAction,
  marcarPrincipalColeccionAction,
} from "../actions";

export default async function EditarColeccionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const [coleccion, colecciones] = await Promise.all([
    obtenerColeccion(Number(id)),
    listarColecciones(),
  ]);
  if (!coleccion) notFound();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <PageHeader titulo="Editar colección" descripcion={coleccion.titulo} />
          <ColeccionForm coleccion={coleccion} />
        </div>
        <ListaCompacta
          base="/admin/colecciones"
          actualId={coleccion.id}
          titulo="Ir a otra colección"
          items={colecciones.map((c) => ({ id: c.id, titulo: c.titulo, activo: c.estado, imagenUrl: c.imagenUrl }))}
        />
      </div>

      <section>
        <h2 className="text-lg font-semibold">Galería de la colección</h2>
        <p className="mt-1 text-sm text-gray-500">
          Estas imágenes se muestran en el detalle de la colección. Marca una como principal.
        </p>

        <div className="mt-4 flex flex-wrap gap-4">
          {coleccion.imagenes.length === 0 ? (
            <p className="text-sm text-gray-400">Sin imágenes aún.</p>
          ) : (
            coleccion.imagenes.map((img) => (
              <div key={img.id} className="w-40 rounded-lg border border-gray-200 bg-white p-2">
                <div className="relative h-32 w-full overflow-hidden rounded bg-gray-100">
                  <Image src={img.url} alt={img.textoAlternativo ?? ""} fill className="object-cover" unoptimized />
                </div>
                {img.esPrincipal ? (
                  <span className="mt-1 inline-block text-xs font-medium text-green-700">Principal</span>
                ) : (
                  <form action={marcarPrincipalColeccionAction} className="mt-1">
                    <input type="hidden" name="id" value={img.id} />
                    <input type="hidden" name="coleccionId" value={coleccion.id} />
                    <button type="submit" className="text-xs text-gray-600 hover:underline">
                      Marcar principal
                    </button>
                  </form>
                )}
                <form action={eliminarImagenColeccionAction} className="mt-1">
                  <input type="hidden" name="id" value={img.id} />
                  <input type="hidden" name="coleccionId" value={coleccion.id} />
                  <button type="submit" className="text-xs text-red-600 hover:underline">
                    Eliminar
                  </button>
                </form>
              </div>
            ))
          )}
        </div>

        <form action={agregarImagenColeccionAction} className="mt-6 flex max-w-lg flex-col gap-3">
          <input type="hidden" name="coleccionId" value={coleccion.id} />
          <ImageUploader fieldName="url" carpeta="colecciones" label="Nueva imagen de galería" />
          <Checkbox name="esPrincipal" label="Marcar como imagen principal" />
          <div>
            <SubmitButton variant="secondary">Agregar imagen</SubmitButton>
          </div>
        </form>
      </section>
    </div>
  );
}
