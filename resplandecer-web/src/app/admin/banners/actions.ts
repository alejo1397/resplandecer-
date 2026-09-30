"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { CACHE_TAGS } from "@/lib/cache";
import {
  crearHomeBanner,
  actualizarHomeBanner,
  cambiarEstadoHomeBanner,
  eliminarHomeBanner,
} from "@/lib/queries/admin/home";

export type FormState = { error?: string };

export async function guardarBannerAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const idRaw = formData.get("id");
  const seccion = String(formData.get("seccion") ?? "").trim();
  const titulo = String(formData.get("titulo") ?? "").trim() || null;
  const subtitulo = String(formData.get("subtitulo") ?? "").trim() || null;
  const etiqueta = String(formData.get("etiqueta") ?? "").trim() || null;
  const imagenUrl = String(formData.get("imagenUrl") ?? "").trim();
  const enlaceUrl = String(formData.get("enlaceUrl") ?? "").trim() || null;
  const orden = Number(formData.get("orden") ?? 0);
  const estado = formData.get("estado") === "on";

  if (seccion !== "mobiliario" && seccion !== "colecciones") {
    return { error: "Sección inválida." };
  }
  if (!imagenUrl) return { error: "La imagen es obligatoria." };

  try {
    if (idRaw) {
      await actualizarHomeBanner(Number(idRaw), { seccion, titulo, subtitulo, etiqueta, imagenUrl, enlaceUrl, orden, estado });
    } else {
      await crearHomeBanner({ seccion, titulo, subtitulo, etiqueta, imagenUrl, enlaceUrl, orden, estado });
    }
  } catch {
    return { error: "No se pudo guardar el banner." };
  }

  revalidatePath("/admin/banners");
  updateTag(CACHE_TAGS.banners);
  redirect(idRaw ? "/admin/banners?ok=actualizado" : "/admin/banners?ok=creado");
}

export async function alternarEstadoBannerAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const estado = formData.get("estado") === "true";
  await cambiarEstadoHomeBanner(id, !estado);
  revalidatePath("/admin/banners");
  updateTag(CACHE_TAGS.banners);
}

export async function eliminarBannerAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await eliminarHomeBanner(id);
  revalidatePath("/admin/banners");
  updateTag(CACHE_TAGS.banners);
}
