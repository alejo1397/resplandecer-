"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import {
  crearProducto,
  actualizarProducto,
  cambiarEstadoProducto,
  agregarImagenProducto,
  eliminarImagenProducto,
} from "@/lib/queries/admin/catalogo";

function toSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type FormState = { error?: string };

export async function guardarProductoAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const idRaw = formData.get("id");
  const nombre = String(formData.get("nombre") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim() || null;
  const precio = Number(formData.get("precio") ?? 0);
  const precioVentaRaw = String(formData.get("precioVenta") ?? "").trim();
  const precioVenta = precioVentaRaw ? Number(precioVentaRaw) : null;
  const categoriaRaw = String(formData.get("categoriaId") ?? "").trim();
  const categoriaId = categoriaRaw ? Number(categoriaRaw) : null;
  const destacado = formData.get("destacado") === "on";
  const orden = Number(formData.get("orden") ?? 0);
  const estado = formData.get("estado") === "on";

  if (!nombre) return { error: "El nombre es obligatorio." };
  if (!Number.isFinite(precio) || precio < 0) return { error: "El precio no es valido." };

  const slug = slugRaw ? toSlug(slugRaw) : toSlug(nombre);

  try {
    if (idRaw) {
      await actualizarProducto(Number(idRaw), {
        nombre, slug, descripcion, precio, precioVenta, categoriaId, destacado, orden, estado,
      });
    } else {
      await crearProducto({
        nombre, slug, descripcion, precio, precioVenta, categoriaId, destacado, orden, estado,
      });
    }
  } catch {
    return { error: "No se pudo guardar. Revisa que el slug no este repetido." };
  }

  revalidatePath("/admin/catalogo");
  redirect("/admin/catalogo");
}

export async function alternarEstadoProductoAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const estado = formData.get("estado") === "true";
  await cambiarEstadoProducto(id, !estado);
  revalidatePath("/admin/catalogo");
}

export async function agregarImagenAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const catalogoId = Number(formData.get("catalogoId"));
  const url = String(formData.get("url") ?? "").trim();
  const esPrincipal = formData.get("esPrincipal") === "on";
  if (!url) return;
  await agregarImagenProducto(catalogoId, { url, esPrincipal });
  revalidatePath(`/admin/catalogo/${catalogoId}`);
}

export async function eliminarImagenAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const catalogoId = Number(formData.get("catalogoId"));
  await eliminarImagenProducto(id);
  revalidatePath(`/admin/catalogo/${catalogoId}`);
}
