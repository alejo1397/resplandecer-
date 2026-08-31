import { getConfiguracionSitio } from "@/lib/queries";
import { ContactoForm } from "./contacto-form";

export const metadata = { title: "Contacto | Resplandecer" };

export default async function ContactoPage() {
  const config = await getConfiguracionSitio();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Contacto</h1>
      <p className="mt-1 text-sm text-gray-500">
        Cuentanos que necesitas y te responderemos pronto.
      </p>

      <div className="mt-6 flex flex-col gap-1 text-sm text-gray-600">
        {config["email_contacto"] ? <p>Correo: {config["email_contacto"]}</p> : null}
        {config["telefono_contacto"] ? <p>Telefono: {config["telefono_contacto"]}</p> : null}
      </div>

      <div className="mt-8">
        <ContactoForm />
      </div>
    </div>
  );
}
