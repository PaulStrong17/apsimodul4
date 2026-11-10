import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function getKaryawanQcFromSession() {
  const session = await getAuthSession();
  if (session && session.role === "karyawan_qc") {
    const karyawan = await prisma.karyawan_qc.findFirst({
      where: { id_pengguna: session.userId },
      include: { pengguna: true },
    });
    if (karyawan) return karyawan;
  }

  // Fallback to default karyawan QC 'KQ01' in DB
  const defaultKaryawan = await prisma.karyawan_qc.findFirst({
    orderBy: { id_karyawanqc: "asc" },
    include: { pengguna: true },
  });
  return defaultKaryawan;
}

export async function requireKaryawanQcApi() {
  const session = await getAuthSession();
  if (!session) {
    const fallback = await prisma.karyawan_qc.findFirst({
      orderBy: { id_karyawanqc: "asc" },
      select: { id_karyawanqc: true },
    });
    if (fallback) {
      return { karyawanQcId: fallback.id_karyawanqc };
    }

    return {
      error: NextResponse.json(
        { error: "Silakan masuk terlebih dahulu." },
        { status: 401 },
      ),
    };
  }

  if (session.role !== "karyawan_qc" && session.role !== "admin") {
    return {
      error: NextResponse.json(
        { error: "Akses Karyawan QC diperlukan." },
        { status: 403 },
      ),
    };
  }

  const karyawan = await prisma.karyawan_qc.findFirst({
    where: { id_pengguna: session.userId },
    select: { id_karyawanqc: true },
  });

  if (!karyawan) {
    const fallback = await prisma.karyawan_qc.findFirst({
      orderBy: { id_karyawanqc: "asc" },
      select: { id_karyawanqc: true },
    });
    if (fallback) {
      return { karyawanQcId: fallback.id_karyawanqc };
    }

    return {
      error: NextResponse.json(
        { error: "Akun belum terhubung ke data Karyawan QC." },
        { status: 403 },
      ),
    };
  }

  return { karyawanQcId: karyawan.id_karyawanqc };
}

export async function requireKaryawanQcPage() {
  const session = await getAuthSession();
  if (session && session.role === "karyawan_qc") {
    const karyawan = await prisma.karyawan_qc.findFirst({
      where: { id_pengguna: session.userId },
      include: { pengguna: true },
    });
    if (karyawan) return karyawan;
  }

  const fallback = await prisma.karyawan_qc.findFirst({
    orderBy: { id_karyawanqc: "asc" },
    include: { pengguna: true },
  });

  if (!fallback) {
    redirect("/login");
  }

  return fallback;
}
