"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/mobiliario", label: "Mobiliario" },
  { href: "/colecciones", label: "Colecciones" },
  { href: "/disena-tu-espacio", label: "Disena tu espacio" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/contacto", label: "Contacto" },
];

export function Header({ nombreSitio }: { nombreSitio: string }) {
  const [abierto, setAbierto] = useState(false);
  const pathname = usePathname();

  // Cerrar el menu al cambiar de ruta.
  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  // Bloquear el scroll del fondo cuando el menu movil esta abierto.
  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b hairline-light bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="display text-xl leading-none text-ink">
            {nombreSitio}
          </Link>

          {/* Navegacion escritorio */}
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

          {/* Boton menu (solo movil) */}
          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="menu-movil"
            className="pill pill-dark text-ink md:hidden"
          >
            <span className="pill-text">{abierto ? "Cerrar" : "Menu"}</span>
          </button>
        </div>
      </header>

      {/* Overlay de menu movil: pantalla completa, opaco, por encima de todo */}
      {abierto ? (
        <div
          id="menu-movil"
          className="fixed inset-0 z-[100] flex flex-col bg-ink md:hidden"
        >
          {/* Barra superior del overlay con boton cerrar */}
          <div className="flex items-center justify-between border-b hairline-dark px-5 py-4">
            <span className="display text-xl text-paper">{nombreSitio}</span>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              className="pill pill-light text-paper"
            >
              <span className="pill-text">Cerrar</span>
            </button>
          </div>

          {/* Opciones */}
          <nav className="flex flex-1 flex-col justify-center px-6">
            <ul className="flex flex-col gap-1">
              {navItems.map((item, i) => (
                <li key={item.href} className="border-b hairline-dark py-3">
                  <Link
                    href={item.href}
                    onClick={() => setAbierto(false)}
                    className="flex items-baseline gap-4"
                  >
                    <span className="label-mono text-paper/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="display text-2xl text-paper">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </>
  );
}
