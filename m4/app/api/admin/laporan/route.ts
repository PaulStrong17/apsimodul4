import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { requireAdminApi } from "@/lib/admin/authorization";
import { parseReportCreateInput } from "@/lib/admin/report-input";
import {
  getAdminReportOptions,
  listAdminReports,
  formatReportCode,
} from "@/lib/admin/reports";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const authorization = await requireAdminApi();
  if (authorization.error) return authorization.error;

  try {
    const [reports, options] = await Promise.all([
      listAdminReports(authorization.adminId),
      getAdminReportOptions(),
    ]);

    return NextResponse.json({ reports, options });
  } catch (error) {
    console.error("Could not load reports:", error);
    return NextResponse.json(
      { error: "Laporan tidak dapat dimuat." },
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

  const parsed = parseReportCreateInput(body);
  if (!parsed) {
    return NextResponse.json(
      {
        error:
          "Periksa kode laporan, periode awal, periode akhir, total produksi, reject rate, dan owner.",
      },
      { status: 400 },
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

    const created = await prisma.laporan.create({
      data: {
        id_laporan: parsed.id,
        periode_awal: parsed.periodStart,
        periode_akhir: parsed.periodEnd,
        total_produksi: parsed.totalProduction,
        jumlah_pemeriksaan: parsed.inspectionCount,
        reject_rate: new Prisma.Decimal(parsed.rejectRate),
        target_reject_rate: new Prisma.Decimal(parsed.targetRejectRate),
        status_pencapaian: parsed.achievement,
        id_admin: authorization.adminId,
        id_owner: parsed.ownerId,
      },
    });

    return NextResponse.json(
      {
        message: "Laporan berhasil ditambahkan.",
        code: formatReportCode(created.id_laporan),
        id: created.id_laporan,
      },
      { status: 201 },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: `Kode laporan ${formatReportCode(parsed.id)} sudah terdaftar.` },
        { status: 409 },
      );
    }

    console.error("Could not create report:", error);
    return NextResponse.json(
      { error: "Laporan tidak dapat disimpan." },
      { status: 500 },
    );
  }
}
