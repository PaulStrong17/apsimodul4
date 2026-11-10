const qcInspectionStatuses = new Set([
  "Direncanakan",
  "Terjadwal",
  "Selesai",
  "Dibatalkan",
]);

const qcVerificationStatuses = new Set([
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

function parseQcScheduleFields(input: Record<string, unknown>) {
  const rawDate =
    input.inspectionDate ??
    input.tanggalPemeriksaan ??
    input.tanggal_pemeriksaan;
  const inspectionDate = parseDate(rawDate);

  const rawType =
    input.type ?? input.jenisPemeriksaan ?? input.jenis_pemeriksaan;
  const type = typeof rawType === "string" ? rawType.trim() : "";

  const rawProductionScheduleId =
    input.productionScheduleId ??
    input.jadwalProduksi ??
    input.productionCode ??
    input.id_jadwalproduksi;
  const productionScheduleId =
    typeof rawProductionScheduleId === "string"
      ? rawProductionScheduleId.trim()
      : "";

  const rawQcEmp =
    input.qualityControlEmployeeId ?? input.karyawanQc ?? input.id_karyawanqc;
  const qualityControlEmployeeId =
    typeof rawQcEmp === "string" ? rawQcEmp.trim() : "";

  const rawProdEmp =
    input.productionEmployeeId ??
    input.karyawanProduksi ??
    input.id_karyawanproduksi;
  const productionEmployeeId =
    typeof rawProdEmp === "string" ? rawProdEmp.trim() : "";

  const rawOwnerId = input.ownerId ?? input.owner ?? input.id_owner;
  const ownerId = typeof rawOwnerId === "string" ? rawOwnerId.trim() : "";

  const rawStatus =
    input.status ?? input.statusPemeriksaan ?? input.status_pemeriksaan;
  const status =
    typeof rawStatus === "string" && rawStatus.trim()
      ? rawStatus.trim()
      : "Terjadwal";

  const rawVerificationStatus =
    input.verificationStatus ??
    input.statusVerifikasi ??
    input.status_verifikasi;
  const verificationStatus =
    typeof rawVerificationStatus === "string" && rawVerificationStatus.trim()
      ? rawVerificationStatus.trim()
      : "Menunggu";

  if (
    !inspectionDate ||
    !type ||
    type.length > 255 ||
    !productionScheduleId ||
    productionScheduleId.length > 10 ||
    !qualityControlEmployeeId ||
    qualityControlEmployeeId.length > 10 ||
    !productionEmployeeId ||
    productionEmployeeId.length > 10 ||
    !ownerId ||
    ownerId.length > 10 ||
    !qcInspectionStatuses.has(status) ||
    !qcVerificationStatuses.has(verificationStatus)
  ) {
    return null;
  }

  return {
    inspectionDate,
    type,
    productionScheduleId,
    qualityControlEmployeeId,
    productionEmployeeId,
    ownerId,
    status,
    verificationStatus,
  };
}

export function parseQcScheduleCreateInput(body: unknown) {
  if (!body || typeof body !== "object") return null;

  const input = body as Record<string, unknown>;
  const rawCode =
    input.code ?? input.kode ?? input.id_jadwalqc;
  const code =
    typeof rawCode === "string" ? rawCode.trim().toUpperCase() : "";
  const fields = parseQcScheduleFields(input);

  if (!code || code.length > 10 || !fields) return null;
  return { code, ...fields };
}

export function parseQcScheduleUpdateInput(body: unknown) {
  if (!body || typeof body !== "object") return null;
  return parseQcScheduleFields(body as Record<string, unknown>);
}
