import Link from "next/link";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/mobiliario", label: "Mobiliario" },
  { href: "/colecciones", label: "Colecciones" },
  { href: "/disena-tu-espacio", label: "Disena tu espacio" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/contacto", label: "Contacto" },
];

export function Header({ nombreSitio }: { nombreSitio: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-gray-900">
          {nombreSitio}
        </Link>
        <nav>
          <ul className="flex flex-wrap items-center gap-5 text-sm text-gray-600">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-gray-900">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
