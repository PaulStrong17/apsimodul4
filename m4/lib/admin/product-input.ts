const maximumStock = 2_147_483_647;

function parseStock(value: unknown) {
  if (
    (typeof value !== "string" && typeof value !== "number") ||
    (typeof value === "string" && !value.trim())
  ) {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 0 && parsed <= maximumStock
    ? parsed
    : null;
}

function parseProductFields(input: Record<string, unknown>) {
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const variation =
    typeof input.variation === "string" ? input.variation.trim() : "";
  const stock = parseStock(input.stock);
  const recipe = typeof input.recipe === "string" ? input.recipe.trim() : "";

  if (
    !name ||
    name.length > 100 ||
    !variation ||
    variation.length > 50 ||
    stock === null ||
    !recipe ||
    recipe.length > 255
  ) {
    return null;
  }

  return { name, variation, stock, recipe };
}

export function parseProductCreateInput(body: unknown) {
  if (!body || typeof body !== "object") return null;

  const input = body as Record<string, unknown>;
  const code = typeof input.code === "string" ? input.code.trim() : "";
  const fields = parseProductFields(input);

  if (!code || code.length > 10 || !fields) return null;

  return { code, ...fields };
}

export function parseProductUpdateInput(body: unknown) {
  if (!body || typeof body !== "object") return null;
  return parseProductFields(body as Record<string, unknown>);
}
