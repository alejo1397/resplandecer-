import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serializers";

/**
 * Consultas PUBLICAS de testimonios, redes sociales y configuracion del sitio.
 * Todas filtran por estado = true.
 */

/** Lista los testimonios activos, con su imagen, ordenados. */
export async function getTestimoniosActivos() {
  const testimonios = await prisma.testimonio.findMany({
    where: { estado: true },
    orderBy: { orden: "asc" },
    include: { imagen: true },
  });
  return serialize(testimonios);
}

/** Lista las redes sociales activas, ordenadas. */
export async function getRedesSocialesActivas() {
  const redes = await prisma.redSocial.findMany({
    where: { estado: true },
    orderBy: { orden: "asc" },
  });
  return serialize(redes);
}

/**
 * Devuelve la configuracion del sitio activa como un mapa clave -> valor.
 * Practico para leer parametros en la UI: config["titulo_hero"], etc.
 */
export async function getConfiguracionSitio(): Promise<Record<string, string>> {
  const parametros = await prisma.configuracionSitio.findMany({
    where: { estado: true },
  });

  const mapa: Record<string, string> = {};
  for (const p of parametros) {
    mapa[p.clave] = p.valor ?? "";
  }
  return mapa;
}

/** Obtiene un unico parametro de configuracion por su clave (si esta activo). */
export async function getParametro(clave: string): Promise<string | null> {
  const parametro = await prisma.configuracionSitio.findFirst({
    where: { clave, estado: true },
  });
  return parametro?.valor ?? null;
}
