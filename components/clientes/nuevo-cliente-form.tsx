"use client";

import { useState, useTransition } from "react";
import {
  buscarPosiblesDuplicados,
  crearCliente,
  type ClienteDuplicado,
} from "@/lib/clientes/acciones";

const CAMPOS: { name: string; label: string; type?: string }[] = [
  { name: "nombre", label: "Nombre" },
  { name: "empresa", label: "Empresa" },
  { name: "telefono", label: "Teléfono" },
  { name: "whatsapp", label: "WhatsApp" },
  { name: "email", label: "Email", type: "email" },
  { name: "ruc", label: "RUC / identificación" },
  { name: "direccion", label: "Dirección" },
];

export default function NuevoClienteForm() {
  const [abierto, setAbierto] = useState(false);
  const [duplicados, setDuplicados] = useState<ClienteDuplicado[]>([]);
  const [pendiente, iniciarTransicion] = useTransition();
  const [mensaje, setMensaje] = useState<string | null>(null);

  async function revisarDuplicados(form: HTMLFormElement) {
    const nombre = (form.elements.namedItem("nombre") as HTMLInputElement)?.value ?? "";
    const telefono = (form.elements.namedItem("telefono") as HTMLInputElement)?.value ?? "";
    if (!nombre && !telefono) return;
    const encontrados = await buscarPosiblesDuplicados(nombre, telefono);
    setDuplicados(encontrados);
  }

  function manejarSubmit(formData: FormData) {
    iniciarTransicion(async () => {
      const resultado = await crearCliente(formData);
      if (resultado.ok) {
        setMensaje("Cliente guardado.");
        setDuplicados([]);
        setAbierto(false);
      } else {
        setMensaje(resultado.mensaje ?? "No se pudo guardar el cliente.");
      }
    });
  }

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        className="bg-clay text-white rounded px-4 py-2 text-sm font-semibold"
      >
        + Nuevo cliente
      </button>
    );
  }

  return (
    <form
      action={manejarSubmit}
      onBlur={(e) => revisarDuplicados(e.currentTarget)}
      className="bg-surface border border-line rounded p-5"
    >
      <div className="grid grid-cols-2 gap-4">
        {CAMPOS.map((c) => (
          <div key={c.name}>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink-muted mb-1">
              {c.label}
            </label>
            <input
              name={c.name}
              type={c.type ?? "text"}
              className="w-full border border-line rounded px-3 py-2 text-sm"
            />
          </div>
        ))}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-ink-muted mb-1">
            Tipo de cliente
          </label>
          <select name="tipo_cliente" className="w-full border border-line rounded px-3 py-2 text-sm">
            <option value="normal">Normal</option>
            <option value="gremio">Gremio</option>
            <option value="corporativo">Corporativo</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-xs font-semibold uppercase tracking-wide text-ink-muted mb-1">
          Notas
        </label>
        <textarea name="notas" rows={2} className="w-full border border-line rounded px-3 py-2 text-sm" />
      </div>

      {duplicados.length > 0 && (
        <div className="mt-4 bg-warn-bg border border-warn rounded p-3 text-sm">
          <p className="font-semibold text-warn mb-1">
            Ya existen clientes parecidos — revisa antes de guardar uno nuevo:
          </p>
          <ul className="list-disc pl-5">
            {duplicados.map((d) => (
              <li key={d.id}>
                {d.nombre} {d.empresa ? `— ${d.empresa}` : ""} {d.telefono ? `(${d.telefono})` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      {mensaje && <p className="text-sm mt-3">{mensaje}</p>}

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          disabled={pendiente}
          className="bg-clay text-white rounded px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          {pendiente ? "Guardando..." : "Guardar cliente"}
        </button>
        <button
          type="button"
          onClick={() => setAbierto(false)}
          className="border border-line rounded px-4 py-2 text-sm"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
