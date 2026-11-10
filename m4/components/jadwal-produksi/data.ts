export type ProductionScheduleStatus =
  | "Direncanakan"
  | "Terjadwal"
  | "Selesai"
  | "Dibatalkan";

export type VerificationStatus =
  | "Menunggu"
  | "Terverifikasi"
  | "Ditolak";

export type ProductionSchedule = {
  code: string;
  productionDate: string;
  requestCode: string;
  productName: string;
  target: number;
  productionEmployee: string;
  qualityControlEmployee: string;
  status: ProductionScheduleStatus;
  verificationStatus: VerificationStatus;
  owner: string;
};

export const productionSchedules: ProductionSchedule[] = [
  {
    code: "JP-001",
    productionDate: "2026-10-22",
    requestCode: "PRM-001",
    productName: "Keripik Cabe Original",
    target: 500,
    productionEmployee: "Raffa Fahrezy",
    qualityControlEmployee: "Rizki Dinu",
    status: "Selesai",
    verificationStatus: "Terverifikasi",
    owner: "Onang",
  },
  {
    code: "JP-002",
    productionDate: "2026-10-23",
    requestCode: "PRM-002",
    productName: "Keripik Cabe Pedas",
    target: 400,
    productionEmployee: "Handika Kurniawan",
    qualityControlEmployee: "Rizki Dinu",
    status: "Selesai",
    verificationStatus: "Terverifikasi",
    owner: "Onang",
  },
  {
    code: "JP-003",
    productionDate: "2026-10-26",
    requestCode: "PRM-001",
    productName: "Keripik Cabe Original",
    target: 600,
    productionEmployee: "Raffa Fahrezy",
    qualityControlEmployee: "Rizki Dinu",
    status: "Terjadwal",
    verificationStatus: "Menunggu",
    owner: "Onang",
  },
  {
    code: "JP-004",
    productionDate: "2026-10-27",
    requestCode: "PRM-003",
    productName: "Keripik Cabe Extra Pedas",
    target: 350,
    productionEmployee: "Handika Kurniawan",
    qualityControlEmployee: "Rizki Dinu",
    status: "Direncanakan",
    verificationStatus: "Menunggu",
    owner: "Onang",
  },
  {
    code: "JP-005",
    productionDate: "2026-10-28",
    requestCode: "PRM-002",
    productName: "Keripik Cabe Pedas",
    target: 450,
    productionEmployee: "Raffa Fahrezy",
    qualityControlEmployee: "Rizki Dinu",
    status: "Direncanakan",
    verificationStatus: "Menunggu",
    owner: "Onang",
  },
];

export const productionRequests = [
  { code: "PRM-001", productName: "Keripik Cabe Original" },
  { code: "PRM-002", productName: "Keripik Cabe Pedas" },
  { code: "PRM-003", productName: "Keripik Cabe Extra Pedas" },
];

export const productionEmployees = ["Raffa Fahrezy", "Handika Kurniawan"];
export const qualityControlEmployees = ["Rizki Dinu"];
export const scheduleStatuses: ProductionScheduleStatus[] = [
  "Direncanakan",
  "Terjadwal",
  "Selesai",
  "Dibatalkan",
];
export const verificationStatuses: VerificationStatus[] = [
  "Menunggu",
  "Terverifikasi",
  "Ditolak",
];
export const scheduleOwners = ["Onang"];

export function getProductionSchedule(code: string) {
  return productionSchedules.find(
    (schedule) => schedule.code.toLowerCase() === code.toLowerCase(),
  );
}

export function formatProductionDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function getProductRequestLabel(schedule: ProductionSchedule) {
  return `${schedule.requestCode} · ${schedule.productName}`;
}
