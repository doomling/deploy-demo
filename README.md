# Deploy demo

App de ejemplo para la clase de deploy y CI/CD con Supabase + Vercel.
Una lista de items: una tabla, una página, un formulario y un endpoint de salud.
Es chica a propósito, para que toda la atención vaya al pipeline.

## Qué hay adentro

| Ruta | Para qué |
| --- | --- |
| `src/app/page.tsx` | Lista los items y muestra entorno y commit en el pie |
| `src/app/actions.ts` | Server Action que agrega un item |
| `src/app/api/health/route.ts` | Commit, entorno y si la base responde |
| `src/lib/supabase.ts` | La única conexión entre la app y Supabase |
| `src/lib/items.ts` + test | Validación del título, con tests de Jest |
| `src/types/database.ts` | Tipos generados desde el esquema |
| `supabase/migrations/` | El esquema, como código |
| `supabase/seed.sql` | Datos para local y para ramas de preview |
| `supabase/tests/` | Tests de base de datos (pgTAP), RLS incluido |
| `.github/workflows/ci.yml` | Verificación en cada pull request |
| `.github/workflows/deploy-db.yml` | Migraciones a producción al mergear (ruta B) |
| `demo/` | SQL preparado para el demo de expandir y contraer |

## Puesta en marcha local

Requisitos: Node 22, Docker y la [CLI de Supabase](https://supabase.com/docs/guides/local-development/cli/getting-started).

```bash
npm install
supabase start                 # levanta Postgres y la API en Docker
supabase db reset              # aplica migraciones y seed.sql
cp .env.example .env.local     # completar con los valores de: supabase status
npm run dev
```

**Primer paso obligatorio:** regenerar los tipos y commitearlos. La versión
incluida está escrita a mano, y el check de CI compara contra la generada.

```bash
supabase gen types typescript --local > src/types/database.ts
```

## Comandos

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm test            # Jest
supabase db lint    # errores en el SQL
supabase test db    # tests pgTAP
```

## Conexión con Vercel y Supabase

1. Subir el repo a GitHub e importarlo en Vercel.
2. Crear el proyecto de Supabase de producción y correr `supabase link` y `supabase db push`.
3. Definir en Vercel `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
   **con valores distintos para Production y Preview**. La integración de Supabase
   en el Marketplace de Vercel las sincroniza sola.
4. Ruta A (Branching): conectar la integración de GitHub en Supabase y borrar `deploy-db.yml`.
   Ruta B (dos proyectos): crear el proyecto de staging, apuntar ahí las variables de Preview
   y cargar en GitHub los secretos `SUPABASE_ACCESS_TOKEN`, `PRODUCTION_DB_PASSWORD` y
   `PRODUCTION_PROJECT_ID` dentro del environment `production`.
5. Proteger `main` y marcar como requeridos los jobs `app` y `db`.

Para comprobar a qué base le habla un deployment: abrir `/api/health` y mirar `env` y `commit`.

## Guion del demo: renombrar `title` a `name`

Tres pull requests, uno por paso.

### PR 1: expandir

```bash
supabase migration new expand_items_name
# pegar demo/01_expand.sql en el archivo creado
supabase db reset
supabase gen types typescript --local > src/types/database.ts
```

La app no cambia. La versión vieja sigue funcionando con el esquema nuevo.

### PR 2: migrar la app

En `src/app/actions.ts`, escribir en las dos columnas:

```ts
.insert({ title: parsed.title, name: parsed.title })
```

En `src/app/page.tsx`, leer `name` con `title` como respaldo:

```tsx
.select("id, title, name, created_at")
// ...
<li key={item.id}>{item.name ?? item.title}</li>
```

Si este deploy sale mal, el rollback en Vercel es seguro: la versión anterior
solo usa `title`, que sigue existiendo.

### PR 3: contraer

```bash
supabase migration new contract_items_title
# pegar demo/03_contract.sql
supabase db reset
supabase gen types typescript --local > src/types/database.ts
```

En el mismo PR, quitar `title` del código: el insert queda `{ name: parsed.title }`
y la página lee solo `name`. Hasta que la app nueva termine de desplegarse, la
versión del PR 2 sigue funcionando para leer; ese es el orden que hace seguro el paso.

### El bug para el rollback

Un PR aparte que rompa algo visible sin tocar la base, por ejemplo invertir el
orden de la lista (`ascending: true`) o cambiar el texto del botón. Mergear,
mostrarlo en producción y hacer Instant Rollback desde Vercel.
