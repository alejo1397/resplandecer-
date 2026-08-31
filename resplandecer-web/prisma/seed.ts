import { PrismaClient, TipoParametro } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";

const prisma = new PrismaClient();

/**
 * Hashea una contrasena usando scrypt (incluido en Node, sin dependencias
 * externas). Formato almacenado: "salt:hash" en hexadecimal.
 */
function hashPassword(plain: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(plain, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  console.log("Sembrando datos de ejemplo...");

  // -------------------------------------------------------------------------
  // Usuario administrador
  // -------------------------------------------------------------------------
  await prisma.usuario.upsert({
    where: { email: "admin@resplandecer.co" },
    update: {},
    create: {
      nombre: "Administrador",
      email: "admin@resplandecer.co",
      passwordHash: hashPassword("cambiar-esta-clave"),
      rol: "administrador",
    },
  });

  // -------------------------------------------------------------------------
  // Categorias reales del negocio
  // -------------------------------------------------------------------------
  const categorias = ["Comedor", "Sala", "Alcoba", "Escritorios", "Entrada", "TV", "Baby", "Juvenil"];
  let ordenCat = 1;
  for (const nombre of categorias) {
    const slug = nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    await prisma.categoria.upsert({
      where: { slug },
      update: { nombre, orden: ordenCat },
      create: { nombre, slug, orden: ordenCat, estado: true },
    });
    ordenCat++;
  }

  // Nota: los productos se cargan desde el panel admin (no hay productos de ejemplo).

  // -------------------------------------------------------------------------
  // Testimonios (con imagen)
  // -------------------------------------------------------------------------
  const imagenTestimonio = await prisma.imagenTestimonio.create({
    data: {
      url: "https://placehold.co/200x200?text=Cliente",
      textoAlternativo: "Foto de cliente",
    },
  });

  await prisma.testimonio.create({
    data: {
      nombreCliente: "Maria Gomez",
      cargoOCiudad: "Bogota",
      mensaje: "Los muebles superaron mis expectativas. Excelente acabado.",
      calificacion: 5,
      imagenId: imagenTestimonio.id,
      orden: 1,
    },
  });

  // -------------------------------------------------------------------------
  // Redes sociales
  // -------------------------------------------------------------------------
  const redes = [
    { nombre: "Instagram", url: "https://instagram.com/resplandecer", icono: "instagram", orden: 1 },
    { nombre: "Facebook", url: "https://facebook.com/resplandecer", icono: "facebook", orden: 2 },
    { nombre: "WhatsApp", url: "https://wa.me/573000000000", icono: "whatsapp", orden: 3 },
  ];
  for (const r of redes) {
    await prisma.redSocial.create({ data: r });
  }

  // -------------------------------------------------------------------------
  // Configuracion del sitio (parametros clave-valor)
  // -------------------------------------------------------------------------
  const parametros = [
    { clave: "titulo_hero", valor: "Diseno & Produccion de Mobiliario", tipo: TipoParametro.texto, descripcion: "Titulo principal del hero" },
    { clave: "subtitulo_hero", valor: "Convertimos tus espacios en lo que suenas.", tipo: TipoParametro.texto, descripcion: "Subtitulo del hero" },
    { clave: "telefono_contacto", valor: "+57 300 000 0000", tipo: TipoParametro.texto, descripcion: "Telefono de contacto" },
    { clave: "whatsapp_numero", valor: "573000000000", tipo: TipoParametro.texto, descripcion: "Numero de WhatsApp (formato internacional sin +)" },
    { clave: "email_contacto", valor: "contacto@resplandecer.co", tipo: TipoParametro.texto, descripcion: "Correo de contacto" },
    { clave: "hero_imagen", valor: "https://placehold.co/1600x900?text=Resplandecer", tipo: TipoParametro.imagen, descripcion: "Imagen de fondo del hero" },
    // Pagina "Disena tu espacio"
    { clave: "diseno_titulo", valor: "Disena tu espacio", tipo: TipoParametro.texto, descripcion: "Titulo de la pagina de diseno personalizado" },
    { clave: "diseno_descripcion", valor: "Creamos mobiliario a la medida de tus espacios y tu estilo. Cuentanos tu idea y la hacemos realidad.", tipo: TipoParametro.texto, descripcion: "Descripcion del servicio de diseno personalizado" },
    { clave: "diseno_imagen", valor: "https://placehold.co/1200x800?text=Disena+tu+espacio", tipo: TipoParametro.imagen, descripcion: "Imagen de la pagina de diseno personalizado" },
  ];
  for (const param of parametros) {
    await prisma.configuracionSitio.upsert({
      where: { clave: param.clave },
      update: {},
      create: param,
    });
  }

  // -------------------------------------------------------------------------
  // Proyecto de ejemplo (con imagen)
  // -------------------------------------------------------------------------
  const proyecto = await prisma.proyecto.upsert({
    where: { slug: "apartamento-modelo" },
    update: {},
    create: {
      titulo: "Apartamento Modelo",
      slug: "apartamento-modelo",
      descripcion: "Amoblamiento integral de un apartamento: comedor, sala y habitaciones.",
      ubicacion: "Bogota",
      destacado: true,
      orden: 1,
    },
  });

  const yaTieneImagenProyecto = await prisma.imagenProyecto.findFirst({
    where: { proyectoId: proyecto.id },
  });
  if (!yaTieneImagenProyecto) {
    await prisma.imagenProyecto.create({
      data: {
        proyectoId: proyecto.id,
        url: "https://placehold.co/1200x800?text=Apartamento+Modelo",
        textoAlternativo: "Apartamento Modelo",
        esPrincipal: true,
        orden: 1,
      },
    });
  }

  console.log("Datos de ejemplo sembrados correctamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
