import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Configura las categorias reales del negocio y limpia los datos de ejemplo
 * (categorias y productos de prueba). Idempotente: se puede correr varias veces.
 */

function toSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const CATEGORIAS_REALES = [
  "Comedor",
  "Sala",
  "Alcoba",
  "Escritorios",
  "Entrada",
  "TV",
  "Baby",
  "Juvenil",
];

async function main() {
  // 1) Eliminar productos de ejemplo (y sus imagenes por cascade)
  const slugsEjemplo = [
    "silla-jenga",
    "silla-jenga-tapizada",
    "silla-rummy",
    "silla-de-barra-jenga",
    "parques",
  ];
  const borrados = await prisma.catalogo.deleteMany({
    where: { slug: { in: slugsEjemplo } },
  });
  console.log(`Productos de ejemplo eliminados: ${borrados.count}`);

  // 2) Eliminar categorias de ejemplo
  const catsEjemplo = ["comedores", "sillas", "barras"];
  const catsBorradas = await prisma.categoria.deleteMany({
    where: { slug: { in: catsEjemplo } },
  });
  console.log(`Categorias de ejemplo eliminadas: ${catsBorradas.count}`);

  // 3) Crear las categorias reales (si no existen)
  let orden = 1;
  for (const nombre of CATEGORIAS_REALES) {
    const slug = toSlug(nombre);
    await prisma.categoria.upsert({
      where: { slug },
      update: { nombre, orden },
      create: { nombre, slug, orden, estado: true },
    });
    orden++;
  }
  console.log(`Categorias reales configuradas: ${CATEGORIAS_REALES.length}`);

  const total = await prisma.categoria.count();
  console.log(`Total de categorias en la BD: ${total}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
