# Prints Lab OS — Fase 1 (usuarios y clientes)

## Qué incluye esta entrega
- Estructura base de Next.js + TypeScript + Tailwind (paleta y tipografía del prototipo).
- Login con Supabase Auth.
- Tabla `profiles` con roles (admin, ventas, diseno, produccion, instalacion, finanzas) y políticas de permisos (RLS).
- Módulo de **Clientes**: listado, ficha individual, formulario de creación con aviso de posibles duplicados.
- Sidebar que muestra solo las secciones permitidas según el rol del usuario.

## Cómo arrancarlo

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Conectar tu proyecto de Supabase**
   - Copia `.env.example` a `.env.local`.
   - Pega tu `Project URL` y `anon public key` (Project Settings → API en supabase.com).

3. **Aplicar la migración de base de datos**
   - En el panel de Supabase, ve a **SQL Editor** → pega el contenido de
     `supabase/migrations/0001_fase1_usuarios_clientes.sql` → ejecútalo.
   - Esto crea las tablas `profiles` y `clientes`, sus roles y sus permisos.

4. **Crear tu primer usuario admin**
   - En Supabase, ve a **Authentication → Users → Add user** y crea tu cuenta.
   - Se creará automáticamente un `profile` con rol `ventas`.
   - En **Table Editor → profiles**, cambia manualmente ese registro a `rol = admin`.
     (Solo la primera vez — después ya puedes crear más usuarios desde la app.)

5. **Correr en local**
   ```bash
   npm run dev
   ```
   Abre `http://localhost:3000/login` y entra con el usuario que creaste.

6. **Publicar en Vercel**
   - Sube este código a tu repositorio de GitHub.
   - En Vercel: "Import Project" → selecciona el repositorio.
   - Agrega las mismas variables de `.env.local` en Vercel (Settings → Environment Variables).

## Qué sigue (Fase 2)
Migrar el cotizador del prototipo HTML a este proyecto, leyendo el catálogo
desde una tabla `productos` en lugar de un array embebido en el código.
