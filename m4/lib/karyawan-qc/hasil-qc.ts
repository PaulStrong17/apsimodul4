import { prisma } from "@/lib/prisma";
import type { QualityResult } from "@/components/karyawan-qc/data";

export type QcScheduleOption = {
  value: string;
  label: string;
};

export type ProductionResultOption = {
  code: string;
  label: string;
};

export type ReportOptionItem = {
  code: string;
  label: string;
};

export type QcResultOptions = {
  qcSchedules: QcScheduleOption[];
  productionResults: ProductionResultOption[];
  reports: ReportOptionItem[];
};

function formatDate(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export function normalizeQcResultCode(code: string): string {
  return code.trim().toUpperCase();
}

function matchCodeVariants(code: string): string[] {
  const trimmed = code.trim().toUpperCase();
  const variants = new Set<string>([trimmed]);

  // HQC-001 -> HQ001, HQC001
  if (trimmed.startsWith("HQC-")) {
    const num = trimmed.replace("HQC-", "");
    variants.add(`HQ${num}`);
    variants.add(`HQC${num}`);
  } else if (trimmed.startsWith("HQC")) {
    const num = trimmed.replace("HQC", "");
    variants.add(`HQ${num}`);
    variants.add(`HQC-${num}`);
  } else if (trimmed.startsWith("HQ")) {
    const num = trimmed.replace("HQ", "");
    variants.add(`HQC-${num}`);
    variants.add(`HQC${num}`);
  }

  return Array.from(variants);
}

function mapQcResult(item: {
  id_hasilqc: string;
  tanggal_pencatatan: Date;
  jumlah_diperiksa: number;
  jumlah_lolos: number;
  jumlah_reject: number;
  keterangan: string;
  id_jadwalqc: string;
  id_laporan: number | null;
  tindakan_perbaikan?: {
    hasil_tindakan: string | null;
    deskripsi_tindakan: string | null;
  }[];
  hasil_qc_hasil_produksi?: {
    id_hasil: string;
  }[];
}): QualityResult {
  const correctiveAction =
    item.tindakan_perbaikan?.[0]?.hasil_tindakan ||
    item.tindakan_perbaikan?.[0]?.deskripsi_tindakan ||
    "";

  const productionResultCode =
    item.hasil_qc_hasil_produksi?.[0]?.id_hasil || "";

  const reportCode = item.id_laporan ? `LAP-${String(item.id_laporan).padStart(3, "0")}` : "";

  return {
    code: item.id_hasilqc,
    recordedAt: formatDate(item.tanggal_pencatatan),
    qcScheduleCode: item.id_jadwalqc,
    inspected: item.jumlah_diperiksa,
    passed: item.jumlah_lolos,
    rejected: item.jumlah_reject,
    note: item.keterangan,
    correctiveAction,
    productionResultCode,
    reportCode,
  };
}

const qcResultSelect = {
  id_hasilqc: true,
  tanggal_pencatatan: true,
  jumlah_diperiksa: true,
  jumlah_lolos: true,
  jumlah_reject: true,
  keterangan: true,
  id_jadwalqc: true,
  id_laporan: true,
  tindakan_perbaikan: {
    select: {
      hasil_tindakan: true,
      deskripsi_tindakan: true,
    },
    take: 1,
  },
  hasil_qc_hasil_produksi: {
    select: {
      id_hasil: true,
    },
    take: 1,
  },
} as const;

export async function listQcResults(karyawanQcId: string): Promise<QualityResult[]> {
  const results = await prisma.hasil_pemeriksaan_qc.findMany({
    where: { id_karyawanqc: karyawanQcId },
    orderBy: [{ tanggal_pencatatan: "desc" }, { id_hasilqc: "asc" }],
    select: qcResultSelect,
  });

  return results.map(mapQcResult);
}

export async function getQcResult(
  karyawanQcId: string,
  code: string,
): Promise<QualityResult | null> {
  const variants = matchCodeVariants(code);

  const result = await prisma.hasil_pemeriksaan_qc.findFirst({
    where: {
      id_karyawanqc: karyawanQcId,
      id_hasilqc: { in: variants, mode: "insensitive" },
    },
    select: qcResultSelect,
  });

  return result ? mapQcResult(result) : null;
}

export async function getQcResultOptions(
  karyawanQcId: string,
): Promise<QcResultOptions> {
  const [schedules, productionResults, reports] = await Promise.all([
    prisma.jadwal_pemeriksaan_qc.findMany({
      where: { id_karyawanqc: karyawanQcId },
      orderBy: [{ tanggal_pemeriksaan: "desc" }, { id_jadwalqc: "asc" }],
      include: {
        jadwal_produksi: {
          include: {
            permintaan_produk: { include: { produk: true } },
          },
        },
      },
    }),
    prisma.hasil_produksi.findMany({
      orderBy: [{ tanggal_pencatatan: "desc" }, { id_hasil: "asc" }],
      include: {
        jadwal_produksi: {
          include: {
            permintaan_produk: { include: { produk: true } },
          },
        },
      },
    }),
    prisma.laporan.findMany({
      orderBy: { id_laporan: "desc" },
      select: { id_laporan: true },
    }),
  ]);

  return {
    qcSchedules: schedules.map((s) => {
      const prod = s.jadwal_produksi;
      const prodName = prod
        ? `${prod.permintaan_produk.produk.nama_produk} ${prod.permintaan_produk.produk.varian}`.trim()
        : "";
      const type = s.jenis_pemeriksaan || "Pemeriksaan Mutu";
      const label = prodName ? `${s.id_jadwalqc} — ${type} (${prodName})` : `${s.id_jadwalqc} — ${type}`;
      return { value: s.id_jadwalqc, label };
    }),
    productionResults: productionResults.map((h) => {
      const prod = h.jadwal_produksi;
      const prodName = prod
        ? `${prod.permintaan_produk.produk.nama_produk} ${prod.permintaan_produk.produk.varian}`.trim()
        : "";
      const label = prodName
        ? `${h.id_hasil} — ${prodName} (${h.jumlah_hasil} pcs)`
        : `${h.id_hasil} (${h.jumlah_hasil} pcs)`;
      return { code: h.id_hasil, label };
    }),
    reports: reports.map((r) => ({
      code: `LAP-${String(r.id_laporan).padStart(3, "0")}`,
      label: `LAP-${String(r.id_laporan).padStart(3, "0")}`,
    })),
  };
}

export async function deleteQcResult(
  karyawanQcId: string,
  code: string,
): Promise<boolean> {
  const variants = matchCodeVariants(code);

  const existing = await prisma.hasil_pemeriksaan_qc.findFirst({
    where: {
      id_karyawanqc: karyawanQcId,
      id_hasilqc: { in: variants, mode: "insensitive" },
    },
    select: { id_hasilqc: true },
  });

  if (!existing) return false;

  // Hapus relasi penghubung hasil_qc_hasil_produksi dan tindakan_perbaikan terlebih dahulu
  await prisma.hasil_qc_hasil_produksi.deleteMany({
    where: { id_hasilqc: existing.id_hasilqc },
  });

  await prisma.tindakan_perbaikan.deleteMany({
    where: { id_hasilqc: existing.id_hasilqc },
  });

  await prisma.hasil_pemeriksaan_qc.delete({
    where: { id_hasilqc: existing.id_hasilqc },
  });

  return true;
}
