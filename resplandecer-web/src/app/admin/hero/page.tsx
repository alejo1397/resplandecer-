import { requireAdmin } from "@/lib/auth/guard";
import { getConfiguracionSitio } from "@/lib/queries";
import { PageHeader, SubmitButton } from "../_components/ui";
import { HeroForm } from "./hero-form";
import { limpiarHeroAction } from "./actions";

export default async function HeroPage() {
  await requireAdmin();
  const config = await getConfiguracionSitio();

  const mediaUrl = config["hero_media_url"] ?? "";
  const mediaTipo = config["hero_media_tipo"] ?? "";
  const posterUrl = config["hero_poster_url"] ?? "";

  return (
    <div className="max-w-2xl">
      <PageHeader
        titulo="Hero de la página principal"
        descripcion="Cambia el fondo del hero por un video o una imagen."
      />

      <HeroForm mediaUrl={mediaUrl} mediaTipo={mediaTipo} posterUrl={posterUrl} />

      {mediaUrl ? (
        <form action={limpiarHeroAction} className="mt-6">
          <SubmitButton variant="danger">Quitar media (volver al plano interactivo)</SubmitButton>
        </form>
      ) : null}
    </div>
  );
}
