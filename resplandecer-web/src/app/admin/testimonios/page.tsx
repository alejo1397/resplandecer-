import { requireAdmin } from "@/lib/auth/guard";
import { SeccionEnConstruccion } from "../_placeholder";

export default async function TestimoniosPage() {
  await requireAdmin();
  return (
    <SeccionEnConstruccion
      titulo="Testimonios"
      descripcion="Gestiona los testimonios de clientes."
    />
  );
}
