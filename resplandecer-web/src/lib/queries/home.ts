import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serializers";

/**
 * Consultas PUBLICAS de las secciones administrables del home:
 * FAQ, servicios ("Qué hacemos") y métricas (estadísticas).
 * Todas filtran por estado = true y respetan el campo "orden".
 */

/** Lista las preguntas frecuentes activas, ordenadas. */
export async function getFaqsActivas() {
  const faqs = await prisma.faq.findMany({
    where: { estado: true },
    orderBy: { orden: "asc" },
  });
  return serialize(faqs);
}

/** Lista los servicios activos, ordenados. */
export async function getServiciosActivos() {
  const servicios = await prisma.servicio.findMany({
    where: { estado: true },
    orderBy: { orden: "asc" },
  });
  return serialize(servicios);
}

/** Lista las métricas activas, ordenadas. */
export async function getMetricasActivas() {
  const metricas = await prisma.metrica.findMany({
    where: { estado: true },
    orderBy: { orden: "asc" },
  });
  return serialize(metricas);
}

/** Lista los pasos activos de "Diseña tu espacio", ordenados. */
export async function getPasosDisenoActivos() {
  const pasos = await prisma.pasoDiseno.findMany({
    where: { estado: true },
    orderBy: { orden: "asc" },
  });
  return serialize(pasos);
}

/** Lista los textos activos del marquee, ordenados. */
export async function getMarqueeItemsActivos() {
  const items = await prisma.marqueeItem.findMany({
    where: { estado: true },
    orderBy: { orden: "asc" },
  });
  return serialize(items);
}

/** Lista los banners activos de una sección del home ("mobiliario"|"colecciones"). */
export async function getHomeBannersActivos(seccion: string) {
  const banners = await prisma.homeBanner.findMany({
    where: { estado: true, seccion },
    orderBy: { orden: "asc" },
  });
  return serialize(banners);
}
