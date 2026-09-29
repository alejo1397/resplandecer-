import Image from "next/image";
import { getPaginaPorSlug } from "@/lib/queries";

export const metadata = { title: "Nuestra historia | Resplandecer" };

export default async function NuestraHistoriaPage() {
  const pagina = await getPaginaPorSlug("nuestra-historia");

  const titulo = pagina?.titulo || "Nuestra historia";
  const bloques = pagina?.bloques ?? [];

  return (
    <div>
      {/* Hero editorial */}
      <section className="border-b hairline-light bg-paper">
        <div className="mx-auto max-w-5xl px-5 py-20 text-center">
          <p className="label-mono text-ink/50">Nosotros</p>
          <h1 className="display mt-4 text-[clamp(2.4rem,7vw,5.5rem)] text-ink">{titulo}</h1>
          {pagina?.subtitulo ? (
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink/70">
              {pagina.subtitulo}
            </p>
          ) : null}
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-16">
        {bloques.length === 0 ? (
          <p className="text-center text-sm leading-relaxed text-ink/60">
            Estamos preparando el relato de nuestra historia. Muy pronto podrás conocer
            cómo nació Resplandecer y el proceso artesanal detrás de cada pieza.
          </p>
        ) : (
          <div className="flex flex-col gap-16">
            {bloques.map((b, i) => (
              <section
                key={b.id}
                className={`grid items-center gap-8 ${b.imagenUrl ? "md:grid-cols-2" : ""}`}
              >
                <div className={b.imagenUrl && i % 2 === 1 ? "md:order-2" : ""}>
                  {b.subtitulo ? (
                    <h2 className="display text-[clamp(1.4rem,3vw,2.2rem)] text-ink">{b.subtitulo}</h2>
                  ) : null}
                  <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-ink/70">
                    {b.contenido}
                  </p>
                </div>
                {b.imagenUrl ? (
                  <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink/5 ${i % 2 === 1 ? "md:order-1" : ""}`}>
                    <Image
                      src={b.imagenUrl}
                      alt={b.subtitulo ?? titulo}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
