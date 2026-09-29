type Servicio = {
  titulo: string;
  descripcion?: string | null;
};

/**
 * Lista de servicios de la sección "¿Qué hacemos?".
 * Presentación limpia y responsive, sin la miniatura flotante que seguía al
 * cursor (se retiró para simplificar la sección). Es un Server Component: el
 * contenido llega desde el panel administrativo.
 */
export function Servicios({ items }: { items: Servicio[] }) {
  if (items.length === 0) return null;

  return (
    <section className="bg-paper py-20">
      <div className="mx-auto max-w-7xl px-5">
        <p className="label-mono text-ink/50">¿Qué hacemos?</p>
        <h2 className="display mt-3 text-[clamp(1.6rem,3.5vw,2.6rem)] text-ink">
          Servicios
        </h2>

        <div className="mt-10 border-t hairline-light">
          {items.map((s, i) => (
            <div
              key={i}
              className="group flex items-center justify-between gap-6 border-b hairline-light py-6 transition-colors hover:bg-ink hover:px-5 hover:text-paper"
            >
              <div className="flex items-baseline gap-5">
                <span className="label-mono text-ink/40 group-hover:text-paper/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display text-2xl text-ink group-hover:text-paper md:text-3xl">
                  {s.titulo}
                </h3>
              </div>
              {s.descripcion ? (
                <p className="hidden max-w-xs text-right text-sm text-ink/60 group-hover:text-paper/70 md:block">
                  {s.descripcion}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
