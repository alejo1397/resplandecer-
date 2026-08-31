import { requireAdmin } from "@/lib/auth/guard";
import { SeccionEnConstruccion } from "../_placeholder";

export default async function CategoriasPage() {
  await requireAdmin();
  return (
    <SeccionEnConstruccion
      titulo="Categorias"
      descripcion="Gestiona las categorias del catalogo."
    />
  );
}
