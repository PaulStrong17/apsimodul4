import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function requireAdminApi() {
  const session = await getAuthSession();
  if (!session) {
    return {
      error: NextResponse.json(
        { error: "Silakan masuk terlebih dahulu." },
        { status: 401 },
      ),
    };
  }
  if (session.role !== "admin") {
    return {
      error: NextResponse.json(
        { error: "Akses Admin diperlukan." },
        { status: 403 },
      ),
    };
  }

  const admin = await prisma.admin.findFirst({
    where: { id_pengguna: session.userId },
    select: { id_admin: true },
  });
  if (!admin) {
    return {
      error: NextResponse.json(
        { error: "Akun belum terhubung ke data Admin." },
        { status: 403 },
      ),
    };
  }

  return { adminId: admin.id_admin };
}

export async function requireAdminPage() {
  const session = await getAuthSession();
  if (!session || session.role !== "admin") redirect("/login");

  const admin = await prisma.admin.findFirst({
    where: { id_pengguna: session.userId },
    select: { id_admin: true },
  });
  if (!admin) redirect("/login");

  return admin;
}
