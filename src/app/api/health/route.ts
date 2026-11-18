"use server";

import { revalidatePath } from "next/cache";
import { parseTitle } from "@/lib/items";
import { log } from "@/lib/log";
import { createSupabaseClient } from "@/lib/supabase";

export async function addItem(formData: FormData) {
  const parsed = parseTitle(formData.get("title"));
  if (!parsed.ok) {
    log("warn", "item_rejected", { reason: parsed.error });
    return;
  }

  const started = Date.now();
  const supabase = createSupabaseClient();
  const { error } = await supabase
    .from("items")
    .insert({ title: parsed.title });
  const ms = Date.now() - started;

  if (error) {
    // Se registra el código y el largo del título, no el título en sí.
    log("error", "item_insert_failed", {
      code: error.code,
      error: error.message,
      titleLength: parsed.title.length,
      ms,
    });
    throw new Error("No se pudo guardar el item");
  }

  log("info", "item_inserted", { ms });
  revalidatePath("/");
}
