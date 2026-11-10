import { prisma } from "@/lib/prisma";

export type OwnerVerificationItem = {
  code: string;
  type: "Jadwal Produksi" | "Jadwal QC";
  date: string;
  description: string;
  responsible: string;
  status: "Menunggu Keputusan" | "Sudah Disetujui" | "Ditolak";
  rawStatus: string;
};

export type OwnerVerificationDetailData = {
  code: string;
  type: "Jadwal Produksi" | "Jadwal QC";
  date: string;
  productName: string;
  amount: string;
  responsible: string;
  status: "Menunggu Keputusan" | "Sudah Disetujui" | "Ditolak";
  rawStatus: string;
};

function formatDate(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

function mapStatus(status: string | null | undefined): "Menunggu Keputusan" | "Sudah Disetujui" | "Ditolak" {
  if (!status) return "Menunggu Keputusan";
  const lower = status.toLowerCase();
  if (lower === "terverifikasi" || lower === "sudah disetujui" || lower === "disetujui") {
    return "Sudah Disetujui";
  }
  if (lower === "ditolak") {
    return "Ditolak";
  }
  return "Menunggu Keputusan";
}

export async function listOwnerVerifications(ownerId: string): Promise<OwnerVerificationItem[]> {
  const [productionSchedules, qualitySchedules] = await Promise.all([
    prisma.jadwal_produksi.findMany({
      where: { id_owner: ownerId },
      orderBy: [{ tanggal_produksi: "desc" }, { id_jadwalproduksi: "asc" }],
      include: {
        karyawan_produksi: { include: { pengguna: true } },
        permintaan_produk: {
          include: { produk: true },
        },
      },
    }),
    prisma.jadwal_pemeriksaan_qc.findMany({
      where: { id_owner: ownerId },
      orderBy: [{ tanggal_pemeriksaan: "desc" }, { id_jadwalqc: "asc" }],
      include: {
        karyawan_qc: { include: { pengguna: true } },
      },
    }),
  ]);

  const items: OwnerVerificationItem[] = [];

  for (const prod of productionSchedules) {
    const prodName = `${prod.permintaan_produk.produk.nama_produk} ${prod.permintaan_produk.produk.varian}`.trim();
    items.push({
      code: prod.id_jadwalproduksi,
      type: "Jadwal Produksi",
      date: formatDate(prod.tanggal_produksi),
      description: `${prodName} · ${prod.jumlah_target} pcs`,
      responsible: prod.karyawan_produksi.pengguna.nama_lengkap,
      status: mapStatus(prod.status_verifikasi),
      rawStatus: prod.status_verifikasi,
    });
  }

  for (const qc of qualitySchedules) {
    items.push({
      code: qc.id_jadwalqc,
      type: "Jadwal QC",
      date: formatDate(qc.tanggal_pemeriksaan),
      description: qc.jenis_pemeriksaan || "Pemeriksaan Mutu",
      responsible: qc.karyawan_qc.pengguna.nama_lengkap,
      status: mapStatus(qc.status_verifikasi),
      rawStatus: qc.status_verifikasi ?? "Menunggu",
    });
  }

  // Sort: yang "Menunggu Keputusan" tampil di atas, lalu urut tanggal terbaru
  items.sort((a, b) => {
    if (a.status === "Menunggu Keputusan" && b.status !== "Menunggu Keputusan") return -1;
    if (a.status !== "Menunggu Keputusan" && b.status === "Menunggu Keputusan") return 1;
    return b.date.localeCompare(a.date);
  });

  return items;
}

export async function getOwnerVerificationDetail(
  ownerId: string,
  code: string,
): Promise<OwnerVerificationDetailData | null> {
  const decoded = decodeURIComponent(code).trim();

  // Coba cari di jadwal_produksi dulu
  const prod = await prisma.jadwal_produksi.findFirst({
    where: {
      id_owner: ownerId,
      id_jadwalproduksi: { equals: decoded, mode: "insensitive" },
    },
    include: {
      karyawan_produksi: { include: { pengguna: true } },
      permintaan_produk: { include: { produk: true } },
    },
  });

  if (prod) {
    const prodName = `${prod.permintaan_produk.produk.nama_produk} ${prod.permintaan_produk.produk.varian}`.trim();
    return {
      code: prod.id_jadwalproduksi,
      type: "Jadwal Produksi",
      date: formatDate(prod.tanggal_produksi),
      productName: prodName,
      amount: `${prod.jumlah_target} pcs`,
      responsible: prod.karyawan_produksi.pengguna.nama_lengkap,
      status: mapStatus(prod.status_verifikasi),
      rawStatus: prod.status_verifikasi,
    };
  }

  // Jika bukan, cari di jadwal_pemeriksaan_qc
  const qc = await prisma.jadwal_pemeriksaan_qc.findFirst({
    where: {
      id_owner: ownerId,
      id_jadwalqc: { equals: decoded, mode: "insensitive" },
    },
    include: {
      karyawan_qc: { include: { pengguna: true } },
      jadwal_produksi: {
        include: {
          permintaan_produk: { include: { produk: true } },
        },
      },
    },
  });

  if (qc) {
    const prod = qc.jadwal_produksi;
    const prodName = prod
      ? `${prod.permintaan_produk.produk.nama_produk} ${prod.permintaan_produk.produk.varian}`.trim()
      : qc.jenis_pemeriksaan || "Pemeriksaan Mutu";

    return {
      code: qc.id_jadwalqc,
      type: "Jadwal QC",
      date: formatDate(qc.tanggal_pemeriksaan),
      productName: prodName,
      amount: qc.jenis_pemeriksaan || "Pemeriksaan Mutu",
      responsible: qc.karyawan_qc.pengguna.nama_lengkap,
      status: mapStatus(qc.status_verifikasi),
      rawStatus: qc.status_verifikasi ?? "Menunggu",
    };
  }

  return null;
}

export async function verifySchedule(
  ownerId: string,
  code: string,
  decision: "setujui" | "tolak",
): Promise<{ success: boolean; type: "Jadwal Produksi" | "Jadwal QC"; newStatus: string } | null> {
  const decoded = decodeURIComponent(code).trim();
  const dbStatus = decision === "setujui" ? "Terverifikasi" : "Ditolak";

  // Cek apakah jadwal produksi
  const prod = await prisma.jadwal_produksi.findFirst({
    where: {
      id_owner: ownerId,
      id_jadwalproduksi: { equals: decoded, mode: "insensitive" },
    },
    select: { id_jadwalproduksi: true },
  });

  if (prod) {
    await prisma.jadwal_produksi.update({
      where: { id_jadwalproduksi: prod.id_jadwalproduksi },
      data: { status_verifikasi: dbStatus },
    });
    return { success: true, type: "Jadwal Produksi", newStatus: dbStatus };
  }

  // Cek apakah jadwal QC
  const qc = await prisma.jadwal_pemeriksaan_qc.findFirst({
    where: {
      id_owner: ownerId,
      id_jadwalqc: { equals: decoded, mode: "insensitive" },
    },
    select: { id_jadwalqc: true },
  });

  if (qc) {
    await prisma.jadwal_pemeriksaan_qc.update({
      where: { id_jadwalqc: qc.id_jadwalqc },
      data: { status_verifikasi: dbStatus },
    });
    return { success: true, type: "Jadwal QC", newStatus: dbStatus };
  }

  return null;
}
