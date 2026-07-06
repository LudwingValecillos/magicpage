-- Tabla de configuración de la tienda (clave-valor).
-- Ejecutar en el SQL Editor de Supabase (proyecto zwjzdwcmtdyjlozxvieq).
--
-- Guarda el número de WhatsApp editable desde el panel admin. Lectura pública
-- (RLS permite SELECT a todos); la escritura pasa por /api/admin/settings con
-- el service_role, que bypassa RLS.

create table if not exists public.settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

alter table public.settings enable row level security;

drop policy if exists "settings_public_read" on public.settings;
create policy "settings_public_read" on public.settings
  for select using (true);

-- Semilla: dejar el número actual del negocio.
-- Reemplazá el value por el número real en formato wa.me (ej. 5491123456789),
-- o dejalo vacío y cargalo desde el panel admin (Configuración).
insert into public.settings (key, value)
values ('whatsapp_number', '')
on conflict (key) do nothing;
