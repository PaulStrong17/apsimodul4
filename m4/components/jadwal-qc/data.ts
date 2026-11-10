import {
  formatProductionDate,
  productionSchedules,
} from "../jadwal-produksi/data";

export type InspectionStatus =
  | "Direncanakan"
  | "Terjadwal"
  | "Selesai"
  | "Dibatalkan";
export type InspectionVerificationStatus =
  | "Menunggu"
  | "Terverifikasi"
  | "Ditolak";

export type QualitySchedule = {
  code: string;
  inspectionDate: string;
  type: string;
  productionCode: string;
  qualityControlEmployee: string;
  productionEmployee: string;
  status: InspectionStatus;
  verificationStatus: InspectionVerificationStatus;
  owner: string;
  createdBy: string;
};

export const inspectionStatuses: InspectionStatus[] = [
  "Direncanakan",
  "Terjadwal",
  "Selesai",
  "Dibatalkan",
];

export const inspectionVerificationStatuses: InspectionVerificationStatus[] = [
  "Menunggu",
  "Terverifikasi",
  "Ditolak",
];

// Kept for owner/karyawan-produksi read-only views (static data)
export const qualitySchedules: QualitySchedule[] = [
  {
    code: "JQ001",
    inspectionDate: "2026-10-22",
    type: "Pemeriksaan Bahan Baku",
    productionCode: "JP001",
    qualityControlEmployee: "Rizki Dinu",
    productionEmployee: "Raffa Fahrezy",
    status: "Selesai",
    verificationStatus: "Terverifikasi",
    owner: "Onang",
    createdBy: "Admin",
  },
  {
    code: "JQ002",
    inspectionDate: "2026-10-23",
    type: "Pemeriksaan Selama Proses",
    productionCode: "JP002",
    qualityControlEmployee: "Rizki Dinu",
    productionEmployee: "Handika Kurniawan",
    status: "Selesai",
    verificationStatus: "Terverifikasi",
    owner: "Onang",
    createdBy: "Admin",
  },
  {
    code: "JQ003",
    inspectionDate: "2026-10-26",
    type: "Pemeriksaan Produk Akhir",
    productionCode: "JP003",
    qualityControlEmployee: "Aisyah Dwina",
    productionEmployee: "Raffa Fahrezy",
    status: "Terjadwal",
    verificationStatus: "Menunggu",
    owner: "Onang",
    createdBy: "Admin",
  },
];

export function getQualitySchedule(code: string) {
  return qualitySchedules.find(
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
  const productionSchedule = productionSchedules.find(
    (s) => s.code.toLowerCase() === schedule.productionCode.toLowerCase(),
  );
  return productionSchedule
    ? `${productionSchedule.code} · ${formatShortInspectionDate(productionSchedule.productionDate)}`
    : schedule.productionCode;
}
