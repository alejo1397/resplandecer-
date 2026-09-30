import Link from "next/link";
import { notFound } from "next/navigation";
import { getColeccionPorSlug } from "@/lib/queries";
import { getConfiguracionSitioCached } from "@/lib/cache";
import { GaleriaColeccion } from "./galeria";

export default async function ColeccionDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [coleccion, config] = await Promise.all([
    getColeccionPorSlug(slug),
    getConfiguracionSitioCached(),
  ]);
  if (!coleccion) notFound();

  const whatsapp = config["whatsapp_numero"];
  const botonTexto = coleccion.whatsappTexto || "Pregunta por la colección";
  const mensaje = encodeURIComponent(
    coleccion.whatsappMensaje || `Hola, quiero información sobre la colección ${coleccion.titulo}.`,
  );
  const whatsappHref = whatsapp ? `https://wa.me/${whatsapp}?text=${mensaje}` : null;

  // Galería: imágenes de la colección; si no hay, cae a la portada.
  const galeria =
    coleccion.imagenes.length > 0
      ? coleccion.imagenes.map((img) => ({ url: img.url, textoAlternativo: img.textoAlternativo }))
      : coleccion.imagenUrl
        ? [{ url: coleccion.imagenUrl, textoAlternativo: coleccion.imagenAlt ?? coleccion.titulo }]
        : [];

  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <Link href="/colecciones" className="label-mono text-ink/50 hover:text-ink">
        ← Colecciones
      </Link>

      <div className="mt-6 grid items-start gap-10 lg:grid-cols-2">
        {/* Galería a la izquierda */}
        <GaleriaColeccion imagenes={galeria} titulo={coleccion.titulo} />

        {/* Texto a la derecha */}
        <div className="lg:pt-4">
          <h1 className="display text-[clamp(2.2rem,6vw,4rem)] text-ink">{coleccion.titulo}</h1>
          {coleccion.resumen ? (
            <p className="mt-3 text-lg text-ink/70">{coleccion.resumen}</p>
          ) : null}
          {coleccion.descripcion ? (
            <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-ink/70">
              {coleccion.descripcion}
            </p>
          ) : null}

          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="pill pill-dark mt-8 inline-flex text-ink"
            >
              <span className="pill-text">{botonTexto}</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
