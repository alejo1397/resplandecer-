import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth/session";
import { LogoutButton } from "./logout-button";

export const metadata = {
  title: "Panel | Resplandecer",
};

const navItems = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/hero", label: "Hero (inicio)" },
  { href: "/admin/banners", label: "Banners (inicio)" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/catalogo", label: "Catálogo" },
  { href: "/admin/colecciones", label: "Colecciones" },
  { href: "/admin/proyectos", label: "Proyectos" },
  { href: "/admin/servicios", label: "Servicios" },
  { href: "/admin/marquee", label: "Marquee" },
  { href: "/admin/disena", label: "Diseña tu espacio" },
  { href: "/admin/faqs", label: "Preguntas frecuentes" },
  { href: "/admin/metricas", label: "Métricas" },
  { href: "/admin/paginas", label: "Páginas de contenido" },
  { href: "/admin/testimonios", label: "Testimonios" },
  { href: "/admin/redes", label: "Redes sociales" },
  { href: "/admin/configuracion", label: "Configuración" },
  { href: "/admin/clientes", label: "Clientes" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Sin sesion (ej. pagina de login): renderizar el contenido sin el chrome del
  // panel. La proteccion real la hace el middleware + requireAdmin.
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <aside className="flex w-60 flex-col border-r border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <Image
            src="/logo_r_black.png"
            alt="Logo de Resplandecer"
            width={140}
            height={44}
            priority
            style={{ height: "32px", width: "auto" }}
          />
          <p className="mt-2 text-xs text-gray-500">Panel de administración</p>
        </div>
        <nav className="flex-1 px-2 py-3">
          <ul className="flex flex-col gap-0.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
          <span className="text-sm text-gray-500">{session.email}</span>
          <LogoutButton />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
