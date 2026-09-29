import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serializers";

/**
 * CRUD administrativo de las secciones del home: FAQ, servicios y métricas.
 * A diferencia de las queries públicas, aquí se listan TODAS (activas e
 * inactivas), porque el admin necesita gestionarlas.
 */

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

export type FaqInput = {
  pregunta: string;
  respuesta: string;
  orden?: number;
  estado?: boolean;
};

export async function listarFaqs() {
  const faqs = await prisma.faq.findMany({ orderBy: { orden: "asc" } });
  return serialize(faqs);
}

export async function obtenerFaq(id: number) {
  const faq = await prisma.faq.findUnique({ where: { id } });
  return faq ? serialize(faq) : null;
}

export async function crearFaq(input: FaqInput) {
  const faq = await prisma.faq.create({
    data: {
      pregunta: input.pregunta,
      respuesta: input.respuesta,
      orden: input.orden ?? 0,
      estado: input.estado ?? true,
    },
  });
  return serialize(faq);
}

export async function actualizarFaq(id: number, input: Partial<FaqInput>) {
  const faq = await prisma.faq.update({
    where: { id },
    data: {
      pregunta: input.pregunta,
      respuesta: input.respuesta,
      orden: input.orden,
      estado: input.estado,
    },
  });
  return serialize(faq);
}

export async function cambiarEstadoFaq(id: number, estado: boolean) {
  const faq = await prisma.faq.update({ where: { id }, data: { estado } });
  return serialize(faq);
}

export async function eliminarFaq(id: number) {
  await prisma.faq.delete({ where: { id } });
}

// ---------------------------------------------------------------------------
// Servicios
// ---------------------------------------------------------------------------

export type ServicioInput = {
  titulo: string;
  descripcion?: string | null;
  imagenUrl?: string | null;
  orden?: number;
  estado?: boolean;
};

export async function listarServicios() {
  const servicios = await prisma.servicio.findMany({ orderBy: { orden: "asc" } });
  return serialize(servicios);
}

export async function obtenerServicio(id: number) {
  const servicio = await prisma.servicio.findUnique({ where: { id } });
  return servicio ? serialize(servicio) : null;
}

export async function crearServicio(input: ServicioInput) {
  const servicio = await prisma.servicio.create({
    data: {
      titulo: input.titulo,
      descripcion: input.descripcion ?? null,
      imagenUrl: input.imagenUrl ?? null,
      orden: input.orden ?? 0,
      estado: input.estado ?? true,
    },
  });
  return serialize(servicio);
}

export async function actualizarServicio(id: number, input: Partial<ServicioInput>) {
  const servicio = await prisma.servicio.update({
    where: { id },
    data: {
      titulo: input.titulo,
      descripcion: input.descripcion,
      imagenUrl: input.imagenUrl,
      orden: input.orden,
      estado: input.estado,
    },
  });
  return serialize(servicio);
}

export async function cambiarEstadoServicio(id: number, estado: boolean) {
  const servicio = await prisma.servicio.update({ where: { id }, data: { estado } });
  return serialize(servicio);
}

export async function eliminarServicio(id: number) {
  await prisma.servicio.delete({ where: { id } });
}

// ---------------------------------------------------------------------------
// Métricas
// ---------------------------------------------------------------------------

export type MetricaInput = {
  valor: number;
  prefijo?: string | null;
  sufijo?: string | null;
  etiqueta: string;
  orden?: number;
  estado?: boolean;
};

export async function listarMetricas() {
  const metricas = await prisma.metrica.findMany({ orderBy: { orden: "asc" } });
  return serialize(metricas);
}

export async function obtenerMetrica(id: number) {
  const metrica = await prisma.metrica.findUnique({ where: { id } });
  return metrica ? serialize(metrica) : null;
}

export async function crearMetrica(input: MetricaInput) {
  const metrica = await prisma.metrica.create({
    data: {
      valor: input.valor,
      prefijo: input.prefijo ?? null,
      sufijo: input.sufijo ?? null,
      etiqueta: input.etiqueta,
      orden: input.orden ?? 0,
      estado: input.estado ?? true,
    },
  });
  return serialize(metrica);
}

export async function actualizarMetrica(id: number, input: Partial<MetricaInput>) {
  const metrica = await prisma.metrica.update({
    where: { id },
    data: {
      valor: input.valor,
      prefijo: input.prefijo,
      sufijo: input.sufijo,
      etiqueta: input.etiqueta,
      orden: input.orden,
      estado: input.estado,
    },
  });
  return serialize(metrica);
}

export async function cambiarEstadoMetrica(id: number, estado: boolean) {
  const metrica = await prisma.metrica.update({ where: { id }, data: { estado } });
  return serialize(metrica);
}

export async function eliminarMetrica(id: number) {
  await prisma.metrica.delete({ where: { id } });
}

// ---------------------------------------------------------------------------
// Pasos de "Diseña tu espacio"
// ---------------------------------------------------------------------------

export type PasoDisenoInput = {
  titulo: string;
  descripcion?: string | null;
  imagenUrl?: string | null;
  orden?: number;
  estado?: boolean;
};

export async function listarPasosDiseno() {
  const pasos = await prisma.pasoDiseno.findMany({ orderBy: { orden: "asc" } });
  return serialize(pasos);
}

export async function obtenerPasoDiseno(id: number) {
  const paso = await prisma.pasoDiseno.findUnique({ where: { id } });
  return paso ? serialize(paso) : null;
}

export async function crearPasoDiseno(input: PasoDisenoInput) {
  const paso = await prisma.pasoDiseno.create({
    data: {
      titulo: input.titulo,
      descripcion: input.descripcion ?? null,
      imagenUrl: input.imagenUrl ?? null,
      orden: input.orden ?? 0,
      estado: input.estado ?? true,
    },
  });
  return serialize(paso);
}

export async function actualizarPasoDiseno(id: number, input: Partial<PasoDisenoInput>) {
  const paso = await prisma.pasoDiseno.update({
    where: { id },
    data: {
      titulo: input.titulo,
      descripcion: input.descripcion,
      imagenUrl: input.imagenUrl,
      orden: input.orden,
      estado: input.estado,
    },
  });
  return serialize(paso);
}

export async function cambiarEstadoPasoDiseno(id: number, estado: boolean) {
  const paso = await prisma.pasoDiseno.update({ where: { id }, data: { estado } });
  return serialize(paso);
}

export async function eliminarPasoDiseno(id: number) {
  await prisma.pasoDiseno.delete({ where: { id } });
}

// ---------------------------------------------------------------------------
// Marquee
// ---------------------------------------------------------------------------

export type MarqueeItemInput = {
  texto: string;
  orden?: number;
  estado?: boolean;
};

export async function listarMarqueeItems() {
  const items = await prisma.marqueeItem.findMany({ orderBy: { orden: "asc" } });
  return serialize(items);
}

export async function obtenerMarqueeItem(id: number) {
  const item = await prisma.marqueeItem.findUnique({ where: { id } });
  return item ? serialize(item) : null;
}

export async function crearMarqueeItem(input: MarqueeItemInput) {
  const item = await prisma.marqueeItem.create({
    data: {
      texto: input.texto,
      orden: input.orden ?? 0,
      estado: input.estado ?? true,
    },
  });
  return serialize(item);
}

export async function actualizarMarqueeItem(id: number, input: Partial<MarqueeItemInput>) {
  const item = await prisma.marqueeItem.update({
    where: { id },
    data: {
      texto: input.texto,
      orden: input.orden,
      estado: input.estado,
    },
  });
  return serialize(item);
}

export async function cambiarEstadoMarqueeItem(id: number, estado: boolean) {
  const item = await prisma.marqueeItem.update({ where: { id }, data: { estado } });
  return serialize(item);
}

export async function eliminarMarqueeItem(id: number) {
  await prisma.marqueeItem.delete({ where: { id } });
}

// ---------------------------------------------------------------------------
// Banners del home (Mobiliario / Colecciones)
// ---------------------------------------------------------------------------

export type HomeBannerInput = {
  seccion: string;
  titulo?: string | null;
  subtitulo?: string | null;
  etiqueta?: string | null;
  imagenUrl: string;
  enlaceUrl?: string | null;
  orden?: number;
  estado?: boolean;
};

export async function listarHomeBanners() {
  const banners = await prisma.homeBanner.findMany({
    orderBy: [{ seccion: "asc" }, { orden: "asc" }],
  });
  return serialize(banners);
}

export async function obtenerHomeBanner(id: number) {
  const banner = await prisma.homeBanner.findUnique({ where: { id } });
  return banner ? serialize(banner) : null;
}

export async function crearHomeBanner(input: HomeBannerInput) {
  const banner = await prisma.homeBanner.create({
    data: {
      seccion: input.seccion,
      titulo: input.titulo ?? null,
      subtitulo: input.subtitulo ?? null,
      etiqueta: input.etiqueta ?? null,
      imagenUrl: input.imagenUrl,
      enlaceUrl: input.enlaceUrl ?? null,
      orden: input.orden ?? 0,
      estado: input.estado ?? true,
    },
  });
  return serialize(banner);
}

export async function actualizarHomeBanner(id: number, input: Partial<HomeBannerInput>) {
  const banner = await prisma.homeBanner.update({
    where: { id },
    data: {
      seccion: input.seccion,
      titulo: input.titulo,
      subtitulo: input.subtitulo,
      etiqueta: input.etiqueta,
      imagenUrl: input.imagenUrl,
      enlaceUrl: input.enlaceUrl,
      orden: input.orden,
      estado: input.estado,
    },
  });
  return serialize(banner);
}

export async function cambiarEstadoHomeBanner(id: number, estado: boolean) {
  const banner = await prisma.homeBanner.update({ where: { id }, data: { estado } });
  return serialize(banner);
}

export async function eliminarHomeBanner(id: number) {
  await prisma.homeBanner.delete({ where: { id } });
}
