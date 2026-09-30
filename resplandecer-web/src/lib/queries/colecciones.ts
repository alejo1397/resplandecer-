import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serializers";

/**
 * Consultas PUBLICAS de colecciones (entidad independiente de categorías y
 * productos). Se usan en /colecciones, /colecciones/[slug] y el banner del home.
 * Filtran por estado = true.
 */

/** Lista las colecciones activas, ordenadas. */
export async function getColeccionesActivas() {
  const colecciones = await prisma.coleccion.findMany({
    where: { estado: true },
    orderBy: { orden: "asc" },
  });
  return serialize(colecciones);
}

/** Obtiene una colección activa por su slug, con su galería de imágenes. */
export async function getColeccionPorSlug(slug: string) {
  const coleccion = await prisma.coleccion.findFirst({
    where: { slug, estado: true },
    include: {
      imagenes: {
        where: { estado: true },
        orderBy: [{ esPrincipal: "desc" }, { orden: "asc" }],
      },
    },
  });
  return coleccion ? serialize(coleccion) : null;
}
