import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serializers";

/**
 * CRUD administrativo de proyectos y sus imagenes (panel admin).
 */

export type ProyectoInput = {
  titulo: string;
  slug: string;
  descripcion?: string | null;
  ubicacion?: string | null;
  fecha?: string | null; // ISO date (YYYY-MM-DD)
  destacado?: boolean;
  orden?: number;
  estado?: boolean;
};

export async function listarProyectos() {
  const proyectos = await prisma.proyecto.findMany({
    orderBy: { orden: "asc" },
    include: { imagenes: { orderBy: { orden: "asc" } } },
  });
  return serialize(proyectos);
}

export async function obtenerProyecto(id: number) {
  const proyecto = await prisma.proyecto.findUnique({
    where: { id },
    include: { imagenes: { orderBy: { orden: "asc" } } },
  });
  return proyecto ? serialize(proyecto) : null;
}

export async function crearProyecto(input: ProyectoInput) {
  const proyecto = await prisma.proyecto.create({
    data: {
      titulo: input.titulo,
      slug: input.slug,
      descripcion: input.descripcion ?? null,
      ubicacion: input.ubicacion ?? null,
      fecha: input.fecha ? new Date(input.fecha) : null,
      destacado: input.destacado ?? false,
      orden: input.orden ?? 0,
      estado: input.estado ?? true,
    },
  });
  return serialize(proyecto);
}

export async function actualizarProyecto(id: number, input: Partial<ProyectoInput>) {
  const proyecto = await prisma.proyecto.update({
    where: { id },
    data: {
      titulo: input.titulo,
      slug: input.slug,
      descripcion: input.descripcion,
      ubicacion: input.ubicacion,
      fecha: input.fecha === undefined ? undefined : input.fecha ? new Date(input.fecha) : null,
      destacado: input.destacado,
      orden: input.orden,
      estado: input.estado,
    },
  });
  return serialize(proyecto);
}

export async function cambiarEstadoProyecto(id: number, estado: boolean) {
  const proyecto = await prisma.proyecto.update({ where: { id }, data: { estado } });
  return serialize(proyecto);
}

export async function agregarImagenProyecto(
  proyectoId: number,
  input: { url: string; textoAlternativo?: string | null; esPrincipal?: boolean; orden?: number },
) {
  const imagen = await prisma.imagenProyecto.create({
    data: {
      proyectoId,
      url: input.url,
      textoAlternativo: input.textoAlternativo ?? null,
      esPrincipal: input.esPrincipal ?? false,
      orden: input.orden ?? 0,
    },
  });
  return serialize(imagen);
}

export async function eliminarImagenProyecto(id: number) {
  await prisma.imagenProyecto.delete({ where: { id } });
}
