import { requireAdmin } from "@/lib/auth/guard";
import { SeccionEnConstruccion } from "../_placeholder";

export default async function ClientesPage() {
  await requireAdmin();
  return (
    <SeccionEnConstruccion
      titulo="Clientes"
      descripcion="Contactos recibidos desde el formulario del sitio."
    />
  );
}
