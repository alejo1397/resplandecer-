import { getConfiguracionSitioCached, getRedesSocialesCached } from "@/lib/cache";
import { Header } from "./_components/header";
import { Footer } from "./_components/footer";
import { WhatsAppButton } from "./_components/whatsapp-button";
import { MotionProvider } from "./_components/motion-provider";

export default async function SitioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [config, redes] = await Promise.all([
    getConfiguracionSitioCached(),
    getRedesSocialesCached(),
  ]);

  const nombreSitio = config["nombre_sitio"] || "Resplandecer";

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <MotionProvider />
      <Header nombreSitio={nombreSitio} />
      <div className="flex-1">{children}</div>
      <Footer
        nombreSitio={nombreSitio}
        email={config["email_contacto"]}
        telefono={config["telefono_contacto"]}
        redes={redes.map((r) => ({ id: r.id, nombre: r.nombre, url: r.url }))}
      />
      <WhatsAppButton numero={config["whatsapp_numero"]} />
    </div>
  );
}
