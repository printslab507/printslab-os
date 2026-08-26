"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ClienteDuplicado = {
  id: string;
  nombre: string;
  telefono: string | null;
  empresa: string | null;
};

// Busca clientes con nombre o teléfono parecido ANTES de guardar.
// No bloquea el guardado: solo avisa, porque a veces el "duplicado"
// es en realidad otra persona con nombre parecido.
export async function buscarPosiblesDuplicados(
  nombre: string,
  telefono: string
): Promise<ClienteDuplicado[]> {
  const supabase = await createClient();
  const filtros = [];
  if (nombre.trim()) filtros.push(`nombre.ilike.%${nombre.trim()}%`);
  if (telefono.trim()) filtros.push(`telefono.eq.${telefono.trim()}`);
  if (filtros.length === 0) return [];

  const { data } = await supabase
    .from("clientes")
    .select("id, nombre, telefono, empresa")
    .or(filtros.join(","))
    .limit(5);

  return data ?? [];
}

export async function crearCliente(formData: FormData) {
  const supabase = await createClient();

  const payload = {
    nombre: String(formData.get("nombre") ?? ""),
    empresa: String(formData.get("empresa") ?? "") || null,
    telefono: String(formData.get("telefono") ?? "") || null,
    whatsapp: String(formData.get("whatsapp") ?? "") || null,
    email: String(formData.get("email") ?? "") || null,
    ruc: String(formData.get("ruc") ?? "") || null,
    tipo_cliente: String(formData.get("tipo_cliente") ?? "normal"),
    direccion: String(formData.get("direccion") ?? "") || null,
    notas: String(formData.get("notas") ?? "") || null,
  };

  const { error } = await supabase.from("clientes").insert(payload);
  if (error) {
    return { ok: false, mensaje: error.message };
  }

  revalidatePath("/clientes");
  return { ok: true };
}
