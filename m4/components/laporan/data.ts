export type ReportType =
  | "Laporan Produksi"
  | "Laporan Pemeriksaan QC"
  | "Laporan Tindakan Perbaikan";

export type ReportAchievement = "Tercapai" | "Belum tercapai" | "Tidak Tercapai";

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
  "Belum tercapai",
];

export const reportOwners = ["Onang"];

// Kept for static view fallback or owner view
export const reports: ProductionReport[] = [
  {
    code: "LP-001",
    type: "Laporan Produksi",
    periodStart: "2026-06-01",
    periodEnd: "2026-06-30",
    totalProduction: 200,
    inspectionCount: 200,
    rejectRate: 6.0,
    targetRejectRate: 5.0,
    achievement: "Belum tercapai",
    owner: "Onang",
    createdBy: "Admin",
    correctiveAction: "Produksi ulang, kemas ulang, penggorengan ulang",
  },
  {
    code: "LP-002",
    type: "Laporan Pemeriksaan QC",
    periodStart: "2026-08-01",
    periodEnd: "2026-08-31",
    totalProduction: 150,
    inspectionCount: 150,
    rejectRate: 4.0,
    targetRejectRate: 5.0,
    achievement: "Tercapai",
    owner: "Onang",
    createdBy: "Admin",
    correctiveAction: "Pemeriksaan rutin berjalan sesuai standar.",
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
  if (Number.isNaN(parsedDate.getTime())) {
    return { day: "—", month: "—", fullMonth: "—", year: "—" };
  }
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

export function formatShortReportPeriod(report: { periodStart: string; periodEnd: string }) {
  const start = getReportDateParts(report.periodStart);
  const end = getReportDateParts(report.periodEnd);
  return `${start.day} ${start.month} – ${end.day} ${end.month} ${end.year}`;
}

export function formatFullReportPeriod(report: { periodStart: string; periodEnd: string }) {
  const start = getReportDateParts(report.periodStart);
  const end = getReportDateParts(report.periodEnd);
  return `${start.day} ${start.fullMonth} ${start.year} – ${end.day} ${end.fullMonth} ${end.year}`;
}

export function formatRejectRate(rate: number) {
  return `${new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rate)}%`;
}
