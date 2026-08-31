import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serializers";
import type { TipoParametro } from "@prisma/client";

/**
 * CRUD administrativo de testimonios (+imagenes), redes sociales y
 * configuracion del sitio (panel admin).
 */

// ---------------------------------------------------------------------------
// Testimonios
// ---------------------------------------------------------------------------

export type TestimonioInput = {
  nombreCliente: string;
  cargoOCiudad?: string | null;
  mensaje: string;
  calificacion?: number | null;
  imagenId?: number | null;
  orden?: number;
  estado?: boolean;
};

export async function listarTestimonios() {
  const testimonios = await prisma.testimonio.findMany({
    orderBy: { orden: "asc" },
    include: { imagen: true },
  });
  return serialize(testimonios);
}

export async function crearTestimonio(input: TestimonioInput) {
  const testimonio = await prisma.testimonio.create({
    data: {
      nombreCliente: input.nombreCliente,
      cargoOCiudad: input.cargoOCiudad ?? null,
      mensaje: input.mensaje,
      calificacion: input.calificacion ?? null,
      imagenId: input.imagenId ?? null,
      orden: input.orden ?? 0,
      estado: input.estado ?? true,
    },
  });
  return serialize(testimonio);
}

export async function actualizarTestimonio(id: number, input: Partial<TestimonioInput>) {
  const testimonio = await prisma.testimonio.update({
    where: { id },
    data: {
      nombreCliente: input.nombreCliente,
      cargoOCiudad: input.cargoOCiudad,
      mensaje: input.mensaje,
      calificacion: input.calificacion,
      imagenId: input.imagenId,
      orden: input.orden,
      estado: input.estado,
    },
  });
  return serialize(testimonio);
}

export async function cambiarEstadoTestimonio(id: number, estado: boolean) {
  const testimonio = await prisma.testimonio.update({
    where: { id },
    data: { estado },
  });
  return serialize(testimonio);
}

/** Crea una imagen de testimonio (para asociarla luego a un testimonio). */
export async function crearImagenTestimonio(url: string, textoAlternativo?: string | null) {
  const imagen = await prisma.imagenTestimonio.create({
    data: { url, textoAlternativo: textoAlternativo ?? null },
  });
  return serialize(imagen);
}

// ---------------------------------------------------------------------------
// Redes sociales
// ---------------------------------------------------------------------------

export type RedSocialInput = {
  nombre: string;
  url: string;
  icono?: string | null;
  orden?: number;
  estado?: boolean;
};

export async function listarRedesSociales() {
  const redes = await prisma.redSocial.findMany({ orderBy: { orden: "asc" } });
  return serialize(redes);
}

export async function crearRedSocial(input: RedSocialInput) {
  const red = await prisma.redSocial.create({
    data: {
      nombre: input.nombre,
      url: input.url,
      icono: input.icono ?? null,
      orden: input.orden ?? 0,
      estado: input.estado ?? true,
    },
  });
  return serialize(red);
}

export async function actualizarRedSocial(id: number, input: Partial<RedSocialInput>) {
  const red = await prisma.redSocial.update({
    where: { id },
    data: {
      nombre: input.nombre,
      url: input.url,
      icono: input.icono,
      orden: input.orden,
      estado: input.estado,
    },
  });
  return serialize(red);
}

export async function cambiarEstadoRedSocial(id: number, estado: boolean) {
  const red = await prisma.redSocial.update({ where: { id }, data: { estado } });
  return serialize(red);
}

// ---------------------------------------------------------------------------
// Configuracion del sitio
// ---------------------------------------------------------------------------

export type ConfiguracionInput = {
  clave: string;
  valor?: string | null;
  tipo?: TipoParametro;
  descripcion?: string | null;
  estado?: boolean;
};

export async function listarConfiguracion() {
  const config = await prisma.configuracionSitio.findMany({
    orderBy: { clave: "asc" },
  });
  return serialize(config);
}

/** Crea o actualiza un parametro por su clave (upsert). */
export async function guardarParametro(input: ConfiguracionInput) {
  const parametro = await prisma.configuracionSitio.upsert({
    where: { clave: input.clave },
    update: {
      valor: input.valor ?? null,
      tipo: input.tipo,
      descripcion: input.descripcion,
      estado: input.estado,
    },
    create: {
      clave: input.clave,
      valor: input.valor ?? null,
      tipo: input.tipo ?? "texto",
      descripcion: input.descripcion ?? null,
      estado: input.estado ?? true,
    },
  });
  return serialize(parametro);
}
