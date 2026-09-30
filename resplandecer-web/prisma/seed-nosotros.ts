/**
 * Siembra del contenido editorial de la página "Nosotros"
 * (Páginas de contenido > Nuestra historia). Idempotente.
 *
 * Mapea las 3 secciones del diseño a 3 bloques de contenido (por orden):
 *   0 -> NUESTRO ESTUDIO   1 -> CREAMOS DISEÑO   2 -> SEBASTIÁN ARISMENDY
 *
 * Uso: npx tsx prisma/seed-nosotros.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BLOQUES = [
  {
    subtitulo: "Nuestro estudio",
    contenido:
      "Somos un espacio creativo dedicado al interiorismo y a la fabricación de mobiliario, especializado en descubrir y definir el estilo personal de cada cliente para transformar sus espacios de manera funcional y estética. Nuestro propósito va más allá de diseñar espacios; buscamos crear ambientes que cuenten historias, generen experiencias y reflejen la esencia de quienes los habitan. Por ello, trabajamos para convertir las ideas, necesidades y sueños de cada persona en espacios únicos, donde el diseño se convierte en una forma de vivir y sentir.",
    imagenUrl: "/col-cocina.jpg",
    orden: 0,
  },
  {
    subtitulo: "Creamos diseño",
    contenido:
      "En Resplandecer nos mueve la pasión por el diseño, los detalles, las texturas y los materiales. Esta sensibilidad nos impulsa a crear piezas de lujo, simbólicas y estéticas. Cada pieza y cada proyecto que desarrollamos refleja la historia, los gustos y las necesidades de nuestros clientes. Por ello, cada creación es hecha por manos artesanas que se sumergen en cada detalle con compromiso y amor, transformando materiales en piezas únicas que conectan con las personas y cuentan una historia propia.",
    imagenUrl: "/serv-sofas.jpg",
    orden: 1,
  },
  {
    subtitulo: "Sebastián Arismendy",
    contenido:
      "Soy diseñador industrial, especializado en desarrollo de producto. Mi trabajo se basa en idear propuestas hasta materializarlas. Mi pasión por el diseño nació durante mi infancia. Crecí en una finca junto a mis abuelos, donde gran parte de mis juegos consistía en explorar mi entorno, encontrar objetos y materiales, y transformarlos en algo nuevo y funcional. Asimismo, cada vez que llegaba a un espacio, sentía la necesidad de reorganizarlo para generar una experiencia diferente. De esos juegos nace la pasión por crear espacios que cuenten una historia.",
    imagenUrl: "/serv-carpinteria.jpg",
    orden: 2,
  },
];

async function main() {
  const pagina = await prisma.paginaContenido.upsert({
    where: { slug: "nuestra-historia" },
    update: { titulo: "Nosotros", estado: true },
    create: { slug: "nuestra-historia", titulo: "Nosotros", estado: true },
  });

  // Reemplaza los bloques para ser idempotente.
  await prisma.bloqueContenido.deleteMany({ where: { paginaId: pagina.id } });
  for (const b of BLOQUES) {
    await prisma.bloqueContenido.create({
      data: {
        paginaId: pagina.id,
        subtitulo: b.subtitulo,
        contenido: b.contenido,
        imagenUrl: b.imagenUrl,
        orden: b.orden,
        estado: true,
      },
    });
    console.log(`✓ ${b.subtitulo}`);
  }
  console.log("Contenido de Nosotros sembrado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
