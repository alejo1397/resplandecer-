import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serializers";

/**
 * Consultas PUBLICAS de categorias y catalogo (para la web publica).
 * Todas filtran por estado = true y respetan el campo "orden".
 */

/** Lista las categorias activas, ordenadas. */
export async function getCategoriasActivas() {
  const categorias = await prisma.categoria.findMany({
    where: { estado: true },
    orderBy: { orden: "asc" },
  });
  return serialize(categorias);
}

/** Lista los productos activos, con su categoria e imagenes activas. */
export async function getProductosActivos() {
  const productos = await prisma.catalogo.findMany({
    where: { estado: true },
    orderBy: { orden: "asc" },
    include: {
      categoria: true,
      imagenes: {
        where: { estado: true },
        orderBy: [{ esPrincipal: "desc" }, { orden: "asc" }],
      },
    },
  });
  return serialize(productos);
}

/** Lista solo los productos destacados y activos. */
export async function getProductosDestacados() {
  const productos = await prisma.catalogo.findMany({
    where: { estado: true, destacado: true },
    orderBy: { orden: "asc" },
    include: {
      categoria: true,
      imagenes: {
        where: { estado: true },
        orderBy: [{ esPrincipal: "desc" }, { orden: "asc" }],
      },
    },
  });
  return serialize(productos);
}

/** Lista los productos activos de una categoria (por slug de categoria). */
export async function getProductosPorCategoria(slugCategoria: string) {
  const productos = await prisma.catalogo.findMany({
    where: {
      estado: true,
      categoria: { slug: slugCategoria, estado: true },
    },
    orderBy: { orden: "asc" },
    include: {
      categoria: true,
      imagenes: {
        where: { estado: true },
        orderBy: [{ esPrincipal: "desc" }, { orden: "asc" }],
      },
    },
  });
  return serialize(productos);
}

/** Obtiene un producto activo por su slug, con categoria e imagenes. */
export async function getProductoPorSlug(slug: string) {
  const producto = await prisma.catalogo.findFirst({
    where: { slug, estado: true },
    include: {
      categoria: true,
      imagenes: {
        where: { estado: true },
        orderBy: [{ esPrincipal: "desc" }, { orden: "asc" }],
      },
    },
  });
  return producto ? serialize(producto) : null;
}
