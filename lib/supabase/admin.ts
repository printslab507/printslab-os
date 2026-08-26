import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// SOLO para uso en el servidor (API routes, Server Actions, funciones de
// integración como Trello). Usa la service role key, que se salta RLS —
// por eso NUNCA debe importarse desde un componente de cliente ni exponerse
// al navegador. La variable SUPABASE_SERVICE_ROLE_KEY no lleva el prefijo
// NEXT_PUBLIC_ a propósito.
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
