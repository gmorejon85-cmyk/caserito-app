-- =========================================================================
--  CASERITO — Script de base de datos para Supabase
--  Copia y pega TODO este archivo en Supabase > SQL Editor > New query,
--  y presiona "Run". Se puede ejecutar una sola vez.
-- =========================================================================

create extension if not exists pgcrypto;

-- -------------------------------------------------------------------------
-- 1. TABLAS
-- -------------------------------------------------------------------------

-- Perfil de cada usuario (cliente, comercio o admin). Se crea solo,
-- automáticamente, cada vez que alguien se registra (ver el trigger más abajo).
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text,
  celular text,
  tipo_usuario text not null default 'cliente' check (tipo_usuario in ('cliente','comercio','admin')),
  ciudad text,
  fecha_registro timestamptz not null default now()
);

-- Comercios (restaurantes, panaderías, supermercados, ferreterías, tiendas, etc.)
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade,
  nombre_comercio text not null,
  tipo_establecimiento text not null,
  celular text,
  direccion text,
  ciudad text,
  estado_aprobacion text not null default 'pendiente' check (estado_aprobacion in ('pendiente','aprobado','rechazado')),
  created_at timestamptz not null default now()
);

-- Excedentes publicados (comida o mercadería) por cada comercio
create table if not exists public.surplus_items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  nombre_producto text not null,
  categoria text not null,
  descripcion text,
  imagen_url text,
  cantidad int not null default 0,
  precio_original numeric(10,2) not null default 0,
  precio_oferta numeric(10,2) not null default 0,
  condiciones text,
  horario_retiro text,
  fecha_limite date,
  es_perecedero boolean not null default true,
  estado text not null default 'activo' check (estado in ('activo','pausado','agotado')),
  created_at timestamptz not null default now()
);

-- Pedidos hechos por los clientes
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.profiles(id) on delete cascade,
  producto_id uuid references public.surplus_items(id) on delete set null,
  business_id uuid not null references public.businesses(id) on delete cascade,
  estado text not null default 'pendiente' check (estado in ('pendiente','confirmado','retirado','cancelado')),
  monto numeric(10,2) not null default 0,
  codigo_retiro text,
  created_at timestamptz not null default now()
);

-- Pagos asociados a cada pedido (por ahora, simulados con QR)
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  metodo_pago text not null default 'QR',
  estado text not null default 'pendiente' check (estado in ('pendiente','pagado','fallido')),
  created_at timestamptz not null default now()
);

-- Productos favoritos de cada cliente
create table if not exists public.favorites (
  usuario_id uuid not null references public.profiles(id) on delete cascade,
  producto_id uuid not null references public.surplus_items(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (usuario_id, producto_id)
);

-- Notificaciones dentro de la app
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.profiles(id) on delete cascade,
  titulo text,
  mensaje text,
  leida boolean not null default false,
  created_at timestamptz not null default now()
);

-- (Las estadísticas de clientes y comercios se calculan al vuelo con
-- consultas sobre "orders", así que no hace falta una tabla aparte.)


-- -------------------------------------------------------------------------
-- 2. FUNCIÓN "¿ES ADMINISTRADOR?" (para los permisos de abajo)
-- -------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and tipo_usuario = 'admin'
  );
$$;


-- -------------------------------------------------------------------------
-- 3. CREAR PERFIL AUTOMÁTICO AL REGISTRARSE
-- -------------------------------------------------------------------------
-- Cada vez que alguien crea una cuenta (cliente o comercio), esto crea su
-- fila en "profiles" automáticamente. Por seguridad, el rol siempre nace
-- como "cliente"; el propio comercio se registra normal y un admin puede
-- cambiar el rol de cualquier usuario después (ver política de "profiles").
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nombre, celular, ciudad, tipo_usuario)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', ''),
    new.raw_user_meta_data->>'celular',
    new.raw_user_meta_data->>'ciudad',
    'cliente'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- -------------------------------------------------------------------------
-- 4. SEGURIDAD (Row Level Security) — quién puede ver y hacer qué
-- -------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.surplus_items enable row level security;
alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.favorites enable row level security;
alter table public.notifications enable row level security;

-- profiles: cada quien ve y edita su propio perfil; el admin ve y edita todos
-- (esto es lo que permite que el admin cambie el rol de un usuario nuevo).
create policy "ver mi perfil o si soy admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "el admin puede actualizar cualquier perfil" on public.profiles
  for update using (id = auth.uid() or public.is_admin());

-- businesses: cualquiera puede ver los comercios aprobados; el dueño ve el
-- suyo aunque esté pendiente; el admin ve y aprueba/rechaza todos.
create policy "ver comercios aprobados, el propio, o si soy admin" on public.businesses
  for select using (estado_aprobacion = 'aprobado' or owner_id = auth.uid() or public.is_admin());
create policy "un usuario registra su propio comercio" on public.businesses
  for insert with check (owner_id = auth.uid());
create policy "el dueño o el admin actualizan el comercio" on public.businesses
  for update using (owner_id = auth.uid() or public.is_admin());

-- surplus_items: cualquiera ve los productos activos de comercios aprobados;
-- el dueño del comercio administra los suyos; el admin administra todos.
create policy "ver productos activos de comercios aprobados" on public.surplus_items
  for select using (
    (estado = 'activo' and exists (select 1 from public.businesses b where b.id = business_id and b.estado_aprobacion = 'aprobado'))
    or exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
    or public.is_admin()
  );
create policy "el comercio publica sus productos" on public.surplus_items
  for insert with check (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid()));
create policy "el comercio o el admin editan el producto" on public.surplus_items
  for update using (
    exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
    or public.is_admin()
  );
create policy "el comercio o el admin eliminan el producto" on public.surplus_items
  for delete using (
    exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
    or public.is_admin()
  );

-- orders: el cliente ve y crea sus propios pedidos; el comercio ve y
-- actualiza los pedidos de su negocio; el admin ve todo.
create policy "el cliente ve sus pedidos, el comercio los suyos, o admin" on public.orders
  for select using (
    usuario_id = auth.uid()
    or exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
    or public.is_admin()
  );
create policy "el cliente crea su pedido" on public.orders
  for insert with check (usuario_id = auth.uid());
create policy "el cliente o el comercio actualizan el pedido" on public.orders
  for update using (
    usuario_id = auth.uid()
    or exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = auth.uid())
    or public.is_admin()
  );

-- payments: visibles para quien es dueño del pedido, el comercio o el admin
create policy "ver pagos de mis pedidos o si soy admin" on public.payments
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.usuario_id = auth.uid())
    or exists (select 1 from public.orders o join public.businesses b on b.id = o.business_id where o.id = order_id and b.owner_id = auth.uid())
    or public.is_admin()
  );
create policy "registrar el pago de mi propio pedido" on public.payments
  for insert with check (exists (select 1 from public.orders o where o.id = order_id and o.usuario_id = auth.uid()));

-- favorites: cada cliente administra únicamente sus propios favoritos
create policy "administrar mis propios favoritos" on public.favorites
  for all using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());

-- notifications: cada quien ve solo sus notificaciones
create policy "ver mis notificaciones" on public.notifications
  for select using (usuario_id = auth.uid());


-- -------------------------------------------------------------------------
-- 5. PERMISOS PARA LAS FOTOS (Storage)
-- -------------------------------------------------------------------------
-- Esto deja listos los permisos para los dos buckets "productos" y "logos"
-- que vas a crear desde el panel de Supabase (Storage > New bucket).
-- No importa si los creas antes o después de correr este script.
drop policy if exists "lectura publica de fotos caserito" on storage.objects;
create policy "lectura publica de fotos caserito" on storage.objects
  for select using (bucket_id in ('productos','logos'));

drop policy if exists "usuarios registrados suben fotos caserito" on storage.objects;
create policy "usuarios registrados suben fotos caserito" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('productos','logos'));

drop policy if exists "usuarios registrados actualizan sus fotos caserito" on storage.objects;
create policy "usuarios registrados actualizan sus fotos caserito" on storage.objects
  for update to authenticated
  using (bucket_id in ('productos','logos'));

drop policy if exists "usuarios registrados borran sus fotos caserito" on storage.objects;
create policy "usuarios registrados borran sus fotos caserito" on storage.objects
  for delete to authenticated
  using (bucket_id in ('productos','logos'));


-- =========================================================================
--  LISTO. Con esto ya quedaron creadas todas las tablas, la seguridad y el
--  registro automático de perfiles. El siguiente paso (crear tu usuario
--  administrador) se hace desde Authentication > Users, como se explica
--  en las instrucciones — no hace falta más SQL para eso.
-- =========================================================================
