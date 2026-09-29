"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/guard";
import { CACHE_TAGS } from "@/lib/cache";
import { guardarParametro } from "@/lib/queries/admin/contenido";

export type FormState = { ok?: boolean; error?: string };

export async function guardarHeroAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const mediaUrl = String(formData.get("hero_media_url") ?? "").trim();
  const mediaTipo = String(formData.get("hero_media_tipo") ?? "").trim();
  const posterUrl = String(formData.get("hero_poster_url") ?? "").trim();

  try {
    await guardarParametro({ clave: "hero_media_url", valor: mediaUrl || null, tipo: "texto" });
    await guardarParametro({ clave: "hero_media_tipo", valor: mediaTipo || null, tipo: "texto" });
    await guardarParametro({ clave: "hero_poster_url", valor: posterUrl || null, tipo: "imagen" });
  } catch {
    return { error: "No se pudo guardar." };
  }

  revalidatePath("/admin/hero");
  updateTag(CACHE_TAGS.config);
  return { ok: true };
}

export async function limpiarHeroAction(): Promise<void> {
  await requireAdmin();
  await guardarParametro({ clave: "hero_media_url", valor: null, tipo: "texto" });
  await guardarParametro({ clave: "hero_media_tipo", valor: null, tipo: "texto" });
  await guardarParametro({ clave: "hero_poster_url", valor: null, tipo: "imagen" });
  revalidatePath("/admin/hero");
  updateTag(CACHE_TAGS.config);
}
