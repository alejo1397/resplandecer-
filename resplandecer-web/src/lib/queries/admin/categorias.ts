import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serializers";

/**
 * CRUD administrativo de categorias (panel admin).
 * A diferencia de las queries publicas, aqui se listan TODAS (activas e
 * inactivas), porque el admin necesita gestionarlas.
 */

export type CategoriaInput = {
  nombre: string;
  slug: string;
  descripcion?: string | null;
  imagenUrl?: string | null;
  whatsappTexto?: string | null;
  whatsappMensaje?: string | null;
  orden?: number;
  estado?: boolean;
};

/** Lista todas las categorias (activas e inactivas) para el panel. */
export async function listarCategorias() {
  const categorias = await prisma.categoria.findMany({
    orderBy: { orden: "asc" },
    include: { _count: { select: { productos: true } } },
  });
  return serialize(categorias);
}

/** Obtiene una categoria por id, con su galeria de imagenes. */
export async function obtenerCategoria(id: number) {
  const categoria = await prisma.categoria.findUnique({
    where: { id },
    include: { imagenes: { orderBy: { orden: "asc" } } },
  });
  return categoria ? serialize(categoria) : null;
}

/** Cuenta cuantos productos tiene asociados una categoria. */
export async function contarProductosDeCategoria(id: number): Promise<number> {
  return prisma.catalogo.count({ where: { categoriaId: id } });
}

/** Crea una categoria. */
export async function crearCategoria(input: CategoriaInput) {
  const categoria = await prisma.categoria.create({
    data: {
      nombre: input.nombre,
      slug: input.slug,
      descripcion: input.descripcion ?? null,
      imagenUrl: input.imagenUrl ?? null,
      whatsappTexto: input.whatsappTexto ?? null,
      whatsappMensaje: input.whatsappMensaje ?? null,
      orden: input.orden ?? 0,
      estado: input.estado ?? true,
    },
  });
  return serialize(categoria);
}

/** Actualiza una categoria. */
export async function actualizarCategoria(id: number, input: Partial<CategoriaInput>) {
  const categoria = await prisma.categoria.update({
    where: { id },
    data: {
      nombre: input.nombre,
      slug: input.slug,
      descripcion: input.descripcion,
      imagenUrl: input.imagenUrl,
      whatsappTexto: input.whatsappTexto,
      whatsappMensaje: input.whatsappMensaje,
      orden: input.orden,
      estado: input.estado,
    },
  });
  return serialize(categoria);
}

/** Agrega una imagen a la galeria de una coleccion/categoria. */
export async function agregarImagenCategoria(
  categoriaId: number,
  input: { url: string; textoAlternativo?: string | null; orden?: number },
) {
  const imagen = await prisma.imagenCategoria.create({
    data: {
      categoriaId,
      url: input.url,
      textoAlternativo: input.textoAlternativo ?? null,
      orden: input.orden ?? 0,
    },
  });
  return serialize(imagen);
}

/** Elimina una imagen de la galeria de una coleccion/categoria. */
export async function eliminarImagenCategoria(id: number) {
  await prisma.imagenCategoria.delete({ where: { id } });
}

/** Cambia el estado activo/inactivo de una categoria. */
export async function cambiarEstadoCategoria(id: number, estado: boolean) {
  const categoria = await prisma.categoria.update({
    where: { id },
    data: { estado },
  });
  return serialize(categoria);
}
