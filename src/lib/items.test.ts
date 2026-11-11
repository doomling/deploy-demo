import { parseTitle, TITLE_MAX_LENGTH } from "./items";

describe("parseTitle", () => {
  it("acepta un título válido y le quita los espacios", () => {
    expect(parseTitle("  Comprar yerba  ")).toEqual({
      ok: true,
      title: "Comprar yerba",
    });
  });

  it("rechaza un título vacío", () => {
    expect(parseTitle("   ").ok).toBe(false);
  });

  it("rechaza valores que no son texto", () => {
    expect(parseTitle(null).ok).toBe(false);
  });

  it("rechaza un título demasiado largo", () => {
    expect(parseTitle("a".repeat(TITLE_MAX_LENGTH + 1)).ok).toBe(false);
  });
});
