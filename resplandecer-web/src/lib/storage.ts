import "server-only";
import { supabaseAdmin, BUCKET_IMAGENES } from "@/lib/supabase";

/**
 * Utilidades de almacenamiento de imagenes en Supabase Storage.
 */

const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

function extensionDesdeTipo(tipo: string): string {
  const mapa: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
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
