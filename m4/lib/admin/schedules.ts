import { prisma } from "@/lib/prisma";

export type ScheduleOption = {
  id: string;
  label: string;
};

export type AdminScheduleOptions = {
  requests: ScheduleOption[];
  owners: ScheduleOption[];
  productionEmployees: ScheduleOption[];
  qualityControlEmployees: ScheduleOption[];
};

export type AdminProductionSchedule = {
  code: string;
  productionDate: string;
  requestCode: string;
  requestLabel: string;
  productName: string;
  target: number;
  productionEmployeeId: string;
  productionEmployee: string;
  qualityControlEmployeeId: string;
  qualityControlEmployee: string;
  ownerId: string;
  owner: string;
  status: string;
  verificationStatus: string;
};

function mapSchedule(schedule: {
  id_jadwalproduksi: string;
  tanggal_produksi: Date;
  jumlah_target: number;
  status_jadwal: string;
  status_verifikasi: string;
  id_permintaan: string;
  id_owner: string;
  id_karyawanqc: string;
  id_karyawanproduksi: string;
  permintaan_produk: {
    jumlah_diminta: number;
    status_permintaan: string;
    produk: { nama_produk: string; varian: string };
  };
  owner: { pengguna: { nama_lengkap: string } };
  karyawan_qc: { pengguna: { nama_lengkap: string } };
  karyawan_produksi: { pengguna: { nama_lengkap: string } };
}): AdminProductionSchedule {
  const productName = `${schedule.permintaan_produk.produk.nama_produk} ${schedule.permintaan_produk.produk.varian}`.trim();

  return {
    code: schedule.id_jadwalproduksi,
    productionDate: schedule.tanggal_produksi.toISOString().slice(0, 10),
    requestCode: schedule.id_permintaan,
    requestLabel: `${schedule.id_permintaan} · ${productName}`,
    productName,
    target: schedule.jumlah_target,
    productionEmployeeId: schedule.id_karyawanproduksi,
    productionEmployee: schedule.karyawan_produksi.pengguna.nama_lengkap,
    qualityControlEmployeeId: schedule.id_karyawanqc,
    qualityControlEmployee: schedule.karyawan_qc.pengguna.nama_lengkap,
    ownerId: schedule.id_owner,
    owner: schedule.owner.pengguna.nama_lengkap,
    status: schedule.status_jadwal,
    verificationStatus: schedule.status_verifikasi,
  };
}

const scheduleSelect = {
  id_jadwalproduksi: true,
  tanggal_produksi: true,
  jumlah_target: true,
  status_jadwal: true,
  status_verifikasi: true,
  id_permintaan: true,
  id_owner: true,
  id_karyawanqc: true,
  id_karyawanproduksi: true,
  permintaan_produk: {
    select: {
      jumlah_diminta: true,
      status_permintaan: true,
      produk: { select: { nama_produk: true, varian: true } },
    },
  },
  owner: { select: { pengguna: { select: { nama_lengkap: true } } } },
  karyawan_qc: { select: { pengguna: { select: { nama_lengkap: true } } } },
  karyawan_produksi: {
    select: { pengguna: { select: { nama_lengkap: true } } },
  },
} as const;

export async function listAdminSchedules(adminId: string) {
  const schedules = await prisma.jadwal_produksi.findMany({
    where: { id_admin: adminId },
    orderBy: [{ tanggal_produksi: "asc" }, { id_jadwalproduksi: "asc" }],
    select: scheduleSelect,
  });

  return schedules.map(mapSchedule);
}

export async function getAdminSchedule(adminId: string, code: string) {
  const schedule = await prisma.jadwal_produksi.findFirst({
    where: { id_admin: adminId, id_jadwalproduksi: code },
    select: scheduleSelect,
  });

  return schedule ? mapSchedule(schedule) : null;
}

export async function getAdminScheduleOptions(
  adminId: string,
): Promise<AdminScheduleOptions> {
  const [requests, owners, productionEmployees, qualityControlEmployees] =
    await Promise.all([
      prisma.permintaan_produk.findMany({
        where: { id_admin: adminId },
        orderBy: { id_permintaan: "asc" },
        select: {
          id_permintaan: true,
          jumlah_diminta: true,
          status_permintaan: true,
          produk: { select: { nama_produk: true, varian: true } },
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
    requests: requests.map((request) => ({
      id: request.id_permintaan,
      label: `${request.id_permintaan} · ${request.produk.nama_produk} ${request.produk.varian} · ${request.jumlah_diminta} pcs · ${request.status_permintaan}`,
    })),
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
