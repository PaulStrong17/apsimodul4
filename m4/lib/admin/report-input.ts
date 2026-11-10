import { parseReportId } from "./reports";

export type ParsedReportInput = {
  id: number;
  periodStart: Date;
  periodEnd: Date;
  totalProduction: number;
  inspectionCount: number;
  rejectRate: number;
  targetRejectRate: number;
  achievement: "Tercapai" | "Belum tercapai";
  ownerId: string;
  reportType?: string;
  correctiveAction?: string;
};

function parseDate(value: unknown): Date | null {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  const date = new Date(`${trimmed}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseDecimal(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) && value >= 0 ? value : null;
  }
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const num = Number(normalized);
  return Number.isFinite(num) && num >= 0 ? num : null;
}

function parseInteger(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isInteger(value) && value >= 0 ? value : null;
  }
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const num = parseInt(trimmed, 10);
  return Number.isFinite(num) && num >= 0 ? num : null;
}

function parseAchievement(value: unknown): "Tercapai" | "Belum tercapai" | null {
  if (typeof value !== "string") return null;
  const lower = value.trim().toLowerCase();
  if (lower === "tercapai") return "Tercapai";
  if (
    lower === "belum tercapai" ||
    lower === "tidak tercapai" ||
    lower === "belum_tercapai"
  ) {
    return "Belum tercapai";
  }
  return null;
}

export function parseReportCreateInput(body: unknown): ParsedReportInput | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;

  const rawCode = data.code ?? data.kode ?? data.id_laporan ?? data.id;
  const id = parseReportId(String(rawCode ?? ""));
  if (id === null) return null;

  const rawStart = data.periodStart ?? data.periode_awal ?? data.periodeAwal;
  const periodStart = parseDate(rawStart);
  if (!periodStart) return null;

  const rawEnd = data.periodEnd ?? data.periode_akhir ?? data.periodeAkhir;
  const periodEnd = parseDate(rawEnd);
  if (!periodEnd) return null;

  if (periodEnd.getTime() < periodStart.getTime()) {
    return null;
  }

  const rawTotal = data.totalProduction ?? data.total_produksi ?? data.totalProduksi;
  const totalProduction = parseInteger(rawTotal);
  if (totalProduction === null) return null;

  const rawCount = data.inspectionCount ?? data.jumlah_pemeriksaan ?? data.jumlahPemeriksaan;
  const inspectionCount = parseInteger(rawCount);
  if (inspectionCount === null) return null;

  const rawReject = data.rejectRate ?? data.reject_rate ?? data.rejectRate;
  const rejectRate = parseDecimal(rawReject);
  if (rejectRate === null) return null;

  const rawTarget = data.targetRejectRate ?? data.target_reject_rate ?? data.targetRejectRate;
  const targetRejectRate = parseDecimal(rawTarget);
  if (targetRejectRate === null) return null;

  const rawAchievement = data.achievement ?? data.status_pencapaian ?? data.statusPencapaian;
  let achievement = parseAchievement(rawAchievement);
  if (!achievement) {
    achievement = rejectRate <= targetRejectRate ? "Tercapai" : "Belum tercapai";
  }

  const rawOwner = data.ownerId ?? data.id_owner ?? data.owner;
  if (!rawOwner || typeof rawOwner !== "string") return null;
  const ownerId = rawOwner.trim();
  if (!ownerId) return null;

  const reportType = typeof data.reportType === "string" ? data.reportType.trim() : undefined;
  const correctiveAction = typeof data.correctiveAction === "string" ? data.correctiveAction.trim() : undefined;

  return {
    id,
    periodStart,
    periodEnd,
    totalProduction,
    inspectionCount,
    rejectRate,
    targetRejectRate,
    achievement,
    ownerId,
    reportType,
    correctiveAction,
  };
}

export function parseReportUpdateInput(body: unknown): Omit<ParsedReportInput, "id"> | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;

  const rawStart = data.periodStart ?? data.periode_awal ?? data.periodeAwal;
  const periodStart = parseDate(rawStart);
  if (!periodStart) return null;

  const rawEnd = data.periodEnd ?? data.periode_akhir ?? data.periodeAkhir;
  const periodEnd = parseDate(rawEnd);
  if (!periodEnd) return null;

  if (periodEnd.getTime() < periodStart.getTime()) {
    return null;
  }

  const rawTotal = data.totalProduction ?? data.total_produksi ?? data.totalProduksi;
  const totalProduction = parseInteger(rawTotal);
  if (totalProduction === null) return null;

  const rawCount = data.inspectionCount ?? data.jumlah_pemeriksaan ?? data.jumlahPemeriksaan;
  const inspectionCount = parseInteger(rawCount);
  if (inspectionCount === null) return null;

  const rawReject = data.rejectRate ?? data.reject_rate ?? data.rejectRate;
  const rejectRate = parseDecimal(rawReject);
  if (rejectRate === null) return null;

  const rawTarget = data.targetRejectRate ?? data.target_reject_rate ?? data.targetRejectRate;
  const targetRejectRate = parseDecimal(rawTarget);
  if (targetRejectRate === null) return null;

  const rawAchievement = data.achievement ?? data.status_pencapaian ?? data.statusPencapaian;
  let achievement = parseAchievement(rawAchievement);
  if (!achievement) {
    achievement = rejectRate <= targetRejectRate ? "Tercapai" : "Belum tercapai";
  }

  const rawOwner = data.ownerId ?? data.id_owner ?? data.owner;
  if (!rawOwner || typeof rawOwner !== "string") return null;
  const ownerId = rawOwner.trim();
  if (!ownerId) return null;

  const reportType = typeof data.reportType === "string" ? data.reportType.trim() : undefined;
  const correctiveAction = typeof data.correctiveAction === "string" ? data.correctiveAction.trim() : undefined;

  return {
    periodStart,
    periodEnd,
    totalProduction,
    inspectionCount,
    rejectRate,
    targetRejectRate,
    achievement,
    ownerId,
    reportType,
    correctiveAction,
  };
}
