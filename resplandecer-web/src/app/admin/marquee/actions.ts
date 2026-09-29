"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { CACHE_TAGS } from "@/lib/cache";
import {
  crearMarqueeItem,
  actualizarMarqueeItem,
  cambiarEstadoMarqueeItem,
  eliminarMarqueeItem,
} from "@/lib/queries/admin/home";

export type FormState = { error?: string };

export async function guardarMarqueeAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const idRaw = formData.get("id");
  const texto = String(formData.get("texto") ?? "").trim();
  const orden = Number(formData.get("orden") ?? 0);
  const estado = formData.get("estado") === "on";

  if (!texto) return { error: "El texto es obligatorio." };

  try {
    if (idRaw) {
      await actualizarMarqueeItem(Number(idRaw), { texto, orden, estado });
    } else {
      await crearMarqueeItem({ texto, orden, estado });
    }
  } catch {
    return { error: "No se pudo guardar el texto." };
  }

  revalidatePath("/admin/marquee");
  updateTag(CACHE_TAGS.marquee);
  redirect("/admin/marquee");
}

export async function alternarEstadoMarqueeAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const estado = formData.get("estado") === "true";
  await cambiarEstadoMarqueeItem(id, !estado);
  revalidatePath("/admin/marquee");
  updateTag(CACHE_TAGS.marquee);
}

export async function eliminarMarqueeAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await eliminarMarqueeItem(id);
  revalidatePath("/admin/marquee");
  updateTag(CACHE_TAGS.marquee);
}
