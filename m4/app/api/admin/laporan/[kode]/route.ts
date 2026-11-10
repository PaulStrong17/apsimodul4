import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { requireAdminApi } from "@/lib/admin/authorization";
import { parseReportUpdateInput } from "@/lib/admin/report-input";
import {
  getAdminReport,
  getAdminReportOptions,
  parseReportId,
  formatReportCode,
} from "@/lib/admin/reports";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  params: Promise<{ kode: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  const authorization = await requireAdminApi();
  if (authorization.error) return authorization.error;

  const { kode } = await params;
  const decodedKode = decodeURIComponent(kode);
  const id = parseReportId(decodedKode);

  if (id === null) {
    return NextResponse.json(
      { error: "Format kode laporan tidak valid." },
      { status: 400 },
    );
  }

  const { searchParams } = new URL(request.url);
  const includeOptions = searchParams.get("options") === "true";

  try {
    const [report, options] = await Promise.all([
      getAdminReport(authorization.adminId, id),
      includeOptions
        ? getAdminReportOptions()
        : Promise.resolve(null),
    ]);

    if (!report) {
      return NextResponse.json(
        { error: "Data laporan tidak ditemukan." },
        { status: 404 },
      );
    }

    return NextResponse.json(options ? { report, options } : { report });
  } catch (error) {
    console.error("Could not load report detail:", error);
    return NextResponse.json(
      { error: "Detail laporan tidak dapat dimuat." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const authorization = await requireAdminApi();
  if (authorization.error) return authorization.error;

  const { kode } = await params;
  const decodedKode = decodeURIComponent(kode);
  const id = parseReportId(decodedKode);

  if (id === null) {
    return NextResponse.json(
      { error: "Format kode laporan tidak valid." },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Format permintaan tidak valid." },
      { status: 400 },
    );
  }

  const parsed = parseReportUpdateInput(body);
  if (!parsed) {
    return NextResponse.json(
      {
        error:
          "Periksa periode awal, periode akhir, total produksi, reject rate, dan owner.",
      },
      { status: 400 },
    );
  }

  const existing = await prisma.laporan.findFirst({
    where: { id_laporan: id, id_admin: authorization.adminId },
    select: { id_laporan: true },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Laporan yang ingin diperbarui tidak ditemukan." },
      { status: 404 },
    );
  }

  const owner = await prisma.owner.findUnique({
    where: { id_owner: parsed.ownerId },
    select: { id_owner: true },
  });

  if (!owner) {
    return NextResponse.json(
      { error: "Owner penerima laporan tidak ditemukan." },
      { status: 400 },
    );
  }

  try {
    if (parsed.reportType) {
      await prisma.laporan_jenis.upsert({
        where: { jenis_laporan: parsed.reportType },
        update: {
          hasil_tindakanperbaikan: parsed.correctiveAction || "-",
          status_pencapaian: parsed.achievement,
        },
        create: {
          jenis_laporan: parsed.reportType,
          hasil_tindakanperbaikan: parsed.correctiveAction || "-",
          status_pencapaian: parsed.achievement,
        },
      });
    }

    const updated = await prisma.laporan.update({
      where: { id_laporan: id },
      data: {
        periode_awal: parsed.periodStart,
        periode_akhir: parsed.periodEnd,
        total_produksi: parsed.totalProduction,
        jumlah_pemeriksaan: parsed.inspectionCount,
        reject_rate: new Prisma.Decimal(parsed.rejectRate),
        target_reject_rate: new Prisma.Decimal(parsed.targetRejectRate),
        status_pencapaian: parsed.achievement,
        id_owner: parsed.ownerId,
      },
    });

    return NextResponse.json({
      message: "Laporan berhasil diperbarui.",
      code: formatReportCode(updated.id_laporan),
      id: updated.id_laporan,
    });
  } catch (error) {
    console.error("Could not update report:", error);
    return NextResponse.json(
      { error: "Laporan tidak dapat diperbarui." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const authorization = await requireAdminApi();
  if (authorization.error) return authorization.error;

  const { kode } = await params;
  const decodedKode = decodeURIComponent(kode);
  const id = parseReportId(decodedKode);

  if (id === null) {
    return NextResponse.json(
      { error: "Format kode laporan tidak valid." },
      { status: 400 },
    );
  }

  const existing = await prisma.laporan.findFirst({
    where: { id_laporan: id, id_admin: authorization.adminId },
    select: { id_laporan: true },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Laporan yang ingin dihapus tidak ditemukan." },
      { status: 404 },
    );
  }

  try {
    await prisma.laporan.delete({
      where: { id_laporan: id },
    });

    return NextResponse.json({
      message: "Laporan berhasil dihapus.",
      code: formatReportCode(id),
      id,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        {
          error:
            "Laporan tidak dapat dihapus karena sudah berelasi dengan data pemeriksaan QC atau tindakan perbaikan.",
        },
        { status: 409 },
      );
    }

    console.error("Could not delete report:", error);
    return NextResponse.json(
      { error: "Laporan tidak dapat dihapus." },
      { status: 500 },
    );
  }
}
