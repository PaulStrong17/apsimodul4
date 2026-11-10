import { bahanBakuData } from "../bahan-baku/data";
import { products } from "../data-produk/data";
import { productionSchedules } from "../jadwal-produksi/data";
import { qualitySchedules } from "../jadwal-qc/data";
import { reports } from "../laporan/data";

export const ownerMaterials = [
  { ...bahanBakuData[0], stock: 25, minimumStock: 5, detailStock: 250 },
  { ...bahanBakuData[1] },
  { ...bahanBakuData[2] },
  {
    code: "BB-004",
    name: "Telur Ayam",
    unit: "kg",
    stock: 45,
    minimumStock: 15,
    price: 28800,
    note: "",
  },
  {
    code: "BB-005",
    name: "Mentega",
    unit: "kg",
    stock: 60,
    minimumStock: 10,
    price: 26600,
    note: "",
  },
  { ...bahanBakuData[5] },
];

export const ownerProducts = products;
export const ownerProductionSchedules = productionSchedules;
export const ownerQualitySchedules = qualitySchedules;
export const ownerReports = reports.map((report) =>
  report.code === "LP-005"
    ? { ...report, type: "Laporan Produksi" as const }
    : report,
);

export const verificationItems = [
  {
    code: "JP-001",
    type: "Jadwal Produksi",
    date: "2026-10-22",
    description: "Keripik Cabe Original · 500 pcs",
    responsible: "Raffa Fahrezy",
    status: "Sudah Disetujui",
  },
  {
    code: "JP-003",
    type: "Jadwal Produksi",
    date: "2026-10-26",
    description: "Keripik Cabe Original · 600 pcs",
    responsible: "Dewi Lestari",
    status: "Menunggu Keputusan",
  },
  {
    code: "JP-004",
    type: "Jadwal Produksi",
    date: "2026-10-27",
    description: "Keripik Cabe Extra Pedas · 350 pcs",
    responsible: "Agus Pratama",
    status: "Menunggu Keputusan",
  },
  {
    code: "JQ-001",
    type: "Jadwal QC",
    date: "2026-10-22",
    description: "Pemeriksaan Bahan Baku",
    responsible: "Siti Rahma",
    status: "Sudah Disetujui",
  },
  {
    code: "JQ-003",
    type: "Jadwal QC",
    date: "2026-10-26",
    description: "Pemeriksaan Produk Akhir",
    responsible: "Budi Santoso",
    status: "Menunggu Keputusan",
  },
];

export function getOwnerMaterial(code: string) {
  return ownerMaterials.find(
    (material) => material.code.toLowerCase() === code.toLowerCase(),
  );
}

export function getOwnerProduct(code: string) {
  return ownerProducts.find(
    (product) => product.code.toLowerCase() === code.toLowerCase(),
  );
}

export function getOwnerProductionSchedule(code: string) {
  return ownerProductionSchedules.find(
    (schedule) => schedule.code.toLowerCase() === code.toLowerCase(),
  );
}

export function getOwnerQualitySchedule(code: string) {
  return ownerQualitySchedules.find(
    (schedule) => schedule.code.toLowerCase() === code.toLowerCase(),
  );
}

export function getOwnerReport(code: string) {
  return ownerReports.find(
    (report) => report.code.toLowerCase() === code.toLowerCase(),
  );
}

export function formatOwnerDate(date: string, month: "short" | "long" = "short") {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month,
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`)).replace(".", "");
}
