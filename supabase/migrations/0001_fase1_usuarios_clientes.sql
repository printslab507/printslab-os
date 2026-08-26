-- Fase 1: Base estructural — usuarios (roles) y clientes
-- ---------------------------------------------------------

-- Roles del sistema. Se puede ampliar más adelante (ej: "gerencia")
-- sin romper nada, porque el resto del esquema referencia este enum.
create type public.rol_usuario as enum (
  'admin',
  'ventas',
  'diseno',
  'produccion',
  'instalacion',
  'finanzas'
);

-- Perfil de cada usuario, 1 a 1 con auth.users de Supabase.
-- auth.users guarda email/password; profiles guarda todo lo específico
-- del negocio (nombre, rol, si está activo).
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text not null,
  rol public.rol_usuario not null default 'ventas',
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Cualquier usuario autenticado puede ver la lista de perfiles
-- (para asignar vendedores, responsables, etc.)
create policy "profiles: lectura para autenticados"
  on public.profiles for select
  to authenticated
  using (true);

-- Solo un admin puede crear o modificar perfiles (dar de alta empleados,
-- cambiar roles). Esto evita que alguien se auto-asigne otro rol.
create policy "profiles: admin puede modificar"
  on public.profiles for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.rol = 'admin'
    )
  );

-- Clientes
-- ---------------------------------------------------------
create type public.tipo_cliente as enum ('normal', 'gremio', 'corporativo');

create table public.clientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  empresa text,
  telefono text,
  whatsapp text,
  email text,
  ruc text,
  tipo_cliente public.tipo_cliente not null default 'normal',
  direccion text,
  notas text,
  created_at timestamptz not null default now(),
  ultima_compra timestamptz,
  total_historico numeric not null default 0,
  creado_por uuid references public.profiles (id)
);

-- Evita duplicados exactos por teléfono o RUC cuando están presentes.
-- (La app además hace una búsqueda de similitud antes de guardar, ver
-- lib/clientes/verificar-duplicado.ts en la Fase 1b.)
create unique index clientes_telefono_unico
  on public.clientes (telefono)
  where telefono is not null and telefono <> '';

create unique index clientes_ruc_unico
  on public.clientes (ruc)
  where ruc is not null and ruc <> '';

alter table public.clientes enable row level security;

-- Cualquier usuario autenticado puede ver y crear clientes.
-- (Ventas, diseño, producción... todos necesitan consultar el cliente
-- en algún punto del flujo.)
create policy "clientes: lectura para autenticados"
  on public.clientes for select
  to authenticated
  using (true);

create policy "clientes: creación para autenticados"
  on public.clientes for insert
  to authenticated
  with check (true);

-- Solo admin y ventas pueden editar o eliminar clientes existentes.
create policy "clientes: edición admin y ventas"
  on public.clientes for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.rol in ('admin', 'ventas')
    )
  );

create policy "clientes: eliminación solo admin"
  on public.clientes for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.rol = 'admin'
    )
  );

-- Trigger: cuando se crea un usuario en auth.users, crear su profile
-- automáticamente con rol "ventas" por defecto (el admin lo ajusta después).
create function public.manejar_nuevo_usuario()
returns trigger as $$
begin
  insert into public.profiles (id, nombre, rol)
  values (new.id, coalesce(new.raw_user_meta_data->>'nombre', new.email), 'ventas');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.manejar_nuevo_usuario();
