import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serializers";

/**
 * CRUD administrativo de páginas de contenido y sus bloques.
 */

export type PaginaInput = {
  slug: string;
  titulo: string;
  subtitulo?: string | null;
  estado?: boolean;
};

export type BloqueInput = {
  subtitulo?: string | null;
  contenido: string;
  imagenUrl?: string | null;
  orden?: number;
  estado?: boolean;
};

export async function listarPaginas() {
  const paginas = await prisma.paginaContenido.findMany({
    orderBy: { titulo: "asc" },
    include: { _count: { select: { bloques: true } } },
  });
  return serialize(paginas);
}

export async function obtenerPagina(id: number) {
  const pagina = await prisma.paginaContenido.findUnique({
    where: { id },
    include: { bloques: { orderBy: { orden: "asc" } } },
  });
  return pagina ? serialize(pagina) : null;
}

/** Crea o actualiza una página por slug (upsert). Útil para asegurar defaults. */
export async function asegurarPagina(input: PaginaInput) {
  const pagina = await prisma.paginaContenido.upsert({
    where: { slug: input.slug },
    update: {},
    create: {
      slug: input.slug,
      titulo: input.titulo,
      subtitulo: input.subtitulo ?? null,
      estado: input.estado ?? true,
    },
  });
  return serialize(pagina);
}

export async function actualizarPagina(id: number, input: Partial<PaginaInput>) {
  const pagina = await prisma.paginaContenido.update({
    where: { id },
    data: {
      titulo: input.titulo,
      subtitulo: input.subtitulo,
      estado: input.estado,
    },
  });
  return serialize(pagina);
}

export async function agregarBloque(paginaId: number, input: BloqueInput) {
  const bloque = await prisma.bloqueContenido.create({
    data: {
      paginaId,
      subtitulo: input.subtitulo ?? null,
      contenido: input.contenido,
      imagenUrl: input.imagenUrl ?? null,
      orden: input.orden ?? 0,
      estado: input.estado ?? true,
    },
  });
  return serialize(bloque);
}

export async function actualizarBloque(id: number, input: Partial<BloqueInput>) {
  const bloque = await prisma.bloqueContenido.update({
    where: { id },
    data: {
      subtitulo: input.subtitulo,
      contenido: input.contenido,
      imagenUrl: input.imagenUrl,
      orden: input.orden,
      estado: input.estado,
    },
  });
  return serialize(bloque);
}

export async function eliminarBloque(id: number) {
  await prisma.bloqueContenido.delete({ where: { id } });
}
