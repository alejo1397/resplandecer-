"use server";

import { requireAdmin } from "@/lib/auth/guard";
import { subirImagen } from "@/lib/storage";

export type UploadState = { url?: string; error?: string };

/**
 * Server action que sube una imagen y devuelve su URL publica.
 * Usada por el componente <ImageUploader>.
 */
export async function subirImagenAction(
  _prev: UploadState,
  formData: FormData,
): Promise<UploadState> {
  await requireAdmin();

  const file = formData.get("archivo");
  const carpeta = String(formData.get("carpeta") ?? "general");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Selecciona un archivo." };
  }

  try {
    const url = await subirImagen(file, carpeta);
    return { url };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "No se pudo subir la imagen.";
    return { error: msg };
  }
}
