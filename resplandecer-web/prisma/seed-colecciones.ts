/**
 * Siembra de colecciones de ejemplo (entidad independiente).
 * Idempotente por slug. Usa imágenes ya presentes en /public.
 *
 * Uso: npx tsx prisma/seed-colecciones.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const COLECCIONES = [
  {
    slug: "coleccion-salas",
    titulo: "Colección Salas",
    resumen: "Salas contemporáneas hechas a la medida.",
    descripcion: "Una colección pensada para espacios de estar: comodidad, líneas limpias y materiales nobles.",
    imagenUrl: "/col-salas.jpg",
    galeria: ["/col-salas.jpg", "/col-dormitorio.jpg", "/col-comedores.jpg"],
  },
  {
    slug: "coleccion-comedores",
    titulo: "Colección Comedores",
    resumen: "Comedores para reunir a los que quieres.",
    descripcion: "Mesas y sillas diseñadas para durar, con acabados artesanales y proporciones cuidadas.",
    imagenUrl: "/col-comedores.jpg",
    galeria: ["/col-comedores.jpg", "/col-cocina.jpg"],
  },
  {
    slug: "coleccion-cocina",
    titulo: "Colección Cocina",
    resumen: "Cocinas integrales con carácter.",
    descripcion: "Cocinas a la medida que combinan funcionalidad y diseño de autor.",
    imagenUrl: "/col-cocina.jpg",
    galeria: ["/col-cocina.jpg"],
  },
];

async function main() {
  let orden = 1;
  for (const c of COLECCIONES) {
    const coleccion = await prisma.coleccion.upsert({
      where: { slug: c.slug },
      update: {
        titulo: c.titulo,
        resumen: c.resumen,
        descripcion: c.descripcion,
        imagenUrl: c.imagenUrl,
        orden,
        estado: true,
        whatsappTexto: "Pregunta por la colección",
      },
      create: {
        slug: c.slug,
        titulo: c.titulo,
        resumen: c.resumen,
        descripcion: c.descripcion,
        imagenUrl: c.imagenUrl,
        orden,
        estado: true,
        whatsappTexto: "Pregunta por la colección",
      },
    });

    // Galería (reemplaza para ser idempotente).
    await prisma.imagenColeccion.deleteMany({ where: { coleccionId: coleccion.id } });
    let io = 1;
    for (const url of c.galeria) {
      await prisma.imagenColeccion.create({
        data: { coleccionId: coleccion.id, url, orden: io, esPrincipal: io === 1 },
      });
      io++;
    }
    console.log(`✓ ${c.titulo}`);
    orden++;
  }
  console.log("Colecciones de ejemplo sembradas.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
