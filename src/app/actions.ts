"use server";

import { revalidatePath } from "next/cache";
import { parseTitle } from "@/lib/items";
import { createSupabaseClient } from "@/lib/supabase";

export async function addItem(formData: FormData) {
  const parsed = parseTitle(formData.get("title"));
  if (!parsed.ok) return;

  const supabase = createSupabaseClient();
  const { error } = await supabase.from("items").insert({ title: parsed.title });

  if (error) {
    throw new Error(`No se pudo guardar el item: ${error.message}`);
  }

  revalidatePath("/");
}
