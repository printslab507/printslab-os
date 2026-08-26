export type Rol =
  | "admin"
  | "ventas"
  | "diseno"
  | "produccion"
  | "instalacion"
  | "finanzas";

// Qué secciones del menú ve cada rol. "admin" siempre ve todo.
// Se amplía agregando una clave nueva aquí — no hace falta tocar
// componentes ni la base de datos para dar de alta un permiso nuevo.
export const MENU_POR_ROL: Record<Rol, string[]> = {
  admin: [
    "dashboard",
    "clientes",
    "cotizador",
    "cotizaciones",
    "crm",
    "produccion",
    "facturacion",
    "finanzas",
    "analitica",
    "inventario",
    "configuracion",
  ],
  ventas: ["dashboard", "clientes", "cotizador", "cotizaciones", "crm"],
  diseno: ["dashboard", "produccion"],
  produccion: ["dashboard", "produccion", "inventario"],
  instalacion: ["dashboard", "produccion"],
  finanzas: ["dashboard", "facturacion", "finanzas", "analitica"],
};

export function puedeVer(rol: Rol, seccion: string): boolean {
  return MENU_POR_ROL[rol]?.includes(seccion) ?? false;
}
