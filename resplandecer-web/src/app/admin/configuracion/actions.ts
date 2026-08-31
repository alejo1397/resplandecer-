"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth/guard";
import { CACHE_TAGS } from "@/lib/cache";
import { guardarParametro } from "@/lib/queries/admin/contenido";

export async function guardarParametroAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const clave = String(formData.get("clave") ?? "").trim();
  const valor = String(formData.get("valor") ?? "");
  if (!clave) return;
  await guardarParametro({ clave, valor });
  revalidatePath("/admin/configuracion");
  updateTag(CACHE_TAGS.config);
}

export async function crearParametroAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const clave = String(formData.get("clave") ?? "").trim();
  const valor = String(formData.get("valor") ?? "");
  const descripcion = String(formData.get("descripcion") ?? "").trim() || null;
  if (!clave) return;
  await guardarParametro({ clave, valor, descripcion });
  revalidatePath("/admin/configuracion");
  updateTag(CACHE_TAGS.config);
}
