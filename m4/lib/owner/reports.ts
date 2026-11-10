import { prisma } from "@/lib/prisma";
import { formatReportCode, parseReportId } from "@/lib/admin/reports";
import type { ProductionReport } from "@/components/laporan/data";

function formatDate(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

function mapOwnerReport(r: {
  id_laporan: number;
  periode_awal: Date;
  periode_akhir: Date;
  total_produksi: number;
  jumlah_pemeriksaan: number;
  reject_rate: { toNumber?: () => number } | number;
  target_reject_rate: { toNumber?: () => number } | number;
  status_pencapaian: string;
  id_owner: string;
  owner: { pengguna: { nama_lengkap: string } };
  tindakan_perbaikan?: {
    jenis_laporan: string | null;
    hasil_tindakan: string | null;
  }[];
  hasil_pemeriksaan_qc?: {
    jenis_laporan: string | null;
  }[];
}): ProductionReport {
  const rawReject = typeof r.reject_rate === "number"
    ? r.reject_rate
    : r.reject_rate.toNumber ? r.reject_rate.toNumber() : Number(r.reject_rate);

  const rawTarget = typeof r.target_reject_rate === "number"
    ? r.target_reject_rate
    : r.target_reject_rate.toNumber ? r.target_reject_rate.toNumber() : Number(r.target_reject_rate);

  const firstTindakan = r.tindakan_perbaikan?.[0];
  const firstHasilQc = r.hasil_pemeriksaan_qc?.[0];
  const type = (firstTindakan?.jenis_laporan || firstHasilQc?.jenis_laporan || "Laporan Produksi") as ProductionReport["type"];
  const correctiveAction = firstTindakan?.hasil_tindakan || "Tidak ada tindakan perbaikan khusus pada periode ini.";

  return {
    code: formatReportCode(r.id_laporan),
    type,
    periodStart: formatDate(r.periode_awal),
    periodEnd: formatDate(r.periode_akhir),
    totalProduction: r.total_produksi,
    inspectionCount: r.jumlah_pemeriksaan,
    rejectRate: Number(rawReject.toFixed(2)),
    targetRejectRate: Number(rawTarget.toFixed(2)),
    achievement: (r.status_pencapaian === "Belum tercapai" ? "Belum tercapai" : "Tercapai") as ProductionReport["achievement"],
    owner: r.owner.pengguna.nama_lengkap,
    createdBy: "Admin",
    correctiveAction,
  };
}

const ownerReportSelect = {
  id_laporan: true,
  periode_awal: true,
  periode_akhir: true,
  total_produksi: true,
  jumlah_pemeriksaan: true,
  reject_rate: true,
  target_reject_rate: true,
  status_pencapaian: true,
  id_owner: true,
  owner: {
    select: {
      pengguna: { select: { nama_lengkap: true } },
    },
  },
  tindakan_perbaikan: {
    select: {
      jenis_laporan: true,
      hasil_tindakan: true,
    },
    take: 1,
  },
  hasil_pemeriksaan_qc: {
    select: {
      jenis_laporan: true,
    },
    take: 1,
  },
} as const;

export async function listOwnerReports(ownerId: string): Promise<ProductionReport[]> {
  const reports = await prisma.laporan.findMany({
    where: { id_owner: ownerId },
    orderBy: { id_laporan: "asc" },
    select: ownerReportSelect,
  });

  return reports.map(mapOwnerReport);
}

export async function getOwnerReport(
  ownerId: string,
  codeOrId: string | number,
): Promise<ProductionReport | null> {
  const id = parseReportId(codeOrId);
  if (id === null) return null;

  const report = await prisma.laporan.findFirst({
    where: { id_owner: ownerId, id_laporan: id },
    select: ownerReportSelect,
  });

  return report ? mapOwnerReport(report) : null;
}

export async function deleteOwnerReport(
  ownerId: string,
  codeOrId: string | number,
): Promise<boolean> {
  const id = parseReportId(codeOrId);
  if (id === null) return false;

  const existing = await prisma.laporan.findFirst({
    where: { id_owner: ownerId, id_laporan: id },
    select: { id_laporan: true },
  });

  if (!existing) return false;

  await prisma.laporan.delete({
    where: { id_laporan: id },
  });

  return true;
}

export type OwnerDashboardPeriod = {
  value: string;
  label: string;
  production: number;
  inspections: number;
  rate: number;
  target: number;
  reports: string[];
};

export type OwnerRejectRateItem = {
  code: string;
  label: string;
  value: number;
};

export async function getOwnerKpiData(ownerId: string) {
  const reports = await listOwnerReports(ownerId);

  if (reports.length === 0) {
    const fallbackPeriod: OwnerDashboardPeriod = {
      value: "all",
      label: "Semua Periode",
      production: 0,
      inspections: 0,
      rate: 0,
      target: 3,
      reports: [],
    };
    return {
      periods: [fallbackPeriod],
      rejectRates: [] as OwnerRejectRateItem[],
      reports: [] as ProductionReport[],
    };
  }

  // Bangun periods dinamis dari database
  const periods: OwnerDashboardPeriod[] = [];

  // 1. Total gabungan seluruh laporan
  const totalProduction = reports.reduce((acc, r) => acc + r.totalProduction, 0);
  const totalInspections = reports.reduce((acc, r) => acc + r.inspectionCount, 0);
  const avgRate = Number(
    (reports.reduce((acc, r) => acc + r.rejectRate, 0) / reports.length).toFixed(2),
  );
  const avgTarget = Number(
    (reports.reduce((acc, r) => acc + r.targetRejectRate, 0) / reports.length).toFixed(2),
  );

  const firstReport = reports[0];
  const lastReport = reports[reports.length - 1];

  periods.push({
    value: `${firstReport.periodStart}_${lastReport.periodEnd}`,
    label: `${firstReport.periodStart} – ${lastReport.periodEnd}`,
    production: totalProduction,
    inspections: totalInspections,
    rate: avgRate,
    target: avgTarget,
    reports: reports.map((r) => r.code),
  });

  // 2. Tiap laporan sebagai individual period
  for (const r of reports) {
    periods.push({
      value: `${r.periodStart}_${r.periodEnd}`,
      label: `${r.periodStart} – ${r.periodEnd} (${r.code})`,
      production: r.totalProduction,
      inspections: r.inspectionCount,
      rate: r.rejectRate,
      target: r.targetRejectRate,
      reports: [r.code],
    });
  }

  const rejectRates: OwnerRejectRateItem[] = reports.map((r) => ({
    code: r.code,
    label: r.code,
    value: r.rejectRate,
  }));

  return {
    periods,
    rejectRates,
    reports,
  };
}
