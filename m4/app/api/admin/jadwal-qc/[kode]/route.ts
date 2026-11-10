import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { requireAdminApi } from "@/lib/admin/authorization";
import { parseQcScheduleUpdateInput } from "@/lib/admin/qc-schedule-input";
import {
  getAdminQcSchedule,
  getAdminQcScheduleOptions,
} from "@/lib/admin/qc-schedules";
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
    const schedule = await getAdminQcSchedule(authorization.adminId, decodedKode);
    if (!schedule) {
      return NextResponse.json(
        { error: "Jadwal pemeriksaan QC tidak ditemukan." },
        { status: 404 },
      );
    }

    const url = new URL(request.url);
    const includeOptions = url.searchParams.get("options") === "true";
    const options = includeOptions
      ? await getAdminQcScheduleOptions(authorization.adminId)
      : undefined;

    return NextResponse.json({
      schedule,
      ...(options ? { options } : {}),
    });
  } catch (error) {
    console.error("Could not load QC schedule:", error);
    return NextResponse.json(
      { error: "Jadwal pemeriksaan QC tidak dapat dimuat." },
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

  const schedule = parseQcScheduleUpdateInput(body);
  if (!schedule) {
    return NextResponse.json(
      {
        error:
          "Periksa tanggal pemeriksaan, jenis pemeriksaan, referensi jadwal produksi, karyawan, dan owner.",
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

    const result = await prisma.jadwal_pemeriksaan_qc.updateMany({
      where: {
        id_admin: authorization.adminId,
        id_jadwalqc: decodedKode,
      },
      data: {
        tanggal_pemeriksaan: schedule.inspectionDate,
        jenis_pemeriksaan: schedule.type,
        status_verifikasi: schedule.verificationStatus,
        status_pemeriksaan: schedule.status,
        id_jadwalproduksi: schedule.productionScheduleId,
        id_owner: schedule.ownerId,
        id_karyawanqc: schedule.qualityControlEmployeeId,
        id_karyawanproduksi: schedule.productionEmployeeId,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Jadwal pemeriksaan QC tidak ditemukan." },
        { status: 404 },
      );
    }

    return NextResponse.json({ code: decodedKode });
  } catch (error) {
    console.error("Could not update QC schedule:", error);
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
      { error: "Jadwal pemeriksaan QC tidak dapat diperbarui." },
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
    const result = await prisma.jadwal_pemeriksaan_qc.deleteMany({
      where: {
        id_admin: authorization.adminId,
        id_jadwalqc: decodedKode,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Jadwal pemeriksaan QC tidak ditemukan." },
        { status: 404 },
      );
    }

    return NextResponse.json({ code: decodedKode });
  } catch (error) {
    console.error("Could not delete QC schedule:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        {
          error:
            "Jadwal QC tidak dapat dihapus karena sudah memiliki hasil pemeriksaan QC terkait.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghapus jadwal pemeriksaan QC." },
      { status: 500 },
    );
  }
}
