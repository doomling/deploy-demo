-- PASO 1 del demo: EXPANDIR.
-- Crear la migración con:
--   supabase migration new expand_items_name
-- y pegar este contenido en el archivo nuevo.
--
-- La app vieja sigue funcionando: todavía lee y escribe title.

alter table public.items
  add column name text check (char_length(name) between 1 and 80);

update public.items set name = title where name is null;
