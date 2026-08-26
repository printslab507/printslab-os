import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

// Cliente para usar dentro de componentes de cliente ("use client").
// Usa la anon key: respeta siempre las políticas de RLS de Postgres.
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
