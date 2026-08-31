"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { CACHE_TAGS } from "@/lib/cache";
import {
  crearRedSocial,
  actualizarRedSocial,
  cambiarEstadoRedSocial,
} from "@/lib/queries/admin/contenido";

export type FormState = { error?: string };

export async function guardarRedAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const idRaw = formData.get("id");
  const nombre = String(formData.get("nombre") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const icono = String(formData.get("icono") ?? "").trim() || null;
  const orden = Number(formData.get("orden") ?? 0);
  const estado = formData.get("estado") === "on";

  if (!nombre) return { error: "El nombre es obligatorio." };
  if (!url) return { error: "La URL es obligatoria." };

  try {
    if (idRaw) {
      await actualizarRedSocial(Number(idRaw), { nombre, url, icono, orden, estado });
    } else {
      await crearRedSocial({ nombre, url, icono, orden, estado });
    }
  } catch {
    return { error: "No se pudo guardar la red social." };
  }

  revalidatePath("/admin/redes");
  updateTag(CACHE_TAGS.redes);
  redirect("/admin/redes");
}

export async function alternarEstadoRedAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const estado = formData.get("estado") === "true";
  await cambiarEstadoRedSocial(id, !estado);
  revalidatePath("/admin/redes");
  updateTag(CACHE_TAGS.redes);
}
