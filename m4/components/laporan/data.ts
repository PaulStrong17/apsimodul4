export type ReportType =
  | "Laporan Produksi"
  | "Laporan Pemeriksaan QC"
  | "Laporan Tindakan Perbaikan";

export type ReportAchievement = "Tercapai" | "Tidak Tercapai";

export type ProductionReport = {
  code: string;
  type: ReportType;
  periodStart: string;
  periodEnd: string;
  totalProduction: number;
  inspectionCount: number;
  rejectRate: number;
  targetRejectRate: number;
  achievement: ReportAchievement;
  owner: string;
  createdBy: string;
  correctiveAction: string;
};

export const reportTypes: ReportType[] = [
  "Laporan Produksi",
  "Laporan Pemeriksaan QC",
  "Laporan Tindakan Perbaikan",
];

export const reportAchievements: ReportAchievement[] = [
  "Tercapai",
  "Tidak Tercapai",
];

export const reportOwners = ["Onang"];

export const reports: ProductionReport[] = [
  {
    code: "LP-001",
    type: "Laporan Produksi",
    periodStart: "2026-10-01",
    periodEnd: "2026-10-15",
    totalProduction: 6200,
    inspectionCount: 24,
    rejectRate: 2.1,
    targetRejectRate: 3,
    achievement: "Tercapai",
    owner: "Onang",
    createdBy: "Admin",
    correctiveAction: "Tidak ada tindakan perbaikan khusus pada periode ini.",
  },
  {
    code: "LP-002",
    type: "Laporan Pemeriksaan QC",
    periodStart: "2026-10-01",
    periodEnd: "2026-10-15",
    totalProduction: 5950,
    inspectionCount: 31,
    rejectRate: 3.4,
    targetRejectRate: 3,
    achievement: "Tidak Tercapai",
    owner: "Onang",
    createdBy: "Admin",
    correctiveAction:
      "Evaluasi mutu bahan baku dan proses produksi untuk menurunkan reject rate.",
  },
  {
    code: "LP-003",
    type: "Laporan Produksi",
    periodStart: "2026-10-16",
    periodEnd: "2026-10-22",
    totalProduction: 2800,
    inspectionCount: 12,
    rejectRate: 1.9,
    targetRejectRate: 3,
    achievement: "Tercapai",
    owner: "Onang",
    createdBy: "Admin",
    correctiveAction: "Pemeriksaan rutin berjalan sesuai standar.",
  },
  {
    code: "LP-004",
    type: "Laporan Pemeriksaan QC",
    periodStart: "2026-10-16",
    periodEnd: "2026-10-22",
    totalProduction: 2800,
    inspectionCount: 14,
    rejectRate: 2.6,
    targetRejectRate: 3,
    achievement: "Tercapai",
    owner: "Onang",
    createdBy: "Admin",
    correctiveAction: "Tidak ada tindakan perbaikan khusus pada periode ini.",
  },
  {
    code: "LP-005",
    type: "Laporan Tindakan Perbaikan",
    periodStart: "2026-10-01",
    periodEnd: "2026-10-22",
    totalProduction: 8750,
    inspectionCount: 45,
    rejectRate: 2.95,
    targetRejectRate: 3,
    achievement: "Tercapai",
    owner: "Onang",
    createdBy: "Admin",
    correctiveAction:
      "Penyesuaian proses penggorengan dan pengecekan kemasan dilakukan.",
  },
];

export function getReport(code: string) {
  return reports.find((report) => report.code.toLowerCase() === code.toLowerCase());
}

export function formatReportNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function getReportDateParts(date: string) {
  const parsedDate = new Date(`${date}T00:00:00Z`);
  const day = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    timeZone: "UTC",
  }).format(parsedDate);
  const month = new Intl.DateTimeFormat("id-ID", {
    month: "short",
    timeZone: "UTC",
  })
    .format(parsedDate)
    .replace(".", "");
  const fullMonth = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    timeZone: "UTC",
  }).format(parsedDate);
  const year = new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    timeZone: "UTC",
  }).format(parsedDate);

  return { day, month, fullMonth, year };
}

export function formatReportDateOption(date: string) {
  const { day, fullMonth, year } = getReportDateParts(date);
  return `${day} ${fullMonth} ${year}`;
}

export function formatShortReportPeriod(report: ProductionReport) {
  const start = getReportDateParts(report.periodStart);
  const end = getReportDateParts(report.periodEnd);
  return `${start.day}–${end.day} ${end.month} ${end.year}`;
}

export function formatFullReportPeriod(report: ProductionReport) {
  const start = getReportDateParts(report.periodStart);
  const end = getReportDateParts(report.periodEnd);
  return `${start.day} – ${end.day} ${end.fullMonth} ${end.year}`;
}

export function formatRejectRate(rate: number) {
  return `${new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rate)}%`;
}
