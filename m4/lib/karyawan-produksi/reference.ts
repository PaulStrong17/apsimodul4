import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/components/bahan-baku/data";
import { formatProductionDate } from "@/components/jadwal-produksi/data";
import type {
  ProductionReference,
  ProductionRow,
  ProductionSection,
} from "@/components/karyawan-produksi/data";

function formatDate(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export async function getProductionReferenceData(
  section: ProductionSection,
  karyawanProduksiId: string,
): Promise<ProductionReference | null> {
  if (section === "bahan-baku") {
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

    const rows: ProductionRow[] = materials.map((m) => {
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
      const supplierName = latestReceipt?.jenis_supplier?.nama_supplier || "—";
      const receiptDate = latestReceipt?.tanggal_terima
        ? formatDate(latestReceipt.tanggal_terima)
        : "—";

      return {
        code: m.id_bahan,
        title: m.nama_bahan,
        cells: [
          m.id_bahan,
          m.nama_bahan,
          m.satuan,
          `${stockNum} ${m.satuan}`,
          `${minStockNum} ${m.satuan}`,
          recipeNames,
          supplierName,
          receiptDate,
        ],
        fields: [
          ["Nama Bahan Baku", m.nama_bahan],
          ["Satuan", m.satuan],
          ["Stok", `${stockNum} ${m.satuan}`],
          ["Stok Minimum", `${minStockNum} ${m.satuan}`],
          ["Resep Produk", recipeNames],
          ["Supplier", supplierName],
          ["Tanggal Penerimaan", receiptDate],
          ["Dikelola Oleh", "Admin"],
        ],
      };
    });

    return {
      title: "Daftar Bahan Baku",
      description:
        "Lihat ketersediaan bahan baku, resep terkait, dan supplier untuk mendukung kegiatan produksi.",
      tableTitle: "Data Bahan Baku",
      columns: [
        "Kode",
        "Nama Bahan Baku",
        "Satuan",
        "Stok",
        "Stok Minimum",
        "Resep Produk",
        "Supplier",
        "Tgl Terima",
      ],
      backgroundImage: "/images/karyawan-qc/background-bahan-baku.jpg",
      rows,
    };
  }

  if (section === "data-produk") {
    const products = await prisma.produk.findMany({
      orderBy: { id_produk: "asc" },
      include: { resep: true },
    });

    const rows: ProductionRow[] = products.map((p) => {
      const recipeDesc =
        p.resep?.[0]?.deskripsi_resep || p.resep_produk || `Resep ${p.nama_produk}`;
      return {
        code: p.id_produk,
        title: p.nama_produk,
        cells: [
          p.id_produk,
          p.nama_produk,
          p.varian,
          `${p.stok_produk} pcs`,
          recipeDesc,
        ],
        fields: [
          ["Nama Produk", p.nama_produk],
          ["Varian", p.varian],
          ["Stok Produk", `${p.stok_produk} pcs`],
          ["Harga", formatRupiah(20000)],
          ["Keterangan", recipeDesc],
        ],
      };
    });

    return {
      title: "Daftar Produk",
      description: "Lihat informasi produk dan resep yang menjadi acuan produksi.",
      tableTitle: "Data Produk",
      columns: ["Kode", "Nama Produk", "Varian", "Stok Produk", "Keterangan"],
      backgroundImage: "/images/karyawan-qc/background-produk.jpg",
      rows,
    };
  }

  if (section === "jadwal-produksi") {
    const schedules = await prisma.jadwal_produksi.findMany({
      where: { id_karyawanproduksi: karyawanProduksiId },
      orderBy: [{ tanggal_produksi: "desc" }, { id_jadwalproduksi: "asc" }],
      include: {
        permintaan_produk: { include: { produk: true } },
        karyawan_produksi: { include: { pengguna: true } },
        karyawan_qc: { include: { pengguna: true } },
      },
    });

    const rows: ProductionRow[] = schedules.map((s) => {
      const prodName = `${s.permintaan_produk.produk.nama_produk} ${s.permintaan_produk.produk.varian}`.trim();
      const dateStr = formatProductionDate(formatDate(s.tanggal_produksi));
      return {
        code: s.id_jadwalproduksi,
        title: prodName,
        cells: [
          s.id_jadwalproduksi,
          dateStr,
          prodName,
          `${s.jumlah_target} pcs`,
          s.status_jadwal,
        ],
        fields: [
          ["Tanggal Produksi", dateStr],
          ["Permintaan Produk", `${s.id_permintaan} — ${prodName}`],
          ["Jumlah Target", `${s.jumlah_target} pcs`],
          ["Status Jadwal", s.status_jadwal],
          ["Status Verifikasi", s.status_verifikasi],
          ["Karyawan Produksi", s.karyawan_produksi.pengguna.nama_lengkap],
          ["Karyawan QC", s.karyawan_qc.pengguna.nama_lengkap],
        ],
      };
    });

    return {
      title: "Jadwal Produksi",
      description: "Tinjau jadwal produksi yang ditugaskan kepada Anda.",
      tableTitle: "Jadwal Produksi Saya",
      columns: [
        "Kode",
        "Tanggal Produksi",
        "Produk",
        "Jumlah Target",
        "Status Jadwal",
      ],
      backgroundImage: "/images/karyawan-qc/background-jadwal-produksi.jpg",
      rows,
    };
  }

  if (section === "jadwal-qc") {
    const schedules = await prisma.jadwal_pemeriksaan_qc.findMany({
      where: { id_karyawanproduksi: karyawanProduksiId },
      orderBy: [{ tanggal_pemeriksaan: "desc" }, { id_jadwalqc: "asc" }],
      include: {
        jadwal_produksi: {
          include: {
            permintaan_produk: { include: { produk: true } },
          },
        },
        karyawan_produksi: { include: { pengguna: true } },
        karyawan_qc: { include: { pengguna: true } },
      },
    });

    const rows: ProductionRow[] = schedules.map((s) => {
      const dateStr = s.tanggal_pemeriksaan
        ? formatProductionDate(formatDate(s.tanggal_pemeriksaan))
        : "—";
      const type = s.jenis_pemeriksaan || "Pemeriksaan Mutu";
      const status = s.status_pemeriksaan || "Terjadwal";

      return {
        code: s.id_jadwalqc,
        title: type,
        cells: [
          s.id_jadwalqc,
          dateStr,
          type,
          s.id_jadwalproduksi,
          status,
        ],
        fields: [
          ["Tanggal Pemeriksaan", dateStr],
          ["Jenis Pemeriksaan", type],
          ["Jadwal Produksi", s.id_jadwalproduksi],
          ["Status Pemeriksaan", status],
          ["Status Verifikasi", s.status_verifikasi || "Menunggu"],
          ["Karyawan Produksi", s.karyawan_produksi.pengguna.nama_lengkap],
          ["Karyawan QC", s.karyawan_qc.pengguna.nama_lengkap],
        ],
      };
    });

    return {
      title: "Jadwal QC",
      description: "Lihat jadwal pemeriksaan yang berkaitan dengan tugas produksi Anda.",
      tableTitle: "Jadwal Pemeriksaan QC",
      columns: [
        "Kode",
        "Tanggal Pemeriksaan",
        "Jenis Pemeriksaan",
        "Jadwal Produksi",
        "Status",
      ],
      backgroundImage: "/images/karyawan-qc/background-jadwal-qc.jpg",
      rows,
    };
  }

  if (section === "tindakan-perbaikan") {
    const actions = await prisma.tindakan_perbaikan.findMany({
      where: { id_karyawanproduksi: karyawanProduksiId },
      orderBy: { id_tindakan: "asc" },
      include: {
        hasil_pemeriksaan_qc: {
          include: {
            jadwal_pemeriksaan_qc: true,
          },
        },
        karyawan_qc: { include: { pengguna: true } },
        owner: { include: { pengguna: true } },
      },
    });

    const rows: ProductionRow[] = actions.map((t) => {
      const dateStr = t.tanggal_tindakan
        ? formatProductionDate(formatDate(t.tanggal_tindakan))
        : "—";
      const prodCode =
        t.hasil_pemeriksaan_qc?.jadwal_pemeriksaan_qc?.id_jadwalproduksi || "—";
      const issue = t.keterangan || t.hasil_pemeriksaan_qc?.keterangan || "—";
      const actionDesc =
        t.deskripsi_tindakan || t.hasil_tindakan || "Periksa dan tindak lanjuti sesuai standar.";
      const status = t.status || "Direncanakan";

      return {
        code: t.id_tindakan,
        title: t.deskripsi_tindakan || t.hasil_tindakan || t.id_tindakan,
        cells: [
          t.id_tindakan,
          prodCode,
          issue,
          status,
          dateStr,
        ],
        fields: [
          ["Jadwal Produksi", prodCode],
          ["Masalah", issue],
          ["Tindakan", actionDesc],
          ["Status", status],
          ["Tanggal", dateStr],
          ["Dicatat Oleh", t.karyawan_qc.pengguna.nama_lengkap],
          ["Diverifikasi Oleh", t.owner.pengguna.nama_lengkap],
        ],
      };
    });

    return {
      title: "Tindakan Perbaikan",
      description: "Lihat tindak lanjut yang perlu dilakukan berdasarkan catatan QC.",
      tableTitle: "Daftar Tindakan Perbaikan",
      columns: [
        "Kode",
        "Jadwal Produksi",
        "Masalah",
        "Status",
        "Tanggal",
      ],
      backgroundImage: "/images/karyawan-qc/background-hasil-qc.jpg",
      rows,
    };
  }

  return null;
}

export async function getProductionRowData(
  section: ProductionSection,
  code: string,
  karyawanProduksiId: string,
): Promise<ProductionRow | null> {
  const data = await getProductionReferenceData(section, karyawanProduksiId);
  if (!data) return null;
  const decoded = decodeURIComponent(code).toLowerCase();
  return data.rows.find((r) => r.code.toLowerCase() === decoded) ?? null;
}
