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
    <header className="sticky top-0 z-40 border-b hairline-light bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="display text-xl leading-none text-ink"
        >
          {nombreSitio}
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-7">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="label-mono text-ink/70 transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link href="/contacto" className="pill pill-dark text-ink md:hidden">
          <span className="pill-text">Menu</span>
        </Link>
      </div>
    </header>
  );
}
