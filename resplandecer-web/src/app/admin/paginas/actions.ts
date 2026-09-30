"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import {
  actualizarPagina,
  agregarBloque,
  actualizarBloque,
  eliminarBloque,
} from "@/lib/queries/admin/paginas";

export type FormState = { error?: string };

export async function guardarPaginaAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const titulo = String(formData.get("titulo") ?? "").trim();
  const subtitulo = String(formData.get("subtitulo") ?? "").trim() || null;
  const estado = formData.get("estado") === "on";

  if (!titulo) return { error: "El título es obligatorio." };

  try {
    await actualizarPagina(id, { titulo, subtitulo, estado });
  } catch {
    return { error: "No se pudo guardar la página." };
  }

  revalidatePath("/admin/paginas");
  redirect(`/admin/paginas/${id}`);
}

export async function agregarBloqueAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const paginaId = Number(formData.get("paginaId"));
  const subtitulo = String(formData.get("subtitulo") ?? "").trim() || null;
  const contenido = String(formData.get("contenido") ?? "").trim();
  const imagenUrl = String(formData.get("imagenUrl") ?? "").trim() || null;
  const orden = Number(formData.get("orden") ?? 0);
  if (!contenido) return;
  await agregarBloque(paginaId, { subtitulo, contenido, imagenUrl, orden });
  revalidatePath(`/admin/paginas/${paginaId}`);
}

export async function actualizarBloqueAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const paginaId = Number(formData.get("paginaId"));
  const subtitulo = String(formData.get("subtitulo") ?? "").trim() || null;
  const contenido = String(formData.get("contenido") ?? "").trim();
  const imagenUrl = String(formData.get("imagenUrl") ?? "").trim() || null;
  const orden = Number(formData.get("orden") ?? 0);
  const estado = formData.get("estado") === "on";
  if (!contenido) return;
  await actualizarBloque(id, { subtitulo, contenido, imagenUrl, orden, estado });
  revalidatePath(`/admin/paginas/${paginaId}`);
}

export async function eliminarBloqueAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const paginaId = Number(formData.get("paginaId"));
  await eliminarBloque(id);
  revalidatePath(`/admin/paginas/${paginaId}`);
}
