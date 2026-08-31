import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  await requireAdmin();

  const [categorias, productos, testimonios, redes, clientes] = await Promise.all([
    prisma.categoria.count(),
    prisma.catalogo.count(),
    prisma.testimonio.count(),
    prisma.redSocial.count(),
    prisma.cliente.count(),
  ]);

  const tarjetas = [
    { label: "Categorias", valor: categorias, href: "/admin/categorias" },
    { label: "Productos", valor: productos, href: "/admin/catalogo" },
    { label: "Testimonios", valor: testimonios, href: "/admin/testimonios" },
    { label: "Redes sociales", valor: redes, href: "/admin/redes" },
    { label: "Clientes", valor: clientes, href: "/admin/clientes" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Inicio</h1>
      <p className="mt-1 text-sm text-gray-500">
        Resumen del contenido de tu sitio.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {tarjetas.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-400"
          >
            <p className="text-3xl font-semibold">{t.valor}</p>
            <p className="mt-1 text-sm text-gray-500">{t.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
