"use server";

import { crearCliente } from "@/lib/queries/clientes";

export type ContactoState = { ok?: boolean; error?: string };

export async function enviarContactoAction(
  _prev: ContactoState,
  formData: FormData,
): Promise<ContactoState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim() || null;
  const telefono = String(formData.get("telefono") ?? "").trim() || null;
  const ciudad = String(formData.get("ciudad") ?? "").trim() || null;
  const mensaje = String(formData.get("mensaje") ?? "").trim() || null;

  try {
    await crearCliente({ nombre, email, telefono, ciudad, mensaje });
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "No se pudo enviar el mensaje.";
    return { error: msg };
  }
}
