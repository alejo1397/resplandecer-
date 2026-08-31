import Image from "next/image";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { obtenerProducto } from "@/lib/queries/admin/catalogo";
import { listarCategorias } from "@/lib/queries/admin/categorias";
import { PageHeader, Field, TextInput, Checkbox, SubmitButton } from "../../_components/ui";
import { ProductoForm } from "../producto-form";
import { agregarImagenAction, eliminarImagenAction } from "../actions";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const productoId = Number(id);
  const [producto, categorias] = await Promise.all([
    obtenerProducto(productoId),
    listarCategorias(),
  ]);
  if (!producto) notFound();

  return (
    <div className="flex max-w-4xl flex-col gap-10">
      <div>
        <PageHeader titulo="Editar producto" descripcion={producto.nombre} />
        <ProductoForm
          producto={producto}
          categorias={categorias.map((c) => ({ id: c.id, nombre: c.nombre }))}
        />
      </div>

      <section>
        <h2 className="text-lg font-semibold">Imagenes</h2>
        <p className="mt-1 text-sm text-gray-500">
          Agrega imagenes por URL. (La subida de archivos llegara con Supabase Storage.)
        </p>

        <div className="mt-4 flex flex-wrap gap-4">
          {producto.imagenes.length === 0 ? (
            <p className="text-sm text-gray-400">Sin imagenes aun.</p>
          ) : (
            producto.imagenes.map((img) => (
              <div key={img.id} className="w-40 rounded-lg border border-gray-200 bg-white p-2">
                <div className="relative h-32 w-full overflow-hidden rounded bg-gray-100">
                  <Image src={img.url} alt={img.textoAlternativo ?? ""} fill className="object-cover" unoptimized />
                </div>
                {img.esPrincipal ? (
                  <span className="mt-1 inline-block text-xs text-gray-500">Principal</span>
                ) : null}
                <form action={eliminarImagenAction} className="mt-2">
                  <input type="hidden" name="id" value={img.id} />
                  <input type="hidden" name="catalogoId" value={producto.id} />
                  <button type="submit" className="text-xs text-red-600 hover:underline">
                    Eliminar
                  </button>
                </form>
              </div>
            ))
          )}
        </div>

        <form action={agregarImagenAction} className="mt-6 flex max-w-lg flex-col gap-3">
          <input type="hidden" name="catalogoId" value={producto.id} />
          <Field label="URL de la nueva imagen">
            <TextInput name="url" type="url" placeholder="https://..." required />
          </Field>
          <Checkbox name="esPrincipal" label="Marcar como imagen principal" />
          <div>
            <SubmitButton variant="secondary">Agregar imagen</SubmitButton>
          </div>
        </form>
      </section>
    </div>
  );
}
