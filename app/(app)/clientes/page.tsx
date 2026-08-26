import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import NuevoClienteForm from "@/components/clientes/nuevo-cliente-form";

export default async function ClientesPage() {
  const supabase = await createClient();
  const { data: clientes } = await supabase
    .from("clientes")
    .select("id, nombre, empresa, telefono, tipo_cliente, ultima_compra, total_historico")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-xl">Clientes</h1>
      </div>

      <NuevoClienteForm />

      <div className="bg-surface border border-line rounded mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-ink-muted border-b border-line">
              <th className="p-3">Nombre</th>
              <th className="p-3">Empresa</th>
              <th className="p-3">Teléfono</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Última compra</th>
              <th className="p-3">Total histórico</th>
            </tr>
          </thead>
          <tbody>
            {(clientes ?? []).map((c) => (
              <tr key={c.id} className="border-b border-line last:border-0">
                <td className="p-3">
                  <Link href={`/clientes/${c.id}`} className="text-navy font-medium hover:underline">
                    {c.nombre}
                  </Link>
                </td>
                <td className="p-3">{c.empresa ?? "—"}</td>
                <td className="p-3 font-mono">{c.telefono ?? "—"}</td>
                <td className="p-3 capitalize">{c.tipo_cliente}</td>
                <td className="p-3 font-mono">
                  {c.ultima_compra ? new Date(c.ultima_compra).toLocaleDateString("es-PA") : "—"}
                </td>
                <td className="p-3 font-mono">B/.{Number(c.total_historico).toFixed(2)}</td>
              </tr>
            ))}
            {(!clientes || clientes.length === 0) && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-ink-muted">
                  Aún no hay clientes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
