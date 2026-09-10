import Image from "next/image";
import Link from "next/link";
import { getConfiguracionSitioCached } from "@/lib/cache";

export const metadata = { title: "Disena tu espacio | Resplandecer" };

export default async function DisenaTuEspacioPage() {
  const config = await getConfiguracionSitioCached();

  const titulo = config["diseno_titulo"] || "Disena tu espacio";
  const descripcion =
    config["diseno_descripcion"] ||
    "Creamos mobiliario a la medida de tus espacios y tu estilo.";
  const imagen = config["diseno_imagen"];
  const whatsapp = config["whatsapp_numero"];
  const mensaje = encodeURIComponent("Hola, quiero disenar un mueble a la medida.");
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
                <span className="pill-text">Cuentanos tu idea</span>
              </a>
            ) : null}
            <Link href="/contacto" className="pill pill-dark text-ink/70">
              <span className="pill-text">Escribenos</span>
            </Link>
          </div>
        </div>

        {imagen ? (
          <div className="reveal relative aspect-[3/2] overflow-hidden rounded-2xl bg-ink/5">
            <Image src={imagen} alt={titulo} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
