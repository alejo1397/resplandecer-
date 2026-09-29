import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serializers";

/**
 * Consulta PUBLICA de páginas de contenido (términos y condiciones, nuestra
 * historia, etc.). Devuelve la página activa con sus bloques activos ordenados.
 */
export async function getPaginaPorSlug(slug: string) {
  const pagina = await prisma.paginaContenido.findFirst({
    where: { slug, estado: true },
    include: {
      bloques: {
        where: { estado: true },
        orderBy: { orden: "asc" },
      },
    },
  });
  return pagina ? serialize(pagina) : null;
}
