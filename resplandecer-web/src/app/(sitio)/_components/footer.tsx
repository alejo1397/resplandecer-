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
    <footer className="mt-20 border-t border-gray-200 bg-gray-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="text-base font-semibold text-gray-900">{nombreSitio}</p>
          <p className="mt-2 text-sm text-gray-500">
            Diseno y produccion de mobiliario.
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-900">Contacto</p>
          <ul className="mt-2 space-y-1 text-sm text-gray-500">
            {email ? <li>{email}</li> : null}
            {telefono ? <li>{telefono}</li> : null}
          </ul>
        </div>

        {redes.length > 0 ? (
          <div>
            <p className="text-sm font-medium text-gray-900">Siguenos</p>
            <ul className="mt-2 space-y-1 text-sm text-gray-500">
              {redes.map((r) => (
                <li key={r.id}>
                  <a href={r.url} target="_blank" rel="noreferrer" className="transition hover:text-gray-900">
                    {r.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} {nombreSitio}. Todos los derechos reservados.
        </p>
        <p className="mt-1">
          <Link href="/admin" className="hover:text-gray-600">
            Administracion
          </Link>
        </p>
      </div>
    </footer>
  );
}
