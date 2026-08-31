import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Ingresar | Panel Resplandecer",
};

export default async function LoginPage() {
  // Si ya hay sesion, ir directo al panel.
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-gray-900">Resplandecer</h1>
          <p className="mt-1 text-sm text-gray-500">Panel de administracion</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
