import { prisma } from "@/lib/prisma";
import { serialize } from "@/lib/serializers";

/**
 * Captura de clientes desde el formulario de contacto (uso publico) y
 * lectura de clientes (uso administrativo).
 */

export type NuevoClienteInput = {
  nombre: string;
  email?: string | null;
  telefono?: string | null;
  ciudad?: string | null;
  mensaje?: string | null;
};

/** Valida y crea un cliente a partir del formulario de contacto. */
export async function crearCliente(input: NuevoClienteInput) {
  const nombre = input.nombre?.trim();
  if (!nombre) {
    throw new Error("El nombre es obligatorio.");
  }

  // Debe venir al menos una via de contacto (email o telefono).
  const email = input.email?.trim() || null;
  const telefono = input.telefono?.trim() || null;
  if (!email && !telefono) {
    throw new Error("Debes indicar un correo o un telefono de contacto.");
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("El correo no tiene un formato valido.");
  }

  const cliente = await prisma.cliente.create({
    data: {
      nombre,
      email,
      telefono,
      ciudad: input.ciudad?.trim() || null,
      mensaje: input.mensaje?.trim() || null,
    },
  });

  return serialize(cliente);
}

/** Lista los clientes (uso administrativo). Mas recientes primero. */
export async function getClientes() {
  const clientes = await prisma.cliente.findMany({
    orderBy: { creadoEn: "desc" },
  });
  return serialize(clientes);
}
