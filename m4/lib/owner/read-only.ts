import { prisma } from "@/lib/prisma";
import { formatProductPrice } from "@/components/data-produk/data";
import { formatProductionDate } from "@/components/jadwal-produksi/data";
import { formatOwnerDate } from "@/components/owner/data";

function formatDate(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export type OwnerDetailField = {
  label: string;
  value: string;
};

export type OwnerDetailResponse = {
  title: string;
  code: string;
  fields: OwnerDetailField[];
};

export async function listOwnerMaterials() {
  const materials = await prisma.bahan_baku.findMany({
    orderBy: { id_bahan: "asc" },
    include: {
      detail_resep: {
        include: {
          resep: {
            include: { produk: true },
          },
        },
      },
      penerimaan_bahan_baku: {
        orderBy: { tanggal_terima: "desc" },
        include: {
          jenis_supplier: true,
        },
      },
    },
  });

  return materials.map((m) => {
    const stockNum = Number(m.stok);
    const minStockNum = Number(m.stok_minimum);

    const recipeNames =
      m.detail_resep
        .map((dr) =>
          dr.resep?.produk
            ? `${dr.resep.produk.nama_produk} (${dr.resep.produk.varian})`
            : dr.id_resep,
        )
        .filter(Boolean)
        .join(", ") || "—";

    const latestReceipt = m.penerimaan_bahan_baku[0];
    const lastSupplierName = latestReceipt?.jenis_supplier?.nama_supplier || "—";
    const lastReceiptDate = latestReceipt?.tanggal_terima
      ? formatDate(latestReceipt.tanggal_terima)
      : "—";

    return {
      code: m.id_bahan,
      name: m.nama_bahan,
      unit: m.satuan,
      stock: stockNum,
      minimumStock: minStockNum,
      recipeNames,
      lastSupplierName,
      lastReceiptDate,
      price: 0,
      note: "",
      detailStock: stockNum * 10,
    };
  });
}

export async function listOwnerProducts() {
  const products = await prisma.produk.findMany({
    orderBy: { id_produk: "asc" },
    include: { resep: true },
  });

  return products.map((p) => {
    const recipeDesc = p.resep?.[0]?.deskripsi_resep || p.resep_produk || `Resep ${p.nama_produk}`;
    return {
      code: p.id_produk,
      name: p.nama_produk,
      variation: p.varian,
      stock: p.stok_produk,
      price: 20000,
      recipe: recipeDesc,
      description: `Produk ${p.nama_produk} varian ${p.varian}.`,
    };
  });
}

export async function listOwnerProductionSchedules(ownerId: string) {
  const schedules = await prisma.jadwal_produksi.findMany({
    where: { id_owner: ownerId },
    orderBy: [{ tanggal_produksi: "desc" }, { id_jadwalproduksi: "asc" }],
    include: {
      permintaan_produk: { include: { produk: true } },
      karyawan_produksi: { include: { pengguna: true } },
      karyawan_qc: { include: { pengguna: true } },
      owner: { include: { pengguna: true } },
    },
  });

  return schedules.map((s) => {
    const prodName = `${s.permintaan_produk.produk.nama_produk} ${s.permintaan_produk.produk.varian}`.trim();
    return {
      code: s.id_jadwalproduksi,
      productionDate: formatDate(s.tanggal_produksi),
      requestCode: s.id_permintaan,
      productName: prodName,
      target: s.jumlah_target,
      productionEmployee: s.karyawan_produksi.pengguna.nama_lengkap,
      qualityControlEmployee: s.karyawan_qc.pengguna.nama_lengkap,
      status: s.status_jadwal as "Direncanakan" | "Terjadwal" | "Selesai" | "Dibatalkan",
      verificationStatus: s.status_verifikasi as "Menunggu" | "Terverifikasi" | "Ditolak",
      owner: s.owner.pengguna.nama_lengkap,
    };
  });
}

export async function listOwnerQualitySchedules(ownerId: string) {
  const schedules = await prisma.jadwal_pemeriksaan_qc.findMany({
    where: { id_owner: ownerId },
    orderBy: [{ tanggal_pemeriksaan: "desc" }, { id_jadwalqc: "asc" }],
    include: {
      jadwal_produksi: {
        include: {
          permintaan_produk: { include: { produk: true } },
        },
      },
      karyawan_qc: { include: { pengguna: true } },
      karyawan_produksi: { include: { pengguna: true } },
      owner: { include: { pengguna: true } },
    },
  });

  return schedules.map((s) => ({
    code: s.id_jadwalqc,
    inspectionDate: formatDate(s.tanggal_pemeriksaan),
    type: s.jenis_pemeriksaan || "Pemeriksaan Mutu",
    productionCode: s.id_jadwalproduksi,
    qualityControlEmployee: s.karyawan_qc.pengguna.nama_lengkap,
    productionEmployee: s.karyawan_produksi.pengguna.nama_lengkap,
    status: (s.status_pemeriksaan ?? "Terjadwal") as "Direncanakan" | "Terjadwal" | "Selesai" | "Dibatalkan",
    verificationStatus: (s.status_verifikasi ?? "Menunggu") as "Menunggu" | "Terverifikasi" | "Ditolak",
    owner: s.owner.pengguna.nama_lengkap,
    createdBy: "Admin",
  }));
}

export async function getOwnerReadOnlyDetail(
  section: string,
  code: string,
  ownerId: string,
): Promise<OwnerDetailResponse | null> {
  const decoded = decodeURIComponent(code).trim();

  if (section === "bahan-baku") {
    const material = await prisma.bahan_baku.findFirst({
      where: { id_bahan: { equals: decoded, mode: "insensitive" } },
      include: {
        detail_resep: {
          include: {
            resep: {
              include: { produk: true },
            },
          },
        },
        penerimaan_bahan_baku: {
          orderBy: { tanggal_terima: "desc" },
          include: {
            jenis_supplier: true,
          },
        },
      },
    });
    if (!material) return null;

    const stockNum = Number(material.stok);
    const minStockNum = Number(material.stok_minimum);

    const recipeList = material.detail_resep
      .map((dr) => {
        const prod = dr.resep?.produk;
        return prod ? `${prod.nama_produk} (${prod.varian})` : dr.id_resep;
      })
      .filter(Boolean);

    const latestReceipt = material.penerimaan_bahan_baku[0];
    const supplierName = latestReceipt?.jenis_supplier?.nama_supplier || "—";
    const receiptDate = latestReceipt?.tanggal_terima
      ? formatDate(latestReceipt.tanggal_terima)
      : "—";

    return {
      title: material.nama_bahan,
      code: material.id_bahan,
      fields: [
        { label: "Nama Bahan Baku", value: material.nama_bahan },
        { label: "Satuan", value: material.satuan },
        { label: "Stok", value: `${stockNum} ${material.satuan}` },
        { label: "Stok Minimum", value: `${minStockNum} ${material.satuan}` },
        {
          label: "Resep Produk",
          value: recipeList.length > 0 ? recipeList.join(", ") : "—",
        },
        { label: "Supplier", value: supplierName },
        { label: "Tanggal Penerimaan", value: receiptDate },
        { label: "Dikelola Oleh", value: "Admin" },
      ],
    };
  }

  if (section === "data-produk") {
    const product = await prisma.produk.findFirst({
      where: { id_produk: { equals: decoded, mode: "insensitive" } },
      include: { resep: true },
    });
    if (!product) return null;

    const recipeDesc = product.resep?.[0]?.deskripsi_resep || product.resep_produk || `Resep ${product.nama_produk}`;

    return {
      title: product.nama_produk,
      code: product.id_produk,
      fields: [
        { label: "Variasi", value: product.varian },
        { label: "Stok Produk", value: `${product.stok_produk} pcs` },
        { label: "Harga Produk", value: formatProductPrice(20000) },
        { label: "Resep Produk", value: recipeDesc },
        { label: "Deskripsi Produk", value: `Produk ${product.nama_produk} varian ${product.varian}.` },
      ],
    };
  }

  if (section === "jadwal-produksi") {
    const schedule = await prisma.jadwal_produksi.findFirst({
      where: {
        id_jadwalproduksi: { equals: decoded, mode: "insensitive" },
        id_owner: ownerId,
      },
      include: {
        permintaan_produk: { include: { produk: true } },
        karyawan_produksi: { include: { pengguna: true } },
        karyawan_qc: { include: { pengguna: true } },
        owner: { include: { pengguna: true } },
      },
    });
    if (!schedule) return null;

    const prodName = `${schedule.permintaan_produk.produk.nama_produk} ${schedule.permintaan_produk.produk.varian}`.trim();
    return {
      title: `Produksi ${prodName}`,
      code: schedule.id_jadwalproduksi,
      fields: [
        {
          label: "Tanggal Produksi",
          value: formatProductionDate(formatDate(schedule.tanggal_produksi)),
        },
        { label: "Jumlah Target", value: `${schedule.jumlah_target} pcs` },
        {
          label: "Permintaan Produk",
          value: `${schedule.id_permintaan} — ${prodName}`,
        },
        { label: "Status Jadwal", value: schedule.status_jadwal },
        {
          label: "Karyawan Produksi",
          value: schedule.karyawan_produksi.pengguna.nama_lengkap,
        },
        {
          label: "Karyawan QC",
          value: schedule.karyawan_qc.pengguna.nama_lengkap,
        },
        {
          label: "Status Verifikasi",
          value: schedule.status_verifikasi,
        },
        {
          label: "Owner Penanggung Jawab",
          value: schedule.owner.pengguna.nama_lengkap,
        },
      ],
    };
  }

  if (section === "jadwal-qc") {
    const schedule = await prisma.jadwal_pemeriksaan_qc.findFirst({
      where: {
        id_jadwalqc: { equals: decoded, mode: "insensitive" },
        id_owner: ownerId,
      },
      include: {
        jadwal_produksi: {
          include: {
            permintaan_produk: { include: { produk: true } },
          },
        },
        karyawan_qc: { include: { pengguna: true } },
        karyawan_produksi: { include: { pengguna: true } },
        owner: { include: { pengguna: true } },
      },
    });
    if (!schedule) return null;

    const prod = schedule.jadwal_produksi;
    const prodLabel = prod
      ? `${prod.id_jadwalproduksi} · ${formatDate(prod.tanggal_produksi)}`
      : schedule.id_jadwalproduksi;

    return {
      title: schedule.jenis_pemeriksaan || "Pemeriksaan Mutu",
      code: schedule.id_jadwalqc,
      fields: [
        {
          label: "Tanggal Pemeriksaan",
          value: schedule.tanggal_pemeriksaan
            ? formatOwnerDate(formatDate(schedule.tanggal_pemeriksaan), "long")
            : "—",
        },
        {
          label: "Jadwal Produksi",
          value: prodLabel,
        },
        {
          label: "Karyawan QC",
          value: schedule.karyawan_qc.pengguna.nama_lengkap,
        },
        {
          label: "Karyawan Produksi",
          value: schedule.karyawan_produksi.pengguna.nama_lengkap,
        },
        {
          label: "Status Pemeriksaan",
          value: schedule.status_pemeriksaan || "Terjadwal",
        },
        {
          label: "Status Verifikasi",
          value: schedule.status_verifikasi || "Menunggu",
        },
        {
          label: "Owner Penanggung Jawab",
          value: schedule.owner.pengguna.nama_lengkap,
        },
        { label: "Dicatat oleh", value: "Admin" },
      ],
    };
  }

  return null;
}
