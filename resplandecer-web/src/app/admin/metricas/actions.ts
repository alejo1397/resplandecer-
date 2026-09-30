"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { CACHE_TAGS } from "@/lib/cache";
import {
  crearMetrica,
  actualizarMetrica,
  cambiarEstadoMetrica,
  eliminarMetrica,
} from "@/lib/queries/admin/home";

export type FormState = { error?: string };

export async function guardarMetricaAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const idRaw = formData.get("id");
  const valor = Number(formData.get("valor") ?? 0);
  const prefijo = String(formData.get("prefijo") ?? "").trim() || null;
  const sufijo = String(formData.get("sufijo") ?? "").trim() || null;
  const etiqueta = String(formData.get("etiqueta") ?? "").trim();
  const orden = Number(formData.get("orden") ?? 0);
  const estado = formData.get("estado") === "on";

  if (!etiqueta) return { error: "La etiqueta es obligatoria." };
  if (!Number.isFinite(valor)) return { error: "El valor no es válido." };

  try {
    if (idRaw) {
      await actualizarMetrica(Number(idRaw), { valor, prefijo, sufijo, etiqueta, orden, estado });
    } else {
      await crearMetrica({ valor, prefijo, sufijo, etiqueta, orden, estado });
    }
  } catch {
    return { error: "No se pudo guardar la métrica." };
  }

  revalidatePath("/admin/metricas");
  updateTag(CACHE_TAGS.metricas);
  redirect(idRaw ? "/admin/metricas?ok=actualizado" : "/admin/metricas?ok=creado");
}

export async function alternarEstadoMetricaAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const estado = formData.get("estado") === "true";
  await cambiarEstadoMetrica(id, !estado);
  revalidatePath("/admin/metricas");
  updateTag(CACHE_TAGS.metricas);
}

export async function eliminarMetricaAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await eliminarMetrica(id);
  revalidatePath("/admin/metricas");
  updateTag(CACHE_TAGS.metricas);
}
