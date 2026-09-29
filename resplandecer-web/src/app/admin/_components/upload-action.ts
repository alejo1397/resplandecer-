"use server";

import { requireAdmin } from "@/lib/auth/guard";
import { subirImagen, subirMedia } from "@/lib/storage";

export type UploadState = { url?: string; error?: string };
export type MediaUploadState = { url?: string; tipo?: "image" | "video"; error?: string };

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

/**
 * Server action que sube una imagen O video y devuelve su URL pública y tipo.
 * Usada por el componente <MediaUploader> (hero multimedia).
 */
export async function subirMediaAction(
  _prev: MediaUploadState,
  formData: FormData,
): Promise<MediaUploadState> {
  await requireAdmin();

  const file = formData.get("archivo");
  const carpeta = String(formData.get("carpeta") ?? "hero");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Selecciona un archivo." };
  }

  try {
    const { url, tipo } = await subirMedia(file, carpeta);
    return { url, tipo };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "No se pudo subir el archivo.";
    return { error: msg };
  }
}
