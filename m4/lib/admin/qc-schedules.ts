import { prisma } from "@/lib/prisma";

export type QcScheduleOption = {
  id: string;
  label: string;
};

export type AdminQcScheduleOptions = {
  productionSchedules: QcScheduleOption[];
  qualityControlEmployees: QcScheduleOption[];
  productionEmployees: QcScheduleOption[];
  owners: QcScheduleOption[];
};

export type AdminQcSchedule = {
  code: string;
  inspectionDate: string;
  type: string;
  productionCode: string;
  productionLabel: string;
  productName: string;
  qualityControlEmployeeId: string;
  qualityControlEmployee: string;
  productionEmployeeId: string;
  productionEmployee: string;
  ownerId: string;
  owner: string;
  status: string;
  verificationStatus: string;
  createdBy: string;
};

function formatDate(date: Date | null) {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

function mapQcSchedule(schedule: {
  id_jadwalqc: string;
  tanggal_pemeriksaan: Date | null;
  jenis_pemeriksaan: string | null;
  status_verifikasi: string | null;
  status_pemeriksaan: string | null;
  id_jadwalproduksi: string;
  id_owner: string;
  id_karyawanqc: string;
  id_karyawanproduksi: string;
  jadwal_produksi: {
    id_jadwalproduksi: string;
    tanggal_produksi: Date;
    permintaan_produk: {
      produk: { nama_produk: string; varian: string };
    };
  };
  owner: { pengguna: { nama_lengkap: string } };
  karyawan_qc: { pengguna: { nama_lengkap: string } };
  karyawan_produksi: { pengguna: { nama_lengkap: string } };
}): AdminQcSchedule {
  const prod = schedule.jadwal_produksi;
  const productName = `${prod.permintaan_produk.produk.nama_produk} ${prod.permintaan_produk.produk.varian}`.trim();
  const prodDate = formatDate(prod.tanggal_produksi);

  return {
    code: schedule.id_jadwalqc,
    inspectionDate: formatDate(schedule.tanggal_pemeriksaan),
    type: schedule.jenis_pemeriksaan ?? "Pemeriksaan Mutu",
    productionCode: schedule.id_jadwalproduksi,
    productionLabel: `${schedule.id_jadwalproduksi} · ${prodDate} · ${productName}`,
    productName,
    qualityControlEmployeeId: schedule.id_karyawanqc,
    qualityControlEmployee: schedule.karyawan_qc.pengguna.nama_lengkap,
    productionEmployeeId: schedule.id_karyawanproduksi,
    productionEmployee: schedule.karyawan_produksi.pengguna.nama_lengkap,
    ownerId: schedule.id_owner,
    owner: schedule.owner.pengguna.nama_lengkap,
    status: schedule.status_pemeriksaan ?? "Terjadwal",
    verificationStatus: schedule.status_verifikasi ?? "Menunggu",
    createdBy: "Admin",
  };
}

const qcScheduleSelect = {
  id_jadwalqc: true,
  tanggal_pemeriksaan: true,
  jenis_pemeriksaan: true,
  status_verifikasi: true,
  status_pemeriksaan: true,
  id_jadwalproduksi: true,
  id_owner: true,
  id_karyawanqc: true,
  id_karyawanproduksi: true,
  jadwal_produksi: {
    select: {
      id_jadwalproduksi: true,
      tanggal_produksi: true,
      permintaan_produk: {
        select: {
          produk: { select: { nama_produk: true, varian: true } },
        },
      },
    },
  },
  owner: { select: { pengguna: { select: { nama_lengkap: true } } } },
  karyawan_qc: { select: { pengguna: { select: { nama_lengkap: true } } } },
  karyawan_produksi: {
    select: { pengguna: { select: { nama_lengkap: true } } },
  },
} as const;

export async function listAdminQcSchedules(adminId: string) {
  const schedules = await prisma.jadwal_pemeriksaan_qc.findMany({
    where: { id_admin: adminId },
    orderBy: [{ tanggal_pemeriksaan: "asc" }, { id_jadwalqc: "asc" }],
    select: qcScheduleSelect,
  });

  return schedules.map(mapQcSchedule);
}

export async function getAdminQcSchedule(adminId: string, code: string) {
  const schedule = await prisma.jadwal_pemeriksaan_qc.findFirst({
    where: { id_admin: adminId, id_jadwalqc: code },
    select: qcScheduleSelect,
  });

  return schedule ? mapQcSchedule(schedule) : null;
}

export async function getAdminQcScheduleOptions(
  adminId: string,
): Promise<AdminQcScheduleOptions> {
  const [productionSchedules, owners, productionEmployees, qualityControlEmployees] =
    await Promise.all([
      prisma.jadwal_produksi.findMany({
        where: { id_admin: adminId },
        orderBy: [{ tanggal_produksi: "asc" }, { id_jadwalproduksi: "asc" }],
        select: {
          id_jadwalproduksi: true,
          tanggal_produksi: true,
          permintaan_produk: {
            select: {
              produk: { select: { nama_produk: true, varian: true } },
            },
          },
        },
      }),
      prisma.owner.findMany({
        orderBy: { id_owner: "asc" },
        select: {
          id_owner: true,
          pengguna: { select: { nama_lengkap: true } },
        },
      }),
      prisma.karyawan_produksi.findMany({
        orderBy: { id_karyawanproduksi: "asc" },
        select: {
          id_karyawanproduksi: true,
          pengguna: { select: { nama_lengkap: true } },
        },
      }),
      prisma.karyawan_qc.findMany({
        orderBy: { id_karyawanqc: "asc" },
        select: {
          id_karyawanqc: true,
          pengguna: { select: { nama_lengkap: true } },
        },
      }),
    ]);

  return {
    productionSchedules: productionSchedules.map((schedule) => {
      const productName = `${schedule.permintaan_produk.produk.nama_produk} ${schedule.permintaan_produk.produk.varian}`.trim();
      const prodDate = formatDate(schedule.tanggal_produksi);
      return {
        id: schedule.id_jadwalproduksi,
        label: `${schedule.id_jadwalproduksi} · ${prodDate} · ${productName}`,
      };
    }),
    owners: owners.map((owner) => ({
      id: owner.id_owner,
      label: `${owner.pengguna.nama_lengkap} (${owner.id_owner})`,
    })),
    productionEmployees: productionEmployees.map((employee) => ({
      id: employee.id_karyawanproduksi,
      label: `${employee.pengguna.nama_lengkap} (${employee.id_karyawanproduksi})`,
    })),
    qualityControlEmployees: qualityControlEmployees.map((employee) => ({
      id: employee.id_karyawanqc,
      label: `${employee.pengguna.nama_lengkap} (${employee.id_karyawanqc})`,
    })),
  };
}
