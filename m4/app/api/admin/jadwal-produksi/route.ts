import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { requireAdminApi } from "@/lib/admin/authorization";
import {
  parseScheduleCreateInput,
} from "@/lib/admin/schedule-input";
import {
  getAdminScheduleOptions,
  listAdminSchedules,
} from "@/lib/admin/schedules";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const authorization = await requireAdminApi();
  if (authorization.error) return authorization.error;

  try {
    const [schedules, options] = await Promise.all([
      listAdminSchedules(authorization.adminId),
      getAdminScheduleOptions(authorization.adminId),
    ]);

    return NextResponse.json({ schedules, options });
  } catch (error) {
    console.error("Could not load production schedules:", error);
    return NextResponse.json(
      { error: "Jadwal produksi tidak dapat dimuat." },
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

  const schedule = parseScheduleCreateInput(body);
  if (!schedule) {
    return NextResponse.json(
      { error: "Periksa kode, tanggal, target, referensi, dan status jadwal." },
      { status: 400 },
    );
  }

  try {
    const options = await getAdminScheduleOptions(authorization.adminId);
    if (!options.requests.some((option) => option.id === schedule.requestId)) {
      return NextResponse.json(
        {
          error:
            "Permintaan produk tidak valid atau bukan milik Admin ini.",
        },
        { status: 400 },
      );
    }
    if (!options.owners.some((option) => option.id === schedule.ownerId)) {
      return NextResponse.json(
        { error: "Owner penanggung jawab tidak terdaftar." },
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

    const created = await prisma.jadwal_produksi.create({
      data: {
        id_jadwalproduksi: schedule.code,
        tanggal_produksi: schedule.productionDate,
        jumlah_target: schedule.target,
        status_jadwal: schedule.status,
        status_verifikasi: schedule.verificationStatus,
        id_admin: authorization.adminId,
        id_permintaan: schedule.requestId,
        id_owner: schedule.ownerId,
        id_karyawanproduksi: schedule.productionEmployeeId,
        id_karyawanqc: schedule.qualityControlEmployeeId,
      },
      select: { id_jadwalproduksi: true },
    });

    return NextResponse.json(
      { code: created.id_jadwalproduksi },
      { status: 201 },
    );
  } catch (error) {
    console.error("Could not create production schedule:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Kode jadwal tersebut sudah digunakan." },
        { status: 409 },
      );
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        { error: "Referensi jadwal sudah tidak tersedia. Muat ulang halaman." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan saat menyimpan jadwal produksi." },
      { status: 500 },
    );
  }
}
