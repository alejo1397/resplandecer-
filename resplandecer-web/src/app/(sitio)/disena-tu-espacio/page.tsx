import Image from "next/image";
import Link from "next/link";
import { getConfiguracionSitio } from "@/lib/queries";

export const metadata = { title: "Disena tu espacio | Resplandecer" };

export default async function DisenaTuEspacioPage() {
  const config = await getConfiguracionSitio();

  const titulo = config["diseno_titulo"] || "Disena tu espacio";
  const descripcion =
    config["diseno_descripcion"] ||
    "Creamos mobiliario a la medida de tus espacios y tu estilo.";
  const imagen = config["diseno_imagen"];
  const whatsapp = config["whatsapp_numero"];
  const mensaje = encodeURIComponent("Hola, quiero disenar un mueble a la medida.");
  const whatsappHref = whatsapp ? `https://wa.me/${whatsapp}?text=${mensaje}` : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">{titulo}</h1>
          <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-gray-600">
            {descripcion}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-md bg-green-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-green-600"
              >
                Cuentanos tu idea
              </a>
            ) : null}
            <Link
              href="/contacto"
              className="inline-flex items-center rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Escribenos
            </Link>
          </div>
        </div>

        {imagen ? (
          <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-gray-100">
            <Image src={imagen} alt={titulo} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
