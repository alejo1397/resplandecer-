"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { CACHE_TAGS } from "@/lib/cache";
import {
  crearColeccion,
  actualizarColeccion,
  cambiarEstadoColeccion,
  eliminarColeccion,
  agregarImagenColeccion,
  eliminarImagenColeccion,
  marcarImagenPrincipalColeccion,
} from "@/lib/queries/admin/colecciones";

function toSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type FormState = { error?: string };

export async function guardarColeccionAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const idRaw = formData.get("id");
  const titulo = String(formData.get("titulo") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const resumen = String(formData.get("resumen") ?? "").trim() || null;
  const descripcion = String(formData.get("descripcion") ?? "").trim() || null;
  const imagenUrl = String(formData.get("imagenUrl") ?? "").trim() || null;
  const imagenAlt = String(formData.get("imagenAlt") ?? "").trim() || null;
  const whatsappTexto = String(formData.get("whatsappTexto") ?? "").trim() || null;
  const whatsappMensaje = String(formData.get("whatsappMensaje") ?? "").trim() || null;
  const orden = Number(formData.get("orden") ?? 0);
  const estado = formData.get("estado") === "on";

  if (!titulo) return { error: "El título es obligatorio." };
  const slug = slugRaw ? toSlug(slugRaw) : toSlug(titulo);

  try {
    if (idRaw) {
      await actualizarColeccion(Number(idRaw), {
        titulo, slug, resumen, descripcion, imagenUrl, imagenAlt, whatsappTexto, whatsappMensaje, orden, estado,
      });
    } else {
      await crearColeccion({
        titulo, slug, resumen, descripcion, imagenUrl, imagenAlt, whatsappTexto, whatsappMensaje, orden, estado,
      });
    }
  } catch {
    return { error: "No se pudo guardar. Revisa que el slug no esté repetido." };
  }

  revalidatePath("/admin/colecciones");
  updateTag(CACHE_TAGS.colecciones);
  redirect(idRaw ? "/admin/colecciones?ok=actualizado" : "/admin/colecciones?ok=creado");
}

export async function alternarEstadoColeccionAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const estado = formData.get("estado") === "true";
  await cambiarEstadoColeccion(id, !estado);
  revalidatePath("/admin/colecciones");
  updateTag(CACHE_TAGS.colecciones);
}

export async function eliminarColeccionAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await eliminarColeccion(id);
  revalidatePath("/admin/colecciones");
  updateTag(CACHE_TAGS.colecciones);
}

export async function agregarImagenColeccionAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const coleccionId = Number(formData.get("coleccionId"));
  const url = String(formData.get("url") ?? "").trim();
  const esPrincipal = formData.get("esPrincipal") === "on";
  if (!url) return;
  await agregarImagenColeccion(coleccionId, { url, esPrincipal });
  revalidatePath(`/admin/colecciones/${coleccionId}`);
  updateTag(CACHE_TAGS.colecciones);
}

export async function marcarPrincipalColeccionAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const coleccionId = Number(formData.get("coleccionId"));
  await marcarImagenPrincipalColeccion(id, coleccionId);
  revalidatePath(`/admin/colecciones/${coleccionId}`);
  updateTag(CACHE_TAGS.colecciones);
}

export async function eliminarImagenColeccionAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const coleccionId = Number(formData.get("coleccionId"));
  await eliminarImagenColeccion(id);
  revalidatePath(`/admin/colecciones/${coleccionId}`);
  updateTag(CACHE_TAGS.colecciones);
}
