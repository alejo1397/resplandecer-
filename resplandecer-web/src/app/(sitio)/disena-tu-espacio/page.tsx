import Image from "next/image";
import Link from "next/link";
import { getConfiguracionSitioCached, getPasosDisenoCached } from "@/lib/cache";

export const metadata = { title: "Diseña tu espacio | Resplandecer" };

export default async function DisenaTuEspacioPage() {
  const [config, pasos] = await Promise.all([
    getConfiguracionSitioCached(),
    getPasosDisenoCached(),
  ]);

  const titulo = config["diseno_titulo"] || "Diseña tu espacio";
  const descripcion =
    config["diseno_descripcion"] ||
    "Creamos mobiliario a la medida de tus espacios y tu estilo.";
  const imagen = config["diseno_imagen"];
  const whatsapp = config["whatsapp_numero"];
  const mensaje = encodeURIComponent("Hola, quiero diseñar un mueble a la medida.");
  const whatsappHref = whatsapp ? `https://wa.me/${whatsapp}?text=${mensaje}` : null;

  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="reveal">
          <p className="label-mono text-ink/50">Servicio</p>
          <h1 className="display mt-3 text-[clamp(2.2rem,6vw,4.5rem)] text-ink">{titulo}</h1>
          <p className="mt-6 max-w-md whitespace-pre-line text-base leading-relaxed text-ink/70">
            {descripcion}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            {whatsappHref ? (
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="pill pill-dark text-ink">
                <span className="pill-text">Cuéntanos tu idea</span>
              </a>
            ) : null}
            <Link href="/contacto" className="pill pill-dark text-ink/70">
              <span className="pill-text">Escríbenos</span>
            </Link>
          </div>
        </div>

        {imagen ? (
          <div className="reveal relative aspect-[3/2] overflow-hidden rounded-2xl bg-ink/5">
            <Image src={imagen} alt={titulo} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
        ) : null}
      </div>

      {/* Paso a paso del proceso (administrable). Fallback si no hay pasos. */}
      {pasos.length > 0 ? (
        <div className="mt-24">
          <p className="label-mono text-ink/50">Cómo trabajamos</p>
          <h2 className="display mt-3 text-[clamp(1.8rem,4vw,3rem)] text-ink">Paso a paso</h2>

          <div className="mt-12 flex flex-col gap-12">
            {pasos.map((paso, i) => (
              <div
                key={paso.id}
                className={`grid items-center gap-8 ${paso.imagenUrl ? "md:grid-cols-2" : ""}`}
              >
                <div className={paso.imagenUrl && i % 2 === 1 ? "md:order-2" : ""}>
                  <span className="label-mono text-ember">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="display mt-2 text-[clamp(1.4rem,3vw,2.2rem)] text-ink">{paso.titulo}</h3>
                  {paso.descripcion ? (
                    <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-ink/70">
                      {paso.descripcion}
                    </p>
                  ) : null}
                </div>
                {paso.imagenUrl ? (
                  <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink/5 ${i % 2 === 1 ? "md:order-1" : ""}`}>
                    <Image
                      src={paso.imagenUrl}
                      alt={paso.titulo}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
