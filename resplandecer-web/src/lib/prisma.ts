import { PrismaClient } from "@prisma/client";

/**
 * Cliente de Prisma en patron singleton.
 *
 * En entornos serverless (Vercel) y en desarrollo con hot-reload, crear un
 * PrismaClient nuevo en cada invocacion agota rapidamente las conexiones a la
 * base de datos. Reutilizamos una unica instancia guardada en el objeto global.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
