import "server-only";
import { supabaseAdmin, BUCKET_IMAGENES } from "@/lib/supabase";

/**
 * Utilidades de almacenamiento de imagenes en Supabase Storage.
 */

const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

// Video: para el hero multimedia administrable.
const TIPOS_VIDEO = ["video/mp4", "video/webm", "video/ogg"];
const MAX_BYTES_VIDEO = 50 * 1024 * 1024; // 50 MB

function extensionDesdeTipo(tipo: string): string {
  const mapa: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/ogg": "ogv",
  };
  return mapa[tipo] ?? "bin";
}

/**
 * Sube un archivo de imagen al bucket y devuelve su URL publica.
 * @param file  Archivo recibido de un formulario.
 * @param carpeta  Subcarpeta logica dentro del bucket (ej. "catalogo", "proyectos").
 */
export async function subirImagen(file: File, carpeta: string): Promise<string> {
  if (!TIPOS_PERMITIDOS.includes(file.type)) {
    throw new Error("Formato no permitido. Usa JPG, PNG, WEBP, GIF o AVIF.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("La imagen supera el tamano maximo de 5 MB.");
  }

  const ext = extensionDesdeTipo(file.type);
  const nombre = `${carpeta}/${crypto.randomUUID()}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from(BUCKET_IMAGENES)
    .upload(nombre, buffer, { contentType: file.type, upsert: false });

  if (error) {
    throw new Error(`No se pudo subir la imagen: ${error.message}`);
  }

  const { data } = supabaseAdmin.storage.from(BUCKET_IMAGENES).getPublicUrl(nombre);
  return data.publicUrl;
}

/**
 * Sube un archivo de imagen O video al bucket y devuelve su URL publica.
 * Usado por el hero multimedia administrable (acepta ambos tipos).
 * @param file  Archivo recibido de un formulario.
 * @param carpeta  Subcarpeta logica dentro del bucket (ej. "hero").
 */
export async function subirMedia(
  file: File,
  carpeta: string,
): Promise<{ url: string; tipo: "image" | "video" }> {
  const esImagen = TIPOS_PERMITIDOS.includes(file.type);
  const esVideo = TIPOS_VIDEO.includes(file.type);

  if (!esImagen && !esVideo) {
    throw new Error("Formato no permitido. Usa una imagen (JPG, PNG, WEBP) o un video (MP4, WEBM).");
  }
  const limite = esVideo ? MAX_BYTES_VIDEO : MAX_BYTES;
  if (file.size > limite) {
    const mb = Math.round(limite / (1024 * 1024));
    throw new Error(`El archivo supera el tamaño máximo de ${mb} MB.`);
  }

  const ext = extensionDesdeTipo(file.type);
  const nombre = `${carpeta}/${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from(BUCKET_IMAGENES)
    .upload(nombre, buffer, { contentType: file.type, upsert: false });

  if (error) {
    throw new Error(`No se pudo subir el archivo: ${error.message}`);
  }

  const { data } = supabaseAdmin.storage.from(BUCKET_IMAGENES).getPublicUrl(nombre);
  return { url: data.publicUrl, tipo: esVideo ? "video" : "image" };
}
