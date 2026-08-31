import "server-only";
import { redirect } from "next/navigation";
import { getSession, type SessionPayload } from "@/lib/auth/session";

/**
 * Exige una sesion de administrador. Usar al inicio de los server components
 * del panel admin. Redirige a /admin/login si no hay sesion valida.
 */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || session.rol !== "administrador") {
    redirect("/admin/login");
  }
  return session;
}
