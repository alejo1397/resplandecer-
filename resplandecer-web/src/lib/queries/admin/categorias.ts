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
  orden?: number;
  estado?: boolean;
};

/** Lista todas las categorias (activas e inactivas) para el panel. */
export async function listarCategorias() {
  const categorias = await prisma.categoria.findMany({
    orderBy: { orden: "asc" },
  });
  return serialize(categorias);
}

/** Obtiene una categoria por id. */
export async function obtenerCategoria(id: number) {
  const categoria = await prisma.categoria.findUnique({ where: { id } });
  return categoria ? serialize(categoria) : null;
}

/** Crea una categoria. */
export async function crearCategoria(input: CategoriaInput) {
  const categoria = await prisma.categoria.create({
    data: {
      nombre: input.nombre,
      slug: input.slug,
      descripcion: input.descripcion ?? null,
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
      orden: input.orden,
      estado: input.estado,
    },
  });
  return serialize(categoria);
}

/** Cambia el estado activo/inactivo de una categoria. */
export async function cambiarEstadoCategoria(id: number, estado: boolean) {
  const categoria = await prisma.categoria.update({
    where: { id },
    data: { estado },
  });
  return serialize(categoria);
}
