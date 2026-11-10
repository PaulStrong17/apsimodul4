import { prisma } from "@/lib/prisma";
import { formatProductionDate } from "@/components/jadwal-produksi/data";
import { formatKqcDate } from "@/components/karyawan-qc/data";
import type {
  KaryawanQcSection,
  ReferenceRow,
  ReferenceSection,
} from "@/components/karyawan-qc/data";

function formatDate(date: Date | null | undefined): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export async function getReferenceSectionData(
  section: KaryawanQcSection,
  karyawanQcId: string,
): Promise<ReferenceSection | null> {
  if (section === "bahan-baku") {
    const materials = await prisma.bahan_baku.findMany({
      orderBy: { id_bahan: "asc" },
    });

    const rows: ReferenceRow[] = materials.map((m) => {
      const stockNum = Number(m.stok);
      const minStockNum = Number(m.stok_minimum);
      return {
        code: m.id_bahan,
        cells: [
          m.id_bahan,
          m.nama_bahan,
          m.satuan,
          String(stockNum),
          String(minStockNum),
        ],
        title: m.nama_bahan,
        fields: [
          ["Satuan", m.satuan],
          ["Stok", `${stockNum} ${m.satuan}`],
          ["Stok Minimum", `${minStockNum} ${m.satuan}`],
          ["Dikelola Oleh", "Admin"],
        ],
      };
    });

    return {
      title: "Daftar Bahan Baku",
      description: "Lihat stok dan spesifikasi bahan baku.",
      tableTitle: "Data Bahan Baku",
      columns: [
        "Kode",
        "Nama Bahan Baku",
        "Satuan",
        "Stok",
        "Stok Minimum",
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

    const rows: ReferenceRow[] = products.map((p) => {
      const recipeDesc =
        p.resep?.[0]?.deskripsi_resep || p.resep_produk || `Resep ${p.nama_produk}`;
      return {
        code: p.id_produk,
        cells: [
          p.id_produk,
          p.nama_produk,
          p.varian,
          String(p.stok_produk),
          recipeDesc,
        ],
        title: p.nama_produk,
        fields: [
          ["Varian", p.varian],
          ["Stok Produk", String(p.stok_produk)],
          ["Resep Produk", recipeDesc],
          ["Dikelola Oleh", "Admin"],
        ],
      };
    });

    return {
      title: "Daftar Produk",
      description: "Lihat varian, stok, dan resep produk acuan mutu.",
      tableTitle: "Data Produk",
      columns: [
        "Kode",
        "Nama Produk",
        "Varian",
        "Stok Produk",
        "Resep Produk",
      ],
      backgroundImage: "/images/karyawan-qc/background-produk.jpg",
      rows,
    };
  }

  if (section === "jadwal-produksi") {
    const schedules = await prisma.jadwal_produksi.findMany({
      where: { id_karyawanqc: karyawanQcId },
      orderBy: [{ tanggal_produksi: "desc" }, { id_jadwalproduksi: "asc" }],
      include: {
        permintaan_produk: { include: { produk: true } },
        karyawan_produksi: { include: { pengguna: true } },
        karyawan_qc: { include: { pengguna: true } },
        owner: { include: { pengguna: true } },
      },
    });

    const rows: ReferenceRow[] = schedules.map((s) => {
      const prodName = `${s.permintaan_produk.produk.nama_produk} ${s.permintaan_produk.produk.varian}`.trim();
      const dateStr = formatProductionDate(formatDate(s.tanggal_produksi));
      return {
        code: s.id_jadwalproduksi,
        cells: [
          s.id_jadwalproduksi,
          dateStr,
          prodName,
          String(s.jumlah_target),
          s.status_verifikasi,
          s.status_jadwal,
        ],
        title: prodName,
        fields: [
          ["Tanggal Produksi", dateStr],
          ["Jumlah Target", String(s.jumlah_target)],
          ["Status Verifikasi", s.status_verifikasi],
          ["Status Jadwal", s.status_jadwal],
          ["Permintaan Produk", `${s.id_permintaan} — ${prodName}`],
          ["Dibuat Oleh", "Admin"],
          ["Karyawan Produksi", s.karyawan_produksi.pengguna.nama_lengkap],
          ["Karyawan QC", s.karyawan_qc.pengguna.nama_lengkap],
          ["Diverifikasi Oleh", s.owner.pengguna.nama_lengkap],
        ],
      };
    });

    return {
      title: "Daftar Jadwal Produksi",
      description:
        "Lihat jadwal produksi beserta target dan status verifikasinya. Klik Lihat pada baris data untuk membuka rincian jadwal.",
      tableTitle: "Data Jadwal Produksi",
      columns: [
        "Kode",
        "Tanggal Produksi",
        "Produk",
        "Jumlah Target",
        "Status Verifikasi",
        "Status Jadwal",
      ],
      backgroundImage: "/images/karyawan-qc/background-jadwal-produksi.jpg",
      rows,
    };
  }

  if (section === "jadwal-qc") {
    const schedules = await prisma.jadwal_pemeriksaan_qc.findMany({
      where: { id_karyawanqc: karyawanQcId },
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

    const rows: ReferenceRow[] = schedules.map((s) => {
      const prod = s.jadwal_produksi;
      const prodName = prod
        ? `${prod.permintaan_produk.produk.nama_produk} ${prod.permintaan_produk.produk.varian}`.trim()
        : "";
      const dateStr = s.tanggal_pemeriksaan
        ? formatKqcDate(formatDate(s.tanggal_pemeriksaan))
        : "—";
      const type = s.jenis_pemeriksaan || "Pemeriksaan Mutu";

      return {
        code: s.id_jadwalqc,
        cells: [
          s.id_jadwalqc,
          dateStr,
          type,
          s.id_jadwalproduksi,
          s.status_verifikasi || "Menunggu",
          s.status_pemeriksaan || "Terjadwal",
        ],
        title: type,
        fields: [
          ["Tanggal Pemeriksaan", dateStr],
          ["Jenis Pemeriksaan", type],
          ["Jadwal Produksi", `${s.id_jadwalproduksi} — ${prodName}`],
          ["Dibuat Oleh", "Admin"],
          ["Status Verifikasi", s.status_verifikasi || "Menunggu"],
          ["Status Pemeriksaan", s.status_pemeriksaan || "Terjadwal"],
          ["Karyawan QC", s.karyawan_qc.pengguna.nama_lengkap],
          ["Karyawan Produksi", s.karyawan_produksi.pengguna.nama_lengkap],
          ["Diverifikasi Oleh", s.owner.pengguna.nama_lengkap],
        ],
      };
    });

    return {
      title: "Daftar Jadwal QC",
      description:
        "Lihat jadwal pemeriksaan QC beserta jenis dan statusnya. Klik Lihat pada baris data untuk membuka rincian jadwal.",
      tableTitle: "Data Jadwal QC",
      columns: [
        "Kode",
        "Tanggal Pemeriksaan",
        "Jenis Pemeriksaan",
        "Jadwal Produksi",
        "Status Verifikasi",
        "Status Pemeriksaan",
      ],
      backgroundImage: "/images/karyawan-qc/background-jadwal-qc.jpg",
      rows,
    };
  }

  if (section === "riwayat-pemeriksaan") {
    const results = await prisma.hasil_pemeriksaan_qc.findMany({
      where: { id_karyawanqc: karyawanQcId },
      orderBy: [{ tanggal_pencatatan: "desc" }, { id_hasilqc: "asc" }],
      include: {
        jadwal_pemeriksaan_qc: true,
        karyawan_qc: { include: { pengguna: true } },
        hasil_qc_hasil_produksi: true,
        tindakan_perbaikan: true,
      },
    });

    const rows: ReferenceRow[] = results.map((r) => {
      const dateStr = formatKqcDate(formatDate(r.tanggal_pencatatan));
      const corrective =
        r.tindakan_perbaikan?.[0]?.hasil_tindakan || "Tidak ada tindakan khusus.";
      const prodCode = r.hasil_qc_hasil_produksi?.[0]?.id_hasil || "—";
      const reportStr = r.id_laporan ? `LAP-${String(r.id_laporan).padStart(3, "0")}` : "—";
      const scheduleType = r.jadwal_pemeriksaan_qc.jenis_pemeriksaan || "Pemeriksaan Mutu";

      return {
        code: r.id_hasilqc,
        cells: [
          r.id_hasilqc,
          dateStr,
          r.id_jadwalqc,
          String(r.jumlah_diperiksa),
          String(r.jumlah_lolos),
          String(r.jumlah_reject),
          r.keterangan,
        ],
        title: scheduleType,
        fields: [
          ["Tanggal Pencatatan", dateStr],
          ["Jadwal QC", `${r.id_jadwalqc} — ${scheduleType}`],
          ["Jumlah Diperiksa", String(r.jumlah_diperiksa)],
          ["Jumlah Lolos", String(r.jumlah_lolos)],
          ["Jumlah Reject", String(r.jumlah_reject)],
          ["Hasil Produksi", prodCode],
          ["Dicatat Oleh", r.karyawan_qc.pengguna.nama_lengkap],
          ["Laporan", reportStr],
          ["Keterangan", r.keterangan],
          ["Tindakan Perbaikan", corrective],
        ],
      };
    });

    return {
      title: "Riwayat Pemeriksaan",
      description:
        "Lihat riwayat hasil pemeriksaan QC yang sudah dicatat. Klik Lihat pada baris data untuk membuka rinciannya.",
      tableTitle: "Riwayat Hasil Pemeriksaan",
      columns: [
        "Kode",
        "Tanggal Pencatatan",
        "Jadwal QC",
        "Diperiksa",
        "Lolos",
        "Reject",
        "Keterangan",
      ],
      backgroundImage: "/images/karyawan-qc/background-riwayat.jpg",
      rows,
    };
  }

  return null;
}

export async function getReferenceRowData(
  section: KaryawanQcSection,
  code: string,
  karyawanQcId: string,
): Promise<ReferenceRow | null> {
  const data = await getReferenceSectionData(section, karyawanQcId);
  if (!data) return null;
  const decoded = decodeURIComponent(code).toLowerCase();
  return (
    data.rows.find((row) => row.code.toLowerCase() === decoded) ?? null
  );
}
