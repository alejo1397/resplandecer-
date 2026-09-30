import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { obtenerPagina } from "@/lib/queries/admin/paginas";
import { PageHeader, Field, TextInput, TextArea, Checkbox, SubmitButton } from "../../_components/ui";
import { ImageUploader } from "../../_components/image-uploader";
import { PaginaForm } from "../pagina-form";
import { agregarBloqueAction, actualizarBloqueAction, eliminarBloqueAction } from "../actions";

export default async function EditarPaginaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const pagina = await obtenerPagina(Number(id));
  if (!pagina) notFound();

  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <div>
        <PageHeader titulo="Editar página" descripcion={pagina.titulo} />
        <PaginaForm pagina={pagina} />
      </div>

      <section>
        <h2 className="text-lg font-semibold">Bloques de contenido</h2>
        <p className="mt-1 text-sm text-gray-500">
          Cada bloque es un subtítulo (opcional) más un texto. Se muestran en orden.
        </p>

        <div className="mt-4 flex flex-col gap-4">
          {pagina.bloques.length === 0 ? (
            <p className="text-sm text-gray-400">Sin bloques aún.</p>
          ) : (
            pagina.bloques.map((b) => (
              <form
                key={b.id}
                action={actualizarBloqueAction}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <input type="hidden" name="id" value={b.id} />
                <input type="hidden" name="paginaId" value={pagina.id} />
                <div className="flex flex-col gap-3">
                  <Field label="Subtítulo (opcional)">
                    <TextInput name="subtitulo" defaultValue={b.subtitulo ?? ""} />
                  </Field>
                  <Field label="Contenido">
                    <TextArea name="contenido" defaultValue={b.contenido} required />
                  </Field>
                  <ImageUploader
                    fieldName="imagenUrl"
                    carpeta="paginas"
                    defaultUrl={b.imagenUrl ?? ""}
                    label="Imagen de la sección (opcional)"
                  />
                  <div className="flex items-center gap-4">
                    <Field label="Orden">
                      <TextInput name="orden" type="number" defaultValue={b.orden} />
                    </Field>
                    <Checkbox name="estado" label="Visible" defaultChecked={b.estado} />
                  </div>
                  <div className="flex items-center gap-3">
                    <SubmitButton variant="secondary">Guardar bloque</SubmitButton>
                  </div>
                </div>
              </form>
            ))
          )}
        </div>

        {pagina.bloques.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-3">
            {pagina.bloques.map((b) => (
              <form key={`del-${b.id}`} action={eliminarBloqueAction}>
                <input type="hidden" name="id" value={b.id} />
                <input type="hidden" name="paginaId" value={pagina.id} />
                <button type="submit" className="text-xs text-red-600 hover:underline">
                  Eliminar bloque #{b.orden}
                </button>
              </form>
            ))}
          </div>
        ) : null}

        <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-700">Agregar bloque</h3>
          <form action={agregarBloqueAction} className="mt-3 flex flex-col gap-3">
            <input type="hidden" name="paginaId" value={pagina.id} />
            <Field label="Subtítulo (opcional)">
              <TextInput name="subtitulo" />
            </Field>
            <Field label="Contenido">
              <TextArea name="contenido" required />
            </Field>
            <ImageUploader fieldName="imagenUrl" carpeta="paginas" label="Imagen de la sección (opcional)" />
            <Field label="Orden">
              <TextInput name="orden" type="number" defaultValue={pagina.bloques.length} />
            </Field>
            <div>
              <SubmitButton>Agregar bloque</SubmitButton>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
