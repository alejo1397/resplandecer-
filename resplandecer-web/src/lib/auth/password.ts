import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Manejo de contrasenas con scrypt (incluido en Node, sin dependencias).
 * Formato almacenado: "salt:hash" en hexadecimal.
 * Debe coincidir con el formato usado en prisma/seed.ts.
 */

/** Genera el hash de una contrasena en texto plano. */
export function hashPassword(plain: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(plain, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verifica una contrasena contra un hash almacenado.
 * Usa comparacion en tiempo constante para evitar timing attacks.
 */
export function verifyPassword(plain: string, stored: string): boolean {
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;

  const hashBuffer = Buffer.from(hashHex, "hex");
  const testBuffer = scryptSync(plain, salt, 64);

  if (hashBuffer.length !== testBuffer.length) return false;
  return timingSafeEqual(hashBuffer, testBuffer);
}
