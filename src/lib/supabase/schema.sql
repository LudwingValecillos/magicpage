-- ====================================================================
-- Magic — Supabase schema
-- Run in the Supabase SQL editor for your project.
-- ====================================================================

-- ---------- Categorías ----------
create table if not exists public.categorias (
  slug text primary key,
  name text not null,
  count integer default 0,
  icon text default '✦',
  color text default '#4DA8FF',
  created_at timestamptz default now()
);

-- ---------- Productos ----------
create table if not exists public.productos (
  slug text primary key,
  name text not null,
  category text not null,
  category_slug text not null references public.categorias(slug) on delete restrict,
  price numeric not null check (price >= 0),
  old_price numeric,
  rating integer default 5 check (rating between 0 and 5),
  badges text[] default '{}',
  icon text default '✦',
  accent text default '#4DA8FF',
  description text default '',
  details text[] default '{}',
  images text[] default '{}',
  active boolean default true,
  on_sale boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_productos_category on public.productos(category_slug);
create index if not exists idx_productos_active on public.productos(active);
create index if not exists idx_productos_on_sale on public.productos(on_sale);

-- ---------- Carrito (por usuario / sesión) ----------
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  session_id text,
  product_slug text not null references public.productos(slug) on delete cascade,
  qty integer not null check (qty > 0),
  created_at timestamptz default now(),
  unique nulls not distinct (user_id, session_id, product_slug)
);

-- ---------- Storage bucket para imágenes ----------
-- Crear bucket en Storage UI:
--   Name: product-images
--   Public: true
-- Política recomendada:
--   - SELECT: público
--   - INSERT/UPDATE/DELETE: solo admin

-- ---------- RLS ----------
alter table public.categorias enable row level security;
alter table public.productos enable row level security;
alter table public.cart_items enable row level security;

-- Lectura pública
create policy "categorias readable by all"
  on public.categorias for select using (true);

create policy "productos activos readable by all"
  on public.productos for select using (active = true);

-- Admin (full access — definí tu propia policy basada en rol)
-- Ejemplo asumiendo claim `is_admin` en JWT:
create policy "admin full access categorias"
  on public.categorias for all
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

create policy "admin full access productos"
  on public.productos for all
  using (auth.jwt() ->> 'role' = 'admin')
  with check (auth.jwt() ->> 'role' = 'admin');

-- Cart por usuario propio
create policy "user reads own cart"
  on public.cart_items for select
  using (auth.uid() = user_id);

create policy "user writes own cart"
  on public.cart_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------- Trigger updated_at ----------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_productos_updated on public.productos;
create trigger trg_productos_updated
  before update on public.productos
  for each row execute function public.set_updated_at();
