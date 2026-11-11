-- Tests de base de datos con pgTAP. Se corren con: supabase test db
begin;

create extension if not exists pgtap with schema extensions;

select plan(5);

select has_table('public', 'items', 'existe la tabla items');
select has_column('public', 'items', 'title', 'items tiene la columna title');

-- A partir de acá, como un visitante anónimo de la API.
set local role anon;

select lives_ok(
  $$ insert into public.items (title) values ('desde anon') $$,
  'anon puede agregar items'
);

select throws_ok(
  $$ insert into public.items (title) values ('') $$,
  '23514',
  null,
  'un título vacío viola el check'
);

select throws_ok(
  $$ delete from public.items $$,
  '42501',
  null,
  'anon no puede borrar items'
);

reset role;

select * from finish();
rollback;
