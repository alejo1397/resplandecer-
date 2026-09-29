/**
 * Siembra idempotente de las categorías de mobiliario iniciales.
 *
 * Categorías: Salas, Comedores, Cocina, Dormitorio, Almacenamiento.
 * Usa upsert por slug, así que se puede ejecutar varias veces sin duplicar.
 *
 * Uso: npx tsx prisma/seed-categorias-mobiliario.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIAS = [
  { nombre: "Salas", slug: "salas" },
  { nombre: "Comedores", slug: "comedores" },
  { nombre: "Cocina", slug: "cocina" },
  { nombre: "Dormitorio", slug: "dormitorio" },
  { nombre: "Almacenamiento", slug: "almacenamiento" },
];

async function main() {
  let orden = 1;
  for (const cat of CATEGORIAS) {
    await prisma.categoria.upsert({
      where: { slug: cat.slug },
      update: { nombre: cat.nombre, orden },
      create: { nombre: cat.nombre, slug: cat.slug, orden, estado: true },
    });
    console.log(`✓ ${cat.nombre} (${cat.slug})`);
    orden++;
  }
  console.log("Categorías de mobiliario sembradas.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
