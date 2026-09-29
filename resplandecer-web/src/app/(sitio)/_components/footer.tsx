import Link from "next/link";
import { Logo } from "./logo";
import { IconoSocial } from "./icono-social";

type Red = { id: number; nombre: string; url: string; icono?: string | null };

export function Footer({
  nombreSitio,
  email,
  telefono,
  redes,
}: {
  nombreSitio: string;
  email?: string;
  telefono?: string;
  redes: Red[];
}) {
  return (
    <footer className="mt-24 bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-5 py-16">
        <Logo alto={44} oscuro />
        <span className="sr-only">{nombreSitio}</span>

        <div className="mt-12 grid gap-10 border-t hairline-dark pt-10 sm:grid-cols-3">
          <div>
            <p className="label-mono text-paper/50">Estudio</p>
            <p className="mt-3 text-sm text-paper/80">
              Diseño y producción de mobiliario a la medida.
            </p>
            <Link
              href="/terminos-y-condiciones"
              className="mt-3 inline-block text-sm text-paper/60 underline-offset-4 transition-colors hover:text-paper hover:underline"
            >
              Términos y condiciones
            </Link>
          </div>

          <div>
            <p className="label-mono text-paper/50">Contacto</p>
            <ul className="mt-3 space-y-1 text-sm text-paper/80">
              {email ? <li>{email}</li> : null}
              {telefono ? <li>{telefono}</li> : null}
            </ul>
          </div>

          {redes.length > 0 ? (
            <div>
              <p className="label-mono text-paper/50">Síguenos</p>
              <ul className="mt-4 flex flex-wrap items-center gap-4">
                {redes.map((r) => (
                  <li key={r.id}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={r.nombre}
                      title={r.nombre}
                      className="inline-flex text-paper/80 transition-colors hover:text-paper"
                    >
                      <IconoSocial nombre={r.nombre} icono={r.icono} className="h-6 w-6" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t hairline-dark py-5 text-center">
        <p className="label-mono text-paper/40">
          © {new Date().getFullYear()} {nombreSitio} — Todos los derechos reservados
        </p>
        <p className="label-mono mt-1 text-paper/40">
          Diseñado por{" "}
          <a
            href="https://page-her-labs.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-paper/60 transition-colors hover:text-paper"
          >
            HER Labs
          </a>
        </p>
        <Link
          href="/admin"
          className="label-mono mt-1 inline-block text-paper/25 hover:text-paper/50"
        >
          Administración
        </Link>
      </div>
    </footer>
  );
}
