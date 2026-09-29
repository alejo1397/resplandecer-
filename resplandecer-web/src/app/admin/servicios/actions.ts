"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { CACHE_TAGS } from "@/lib/cache";
import {
  crearServicio,
  actualizarServicio,
  cambiarEstadoServicio,
  eliminarServicio,
} from "@/lib/queries/admin/home";

export type FormState = { error?: string };

export async function guardarServicioAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const idRaw = formData.get("id");
  const titulo = String(formData.get("titulo") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim() || null;
  const imagenUrl = String(formData.get("imagenUrl") ?? "").trim() || null;
  const orden = Number(formData.get("orden") ?? 0);
  const estado = formData.get("estado") === "on";

  if (!titulo) return { error: "El título es obligatorio." };

  try {
    if (idRaw) {
      await actualizarServicio(Number(idRaw), { titulo, descripcion, imagenUrl, orden, estado });
    } else {
      await crearServicio({ titulo, descripcion, imagenUrl, orden, estado });
    }
  } catch {
    return { error: "No se pudo guardar el servicio." };
  }

  revalidatePath("/admin/servicios");
  updateTag(CACHE_TAGS.servicios);
  redirect("/admin/servicios");
}

export async function alternarEstadoServicioAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const estado = formData.get("estado") === "true";
  await cambiarEstadoServicio(id, !estado);
  revalidatePath("/admin/servicios");
  updateTag(CACHE_TAGS.servicios);
}

export async function eliminarServicioAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await eliminarServicio(id);
  revalidatePath("/admin/servicios");
  updateTag(CACHE_TAGS.servicios);
}
