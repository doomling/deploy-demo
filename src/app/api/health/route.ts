import { connection, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";

/**
 * Chequeo post-deploy: qué versión está corriendo y si la base responde.
 * La clase de observabilidad parte de este endpoint.
 */
export async function GET() {
  await connection(); // siempre en el request, nunca en el build

  let db: "ok" | "error" = "error";

  try {
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from("items")
      .select("id", { count: "exact", head: true });
    if (!error) db = "ok";
  } catch {
    db = "error";
  }

  return NextResponse.json(
    {
      status: db === "ok" ? "ok" : "degraded",
      db,
      env: process.env.VERCEL_ENV ?? "local",
      commit: process.env.VERCEL_GIT_COMMIT_SHA ?? "dev",
    },
    { status: db === "ok" ? 200 : 503 },
  );
}
