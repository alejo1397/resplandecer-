import { requireAdmin } from "@/lib/auth/guard";
import { SeccionEnConstruccion } from "../_placeholder";

export default async function CatalogoPage() {
  await requireAdmin();
  return (
    <SeccionEnConstruccion
      titulo="Catalogo"
      descripcion="Gestiona los productos y sus imagenes."
    />
  );
}
