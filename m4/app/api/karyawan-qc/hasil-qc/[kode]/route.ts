import { NextResponse } from "next/server";
import { requireKaryawanQcApi } from "@/lib/karyawan-qc/authorization";
import { parseQcResultUpdateInput } from "@/lib/karyawan-qc/hasil-qc-input";
import {
  getQcResult,
  getQcResultOptions,
  deleteQcResult,
} from "@/lib/karyawan-qc/hasil-qc";
import { parseReportId } from "@/lib/admin/reports";
import { prisma } from "@/lib/prisma";

type RouteParams = {
  params: Promise<{ kode: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  const authorization = await requireKaryawanQcApi();
  if (authorization.error) return authorization.error;

  const { kode } = await params;
  const { searchParams } = new URL(request.url);
  const includeOptions = searchParams.get("options") === "true";

  try {
    const [result, options] = await Promise.all([
      getQcResult(authorization.karyawanQcId, kode),
      includeOptions
        ? getQcResultOptions(authorization.karyawanQcId)
        : Promise.resolve(null),
    ]);

    if (!result) {
      return NextResponse.json(
        { error: "Data hasil pemeriksaan QC tidak ditemukan." },
        { status: 404 },
      );
    }

    return NextResponse.json(options ? { result, options } : { result });
  } catch (error) {
    console.error("Could not load QC result detail:", error);
    return NextResponse.json(
      { error: "Detail hasil pemeriksaan QC tidak dapat dimuat." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const authorization = await requireKaryawanQcApi();
  if (authorization.error) return authorization.error;

  const { kode } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Format permintaan tidak valid." },
      { status: 400 },
    );
  }

  const parsed = parseQcResultUpdateInput(body);
  if (!parsed) {
    return NextResponse.json(
      {
        error:
          "Periksa tanggal pencatatan, jadwal QC, dan pastikan jumlah lolos + reject sama dengan jumlah diperiksa.",
      },
      { status: 400 },
    );
  }

  const existing = await getQcResult(authorization.karyawanQcId, kode);
  if (!existing) {
    return NextResponse.json(
      { error: "Data hasil QC yang ingin diperbarui tidak ditemukan." },
      { status: 404 },
    );
  }

  const rawReportId = parsed.reportCode ? parseReportId(parsed.reportCode) : null;
  let validReportId: number | null = null;
  if (rawReportId !== null) {
    const reportExists = await prisma.laporan.findUnique({
      where: { id_laporan: rawReportId },
      select: { id_laporan: true },
    });
    if (reportExists) {
      validReportId = reportExists.id_laporan;
    }
  }

  try {
    const updated = await prisma.hasil_pemeriksaan_qc.update({
      where: { id_hasilqc: existing.code },
      data: {
        tanggal_pencatatan: parsed.recordedAt,
        jumlah_diperiksa: parsed.inspected,
        jumlah_lolos: parsed.passed,
        jumlah_reject: parsed.rejected,
        keterangan: parsed.note,
        id_jadwalqc: parsed.qcScheduleCode,
        id_laporan: validReportId,
        jenis_laporan: validReportId ? "Laporan Hasil QC" : null,
      },
    });

    // Update penghubung hasil_qc_hasil_produksi
    if (parsed.productionResultCode) {
      await prisma.hasil_qc_hasil_produksi.deleteMany({
        where: { id_hasilqc: existing.code },
      });

      const prodResult = await prisma.hasil_produksi.findUnique({
        where: { id_hasil: parsed.productionResultCode },
        select: { id_hasil: true },
      });
      if (prodResult) {
        await prisma.hasil_qc_hasil_produksi.create({
          data: {
            id_hasilqc: existing.code,
            id_hasil: prodResult.id_hasil,
          },
        });
      }
    }

    // Update tindakan perbaikan jika ada
    if (parsed.correctiveAction) {
      const existingTindakan = await prisma.tindakan_perbaikan.findFirst({
        where: { id_hasilqc: existing.code },
        select: { id_tindakan: true },
      });

      if (existingTindakan) {
        await prisma.tindakan_perbaikan.update({
          where: { id_tindakan: existingTindakan.id_tindakan },
          data: {
            hasil_tindakan: parsed.correctiveAction,
            deskripsi_tindakan: parsed.note,
          },
        });
      }
    }

    return NextResponse.json({
      message: "Data hasil QC berhasil diperbarui.",
      code: updated.id_hasilqc,
    });
  } catch (error) {
    console.error("Could not update QC result:", error);
    return NextResponse.json(
      { error: "Hasil pemeriksaan QC tidak dapat diperbarui." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const authorization = await requireKaryawanQcApi();
  if (authorization.error) return authorization.error;

  const { kode } = await params;
  try {
    const success = await deleteQcResult(authorization.karyawanQcId, kode);
    if (!success) {
      return NextResponse.json(
        { error: "Data hasil QC tidak ditemukan atau tidak dapat dihapus." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Data hasil pemeriksaan QC berhasil dihapus.",
      code: kode,
    });
  } catch (error) {
    console.error("Could not delete QC result:", error);
    return NextResponse.json(
      { error: "Hasil pemeriksaan QC tidak dapat dihapus." },
      { status: 500 },
    );
  }
}
