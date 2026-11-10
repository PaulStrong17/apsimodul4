import { prisma } from "@/lib/prisma";

export type ReportOption = {
  id: string;
  label: string;
};

export type AdminReportOptions = {
  owners: ReportOption[];
  reportTypes: string[];
  achievements: string[];
};

export type AdminReport = {
  id: number;
  code: string;
  type: string;
  periodStart: string;
  periodEnd: string;
  totalProduction: number;
  inspectionCount: number;
  rejectRate: number;
  targetRejectRate: number;
  achievement: string;
  ownerId: string;
  owner: string;
  createdBy: string;
  correctiveAction: string;
};

export function formatReportCode(id: number): string {
  return `LP-${String(id).padStart(3, "0")}`;
}

export function parseReportId(value: string | number): number | null {
  if (typeof value === "number") {
    return Number.isInteger(value) && value > 0 ? value : null;
  }
  const str = String(value).trim();
  if (!str) return null;

  if (/^\d+$/.test(str)) {
    const id = parseInt(str, 10);
    return id > 0 ? id : null;
  }

  const match = str.match(/^(?:LP[-_]?)0*(\d+)$/i);
  if (match) {
    const id = parseInt(match[1], 10);
    return id > 0 ? id : null;
  }

  return null;
}

function formatDate(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

function mapReport(report: {
  id_laporan: number;
  periode_awal: Date;
  periode_akhir: Date;
  total_produksi: number;
  jumlah_pemeriksaan: number;
  reject_rate: { toNumber?: () => number } | number;
  target_reject_rate: { toNumber?: () => number } | number;
  status_pencapaian: string;
  id_admin: string;
  id_owner: string;
  owner: { pengguna: { nama_lengkap: string } };
  tindakan_perbaikan?: {
    jenis_laporan: string | null;
    hasil_tindakan: string | null;
    deskripsi_tindakan: string | null;
  }[];
  hasil_pemeriksaan_qc?: {
    jenis_laporan: string | null;
  }[];
}): AdminReport {
  const rawReject = typeof report.reject_rate === "number"
    ? report.reject_rate
    : report.reject_rate.toNumber ? report.reject_rate.toNumber() : Number(report.reject_rate);

  const rawTarget = typeof report.target_reject_rate === "number"
    ? report.target_reject_rate
    : report.target_reject_rate.toNumber ? report.target_reject_rate.toNumber() : Number(report.target_reject_rate);

  const firstTindakan = report.tindakan_perbaikan?.[0];
  const firstHasilQc = report.hasil_pemeriksaan_qc?.[0];

  const type = firstTindakan?.jenis_laporan || firstHasilQc?.jenis_laporan || "Laporan Produksi";
  const correctiveAction = firstTindakan?.hasil_tindakan || firstTindakan?.deskripsi_tindakan || "Tidak ada tindakan perbaikan khusus pada periode ini.";

  return {
    id: report.id_laporan,
    code: formatReportCode(report.id_laporan),
    type,
    periodStart: formatDate(report.periode_awal),
    periodEnd: formatDate(report.periode_akhir),
    totalProduction: report.total_produksi,
    inspectionCount: report.jumlah_pemeriksaan,
    rejectRate: Number(rawReject.toFixed(2)),
    targetRejectRate: Number(rawTarget.toFixed(2)),
    achievement: report.status_pencapaian,
    ownerId: report.id_owner,
    owner: report.owner.pengguna.nama_lengkap,
    createdBy: "Admin",
    correctiveAction,
  };
}

const reportSelect = {
  id_laporan: true,
  periode_awal: true,
  periode_akhir: true,
  total_produksi: true,
  jumlah_pemeriksaan: true,
  reject_rate: true,
  target_reject_rate: true,
  status_pencapaian: true,
  id_admin: true,
  id_owner: true,
  owner: {
    select: {
      pengguna: {
        select: { nama_lengkap: true },
      },
    },
  },
  tindakan_perbaikan: {
    select: {
      jenis_laporan: true,
      hasil_tindakan: true,
      deskripsi_tindakan: true,
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

export async function listAdminReports(adminId: string): Promise<AdminReport[]> {
  const reports = await prisma.laporan.findMany({
    where: { id_admin: adminId },
    orderBy: { id_laporan: "asc" },
    select: reportSelect,
  });

  return reports.map(mapReport);
}

export async function getAdminReport(
  adminId: string,
  codeOrId: string | number,
): Promise<AdminReport | null> {
  const id = parseReportId(codeOrId);
  if (id === null) return null;

  const report = await prisma.laporan.findFirst({
    where: { id_admin: adminId, id_laporan: id },
    select: reportSelect,
  });

  return report ? mapReport(report) : null;
}

export async function getAdminReportOptions(): Promise<AdminReportOptions> {
  const owners = await prisma.owner.findMany({
    orderBy: { id_owner: "asc" },
    select: {
      id_owner: true,
      pengguna: {
        select: { nama_lengkap: true },
      },
    },
  });

  return {
    owners: owners.map((owner) => ({
      id: owner.id_owner,
      label: `${owner.pengguna.nama_lengkap} (${owner.id_owner})`,
    })),
    reportTypes: [
      "Laporan Produksi",
      "Laporan Pemeriksaan QC",
      "Laporan Tindakan Perbaikan",
    ],
    achievements: ["Tercapai", "Belum tercapai"],
  };
}
