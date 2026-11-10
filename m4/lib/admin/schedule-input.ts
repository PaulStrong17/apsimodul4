const scheduleStatuses = new Set([
  "Direncanakan",
  "Terjadwal",
  "Selesai",
  "Dibatalkan",
]);
const verificationStatuses = new Set([
  "Menunggu",
  "Terverifikasi",
  "Ditolak",
]);

function parseDate(value: unknown) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
    ? parsed
    : null;
}

function parseScheduleFields(input: Record<string, unknown>) {
  const rawDate =
    input.productionDate ?? input.tanggalProduksi ?? input.tanggal_produksi;
  const productionDate = parseDate(rawDate);

  const rawTarget =
    input.target ?? input.jumlahTarget ?? input.jumlah_target;
  const target =
    typeof rawTarget === "number" ? rawTarget : Number(rawTarget);

  const rawRequestId =
    input.requestId ?? input.permintaanProduk ?? input.id_permintaan;
  const requestId =
    typeof rawRequestId === "string" ? rawRequestId.trim() : "";

  const rawOwnerId = input.ownerId ?? input.owner ?? input.id_owner;
  const ownerId = typeof rawOwnerId === "string" ? rawOwnerId.trim() : "";

  const rawProductionEmp =
    input.productionEmployeeId ??
    input.karyawanProduksi ??
    input.id_karyawanproduksi;
  const productionEmployeeId =
    typeof rawProductionEmp === "string" ? rawProductionEmp.trim() : "";

  const rawQcEmp =
    input.qualityControlEmployeeId ?? input.karyawanQc ?? input.id_karyawanqc;
  const qualityControlEmployeeId =
    typeof rawQcEmp === "string" ? rawQcEmp.trim() : "";

  const rawStatus = input.status ?? input.statusJadwal ?? input.status_jadwal;
  const status =
    typeof rawStatus === "string" && rawStatus.trim()
      ? rawStatus.trim()
      : "Direncanakan";

  const rawVerificationStatus =
    input.verificationStatus ??
    input.statusVerifikasi ??
    input.status_verifikasi;
  const verificationStatus =
    typeof rawVerificationStatus === "string" && rawVerificationStatus.trim()
      ? rawVerificationStatus.trim()
      : "Menunggu";

  if (
    !productionDate ||
    !Number.isSafeInteger(target) ||
    target < 1 ||
    target > 2_147_483_647 ||
    !requestId ||
    requestId.length > 10 ||
    !ownerId ||
    ownerId.length > 10 ||
    !productionEmployeeId ||
    productionEmployeeId.length > 10 ||
    !qualityControlEmployeeId ||
    qualityControlEmployeeId.length > 10 ||
    !scheduleStatuses.has(status) ||
    !verificationStatuses.has(verificationStatus)
  ) {
    return null;
  }

  return {
    productionDate,
    target,
    requestId,
    ownerId,
    productionEmployeeId,
    qualityControlEmployeeId,
    status,
    verificationStatus,
  };
}

export function parseScheduleCreateInput(body: unknown) {
  if (!body || typeof body !== "object") return null;

  const input = body as Record<string, unknown>;
  const rawCode =
    input.code ?? input.kode ?? input.id_jadwalproduksi;
  const code =
    typeof rawCode === "string" ? rawCode.trim().toUpperCase() : "";
  const fields = parseScheduleFields(input);

  if (!code || code.length > 10 || !fields) return null;
  return { code, ...fields };
}

export function parseScheduleUpdateInput(body: unknown) {
  if (!body || typeof body !== "object") return null;
  return parseScheduleFields(body as Record<string, unknown>);
}
