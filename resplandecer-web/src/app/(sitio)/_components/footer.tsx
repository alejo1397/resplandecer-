import Link from "next/link";

type Red = { id: number; nombre: string; url: string };

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
        <p className="display text-[clamp(2rem,6vw,4.5rem)] text-paper">
          {nombreSitio}
        </p>

        <div className="mt-12 grid gap-10 border-t hairline-dark pt-10 sm:grid-cols-3">
          <div>
            <p className="label-mono text-paper/50">Estudio</p>
            <p className="mt-3 text-sm text-paper/80">
              Diseno y produccion de mobiliario a la medida.
            </p>
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
              <p className="label-mono text-paper/50">Siguenos</p>
              <ul className="mt-3 space-y-1 text-sm text-paper/80">
                {redes.map((r) => (
                  <li key={r.id}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="transition-colors hover:text-paper"
                    >
                      {r.nombre}
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
        <Link href="/admin" className="label-mono mt-1 inline-block text-paper/30 hover:text-paper/60">
          Administracion
        </Link>
      </div>
    </footer>
  );
}
