-- Tabla inicial de la app de ejemplo.
create table public.items (
  id bigint generated always as identity primary key,
  title text not null check (char_length(title) between 1 and 80),
  created_at timestamptz not null default now()
);

-- RLS es parte del esquema: viaja en la migración, igual que la tabla.
alter table public.items enable row level security;

-- Permisos mínimos: la API solo puede leer y agregar.
revoke all on public.items from anon, authenticated;
grant select, insert on public.items to anon, authenticated;

create policy "Cualquiera puede leer items"
  on public.items for select
  to anon, authenticated
  using (true);

create policy "Cualquiera puede agregar items"
  on public.items for insert
  to anon, authenticated
  with check (true);

-- No hay políticas de update ni delete: nadie puede modificar ni borrar
-- desde la API.
