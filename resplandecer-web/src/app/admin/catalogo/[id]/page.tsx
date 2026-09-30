import Image from "next/image";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { obtenerProducto, listarProductos } from "@/lib/queries/admin/catalogo";
import { listarCategorias } from "@/lib/queries/admin/categorias";
import { PageHeader, Checkbox, SubmitButton } from "../../_components/ui";
import { ListaCompacta } from "../../_components/lista-compacta";
import { ProductoForm } from "../producto-form";
import { ImageUploader } from "../../_components/image-uploader";
import { agregarImagenAction, eliminarImagenAction, marcarPrincipalProductoAction } from "../actions";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const productoId = Number(id);
  const [producto, categorias, productos] = await Promise.all([
    obtenerProducto(productoId),
    listarCategorias(),
    listarProductos(),
  ]);
  if (!producto) notFound();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <PageHeader titulo="Editar producto" descripcion={producto.nombre} />
          <ProductoForm
            producto={producto}
            categorias={categorias.map((c) => ({ id: c.id, nombre: c.nombre }))}
          />
        </div>
        <ListaCompacta
          base="/admin/catalogo"
          actualId={producto.id}
          titulo="Ir a otro producto"
          items={productos.map((p) => ({
            id: p.id,
            titulo: p.nombre,
            activo: p.estado,
            imagenUrl: p.imagenes[0]?.url ?? null,
          }))}
        />
      </div>

      <section>
        <h2 className="text-lg font-semibold">Imágenes</h2>
        <p className="mt-1 text-sm text-gray-500">
          Sube las imágenes del producto. La primera marcada como principal se usa en el listado.
        </p>

        <div className="mt-4 flex flex-wrap gap-4">
          {producto.imagenes.length === 0 ? (
            <p className="text-sm text-gray-400">Sin imágenes aún.</p>
          ) : (
            producto.imagenes.map((img) => (
              <div key={img.id} className="w-40 rounded-lg border border-gray-200 bg-white p-2">
                <div className="relative h-32 w-full overflow-hidden rounded bg-gray-100">
                  <Image src={img.url} alt={img.textoAlternativo ?? ""} fill className="object-cover" unoptimized />
                </div>
                {img.esPrincipal ? (
                  <span className="mt-1 inline-block text-xs font-medium text-green-700">Principal</span>
                ) : (
                  <form action={marcarPrincipalProductoAction} className="mt-1">
                    <input type="hidden" name="id" value={img.id} />
                    <input type="hidden" name="catalogoId" value={producto.id} />
                    <button type="submit" className="text-xs text-gray-600 hover:underline">
                      Marcar principal
                    </button>
                  </form>
                )}
                <form action={eliminarImagenAction} className="mt-1">
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
          <ImageUploader fieldName="url" carpeta="catalogo" label="Nueva imagen (sube un archivo)" />
          <Checkbox name="esPrincipal" label="Marcar como imagen principal" />
          <div>
            <SubmitButton variant="secondary">Agregar imagen</SubmitButton>
          </div>
        </form>
      </section>
    </div>
  );
}
