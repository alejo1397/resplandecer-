import { getPaginaPorSlug } from "@/lib/queries";

export const metadata = { title: "Términos y condiciones | Resplandecer" };

export default async function TerminosPage() {
  const pagina = await getPaginaPorSlug("terminos-y-condiciones");

  const titulo = pagina?.titulo || "Términos y condiciones";
  const bloques = pagina?.bloques ?? [];

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="display text-[clamp(2rem,5vw,3.5rem)] text-ink">{titulo}</h1>
      {pagina?.subtitulo ? (
        <p className="mt-3 text-base text-ink/60">{pagina.subtitulo}</p>
      ) : null}

      {bloques.length === 0 ? (
        <p className="mt-10 text-sm leading-relaxed text-ink/60">
          El contenido de esta página se está preparando. Vuelve pronto o escríbenos si
          necesitas información sobre nuestros términos y condiciones.
        </p>
      ) : (
        <div className="mt-10 flex flex-col gap-8">
          {bloques.map((b) => (
            <section key={b.id}>
              {b.subtitulo ? (
                <h2 className="text-lg font-semibold text-ink">{b.subtitulo}</h2>
              ) : null}
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink/70">
                {b.contenido}
              </p>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
