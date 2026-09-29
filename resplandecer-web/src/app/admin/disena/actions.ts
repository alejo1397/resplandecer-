"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { CACHE_TAGS } from "@/lib/cache";
import {
  crearPasoDiseno,
  actualizarPasoDiseno,
  cambiarEstadoPasoDiseno,
  eliminarPasoDiseno,
} from "@/lib/queries/admin/home";

export type FormState = { error?: string };

export async function guardarPasoAction(
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
      await actualizarPasoDiseno(Number(idRaw), { titulo, descripcion, imagenUrl, orden, estado });
    } else {
      await crearPasoDiseno({ titulo, descripcion, imagenUrl, orden, estado });
    }
  } catch {
    return { error: "No se pudo guardar el paso." };
  }

  revalidatePath("/admin/disena");
  updateTag(CACHE_TAGS.pasosDiseno);
  redirect("/admin/disena");
}

export async function alternarEstadoPasoAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const estado = formData.get("estado") === "true";
  await cambiarEstadoPasoDiseno(id, !estado);
  revalidatePath("/admin/disena");
  updateTag(CACHE_TAGS.pasosDiseno);
}

export async function eliminarPasoAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await eliminarPasoDiseno(id);
  revalidatePath("/admin/disena");
  updateTag(CACHE_TAGS.pasosDiseno);
}
