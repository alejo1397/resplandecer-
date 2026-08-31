"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { setSessionCookie, clearSessionCookie } from "@/lib/auth/session";

export type LoginState = {
  error?: string;
};

/**
 * Server action de login. Verifica email + contrasena contra la tabla usuarios
 * (solo administradores activos) y crea la sesion.
 */
export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Ingresa tu correo y contrasena." };
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } });

  // Mensaje generico para no revelar si el correo existe.
  const credencialesInvalidas: LoginState = { error: "Correo o contrasena incorrectos." };

  if (!usuario || !usuario.estado) return credencialesInvalidas;
  if (usuario.rol !== "administrador") return credencialesInvalidas;
  if (!verifyPassword(password, usuario.passwordHash)) return credencialesInvalidas;

  await setSessionCookie({
    userId: usuario.id,
    email: usuario.email,
    rol: usuario.rol,
  });

  redirect("/admin");
}

/** Server action de logout. Borra la sesion y vuelve al login. */
export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/admin/login");
}
