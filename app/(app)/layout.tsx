import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MENU_POR_ROL, type Rol } from "@/lib/permisos/matriz";

const ETIQUETAS: Record<string, string> = {
  dashboard: "Panel",
  clientes: "Clientes",
  cotizador: "Cotizador",
  cotizaciones: "Cotizaciones",
  crm: "CRM",
  produccion: "Producción",
  facturacion: "Facturación",
  finanzas: "Finanzas",
  analitica: "Analítica",
  inventario: "Inventario",
  configuracion: "Configuración",
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nombre, rol")
    .eq("id", user.id)
    .single();

  const rol = (profile?.rol ?? "ventas") as Rol;
  const secciones = MENU_POR_ROL[rol] ?? [];

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 border-r border-line bg-surface p-5 flex flex-col">
        <h1 className="font-display font-bold text-lg mb-1">Prints Lab OS</h1>
        <p className="text-xs text-ink-muted mb-6">{profile?.nombre ?? user.email}</p>
        <nav className="flex flex-col gap-1">
          {secciones.map((s) => (
            <a
              key={s}
              href={`/${s}`}
              className="text-sm px-3 py-2 rounded hover:bg-paper text-ink"
            >
              {ETIQUETAS[s] ?? s}
            </a>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
