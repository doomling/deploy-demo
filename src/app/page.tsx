import { Suspense } from "react";
import { connection } from "next/server";
import { addItem } from "./actions";
import { TITLE_MAX_LENGTH } from "@/lib/items";
import { createSupabaseClient } from "@/lib/supabase";
import styles from "./page.module.css";

// La lista se lee en cada request: así cada deployment muestra lo que hay
// en SU base de datos, no lo que había al momento del build.
async function ItemList() {
  await connection();

  const supabase = createSupabaseClient();
  const { data: items, error } = await supabase
    .from("items")
    .select("id, title, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <p className={styles.error}>
        No se pudieron cargar los items: {error.message}
      </p>
    );
  }

  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  );
}

export default function Home() {
  const env = process.env.VERCEL_ENV ?? "local";
  const commit = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "dev";

  return (
    <main className={styles.main}>
      <h1>Mi lista de items pero probando CI</h1>

      <form action={addItem} className={styles.form}>
        <input
          name="title"
          placeholder="Nuevo item"
          maxLength={TITLE_MAX_LENGTH}
          required
          aria-label="Título del item"
        />
        <button type="submit">Agregar</button>
      </form>

      <Suspense fallback={<p>Cargando items…</p>}>
        <ItemList />
      </Suspense>

      <footer className={styles.footer}>
        entorno: {env} · commit: {commit}
      </footer>
    </main>
  );
}
