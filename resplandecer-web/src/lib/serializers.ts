import { Prisma } from "@prisma/client";

/**
 * Utilidades de serializacion.
 *
 * En el esquema usamos BigInt (IDs del contenido) y Decimal (precios). Estos
 * tipos no son serializables por defecto a JSON ni se pueden pasar de un Server
 * Component a un Client Component en Next.js. Aqui los convertimos a tipos
 * "planos" (string / number) seguros para la UI.
 */

/** Convierte un BigInt de Prisma a number. Seguro para IDs dentro del rango. */
export function bigIntToNumber(value: bigint): number {
  return Number(value);
}

/** Convierte un Decimal de Prisma a number (para mostrar/operar en la UI). */
export function decimalToNumber(value: Prisma.Decimal | null): number | null {
  return value === null ? null : value.toNumber();
}

/**
 * Serializa recursivamente cualquier estructura reemplazando BigInt por number
 * y Decimal por number. Util para pasar resultados de Prisma a la UI.
 */
export function serialize<T>(value: T): SerializedDeep<T> {
  return serializeInternal(value) as SerializedDeep<T>;
}

function serializeInternal(value: unknown): unknown {
  if (value === null || value === undefined) return value;

  if (typeof value === "bigint") return Number(value);

  if (value instanceof Prisma.Decimal) return value.toNumber();

  if (value instanceof Date) return value.toISOString();

  if (Array.isArray(value)) return value.map(serializeInternal);

  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      out[key] = serializeInternal(val);
    }
    return out;
  }

  return value;
}

/** Tipo resultante de serializar: BigInt/Decimal -> number, Date -> string. */
export type SerializedDeep<T> = T extends bigint
  ? number
  : T extends Prisma.Decimal
    ? number
    : T extends Date
      ? string
      : T extends Array<infer U>
        ? Array<SerializedDeep<U>>
        : T extends object
          ? { [K in keyof T]: SerializedDeep<T[K]> }
          : T;

/** Formatea un precio en pesos colombianos (COP). */
export function formatCOP(value: number | null): string {
  if (value === null) return "";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}
