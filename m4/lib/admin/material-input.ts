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

function parseDate(value: unknown): Date | null {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  const date = new Date(`${trimmed}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export type ParsedMaterialCreateInput = {
  code: string;
  name: string;
  unit: string;
  stock: number;
  minimumStock: number;
  recipeId?: string;
  supplierId?: string;
  receiptDate?: Date;
  receiptAmount?: number;
  receiptNote?: string;
};

export type ParsedMaterialUpdateInput = {
  name: string;
  unit: string;
  stock: number;
  minimumStock: number;
  recipeId?: string;
  supplierId?: string;
  receiptDate?: Date;
  receiptAmount?: number;
  receiptNote?: string;
};

export function parseMaterialCreateInput(body: unknown): ParsedMaterialCreateInput | null {
  if (!body || typeof body !== "object") return null;

  const input = body as Record<string, unknown>;
  const code = typeof input.code === "string" ? input.code.trim().toUpperCase() : "";
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

  const recipeId =
    typeof input.recipeId === "string" && input.recipeId.trim()
      ? input.recipeId.trim()
      : undefined;

  const supplierId =
    typeof input.supplierId === "string" && input.supplierId.trim()
      ? input.supplierId.trim()
      : undefined;

  const receiptDate = parseDate(input.receiptDate ?? input.tanggalTerima);

  const receiptAmount =
    parseNonnegativeDecimal(input.receiptAmount ?? input.jumlahDiterima) ?? stock;

  const receiptNote =
    typeof input.receiptNote === "string" && input.receiptNote.trim()
      ? input.receiptNote.trim()
      : "Penerimaan bahan baku";

  return {
    code,
    name,
    unit,
    stock,
    minimumStock,
    recipeId,
    supplierId,
    receiptDate: receiptDate ?? undefined,
    receiptAmount,
    receiptNote,
  };
}

export function parseMaterialUpdateInput(body: unknown): ParsedMaterialUpdateInput | null {
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

  const recipeId =
    typeof input.recipeId === "string" && input.recipeId.trim()
      ? input.recipeId.trim()
      : undefined;

  const supplierId =
    typeof input.supplierId === "string" && input.supplierId.trim()
      ? input.supplierId.trim()
      : undefined;

  const receiptDate = parseDate(input.receiptDate ?? input.tanggalTerima);

  const receiptAmount =
    parseNonnegativeDecimal(input.receiptAmount ?? input.jumlahDiterima) ?? stock;

  const receiptNote =
    typeof input.receiptNote === "string" && input.receiptNote.trim()
      ? input.receiptNote.trim()
      : undefined;

  return {
    name,
    unit,
    stock,
    minimumStock,
    recipeId,
    supplierId,
    receiptDate: receiptDate ?? undefined,
    receiptAmount,
    receiptNote,
  };
}
