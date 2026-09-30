import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serializers";

/**
 * CRUD administrativo de colecciones y sus imágenes.
 */

export type ColeccionInput = {
  titulo: string;
  slug: string;
  resumen?: string | null;
  descripcion?: string | null;
  imagenUrl?: string | null;
  imagenAlt?: string | null;
  whatsappTexto?: string | null;
  whatsappMensaje?: string | null;
  orden?: number;
  estado?: boolean;
};

export async function listarColecciones() {
  const colecciones = await prisma.coleccion.findMany({
    orderBy: { orden: "asc" },
    include: { _count: { select: { imagenes: true } } },
  });
  return serialize(colecciones);
}

export async function obtenerColeccion(id: number) {
  const coleccion = await prisma.coleccion.findUnique({
    where: { id },
    include: { imagenes: { orderBy: [{ esPrincipal: "desc" }, { orden: "asc" }] } },
  });
  return coleccion ? serialize(coleccion) : null;
}

export async function crearColeccion(input: ColeccionInput) {
  const coleccion = await prisma.coleccion.create({
    data: {
      titulo: input.titulo,
      slug: input.slug,
      resumen: input.resumen ?? null,
      descripcion: input.descripcion ?? null,
      imagenUrl: input.imagenUrl ?? null,
      imagenAlt: input.imagenAlt ?? null,
      whatsappTexto: input.whatsappTexto ?? null,
      whatsappMensaje: input.whatsappMensaje ?? null,
      orden: input.orden ?? 0,
      estado: input.estado ?? true,
    },
  });
  return serialize(coleccion);
}

export async function actualizarColeccion(id: number, input: Partial<ColeccionInput>) {
  const coleccion = await prisma.coleccion.update({
    where: { id },
    data: {
      titulo: input.titulo,
      slug: input.slug,
      resumen: input.resumen,
      descripcion: input.descripcion,
      imagenUrl: input.imagenUrl,
      imagenAlt: input.imagenAlt,
      whatsappTexto: input.whatsappTexto,
      whatsappMensaje: input.whatsappMensaje,
      orden: input.orden,
      estado: input.estado,
    },
  });
  return serialize(coleccion);
}

export async function cambiarEstadoColeccion(id: number, estado: boolean) {
  const coleccion = await prisma.coleccion.update({ where: { id }, data: { estado } });
  return serialize(coleccion);
}

export async function eliminarColeccion(id: number) {
  await prisma.coleccion.delete({ where: { id } });
}

// --- Imágenes de la galería ---

export async function agregarImagenColeccion(
  coleccionId: number,
  input: { url: string; textoAlternativo?: string | null; esPrincipal?: boolean; orden?: number },
) {
  // Si esta imagen es principal, quitar la marca de las demás.
  if (input.esPrincipal) {
    await prisma.imagenColeccion.updateMany({
      where: { coleccionId },
      data: { esPrincipal: false },
    });
  }
  const imagen = await prisma.imagenColeccion.create({
    data: {
      coleccionId,
      url: input.url,
      textoAlternativo: input.textoAlternativo ?? null,
      esPrincipal: input.esPrincipal ?? false,
      orden: input.orden ?? 0,
    },
  });
  return serialize(imagen);
}

export async function marcarImagenPrincipalColeccion(id: number, coleccionId: number) {
  await prisma.imagenColeccion.updateMany({
    where: { coleccionId },
    data: { esPrincipal: false },
  });
  await prisma.imagenColeccion.update({ where: { id }, data: { esPrincipal: true } });
}

export async function eliminarImagenColeccion(id: number) {
  await prisma.imagenColeccion.delete({ where: { id } });
}
