import { requireAdmin } from "@/lib/auth/guard";
import { SeccionEnConstruccion } from "../_placeholder";

export default async function ConfiguracionPage() {
  await requireAdmin();
  return (
    <SeccionEnConstruccion
      titulo="Configuracion"
      descripcion="Edita los textos y parametros del sitio."
    />
  );
}
