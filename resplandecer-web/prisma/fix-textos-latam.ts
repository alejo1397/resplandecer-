/**
 * Corrige textos ya guardados en la base (español de Latinoamérica con tildes).
 * Idempotente: se puede ejecutar varias veces sin efectos secundarios.
 *
 * Uso: npx tsx prisma/fix-textos-latam.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CONFIG: Record<string, string> = {
  titulo_hero: "Diseño & Producción de Mobiliario",
  subtitulo_hero: "Convertimos tus espacios en lo que sueñas.",
  diseno_titulo: "Diseña tu espacio",
  diseno_descripcion:
    "Creamos mobiliario a la medida de tus espacios y tu estilo. Cuéntanos tu idea y la hacemos realidad.",
};

async function main() {
  for (const [clave, valor] of Object.entries(CONFIG)) {
    const existe = await prisma.configuracionSitio.findUnique({ where: { clave } });
    if (existe) {
      await prisma.configuracionSitio.update({ where: { clave }, data: { valor } });
      console.log(`✓ config ${clave}`);
    }
  }

  // Testimonio de ejemplo: María Gómez — Bogotá.
  await prisma.testimonio.updateMany({
    where: { nombreCliente: "Maria Gomez" },
    data: { nombreCliente: "María Gómez", cargoOCiudad: "Bogotá" },
  });
  console.log("✓ testimonio de ejemplo");

  console.log("Textos corregidos.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
