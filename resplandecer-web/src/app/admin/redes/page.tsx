import { requireAdmin } from "@/lib/auth/guard";
import { SeccionEnConstruccion } from "../_placeholder";

export default async function RedesPage() {
  await requireAdmin();
  return (
    <SeccionEnConstruccion
      titulo="Redes sociales"
      descripcion="Gestiona los enlaces a redes sociales."
    />
  );
}
