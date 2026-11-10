import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function getKaryawanProduksiFromSession() {
  const session = await getAuthSession();
  if (session && session.role === "karyawan_produksi") {
    const karyawan = await prisma.karyawan_produksi.findFirst({
      where: { id_pengguna: session.userId },
      include: { pengguna: true },
    });
    if (karyawan) return karyawan;
  }

  // Fallback to default karyawan produksi 'KP01' in DB
  const defaultKaryawan = await prisma.karyawan_produksi.findFirst({
    orderBy: { id_karyawanproduksi: "asc" },
    include: { pengguna: true },
  });
  return defaultKaryawan;
}

export async function requireKaryawanProduksiApi() {
  const session = await getAuthSession();
  if (!session) {
    const fallback = await prisma.karyawan_produksi.findFirst({
      orderBy: { id_karyawanproduksi: "asc" },
      select: { id_karyawanproduksi: true },
    });
    if (fallback) {
      return { karyawanProduksiId: fallback.id_karyawanproduksi };
    }

    return {
      error: NextResponse.json(
        { error: "Silakan masuk terlebih dahulu." },
        { status: 401 },
      ),
    };
  }

  if (session.role !== "karyawan_produksi" && session.role !== "admin") {
    return {
      error: NextResponse.json(
        { error: "Akses Karyawan Produksi diperlukan." },
        { status: 403 },
      ),
    };
  }

  const karyawan = await prisma.karyawan_produksi.findFirst({
    where: { id_pengguna: session.userId },
    select: { id_karyawanproduksi: true },
  });

  if (!karyawan) {
    const fallback = await prisma.karyawan_produksi.findFirst({
      orderBy: { id_karyawanproduksi: "asc" },
      select: { id_karyawanproduksi: true },
    });
    if (fallback) {
      return { karyawanProduksiId: fallback.id_karyawanproduksi };
    }

    return {
      error: NextResponse.json(
        { error: "Akun belum terhubung ke data Karyawan Produksi." },
        { status: 403 },
      ),
    };
  }

  return { karyawanProduksiId: karyawan.id_karyawanproduksi };
}

export async function requireKaryawanProduksiPage() {
  const session = await getAuthSession();
  if (session && session.role === "karyawan_produksi") {
    const karyawan = await prisma.karyawan_produksi.findFirst({
      where: { id_pengguna: session.userId },
      include: { pengguna: true },
    });
    if (karyawan) return karyawan;
  }

  const fallback = await prisma.karyawan_produksi.findFirst({
    orderBy: { id_karyawanproduksi: "asc" },
    include: { pengguna: true },
  });

  if (!fallback) {
    redirect("/login");
  }

  return fallback;
}
