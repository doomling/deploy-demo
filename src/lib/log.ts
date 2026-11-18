type Level = "info" | "warn" | "error";

/**
 * Una línea de log = un objeto JSON en una sola línea.
 * Vercel guarda todo lo que la función escribe en consola, y en JSON
 * cada campo se puede filtrar y contar.
 *
 * Nunca loguear claves, tokens ni el contenido que escribe el usuario.
 */
export function log(
  level: Level,
  msg: string,
  fields: Record<string, unknown> = {},
) {
  const line = JSON.stringify({
    level,
    msg,
    time: new Date().toISOString(),
    env: process.env.VERCEL_ENV ?? "local",
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "dev",
    ...fields,
  });

  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}
