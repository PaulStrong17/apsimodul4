import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { requireKaryawanQcApi } from "@/lib/karyawan-qc/authorization";
import { parseQcResultCreateInput } from "@/lib/karyawan-qc/hasil-qc-input";
import {
  listQcResults,
  getQcResultOptions,
} from "@/lib/karyawan-qc/hasil-qc";
import { parseReportId } from "@/lib/admin/reports";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const authorization = await requireKaryawanQcApi();
  if (authorization.error) return authorization.error;

  try {
    const [results, options] = await Promise.all([
      listQcResults(authorization.karyawanQcId),
      getQcResultOptions(authorization.karyawanQcId),
    ]);

    return NextResponse.json({ results, options });
  } catch (error) {
    console.error("Could not load QC results:", error);
    return NextResponse.json(
      { error: "Data hasil pemeriksaan QC tidak dapat dimuat." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const authorization = await requireKaryawanQcApi();
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

  const parsed = parseQcResultCreateInput(body);
  if (!parsed) {
    return NextResponse.json(
      {
        error:
          "Periksa kode, tanggal pencatatan, jadwal QC, dan pastikan jumlah lolos + reject sama dengan jumlah diperiksa.",
      },
      { status: 400 },
    );
  }

  // Validasi jadwal QC
  const schedule = await prisma.jadwal_pemeriksaan_qc.findFirst({
    where: {
      id_jadwalqc: { equals: parsed.qcScheduleCode, mode: "insensitive" },
    },
    include: {
      jadwal_produksi: true,
    },
  });

  if (!schedule) {
    return NextResponse.json(
      { error: "Jadwal QC yang dipilih tidak valid." },
      { status: 400 },
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
    const created = await prisma.hasil_pemeriksaan_qc.create({
      data: {
        id_hasilqc: parsed.code,
        tanggal_pencatatan: parsed.recordedAt,
        jumlah_diperiksa: parsed.inspected,
        jumlah_lolos: parsed.passed,
        jumlah_reject: parsed.rejected,
        keterangan: parsed.note,
        id_jadwalqc: schedule.id_jadwalqc,
        id_karyawanqc: authorization.karyawanQcId,
        id_laporan: validReportId,
        jenis_laporan: validReportId ? "Laporan Hasil QC" : null,
      },
    });

    // Hubungkan dengan hasil produksi jika ada
    if (parsed.productionResultCode) {
      const prodResult = await prisma.hasil_produksi.findFirst({
        where: {
          id_hasil: { equals: parsed.productionResultCode, mode: "insensitive" },
        },
        select: { id_hasil: true },
      });
      if (prodResult) {
        await prisma.hasil_qc_hasil_produksi.create({
          data: {
            id_hasilqc: created.id_hasilqc,
            id_hasil: prodResult.id_hasil,
          },
        });
      }
    }

    // Catat tindakan perbaikan jika ada
    if (parsed.correctiveAction && parsed.correctiveAction.trim()) {
      const tindakanCount = await prisma.tindakan_perbaikan.count();
      let nextId = `TP${String(tindakanCount + 1).padStart(3, "0")}`;
      let counter = tindakanCount + 1;
      while (
        await prisma.tindakan_perbaikan.findUnique({
          where: { id_tindakan: nextId },
        })
      ) {
        counter++;
        nextId = `TP${String(counter).padStart(3, "0")}`;
      }

      await prisma.tindakan_perbaikan.create({
        data: {
          id_tindakan: nextId,
          deskripsi_tindakan: parsed.note,
          hasil_tindakan: parsed.correctiveAction.trim(),
          tanggal_tindakan: parsed.recordedAt,
          status: "Direncanakan",
          keterangan: parsed.note,
          id_hasilqc: created.id_hasilqc,
          id_owner: schedule.id_owner,
          id_karyawanqc: authorization.karyawanQcId,
          id_karyawanproduksi: schedule.id_karyawanproduksi,
          id_laporan: validReportId,
          jenis_laporan: validReportId ? "Laporan Hasil QC" : null,
        },
      });
    }

    return NextResponse.json(
      {
        message: "Hasil pemeriksaan QC berhasil ditambahkan.",
        code: created.id_hasilqc,
      },
      { status: 201 },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: `Kode hasil QC ${parsed.code} sudah digunakan.` },
        { status: 409 },
      );
    }

    console.error("Could not create QC result:", error);
    return NextResponse.json(
      { error: "Hasil pemeriksaan QC tidak dapat disimpan." },
      { status: 500 },
    );
  }
}
