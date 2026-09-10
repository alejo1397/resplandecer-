import { getConfiguracionSitioCached } from "@/lib/cache";
import { ContactoForm } from "./contacto-form";

export const metadata = { title: "Contacto | Resplandecer" };

export default async function ContactoPage() {
  const config = await getConfiguracionSitioCached();

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="label-mono text-ink/50">Hablemos</p>
      <h1 className="display mt-3 text-[clamp(2.2rem,6vw,4.5rem)] text-ink">Contacto</h1>
      <p className="mt-4 max-w-md text-sm text-ink/60">
        Cuentanos que necesitas y te responderemos pronto.
      </p>

      <div className="mt-6 flex flex-col gap-1 text-sm text-ink/70">
        {config["email_contacto"] ? <p>Correo: {config["email_contacto"]}</p> : null}
        {config["telefono_contacto"] ? <p>Telefono: {config["telefono_contacto"]}</p> : null}
      </div>

      <div className="mt-10">
        <ContactoForm />
      </div>
    </div>
  );
}
