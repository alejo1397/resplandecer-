import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

/**
 * Manejo de la sesion del administrador mediante una cookie firmada (JWT).
 */

const COOKIE_NAME = "resplandecer_session";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 horas

export type SessionPayload = {
  userId: string;
  email: string;
  rol: string;
};

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET no esta definido o es demasiado corto (minimo 32 caracteres). Revisa el .env.",
    );
  }
  return new TextEncoder().encode(secret);
}

/** Firma un token de sesion con los datos del usuario. */
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

/** Verifica un token de sesion y devuelve su payload, o null si es invalido. */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return {
      userId: String(payload.userId),
      email: String(payload.email),
      rol: String(payload.rol),
    };
  } catch {
    return null;
  }
}

/** Crea la cookie de sesion (usar en server actions). */
export async function setSessionCookie(payload: SessionPayload): Promise<void> {
  const token = await createSessionToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

/** Borra la cookie de sesion (logout). */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** Lee la sesion actual desde la cookie, o null si no hay sesion valida. */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export { COOKIE_NAME };
