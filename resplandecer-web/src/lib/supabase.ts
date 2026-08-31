import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase para el SERVIDOR, usando la service_role key.
 *
 * IMPORTANTE: la service_role key da acceso total (salta RLS). Este cliente solo
 * debe usarse en codigo de servidor (server actions), NUNCA en el navegador.
 * Por eso el import de "server-only".
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) {
  throw new Error("Falta NEXT_PUBLIC_SUPABASE_URL en el entorno.");
}

export const supabaseAdmin = createClient(url, serviceKey ?? "", {
  auth: { persistSession: false, autoRefreshToken: false },
});

/** Nombre del bucket de imagenes en Supabase Storage. */
export const BUCKET_IMAGENES = "imagenes";
