export const TITLE_MAX_LENGTH = 80;

export type ParsedTitle =
  | { ok: true; title: string }
  | { ok: false; error: string };

/** Valida el título que llega del formulario antes de tocar la base. */
export function parseTitle(input: unknown): ParsedTitle {
  if (typeof input !== "string") {
    return { ok: false, error: "El título es obligatorio." };
  }

  const title = input.trim();

  if (title.length === 0) {
    return { ok: false, error: "El título es obligatorio." };
  }
  if (title.length > TITLE_MAX_LENGTH) {
    return {
      ok: false,
      error: `El título no puede superar los ${TITLE_MAX_LENGTH} caracteres.`,
    };
  }

  return { ok: true, title };
}
