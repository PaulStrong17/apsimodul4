import {
  formatProductionDate,
  productionSchedules,
} from "../jadwal-produksi/data";

export type InspectionType =
  | "Pemeriksaan Bahan Baku"
  | "Pemeriksaan Selama Proses"
  | "Pemeriksaan Produk Akhir"
  | "Pemeriksaan Kemasan";

export type InspectionStatus = "Terjadwal" | "Berjalan" | "Selesai" | "Dibatalkan";
export type InspectionVerificationStatus =
  | "Belum Terverifikasi"
  | "Terverifikasi"
  | "Perlu Revisi";

export type QualitySchedule = {
  code: string;
  inspectionDate: string;
  type: InspectionType;
  productionCode: string;
  qualityControlEmployee: string;
  productionEmployee: string;
  status: InspectionStatus;
  verificationStatus: InspectionVerificationStatus;
  owner: string;
  createdBy: string;
};

export const inspectionTypes: InspectionType[] = [
  "Pemeriksaan Bahan Baku",
  "Pemeriksaan Selama Proses",
  "Pemeriksaan Produk Akhir",
  "Pemeriksaan Kemasan",
];

export const inspectionStatuses: InspectionStatus[] = [
  "Terjadwal",
  "Berjalan",
  "Selesai",
  "Dibatalkan",
];

export const inspectionVerificationStatuses: InspectionVerificationStatus[] = [
  "Belum Terverifikasi",
  "Terverifikasi",
  "Perlu Revisi",
];

export const qualityControlEmployees = ["Rizki Dinu", "Aisyah Dwina"];

export const qualitySchedules: QualitySchedule[] = [
  {
    code: "JQ-001",
    inspectionDate: "2026-10-22",
    type: "Pemeriksaan Bahan Baku",
    productionCode: "JP-001",
    qualityControlEmployee: "Rizki Dinu",
    productionEmployee: "Raffa Fahrezy",
    status: "Selesai",
    verificationStatus: "Terverifikasi",
    owner: "Onang",
    createdBy: "Admin",
  },
  {
    code: "JQ-002",
    inspectionDate: "2026-10-23",
    type: "Pemeriksaan Selama Proses",
    productionCode: "JP-002",
    qualityControlEmployee: "Rizki Dinu",
    productionEmployee: "Handika Kurniawan",
    status: "Selesai",
    verificationStatus: "Terverifikasi",
    owner: "Onang",
    createdBy: "Admin",
  },
  {
    code: "JQ-003",
    inspectionDate: "2026-10-26",
    type: "Pemeriksaan Produk Akhir",
    productionCode: "JP-003",
    qualityControlEmployee: "Aisyah Dwina",
    productionEmployee: "Raffa Fahrezy",
    status: "Terjadwal",
    verificationStatus: "Belum Terverifikasi",
    owner: "Onang",
    createdBy: "Admin",
  },
  {
    code: "JQ-004",
    inspectionDate: "2026-10-27",
    type: "Pemeriksaan Kemasan",
    productionCode: "JP-004",
    qualityControlEmployee: "Aisyah Dwina",
    productionEmployee: "Handika Kurniawan",
    status: "Terjadwal",
    verificationStatus: "Belum Terverifikasi",
    owner: "Onang",
    createdBy: "Admin",
  },
  {
    code: "JQ-005",
    inspectionDate: "2026-10-28",
    type: "Pemeriksaan Produk Akhir",
    productionCode: "JP-005",
    qualityControlEmployee: "Rizki Dinu",
    productionEmployee: "Raffa Fahrezy",
    status: "Terjadwal",
    verificationStatus: "Belum Terverifikasi",
    owner: "Onang",
    createdBy: "Admin",
  },
];

export function getQualitySchedule(code: string) {
  return qualitySchedules.find(
    (schedule) => schedule.code.toLowerCase() === code.toLowerCase(),
  );
}

export function getQualityProductionSchedule(code: string) {
  return productionSchedules.find(
    (schedule) => schedule.code.toLowerCase() === code.toLowerCase(),
  );
}

export function formatInspectionDate(date: string) {
  return formatProductionDate(date);
}

export function formatShortInspectionDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(new Date(`${date}T00:00:00Z`))
    .replace(".", "");
}

export function getProductionScheduleLabel(schedule: QualitySchedule) {
  const productionSchedule = getQualityProductionSchedule(
    schedule.productionCode,
  );
  return productionSchedule
    ? `${productionSchedule.code} · ${formatShortInspectionDate(
        productionSchedule.productionDate,
      )}`
    : schedule.productionCode;
}
