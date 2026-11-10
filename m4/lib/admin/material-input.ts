const units = new Set(["kg", "gram", "liter", "pcs"]);
const maximumStock = 99_999_999.99;

function parseNonnegativeDecimal(value: unknown) {
  if (
    (typeof value !== "string" && typeof value !== "number") ||
    (typeof value === "string" && !value.trim())
  ) {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= maximumStock
    ? parsed
    : null;
}

export function parseMaterialCreateInput(body: unknown) {
  if (!body || typeof body !== "object") return null;

  const input = body as Record<string, unknown>;
  const code = typeof input.code === "string" ? input.code.trim() : "";
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const unit = typeof input.unit === "string" ? input.unit.trim() : "";
  const stock = parseNonnegativeDecimal(input.stock);
  const minimumStock = parseNonnegativeDecimal(input.minimumStock);

  if (
    !code ||
    code.length > 10 ||
    !name ||
    name.length > 100 ||
    !units.has(unit) ||
    stock === null ||
    minimumStock === null
  ) {
    return null;
  }

  return { code, name, unit, stock, minimumStock };
}

export function parseMaterialUpdateInput(body: unknown) {
  if (!body || typeof body !== "object") return null;

  const input = body as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const unit = typeof input.unit === "string" ? input.unit.trim() : "";
  const stock = parseNonnegativeDecimal(input.stock);
  const minimumStock = parseNonnegativeDecimal(input.minimumStock);

  if (
    !name ||
    name.length > 100 ||
    !units.has(unit) ||
    stock === null ||
    minimumStock === null
  ) {
    return null;
  }

  return { name, unit, stock, minimumStock };
}
