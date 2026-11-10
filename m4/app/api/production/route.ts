import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const productionStatuses = ["Direncanakan", "Berjalan", "Selesai"] as const;

async function getProductionEmployee(userId: string) {
  return prisma.karyawan_produksi.findFirst({
    where: { id_pengguna: userId },
    select: { id_karyawanproduksi: true },
  });
}

export async function GET() {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  }
  if (session.role !== "karyawan_produksi") {
    return NextResponse.json({ error: "Akses tidak diizinkan." }, { status: 403 });
  }

  try {
    const employee = await getProductionEmployee(session.userId);
    if (!employee) {
      return NextResponse.json(
        { error: "Akun belum terhubung ke data karyawan produksi." },
        { status: 403 },
      );
    }

    const schedules = await prisma.jadwal_produksi.findMany({
      where: { id_karyawanproduksi: employee.id_karyawanproduksi },
      select: {
        id_jadwalproduksi: true,
        tanggal_produksi: true,
        status_jadwal: true,
        permintaan_produk: {
          select: {
            produk: { select: { nama_produk: true, varian: true } },
          },
        },
      },
      orderBy: { tanggal_produksi: "asc" },
    });

    return NextResponse.json({
      schedules: schedules.map((schedule) => ({
        id: schedule.id_jadwalproduksi,
        productName: `${schedule.permintaan_produk.produk.nama_produk} ${schedule.permintaan_produk.produk.varian}`.trim(),
        date: schedule.tanggal_produksi.toISOString().slice(0, 10),
        status: schedule.status_jadwal,
      })),
    });
  } catch (error) {
    console.error("Could not load production schedules:", error);
    return NextResponse.json(
      { error: "Jadwal produksi tidak dapat dimuat." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session) {
    return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  }
  if (session.role !== "karyawan_produksi") {
    return NextResponse.json({ error: "Akses tidak diizinkan." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  if (
    typeof input.scheduleId !== "string" ||
    (input.mode !== "progress" && input.mode !== "result")
  ) {
    return NextResponse.json(
      { error: "Jadwal produksi dan jenis pencatatan wajib dipilih." },
      { status: 400 },
    );
  }

  try {
    const employee = await getProductionEmployee(session.userId);
    if (!employee) {
      return NextResponse.json(
        { error: "Akun belum terhubung ke data karyawan produksi." },
        { status: 403 },
      );
    }

    const schedule = await prisma.jadwal_produksi.findFirst({
      where: {
        id_jadwalproduksi: input.scheduleId,
        id_karyawanproduksi: employee.id_karyawanproduksi,
      },
      select: { id_jadwalproduksi: true },
    });
    if (!schedule) {
      return NextResponse.json(
        { error: "Jadwal tidak ditemukan atau bukan jadwal Anda." },
        { status: 404 },
      );
    }

    if (input.mode === "progress") {
      if (
        typeof input.status !== "string" ||
        !productionStatuses.includes(
          input.status as (typeof productionStatuses)[number],
        )
      ) {
        return NextResponse.json(
          { error: "Status produksi tidak valid." },
          { status: 400 },
        );
      }

      const updated = await prisma.jadwal_produksi.update({
        where: { id_jadwalproduksi: schedule.id_jadwalproduksi },
        data: { status_jadwal: input.status },
        select: { id_jadwalproduksi: true },
      });

      return NextResponse.json({ id: updated.id_jadwalproduksi });
    }

    const amount =
      typeof input.amount === "number" ? input.amount : Number(input.amount);
    const note = typeof input.note === "string" ? input.note.trim() : "";
    const date =
      typeof input.date === "string" ? new Date(`${input.date}T00:00:00.000Z`) : null;

    if (
      !Number.isInteger(amount) ||
      amount < 0 ||
      !note ||
      note.length > 255 ||
      !date ||
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== input.date
    ) {
      return NextResponse.json(
        { error: "Tanggal, jumlah hasil, dan keterangan harus valid." },
        { status: 400 },
      );
    }

    const result = await prisma.hasil_produksi.create({
      data: {
        id_hasil: `HP-${randomBytes(6).toString("base64url").slice(0, 7).toUpperCase()}`,
        tanggal_pencatatan: date,
        jumlah_hasil: amount,
        keterangan: note,
        id_jadwalproduksi: schedule.id_jadwalproduksi,
        id_karyawanproduksi: employee.id_karyawanproduksi,
      },
      select: { id_hasil: true },
    });

    return NextResponse.json({ id: result.id_hasil }, { status: 201 });
  } catch (error) {
    console.error("Could not save production data:", error);
    return NextResponse.json(
      { error: "Data produksi tidak dapat disimpan." },
      { status: 500 },
    );
  }
}
