"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { CACHE_TAGS } from "@/lib/cache";
import {
  crearTestimonio,
  actualizarTestimonio,
  cambiarEstadoTestimonio,
  crearImagenTestimonio,
} from "@/lib/queries/admin/contenido";

export type FormState = { error?: string };

export async function guardarTestimonioAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const idRaw = formData.get("id");
  const nombreCliente = String(formData.get("nombreCliente") ?? "").trim();
  const cargoOCiudad = String(formData.get("cargoOCiudad") ?? "").trim() || null;
  const mensaje = String(formData.get("mensaje") ?? "").trim();
  const calificacionRaw = String(formData.get("calificacion") ?? "").trim();
  const calificacion = calificacionRaw ? Number(calificacionRaw) : null;
  const imagenUrl = String(formData.get("imagenUrl") ?? "").trim();
  const imagenUrlActual = String(formData.get("imagenUrlActual") ?? "").trim();
  const orden = Number(formData.get("orden") ?? 0);
  const estado = formData.get("estado") === "on";

  if (!nombreCliente) return { error: "El nombre es obligatorio." };
  if (!mensaje) return { error: "El mensaje es obligatorio." };
  if (calificacion !== null && (calificacion < 1 || calificacion > 5)) {
    return { error: "La calificacion debe estar entre 1 y 5." };
  }

  try {
    // Crear una imagen nueva solo si la URL cambio respecto a la actual.
    let imagenId: number | null | undefined = undefined;
    if (imagenUrl && imagenUrl !== imagenUrlActual) {
      const img = await crearImagenTestimonio(imagenUrl, nombreCliente);
      imagenId = img.id;
    }

    if (idRaw) {
      await actualizarTestimonio(Number(idRaw), {
        nombreCliente,
        cargoOCiudad,
        mensaje,
        calificacion,
        orden,
        estado,
        ...(imagenId !== undefined ? { imagenId } : {}),
      });
    } else {
      await crearTestimonio({
        nombreCliente,
        cargoOCiudad,
        mensaje,
        calificacion,
        orden,
        estado,
        imagenId: imagenId ?? null,
      });
    }
  } catch {
    return { error: "No se pudo guardar el testimonio." };
  }

  revalidatePath("/admin/testimonios");
  updateTag(CACHE_TAGS.testimonios);
  redirect("/admin/testimonios");
}

export async function alternarEstadoTestimonioAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const estado = formData.get("estado") === "true";
  await cambiarEstadoTestimonio(id, !estado);
  revalidatePath("/admin/testimonios");
  updateTag(CACHE_TAGS.testimonios);
}
