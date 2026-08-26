import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function FichaClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: cliente } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", id)
    .single();

  if (!cliente) notFound();

  const campos: [string, string | null][] = [
    ["Empresa", cliente.empresa],
    ["Teléfono", cliente.telefono],
    ["WhatsApp", cliente.whatsapp],
    ["Email", cliente.email],
    ["RUC", cliente.ruc],
    ["Tipo de cliente", cliente.tipo_cliente],
    ["Dirección", cliente.direccion],
    ["Notas", cliente.notas],
  ];

  return (
    <div>
      <h1 className="font-display font-bold text-xl mb-1">{cliente.nombre}</h1>
      <p className="text-ink-muted text-sm mb-6">
        Cliente desde {new Date(cliente.created_at).toLocaleDateString("es-PA")}
      </p>

      <div className="bg-surface border border-line rounded p-5 grid grid-cols-2 gap-4">
        {campos.map(([label, valor]) => (
          <div key={label}>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              {label}
            </p>
            <p className="text-sm mt-1">{valor || "—"}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-navy text-white rounded p-4">
          <p className="text-xs uppercase tracking-wide opacity-75">Total histórico comprado</p>
          <p className="font-mono text-xl font-semibold">
            B/.{Number(cliente.total_historico).toFixed(2)}
          </p>
        </div>
        <div className="bg-surface border border-line rounded p-4">
          <p className="text-xs uppercase tracking-wide text-ink-muted">Última compra</p>
          <p className="font-mono text-xl font-semibold">
            {cliente.ultima_compra
              ? new Date(cliente.ultima_compra).toLocaleDateString("es-PA")
              : "Sin compras aún"}
          </p>
        </div>
      </div>

      <p className="text-ink-muted text-sm mt-6">
        El historial de cotizaciones de este cliente aparecerá aquí en la Fase 2.
      </p>
    </div>
  );
}
