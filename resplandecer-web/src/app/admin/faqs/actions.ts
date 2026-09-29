"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { CACHE_TAGS } from "@/lib/cache";
import {
  crearFaq,
  actualizarFaq,
  cambiarEstadoFaq,
  eliminarFaq,
} from "@/lib/queries/admin/home";

export type FormState = { error?: string };

export async function guardarFaqAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const idRaw = formData.get("id");
  const pregunta = String(formData.get("pregunta") ?? "").trim();
  const respuesta = String(formData.get("respuesta") ?? "").trim();
  const orden = Number(formData.get("orden") ?? 0);
  const estado = formData.get("estado") === "on";

  if (!pregunta) return { error: "La pregunta es obligatoria." };
  if (!respuesta) return { error: "La respuesta es obligatoria." };

  try {
    if (idRaw) {
      await actualizarFaq(Number(idRaw), { pregunta, respuesta, orden, estado });
    } else {
      await crearFaq({ pregunta, respuesta, orden, estado });
    }
  } catch {
    return { error: "No se pudo guardar la pregunta." };
  }

  revalidatePath("/admin/faqs");
  updateTag(CACHE_TAGS.faqs);
  redirect("/admin/faqs");
}

export async function alternarEstadoFaqAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const estado = formData.get("estado") === "true";
  await cambiarEstadoFaq(id, !estado);
  revalidatePath("/admin/faqs");
  updateTag(CACHE_TAGS.faqs);
}

export async function eliminarFaqAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await eliminarFaq(id);
  revalidatePath("/admin/faqs");
  updateTag(CACHE_TAGS.faqs);
}
