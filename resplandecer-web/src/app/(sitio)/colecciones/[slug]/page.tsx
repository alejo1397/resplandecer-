import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoriaPorSlug, getProductosPorCategoria } from "@/lib/queries";
import { getConfiguracionSitioCached } from "@/lib/cache";
import { ProductoCard } from "../../_components/producto-card";
import { GaleriaColeccion } from "./galeria";

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [categoria, config] = await Promise.all([
    getCategoriaPorSlug(slug),
    getConfiguracionSitioCached(),
  ]);
  if (!categoria) notFound();

  const productos = await getProductosPorCategoria(slug);

  const whatsapp = config["whatsapp_numero"];
  const botonTexto = categoria.whatsappTexto || "Pregunta por la colección";
  const mensaje = encodeURIComponent(
    categoria.whatsappMensaje || `Hola, quiero información sobre la colección ${categoria.nombre}.`,
  );
  const whatsappHref = whatsapp ? `https://wa.me/${whatsapp}?text=${mensaje}` : null;

  // Galería: usa las imágenes de la colección; si no hay, cae a la portada.
  const galeria =
    categoria.imagenes.length > 0
      ? categoria.imagenes.map((img) => ({ url: img.url, textoAlternativo: img.textoAlternativo }))
      : categoria.imagenUrl
        ? [{ url: categoria.imagenUrl, textoAlternativo: categoria.nombre }]
        : [];

  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <Link href="/colecciones" className="label-mono text-ink/50 hover:text-ink">
        ← Colecciones
      </Link>

      <div className="mt-6 grid items-start gap-10 lg:grid-cols-2">
        {/* Galería a la izquierda */}
        <GaleriaColeccion imagenes={galeria} titulo={categoria.nombre} />

        {/* Texto a la derecha */}
        <div className="lg:pt-4">
          <h1 className="display text-[clamp(2.2rem,6vw,4rem)] text-ink">{categoria.nombre}</h1>
          {categoria.descripcion ? (
            <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-ink/70">
              {categoria.descripcion}
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

      {/* Productos de la colección */}
      {productos.length > 0 ? (
        <div className="mt-20">
          <h2 className="display text-[clamp(1.4rem,3vw,2rem)] text-ink">Productos de la colección</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {productos.map((p) => (
              <div key={p.id} className="reveal">
                <ProductoCard producto={p} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-16 text-sm text-ink/50">Aún no hay productos en esta colección.</p>
      )}
    </div>
  );
}
