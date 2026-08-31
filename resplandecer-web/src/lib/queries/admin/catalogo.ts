import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serializers";

/**
 * CRUD administrativo del catalogo y sus imagenes (panel admin).
 */

export type ProductoInput = {
  nombre: string;
  slug: string;
  descripcion?: string | null;
  precio: number;
  precioVenta?: number | null;
  categoriaId?: number | null;
  destacado?: boolean;
  orden?: number;
  estado?: boolean;
};

export type ImagenInput = {
  url: string;
  textoAlternativo?: string | null;
  esPrincipal?: boolean;
  orden?: number;
  estado?: boolean;
};

/** Lista todos los productos (activos e inactivos) con categoria e imagenes. */
export async function listarProductos() {
  const productos = await prisma.catalogo.findMany({
    orderBy: { orden: "asc" },
    include: { categoria: true, imagenes: { orderBy: { orden: "asc" } } },
  });
  return serialize(productos);
}

/** Obtiene un producto por id con sus imagenes. */
export async function obtenerProducto(id: number) {
  const producto = await prisma.catalogo.findUnique({
    where: { id },
    include: { categoria: true, imagenes: { orderBy: { orden: "asc" } } },
  });
  return producto ? serialize(producto) : null;
}

/** Crea un producto. */
export async function crearProducto(input: ProductoInput) {
  const producto = await prisma.catalogo.create({
    data: {
      nombre: input.nombre,
      slug: input.slug,
      descripcion: input.descripcion ?? null,
      precio: input.precio,
      precioVenta: input.precioVenta ?? null,
      categoriaId: input.categoriaId ?? null,
      destacado: input.destacado ?? false,
      orden: input.orden ?? 0,
      estado: input.estado ?? true,
    },
  });
  return serialize(producto);
}

/** Actualiza un producto. */
export async function actualizarProducto(id: number, input: Partial<ProductoInput>) {
  const producto = await prisma.catalogo.update({
    where: { id },
    data: {
      nombre: input.nombre,
      slug: input.slug,
      descripcion: input.descripcion,
      precio: input.precio,
      precioVenta: input.precioVenta,
      categoriaId: input.categoriaId,
      destacado: input.destacado,
      orden: input.orden,
      estado: input.estado,
    },
  });
  return serialize(producto);
}

/** Cambia el estado activo/inactivo de un producto. */
export async function cambiarEstadoProducto(id: number, estado: boolean) {
  const producto = await prisma.catalogo.update({
    where: { id },
    data: { estado },
  });
  return serialize(producto);
}

/** Agrega una imagen a un producto. */
export async function agregarImagenProducto(catalogoId: number, input: ImagenInput) {
  const imagen = await prisma.imagenCatalogo.create({
    data: {
      catalogoId,
      url: input.url,
      textoAlternativo: input.textoAlternativo ?? null,
      esPrincipal: input.esPrincipal ?? false,
      orden: input.orden ?? 0,
      estado: input.estado ?? true,
    },
  });
  return serialize(imagen);
}

/** Elimina una imagen de un producto. */
export async function eliminarImagenProducto(id: number) {
  await prisma.imagenCatalogo.delete({ where: { id } });
}
