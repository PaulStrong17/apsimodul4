import { bahanBakuData, formatRupiah } from "../bahan-baku/data";
import { products } from "../data-produk/data";
import {
  formatProductionDate,
  productionSchedules,
} from "../jadwal-produksi/data";
import { qualitySchedules } from "../jadwal-qc/data";

export const productionEmployeeName = "Raffa Fahrezy";

export const productionNavigation = [
  {
    label: "Bahan Baku",
    href: "/karyawan-produksi/bahan-baku",
    icon: "/images/bahan-baku/nav-bahan-baku.svg",
    section: "bahan-baku",
  },
  {
    label: "Data Produk",
    href: "/karyawan-produksi/data-produk",
    icon: "/images/bahan-baku/nav-data-produk.svg",
    section: "data-produk",
  },
  {
    label: "Jadwal Produksi",
    href: "/karyawan-produksi/jadwal-produksi",
    icon: "/images/bahan-baku/nav-jadwal-produksi.svg",
    section: "jadwal-produksi",
  },
  {
    label: "Jadwal QC",
    href: "/karyawan-produksi/jadwal-qc",
    icon: "/images/bahan-baku/nav-jadwal-qc.svg",
    section: "jadwal-qc",
  },
  {
    label: "Input Data Progress Produk",
    href: "/karyawan-produksi/input-progress-produk",
    icon: "/images/karyawan-produksi/nav-progress-produk.svg",
    section: "input-progress-produk",
  },
  {
    label: "Input Data Hasil Produksi",
    href: "/karyawan-produksi/input-hasil-produksi",
    icon: "/images/karyawan-produksi/nav-hasil-produksi.svg",
    section: "input-hasil-produksi",
  },
  {
    label: "Lihat Tindakan Perbaikan",
    href: "/karyawan-produksi/tindakan-perbaikan",
    icon: "/images/karyawan-produksi/nav-tindakan-perbaikan.svg",
    section: "tindakan-perbaikan",
  },
] as const;

export type ProductionSection =
  (typeof productionNavigation)[number]["section"];
export type ProductionActiveSection = ProductionSection | "keluar";

export type ProductionRow = {
  code: string;
  title: string;
  cells: string[];
  fields: [string, string][];
};

export type ProductionReference = {
  title: string;
  description: string;
  tableTitle: string;
  columns: string[];
  backgroundImage: string;
  rows: ProductionRow[];
};

const assignedSchedules = productionSchedules.filter(
  (schedule) => schedule.productionEmployee === productionEmployeeName,
);

const repairActions: ProductionRow[] = [
  {
    code: "TP-001",
    title: "Pemeriksaan ulang kemasan",
    cells: [
      "TP-001",
      "JP-003",
      "Kemasan kurang rapat",
      "Menunggu Perbaikan",
      "26 Oktober 2026",
    ],
    fields: [
      ["Jadwal Produksi", "JP-003"],
      ["Masalah", "Kemasan kurang rapat"],
      ["Tindakan", "Periksa dan rapatkan ulang kemasan sebelum diserahkan ke QC."],
      ["Status", "Menunggu Perbaikan"],
      ["Tanggal", "26 Oktober 2026"],
    ],
  },
  {
    code: "TP-002",
    title: "Penyesuaian tingkat kepedasan",
    cells: [
      "TP-002",
      "JP-005",
      "Rasa belum konsisten",
      "Dalam Tindakan",
      "28 Oktober 2026",
    ],
    fields: [
      ["Jadwal Produksi", "JP-005"],
      ["Masalah", "Rasa belum konsisten"],
      ["Tindakan", "Sesuaikan takaran bumbu mengikuti resep produk."],
      ["Status", "Dalam Tindakan"],
      ["Tanggal", "28 Oktober 2026"],
    ],
  },
];

export const productionReferences: Record<
  Exclude<ProductionSection, "input-progress-produk" | "input-hasil-produksi">,
  ProductionReference
> = {
  "bahan-baku": {
    title: "Daftar Bahan Baku",
    description: "Lihat ketersediaan bahan baku untuk mendukung kegiatan produksi.",
    tableTitle: "Data Bahan Baku",
    columns: ["Kode", "Nama Bahan Baku", "Satuan", "Stok", "Stok Minimum"],
    backgroundImage: "/images/karyawan-qc/background-bahan-baku.jpg",
    rows: bahanBakuData.map((material) => ({
      code: material.code,
      title: material.name,
      cells: [
        material.code,
        material.name,
        material.unit,
        `${material.stock} ${material.unit}`,
        `${material.minimumStock} ${material.unit}`,
      ],
      fields: [
        ["Nama Bahan Baku", material.name],
        ["Satuan", material.unit],
        ["Stok", `${material.stock} ${material.unit}`],
        ["Stok Minimum", `${material.minimumStock} ${material.unit}`],
        ["Dikelola Oleh", "Admin"],
      ],
    })),
  },
  "data-produk": {
    title: "Daftar Produk",
    description: "Lihat informasi produk dan resep yang menjadi acuan produksi.",
    tableTitle: "Data Produk",
    columns: ["Kode", "Nama Produk", "Varian", "Stok Produk", "Keterangan"],
    backgroundImage: "/images/karyawan-qc/background-produk.jpg",
    rows: products.map((product) => ({
      code: product.code,
      title: product.name,
      cells: [
        product.code,
        product.name,
        product.variation,
        `${product.stock} pcs`,
        product.description,
      ],
      fields: [
        ["Nama Produk", product.name],
        ["Varian", product.variation],
        ["Stok Produk", `${product.stock} pcs`],
        ["Harga", formatRupiah(product.price)],
        ["Keterangan", product.description],
      ],
    })),
  },
  "jadwal-produksi": {
    title: "Jadwal Produksi",
    description: `Tinjau jadwal yang ditugaskan kepada ${productionEmployeeName}.`,
    tableTitle: "Jadwal Produksi Saya",
    columns: [
      "Kode",
      "Tanggal Produksi",
      "Produk",
      "Jumlah Target",
      "Status Jadwal",
    ],
    backgroundImage: "/images/karyawan-qc/background-jadwal-produksi.jpg",
    rows: assignedSchedules.map((schedule) => ({
      code: schedule.code,
      title: schedule.productName,
      cells: [
        schedule.code,
        formatProductionDate(schedule.productionDate),
        schedule.productName,
        `${schedule.target} pcs`,
        schedule.status,
      ],
      fields: [
        ["Tanggal Produksi", formatProductionDate(schedule.productionDate)],
        ["Permintaan Produk", `${schedule.requestCode} — ${schedule.productName}`],
        ["Jumlah Target", `${schedule.target} pcs`],
        ["Status Jadwal", schedule.status],
        ["Status Verifikasi", schedule.verificationStatus],
        ["Karyawan Produksi", schedule.productionEmployee],
        ["Karyawan QC", schedule.qualityControlEmployee],
      ],
    })),
  },
  "jadwal-qc": {
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
    rows: qualitySchedules
      .filter((schedule) => schedule.productionEmployee === productionEmployeeName)
      .map((schedule) => ({
        code: schedule.code,
        title: schedule.type,
        cells: [
          schedule.code,
          formatProductionDate(schedule.inspectionDate),
          schedule.type,
          schedule.productionCode,
          schedule.status,
        ],
        fields: [
          ["Tanggal Pemeriksaan", formatProductionDate(schedule.inspectionDate)],
          ["Jenis Pemeriksaan", schedule.type],
          ["Jadwal Produksi", schedule.productionCode],
          ["Status Pemeriksaan", schedule.status],
          ["Status Verifikasi", schedule.verificationStatus],
          ["Karyawan Produksi", schedule.productionEmployee],
          ["Karyawan QC", schedule.qualityControlEmployee],
        ],
      })),
  },
  "tindakan-perbaikan": {
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
    rows: repairActions,
  },
};

export function isProductionSection(value: string): value is ProductionSection {
  return productionNavigation.some((item) => item.section === value);
}

export function isProductionReferenceSection(
  section: ProductionSection,
): section is keyof typeof productionReferences {
  return Object.hasOwn(productionReferences, section);
}

export function getProductionReference(section: ProductionSection) {
  return isProductionReferenceSection(section)
    ? productionReferences[section]
    : undefined;
}

export function getProductionRow(section: ProductionSection, code: string) {
  return getProductionReference(section)?.rows.find(
    (row) => row.code.toLowerCase() === code.toLowerCase(),
  );
}

export function getAssignedProductionSchedules() {
  return assignedSchedules;
}
