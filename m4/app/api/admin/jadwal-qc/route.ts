import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { requireAdminApi } from "@/lib/admin/authorization";
import { parseQcScheduleCreateInput } from "@/lib/admin/qc-schedule-input";
import {
  getAdminQcScheduleOptions,
  listAdminQcSchedules,
} from "@/lib/admin/qc-schedules";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const authorization = await requireAdminApi();
  if (authorization.error) return authorization.error;

  try {
    const [schedules, options] = await Promise.all([
      listAdminQcSchedules(authorization.adminId),
      getAdminQcScheduleOptions(authorization.adminId),
    ]);

    return NextResponse.json({ schedules, options });
  } catch (error) {
    console.error("Could not load QC schedules:", error);
    return NextResponse.json(
      { error: "Jadwal pemeriksaan QC tidak dapat dimuat." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const authorization = await requireAdminApi();
  if (authorization.error) return authorization.error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Format permintaan tidak valid." },
      { status: 400 },
    );
  }

  const schedule = parseQcScheduleCreateInput(body);
  if (!schedule) {
    return NextResponse.json(
      {
        error:
          "Periksa kode, tanggal pemeriksaan, jenis pemeriksaan, referensi jadwal produksi, karyawan, dan owner.",
      },
      { status: 400 },
    );
  }

  try {
    const options = await getAdminQcScheduleOptions(authorization.adminId);
    if (
      !options.productionSchedules.some(
        (option) => option.id === schedule.productionScheduleId,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Jadwal produksi tidak valid atau bukan milik Admin ini.",
        },
        { status: 400 },
      );
    }
    if (
      !options.qualityControlEmployees.some(
        (option) => option.id === schedule.qualityControlEmployeeId,
      )
    ) {
      return NextResponse.json(
        { error: "Karyawan QC tidak terdaftar." },
        { status: 400 },
      );
    }
    if (
      !options.productionEmployees.some(
        (option) => option.id === schedule.productionEmployeeId,
      )
    ) {
      return NextResponse.json(
        { error: "Karyawan produksi tidak terdaftar." },
        { status: 400 },
      );
    }
    if (!options.owners.some((option) => option.id === schedule.ownerId)) {
      return NextResponse.json(
        { error: "Owner penanggung jawab tidak terdaftar." },
        { status: 400 },
      );
    }

    const created = await prisma.jadwal_pemeriksaan_qc.create({
      data: {
        id_jadwalqc: schedule.code,
        tanggal_pemeriksaan: schedule.inspectionDate,
        jenis_pemeriksaan: schedule.type,
        status_verifikasi: schedule.verificationStatus,
        status_pemeriksaan: schedule.status,
        id_jadwalproduksi: schedule.productionScheduleId,
        id_admin: authorization.adminId,
        id_owner: schedule.ownerId,
        id_karyawanqc: schedule.qualityControlEmployeeId,
        id_karyawanproduksi: schedule.productionEmployeeId,
      },
      select: { id_jadwalqc: true },
    });

    return NextResponse.json(
      { code: created.id_jadwalqc },
      { status: 201 },
    );
  } catch (error) {
    console.error("Could not create QC schedule:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Kode jadwal QC tersebut sudah digunakan." },
        { status: 409 },
      );
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        {
          error: "Referensi jadwal sudah tidak tersedia. Muat ulang halaman.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan saat menyimpan jadwal pemeriksaan QC." },
      { status: 500 },
    );
  }
}
