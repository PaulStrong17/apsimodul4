import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { requireAdminApi } from "@/lib/admin/authorization";
import { parseScheduleUpdateInput } from "@/lib/admin/schedule-input";
import {
  getAdminSchedule,
  getAdminScheduleOptions,
} from "@/lib/admin/schedules";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ kode: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  const authorization = await requireAdminApi();
  if (authorization.error) return authorization.error;
  const { kode } = await params;
  const decodedKode = decodeURIComponent(kode);

  try {
    const schedule = await getAdminSchedule(authorization.adminId, decodedKode);
    if (!schedule) {
      return NextResponse.json(
        { error: "Jadwal produksi tidak ditemukan." },
        { status: 404 },
      );
    }

    const url = new URL(request.url);
    const includeOptions = url.searchParams.get("options") === "true";
    const options = includeOptions
      ? await getAdminScheduleOptions(authorization.adminId)
      : undefined;

    return NextResponse.json({
      schedule,
      ...(options ? { options } : {}),
    });
  } catch (error) {
    console.error("Could not load production schedule:", error);
    return NextResponse.json(
      { error: "Jadwal produksi tidak dapat dimuat." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  const authorization = await requireAdminApi();
  if (authorization.error) return authorization.error;
  const { kode } = await params;
  const decodedKode = decodeURIComponent(kode);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Format permintaan tidak valid." },
      { status: 400 },
    );
  }

  const schedule = parseScheduleUpdateInput(body);
  if (!schedule) {
    return NextResponse.json(
      { error: "Periksa tanggal, target, referensi, dan status jadwal." },
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

    const result = await prisma.jadwal_produksi.updateMany({
      where: {
        id_admin: authorization.adminId,
        id_jadwalproduksi: decodedKode,
      },
      data: {
        tanggal_produksi: schedule.productionDate,
        jumlah_target: schedule.target,
        status_jadwal: schedule.status,
        status_verifikasi: schedule.verificationStatus,
        id_permintaan: schedule.requestId,
        id_owner: schedule.ownerId,
        id_karyawanproduksi: schedule.productionEmployeeId,
        id_karyawanqc: schedule.qualityControlEmployeeId,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Jadwal produksi tidak ditemukan." },
        { status: 404 },
      );
    }

    return NextResponse.json({ code: decodedKode });
  } catch (error) {
    console.error("Could not update production schedule:", error);
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
      { error: "Jadwal produksi tidak dapat diperbarui." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const authorization = await requireAdminApi();
  if (authorization.error) return authorization.error;
  const { kode } = await params;
  const decodedKode = decodeURIComponent(kode);

  try {
    const result = await prisma.jadwal_produksi.deleteMany({
      where: {
        id_admin: authorization.adminId,
        id_jadwalproduksi: decodedKode,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Jadwal produksi tidak ditemukan." },
        { status: 404 },
      );
    }

    return NextResponse.json({ code: kode });
  } catch (error) {
    console.error("Could not delete production schedule:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        {
          error:
            "Jadwal tidak dapat dihapus karena sudah memiliki hasil produksi atau jadwal pemeriksaan QC.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghapus jadwal produksi." },
      { status: 500 },
    );
  }
}
