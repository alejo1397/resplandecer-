/**
 * Siembra de CONTENIDO DE EJEMPLO para ver el sitio poblado.
 * Idempotente donde es posible. Usa los archivos ya copiados a /public.
 *
 * Uso: npx tsx prisma/seed-demo-contenido.ts
 */
import { PrismaClient, TipoParametro } from "@prisma/client";

const prisma = new PrismaClient();

async function param(clave: string, valor: string, tipo: TipoParametro = TipoParametro.texto) {
  await prisma.configuracionSitio.upsert({
    where: { clave },
    update: { valor },
    create: { clave, valor, tipo, estado: true },
  });
}

async function main() {
  // 1. HERO con video de ejemplo
  await param("hero_media_url", "/demo_resplandecer.mp4");
  await param("hero_media_tipo", "video");
  await param("hero_poster_url", "/hero-poster.png", TipoParametro.imagen);
  console.log("✓ Hero (video)");

  // 2. Imágenes de portada de categorías (colecciones)
  const imgs: Record<string, string> = {
    salas: "/col-salas.jpg",
    comedores: "/col-comedores.jpg",
    cocina: "/col-cocina.jpg",
    dormitorio: "/col-dormitorio.jpg",
    almacenamiento: "/col-almacenamiento.jpg",
  };
  for (const [slug, imagenUrl] of Object.entries(imgs)) {
    await prisma.categoria.updateMany({ where: { slug }, data: { imagenUrl } });
  }
  console.log("✓ Imágenes de colecciones");

  // 3. Banners Mobiliario y Colecciones (limpia e inserta)
  await prisma.homeBanner.deleteMany({});
  await prisma.homeBanner.createMany({
    data: [
      { seccion: "mobiliario", etiqueta: "Comedor Zafiro - Comedores", imagenUrl: "/col-comedores.jpg", enlaceUrl: "/colecciones/comedores", orden: 1 },
      { seccion: "mobiliario", etiqueta: "Sofá Aurora - Salas", imagenUrl: "/col-salas.jpg", enlaceUrl: "/colecciones/salas", orden: 2 },
      { seccion: "mobiliario", etiqueta: "Cocina Nórdica - Cocina", imagenUrl: "/col-cocina.jpg", enlaceUrl: "/colecciones/cocina", orden: 3 },
      { seccion: "colecciones", etiqueta: "Colección Salas", imagenUrl: "/col-salas.jpg", enlaceUrl: "/colecciones/salas", orden: 1 },
      { seccion: "colecciones", etiqueta: "Colección Comedores", imagenUrl: "/col-comedores.jpg", enlaceUrl: "/colecciones/comedores", orden: 2 },
      { seccion: "colecciones", etiqueta: "Colección Dormitorio", imagenUrl: "/col-dormitorio.jpg", enlaceUrl: "/colecciones/dormitorio", orden: 3 },
    ],
  });
  console.log("✓ Banners");

  // 4. Servicios
  await prisma.servicio.deleteMany({});
  await prisma.servicio.createMany({
    data: [
      { titulo: "Carpintería a medida", descripcion: "Piezas únicas diseñadas para tu espacio.", orden: 1 },
      { titulo: "Cocinas de autor", descripcion: "Cocinas integrales con acabados premium.", orden: 2 },
      { titulo: "Remodelaciones", descripcion: "Transformamos espacios por completo.", orden: 3 },
      { titulo: "Sofás y tapicería", descripcion: "Comodidad y diseño en cada detalle.", orden: 4 },
      { titulo: "Interiorismo", descripcion: "Asesoría integral de diseño interior.", orden: 5 },
      { titulo: "Contract", descripcion: "Proyectos para empresas y hotelería.", orden: 6 },
    ],
  });
  console.log("✓ Servicios");

  // 5. Marquee
  await prisma.marqueeItem.deleteMany({});
  await prisma.marqueeItem.createMany({
    data: [
      { texto: "Diseño", orden: 1 },
      { texto: "Fabricación", orden: 2 },
      { texto: "Instalación", orden: 3 },
      { texto: "A la medida", orden: 4 },
      { texto: "Interiorismo", orden: 5 },
    ],
  });
  console.log("✓ Marquee");

  // 6. Métricas
  await prisma.metrica.deleteMany({});
  await prisma.metrica.createMany({
    data: [
      { valor: 8, sufijo: "+", etiqueta: "Años de experiencia", orden: 1 },
      { valor: 120, etiqueta: "Artesanos", orden: 2 },
      { valor: 2500, sufijo: "+", etiqueta: "Piezas al año", orden: 3 },
      { valor: 98, sufijo: "%", etiqueta: "Entregas a tiempo", orden: 4 },
    ],
  });
  console.log("✓ Métricas");

  // 7. FAQ
  await prisma.faq.deleteMany({});
  await prisma.faq.createMany({
    data: [
      { pregunta: "¿Hacen muebles a la medida?", respuesta: "Sí. Diseñamos y fabricamos cada pieza según tu espacio, estilo y necesidades.", orden: 1 },
      { pregunta: "¿Cuánto tarda un pedido a la medida?", respuesta: "Depende del proyecto. Al cotizar te damos un plazo estimado de fabricación y entrega.", orden: 2 },
      { pregunta: "¿Tienen garantía?", respuesta: "Sí, nuestros muebles cuentan con garantía. Te informamos las condiciones al momento de la compra.", orden: 3 },
      { pregunta: "¿Hacen envíos e instalación?", respuesta: "Sí, realizamos entrega e instalación. Escríbenos para confirmar cobertura.", orden: 4 },
    ],
  });
  console.log("✓ FAQ");

  // 8. Pasos "Diseña tu espacio"
  await prisma.pasoDiseno.deleteMany({});
  await prisma.pasoDiseno.createMany({
    data: [
      { titulo: "Cuéntanos tu idea", descripcion: "Agenda una asesoría y comparte tus referencias, medidas y estilo.", imagenUrl: "/col-salas.jpg", orden: 1 },
      { titulo: "Diseñamos la propuesta", descripcion: "Creamos el diseño a medida con materiales, acabados y presupuesto.", imagenUrl: "/col-cocina.jpg", orden: 2 },
      { titulo: "Fabricamos e instalamos", descripcion: "Producimos tu mobiliario y lo instalamos en tu espacio.", imagenUrl: "/col-comedores.jpg", orden: 3 },
    ],
  });
  console.log("✓ Pasos Diseña tu espacio");

  // 9. Galería de una colección (Salas) para el detalle
  const salas = await prisma.categoria.findUnique({ where: { slug: "salas" } });
  if (salas) {
    await prisma.imagenCategoria.deleteMany({ where: { categoriaId: salas.id } });
    await prisma.imagenCategoria.createMany({
      data: [
        { categoriaId: salas.id, url: "/col-salas.jpg", orden: 1 },
        { categoriaId: salas.id, url: "/col-dormitorio.jpg", orden: 2 },
        { categoriaId: salas.id, url: "/col-comedores.jpg", orden: 3 },
      ],
    });
    await prisma.categoria.update({
      where: { id: salas.id },
      data: {
        descripcion: "Salas contemporáneas, cómodas y hechas a la medida de tu espacio.",
        whatsappTexto: "Pregunta por la colección",
      },
    });
  }
  console.log("✓ Galería de colección (Salas)");

  // 10. Páginas de contenido con bloques
  const terminos = await prisma.paginaContenido.upsert({
    where: { slug: "terminos-y-condiciones" },
    update: {},
    create: { slug: "terminos-y-condiciones", titulo: "Términos y condiciones" },
  });
  await prisma.bloqueContenido.deleteMany({ where: { paginaId: terminos.id } });
  await prisma.bloqueContenido.createMany({
    data: [
      { paginaId: terminos.id, subtitulo: "Uso del sitio", contenido: "Al usar este sitio aceptas los presentes términos y condiciones.", orden: 1 },
      { paginaId: terminos.id, subtitulo: "Cotizaciones", contenido: "Las cotizaciones tienen una vigencia y pueden variar según materiales y tiempos.", orden: 2 },
    ],
  });

  const historia = await prisma.paginaContenido.upsert({
    where: { slug: "nuestra-historia" },
    update: {},
    create: { slug: "nuestra-historia", titulo: "Nuestra historia", subtitulo: "Del bosque al salón, con oficio y detalle." },
  });
  await prisma.bloqueContenido.deleteMany({ where: { paginaId: historia.id } });
  await prisma.bloqueContenido.createMany({
    data: [
      { paginaId: historia.id, subtitulo: "Cómo empezamos", contenido: "Resplandecer nació de la pasión por la madera y el diseño a la medida.", imagenUrl: "/col-comedores.jpg", orden: 1 },
      { paginaId: historia.id, subtitulo: "Nuestro oficio", contenido: "Cada pieza pasa por manos artesanas que cuidan el detalle y la durabilidad.", imagenUrl: "/col-cocina.jpg", orden: 2 },
    ],
  });
  console.log("✓ Páginas de contenido");

  console.log("\nContenido de ejemplo sembrado correctamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
