"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { CACHE_TAGS } from "@/lib/cache";
import {
  crearProyecto,
  actualizarProyecto,
  cambiarEstadoProyecto,
  agregarImagenProyecto,
  eliminarImagenProyecto,
} from "@/lib/queries/admin/proyectos";

function toSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type FormState = { error?: string };

export async function guardarProyectoAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const idRaw = formData.get("id");
  const titulo = String(formData.get("titulo") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim() || null;
  const ubicacion = String(formData.get("ubicacion") ?? "").trim() || null;
  const fecha = String(formData.get("fecha") ?? "").trim() || null;
  const destacado = formData.get("destacado") === "on";
  const orden = Number(formData.get("orden") ?? 0);
  const estado = formData.get("estado") === "on";

  if (!titulo) return { error: "El titulo es obligatorio." };

  const slug = slugRaw ? toSlug(slugRaw) : toSlug(titulo);

  try {
    if (idRaw) {
      await actualizarProyecto(Number(idRaw), { titulo, slug, descripcion, ubicacion, fecha, destacado, orden, estado });
    } else {
      await crearProyecto({ titulo, slug, descripcion, ubicacion, fecha, destacado, orden, estado });
    }
  } catch {
    return { error: "No se pudo guardar. Revisa que el slug no este repetido." };
  }

  revalidatePath("/admin/proyectos");
  updateTag(CACHE_TAGS.proyectos);
  redirect("/admin/proyectos");
}

export async function alternarEstadoProyectoAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const estado = formData.get("estado") === "true";
  await cambiarEstadoProyecto(id, !estado);
  revalidatePath("/admin/proyectos");
  updateTag(CACHE_TAGS.proyectos);
}

export async function agregarImagenProyectoAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const proyectoId = Number(formData.get("proyectoId"));
  const url = String(formData.get("url") ?? "").trim();
  const esPrincipal = formData.get("esPrincipal") === "on";
  if (!url) return;
  await agregarImagenProyecto(proyectoId, { url, esPrincipal });
  revalidatePath(`/admin/proyectos/${proyectoId}`);
  updateTag(CACHE_TAGS.proyectos);
}

export async function eliminarImagenProyectoAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const proyectoId = Number(formData.get("proyectoId"));
  await eliminarImagenProyecto(id);
  revalidatePath(`/admin/proyectos/${proyectoId}`);
  updateTag(CACHE_TAGS.proyectos);
}
