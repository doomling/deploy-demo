-- PASO 3 del demo: CONTRAER.
-- Solo cuando el paso 2 ya está en producción y nada lee title.
--   supabase migration new contract_items_title
--
-- Antes de este paso, el rollback de la app era seguro. Después, no:
-- por eso va en un deploy aparte, y no apurado.

-- Filas que haya escrito una versión vieja de la app entre los pasos 1 y 2.
update public.items set name = title where name is null;

alter table public.items
  alter column name set not null,
  drop column title;
