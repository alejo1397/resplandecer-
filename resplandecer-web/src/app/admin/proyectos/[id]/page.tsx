import Image from "next/image";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { obtenerProyecto } from "@/lib/queries/admin/proyectos";
import { PageHeader, Checkbox, SubmitButton } from "../../_components/ui";
import { ProyectoForm } from "../proyecto-form";
import { ImageUploader } from "../../_components/image-uploader";
import { agregarImagenProyectoAction, eliminarImagenProyectoAction } from "../actions";

export default async function EditarProyectoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const proyecto = await obtenerProyecto(Number(id));
  if (!proyecto) notFound();

  return (
    <div className="flex max-w-4xl flex-col gap-10">
      <div>
        <PageHeader titulo="Editar proyecto" descripcion={proyecto.titulo} />
        <ProyectoForm proyecto={proyecto} />
      </div>

      <section>
        <h2 className="text-lg font-semibold">Imagenes</h2>
        <p className="mt-1 text-sm text-gray-500">
          Agrega imagenes por URL. (La subida de archivos llegara con Supabase Storage.)
        </p>

        <div className="mt-4 flex flex-wrap gap-4">
          {proyecto.imagenes.length === 0 ? (
            <p className="text-sm text-gray-400">Sin imagenes aun.</p>
          ) : (
            proyecto.imagenes.map((img) => (
              <div key={img.id} className="w-40 rounded-lg border border-gray-200 bg-white p-2">
                <div className="relative h-32 w-full overflow-hidden rounded bg-gray-100">
                  <Image src={img.url} alt={img.textoAlternativo ?? ""} fill className="object-cover" unoptimized />
                </div>
                {img.esPrincipal ? (
                  <span className="mt-1 inline-block text-xs text-gray-500">Principal</span>
                ) : null}
                <form action={eliminarImagenProyectoAction} className="mt-2">
                  <input type="hidden" name="id" value={img.id} />
                  <input type="hidden" name="proyectoId" value={proyecto.id} />
                  <button type="submit" className="text-xs text-red-600 hover:underline">
                    Eliminar
                  </button>
                </form>
              </div>
            ))
          )}
        </div>

        <form action={agregarImagenProyectoAction} className="mt-6 flex max-w-lg flex-col gap-3">
          <input type="hidden" name="proyectoId" value={proyecto.id} />
          <ImageUploader fieldName="url" carpeta="proyectos" label="Nueva imagen (sube un archivo)" />
          <Checkbox name="esPrincipal" label="Marcar como imagen principal" />
          <div>
            <SubmitButton variant="secondary">Agregar imagen</SubmitButton>
          </div>
        </form>
      </section>
    </div>
  );
}
