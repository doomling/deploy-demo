import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Cliente de Supabase para código de servidor (Server Components,
 * Server Actions y Route Handlers).
 *
 * Usa la clave publishable: lo que protege los datos son las políticas
 * RLS definidas en supabase/migrations, no esta clave.
 */
export function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // proyectos con claves legacy

  if (!url || !key) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    );
  }

  return createClient<Database>(url, key, {
    auth: { persistSession: false },
  });
}
