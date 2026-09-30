"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { CACHE_TAGS } from "@/lib/cache";
import {
  crearCategoria,
  actualizarCategoria,
  cambiarEstadoCategoria,
} from "@/lib/queries/admin/categorias";

/** Genera un slug simple a partir de un texto. */
function toSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type FormState = { error?: string };

export async function guardarCategoriaAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const idRaw = formData.get("id");
  const nombre = String(formData.get("nombre") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim() || null;
  const imagenUrl = String(formData.get("imagenUrl") ?? "").trim() || null;
  const orden = Number(formData.get("orden") ?? 0);
  const estado = formData.get("estado") === "on";

  if (!nombre) return { error: "El nombre es obligatorio." };

  const slug = slugRaw ? toSlug(slugRaw) : toSlug(nombre);

  try {
    if (idRaw) {
      await actualizarCategoria(Number(idRaw), { nombre, slug, descripcion, imagenUrl, orden, estado });
    } else {
      await crearCategoria({ nombre, slug, descripcion, imagenUrl, orden, estado });
    }
  } catch {
    return { error: "No se pudo guardar. Revisa que el slug no esté repetido." };
  }

  revalidatePath("/admin/categorias");
  updateTag(CACHE_TAGS.categorias);
  redirect(idRaw ? "/admin/categorias?ok=actualizado" : "/admin/categorias?ok=creado");
}

export async function alternarEstadoCategoriaAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const estado = formData.get("estado") === "true";
  // Si se va a inactivar y tiene productos asociados, se oculta la categoria
  // pero sus productos siguen existiendo (no se borran). El aviso se muestra
  // en la UI de la tabla (columna Productos).
  await cambiarEstadoCategoria(id, !estado);
  revalidatePath("/admin/categorias");
  updateTag(CACHE_TAGS.categorias);
  updateTag(CACHE_TAGS.catalogo);
}


