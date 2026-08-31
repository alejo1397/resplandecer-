import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serializers";

/**
 * Consultas PUBLICAS de proyectos (galeria de trabajos). Filtran estado = true.
 */

export async function getProyectosActivos() {
  const proyectos = await prisma.proyecto.findMany({
    where: { estado: true },
    orderBy: { orden: "asc" },
    include: {
      imagenes: {
        where: { estado: true },
        orderBy: [{ esPrincipal: "desc" }, { orden: "asc" }],
      },
    },
  });
  return serialize(proyectos);
}

export async function getProyectosDestacados() {
  const proyectos = await prisma.proyecto.findMany({
    where: { estado: true, destacado: true },
    orderBy: { orden: "asc" },
    include: {
      imagenes: {
        where: { estado: true },
        orderBy: [{ esPrincipal: "desc" }, { orden: "asc" }],
      },
    },
  });
  return serialize(proyectos);
}

export async function getProyectoPorSlug(slug: string) {
  const proyecto = await prisma.proyecto.findFirst({
    where: { slug, estado: true },
    include: {
      imagenes: {
        where: { estado: true },
        orderBy: [{ esPrincipal: "desc" }, { orden: "asc" }],
      },
    },
  });
  return proyecto ? serialize(proyecto) : null;
}
